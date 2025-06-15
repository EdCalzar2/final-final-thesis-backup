import StoryItem from './StoryItem'
import styles from './storyList.module.css'

export default function StoryList({stories, onDeleteStory}) {
    return (
        <div className={styles.list}>
            {stories.map((item) => (
                <StoryItem key={item} item={item} onDelete={onDeleteStory}/>
            ))}
        </div>
    )
}
