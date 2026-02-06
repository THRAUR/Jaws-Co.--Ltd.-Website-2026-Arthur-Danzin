/**
 * DeepL Translation Script
 *
 * Translates the English source file (locales/en.json) to all target languages.
 *
 * Usage:
 *   npm run translate
 *
 * Environment variables:
 *   DEEPL_API_KEY - Your DeepL API key
 *   DEEPL_API_FREE - Set to "true" for DeepL Free API (default: true)
 *
 * Features:
 *   - Only translates new or changed strings
 *   - Preserves existing translations
 *   - Shows progress and statistics
 *   - Rate limiting to avoid API limits
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_FREE = process.env.DEEPL_API_FREE !== 'false';
const DEEPL_API_URL = DEEPL_API_FREE
  ? 'api-free.deepl.com'
  : 'api.deepl.com';

// Language mappings (our code -> DeepL code)
const LANGUAGE_MAPPINGS: Record<string, { deepL: string; name: string }> = {
  'zh-TW': { deepL: 'ZH', name: 'Traditional Chinese' },
  'zh-CN': { deepL: 'ZH', name: 'Simplified Chinese' },
  'ja': { deepL: 'JA', name: 'Japanese' },
  'it': { deepL: 'IT', name: 'Italian' },
  'fr': { deepL: 'FR', name: 'French' },
  'es': { deepL: 'ES', name: 'Spanish' },
  'de': { deepL: 'DE', name: 'German' },
};

// Rate limiting
const BATCH_SIZE = 50; // Max texts per API call
const DELAY_BETWEEN_BATCHES = 500; // ms

// Types
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

// Paths
const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_FILE = path.join(LOCALES_DIR, 'en.json');

/**
 * Flatten nested object to dot-notation keys
 */
function flattenObject(
  obj: Translations,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value as Translations, newKey));
    }
  }

  return result;
}

/**
 * Unflatten dot-notation keys to nested object
 */
function unflattenObject(flat: Record<string, string>): Translations {
  const result: Translations = {};

  for (const [key, value] of Object.entries(flat)) {
    const keys = key.split('.');
    let current: Translations = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k] as Translations;
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}

/**
 * Call DeepL API to translate texts
 */
async function translateWithDeepL(
  texts: string[],
  targetLang: string
): Promise<string[]> {
  if (!DEEPL_API_KEY) {
    throw new Error('DEEPL_API_KEY environment variable not set');
  }

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      text: texts,
      target_lang: targetLang,
    });

    const options = {
      hostname: DEEPL_API_URL,
      port: 443,
      path: '/v2/translate',
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`DeepL API error: ${res.statusCode} - ${responseData}`));
          return;
        }

        try {
          const parsed = JSON.parse(responseData);
          const translations = parsed.translations.map(
            (t: { text: string }) => t.text
          );
          resolve(translations);
        } catch (e) {
          reject(new Error(`Failed to parse DeepL response: ${e}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Translate a language file
 */
async function translateLanguage(
  langCode: string,
  enFlat: Record<string, string>
): Promise<{ translated: number; skipped: number }> {
  const langConfig = LANGUAGE_MAPPINGS[langCode];
  if (!langConfig) {
    throw new Error(`Unknown language code: ${langCode}`);
  }

  const langFile = path.join(LOCALES_DIR, `${langCode}.json`);

  // Load existing translations
  let existing: Translations = {};
  let existingFlat: Record<string, string> = {};

  if (fs.existsSync(langFile)) {
    try {
      existing = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
      existingFlat = flattenObject(existing);
    } catch {
      // Start fresh if file is invalid
    }
  }

  // Find strings that need translation
  const toTranslate: { key: string; text: string }[] = [];

  for (const [key, text] of Object.entries(enFlat)) {
    // Skip if translation exists and source hasn't changed
    if (existingFlat[key] && existingFlat[`_source.${key}`] === text) {
      continue;
    }
    toTranslate.push({ key, text });
  }

  if (toTranslate.length === 0) {
    return { translated: 0, skipped: Object.keys(enFlat).length };
  }

  console.log(`  Translating ${toTranslate.length} strings to ${langConfig.name}...`);

  // Translate in batches
  const result: Record<string, string> = { ...existingFlat };
  const sourceTracker: Record<string, string> = {};

  for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
    const batch = toTranslate.slice(i, i + BATCH_SIZE);
    const texts = batch.map((item) => item.text);

    try {
      const translations = await translateWithDeepL(texts, langConfig.deepL);

      batch.forEach((item, index) => {
        result[item.key] = translations[index];
        sourceTracker[`_source.${item.key}`] = item.text;
      });

      const progress = Math.min(i + BATCH_SIZE, toTranslate.length);
      process.stdout.write(`\r  Progress: ${progress}/${toTranslate.length}`);

      if (i + BATCH_SIZE < toTranslate.length) {
        await sleep(DELAY_BETWEEN_BATCHES);
      }
    } catch (error) {
      console.error(`\n  Error translating batch: ${error}`);
      throw error;
    }
  }

  console.log(''); // New line after progress

  // Remove _source tracking keys from output (internal use only)
  const finalResult: Record<string, string> = {};
  for (const [key, value] of Object.entries(result)) {
    if (!key.startsWith('_source.') && !key.startsWith('_note')) {
      finalResult[key] = value;
    }
  }

  // Store source tracking for incremental updates
  const fullResult = { ...finalResult, ...sourceTracker };

  // Save to file
  const nested = unflattenObject(fullResult);
  fs.writeFileSync(langFile, JSON.stringify(nested, null, 2), 'utf-8');

  return {
    translated: toTranslate.length,
    skipped: Object.keys(enFlat).length - toTranslate.length,
  };
}

/**
 * Main function
 */
async function main() {
  console.log('\n========================================');
  console.log('  DeepL Translation Script');
  console.log('========================================\n');

  // Check for API key
  if (!DEEPL_API_KEY) {
    console.error('Error: DEEPL_API_KEY environment variable not set.');
    console.error('');
    console.error('To set it:');
    console.error('  export DEEPL_API_KEY=your-api-key');
    console.error('');
    console.error('Or add to .env.local:');
    console.error('  DEEPL_API_KEY=your-api-key');
    console.error('');
    process.exit(1);
  }

  // Load English source
  console.log('Loading English source file...');
  if (!fs.existsSync(EN_FILE)) {
    console.error(`Error: English source file not found: ${EN_FILE}`);
    process.exit(1);
  }

  const enData: Translations = JSON.parse(fs.readFileSync(EN_FILE, 'utf-8'));
  const enFlat = flattenObject(enData);
  const totalStrings = Object.keys(enFlat).length;

  console.log(`Found ${totalStrings} strings to translate.\n`);

  // Translate each language
  let totalTranslated = 0;
  let totalSkipped = 0;

  for (const langCode of Object.keys(LANGUAGE_MAPPINGS)) {
    console.log(`\n[${langCode}] ${LANGUAGE_MAPPINGS[langCode].name}`);

    try {
      const { translated, skipped } = await translateLanguage(langCode, enFlat);
      totalTranslated += translated;
      totalSkipped += skipped;

      console.log(`  Done: ${translated} translated, ${skipped} skipped`);
    } catch (error) {
      console.error(`  Failed: ${error}`);
    }
  }

  // Summary
  console.log('\n========================================');
  console.log('  Summary');
  console.log('========================================');
  console.log(`  Total strings: ${totalStrings}`);
  console.log(`  Translated: ${totalTranslated}`);
  console.log(`  Skipped (already translated): ${totalSkipped}`);
  console.log('========================================\n');
}

// Run
main().catch((error) => {
  console.error('Translation failed:', error);
  process.exit(1);
});
