import React from 'react'
import styles from './admin.module.css';

export default function Admin() {
    return(
        <div className={styles.adminPage}>
            <h1>Admin Page</h1>
            <p>This is the admin moderation panel. Stories pending approval will appear here.</p>
        </div>
    )
}