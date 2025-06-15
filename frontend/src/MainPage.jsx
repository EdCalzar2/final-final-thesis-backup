import './App.css'; // Import the main CSS file for styling
import { Navbar } from './components/Navbar'; // Import the Navbar component

// MainPage component acts as a layout wrapper for other pages
function MainPage({ children }) {
    return (
        <div className='MainPage'>
            {/* Display the navigation bar at the top */}
            <Navbar />
            {/* Render any child components or pages inside MainPage */}
            {children}
        </div>
    );
}

export default MainPage; // Export MainPage so it can be used in other files
