'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate submission
        setTimeout(() => {
            setSubmitted(true);
        }, 500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.infoCol}>
                <h1>Start a Project</h1>
                <p>Our engineering team is ready to assist with your connector requirements. Reach out for quotes, samples, or custom design consultations.</p>

                <div className={styles.contactDetail}>
                    <h4>Headquarters</h4>
                    <p>No. 8, Lane 2, Section 2, Example Road,<br />Taipei City 110, Taiwan (R.O.C.)</p>
                </div>
                <div className={styles.contactDetail}>
                    <h4>Email</h4>
                    <p>sales@jaws.com.tw</p>
                </div>
                <div className={styles.contactDetail}>
                    <h4>Phone</h4>
                    <p>+886-2-1234-5678</p>
                </div>
            </div>

            <div className={styles.formCol}>
                {submitted ? (
                    <div className={styles.successMessage}>
                        <h2>Thank You!</h2>
                        <p>Your inquiry has been sent successfully. Our team will contact you within 24 hours.</p>
                        <button onClick={() => setSubmitted(false)} className={styles.resetBtn}>Send Another Message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label>Name</label>
                        <input type="text" placeholder="Your Name" required />

                        <label>Email</label>
                        <input type="email" placeholder="company@email.com" required />

                        <label>Inquiry Type</label>
                        <select>
                            <option>Request for Quote</option>
                            <option>Product Sample</option>
                            <option>Custom OEM</option>
                            <option>Technical Support</option>
                        </select>

                        <label>Message</label>
                        <textarea rows="6" placeholder="Tell us about your project requirements..." required></textarea>

                        <button type="submit">Send Message</button>
                    </form>
                )}
            </div>
        </div>
    );
}
