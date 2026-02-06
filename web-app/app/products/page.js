import Link from 'next/link';
import products from '@/data/products.json';
import styles from './page.module.css';

export const metadata = {
    title: 'Jaws Co., Ltd. - Product Catalog',
    description: 'View our complete catalog of FFC/FPC and Wire-to-Board connectors.',
};

// Category Descriptions Dictionary
const CATEGORY_INFO = {
    "default": {
        title: "Product Catalog",
        desc: "Explore our extensive range of FFC/FPC and Wire-to-Board connectors. Precision manufactured for reliability."
    },
    "FPC / FFC": {
        title: "FPC & FFC Connectors",
        desc: "Flexible Printed Circuit connectors designed for high-density electronic packaging. Featuring Zero Insertion Force (ZIF) and Non-ZIF options."
    },
    "0.5 mm": {
        title: "0.5mm Pitch Connectors",
        desc: "Our most popular fine-pitch series. Ideal for compact devices requiring high reliability and signal integrity."
    },
    "1.0 mm": {
        title: "1.0mm Pitch Connectors",
        desc: "Robust standard pitch connectors. Perfect for automotive, industrial, and consumer electronics applications where durability is key."
    },
    "1.25 mm": {
        title: "1.25mm Pitch Connectors",
        desc: "Wide pitch connectors offering superior mechanical strength and easier manual assembly for larger devices."
    },
    "Wire To Board Connector(NEW)": {
        title: "Wire-to-Board Solutions",
        desc: "Secure wire-to-board connections with positive locking mechanisms. Designed for high-vibration environments."
    }
};

export default function ProductsPage({ searchParams }) {
    const categoryFilter = searchParams?.category;

    // 1. Filter Logic
    let displayedProducts = products;
    if (categoryFilter) {
        displayedProducts = products.filter(p =>
            p.category === categoryFilter ||
            (p.category && p.category.includes(categoryFilter))
        );
    }

    // 2. Dynamic Header Logic
    const headerInfo = CATEGORY_INFO[categoryFilter] || CATEGORY_INFO["default"];

    // 3. Get unique categories (sorted)
    const categories = [...new Set(products.map(p => p.category))].sort();

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <h1>{headerInfo.title}</h1>
                <p>{headerInfo.desc}</p>
            </header>

            <div className={styles.content}>
                <aside className={styles.sidebar}>
                    <div className={styles.filterGroup}>
                        <h3>Categories</h3>
                        <Link href="/products" className={`${styles.filterItem} ${!categoryFilter ? styles.active : ''}`}>All Products</Link>
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                href={`/products?category=${encodeURIComponent(cat)}`}
                                className={`${styles.filterItem} ${categoryFilter === cat ? styles.active : ''}`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </aside>

                <main className={styles.productGrid}>
                    {displayedProducts.map(product => (
                        <div key={product.id} className={styles.productCard}>
                            {/* IMAGE PLACEHOLDER REPLACEMENT */}
                            <div className={styles.placeholderImg}>
                                <span className={styles.phText}>
                                    Product Shot: {product.name}<br />
                                    <small style={{ display: 'block', marginTop: '5px', color: '#999' }}>(Macro view of {product.category} connector showing gold contacts)</small>
                                </span>
                            </div>

                            <div className={styles.pInfo}>
                                <h4>{product.name}</h4>
                                <span className={styles.code}>{product.id}</span>
                                <div className={styles.pSpecs}>
                                    {product.specs.slice(0, 3).map((spec, i) => (
                                        <div key={i}>{spec}</div>
                                    ))}
                                </div>
                            </div>
                            <button className={styles.pAction}>View Details</button>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}
