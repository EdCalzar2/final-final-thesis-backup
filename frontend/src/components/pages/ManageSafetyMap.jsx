import styles from './manageStories.module.css'
import { NavLink } from 'react-router-dom'

export default function ManageSafetyMap() {

    const handleLogout = () => {
        // Optionally clear any auth state here
        navigate('/');
    }

    return(
        <div className={styles.manageStoriesBackground}>
            <nav>
                <ul>
                    <li>
                        <NavLink to='/manageStories' className={({ isActive }) => isActive ? styles.active : undefined}> Manage Stories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/manageSafetyMap' className={({ isActive }) => isActive ? styles.active : undefined}> Manage Safety Map
                        </NavLink>
                    </li>
                </ul>
                <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </nav>
        </div>
    )
}