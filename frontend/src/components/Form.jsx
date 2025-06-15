import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import styles from './form.module.css'

export default function Form({ onAddStory }) {
    const [story, setStory] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault()
        if (!story.trim()) {
            setError("Please enter a story before submitting.")
            return
        }
        
        console.log('Form submitting story:', story.trim());
        
        // Add story text temporarily (waiting for location)
        onAddStory(story.trim())
        
        // Clear form
        setStory("")
        setError("")
        
        console.log('Navigating to pin-safety-map');
        
        // Navigate to pin safety map to select location
        navigate('/pin-safety-map');
    }

    return (
        <>
            <form className={styles.storyForm} onSubmit={handleSubmit}>
                <input
                    className={styles.modernInput}
                    onChange={(e) => {
                        setStory(e.target.value)
                        setError("")
                    }}
                    type='text'
                    value={story}
                    placeholder="Enter your story"
                />
                <button className={styles.modernButton} type='submit'>Submit</button>
            </form>
            
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}
        </>
    )
}