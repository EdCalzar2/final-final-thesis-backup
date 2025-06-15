import styles from './storyItem.module.css'

export default function StoryItem({ item, onDelete }) {
    const handleDelete = () => {
        onDelete(item);
    };

    return (
        <>
        <div className={styles.item}>
            <div className={styles.itemName}>{item}</div>
            <button className={styles.deleteButton} onClick={handleDelete}>
                Delete
            </button>
        </div>
        </>
    )
}
