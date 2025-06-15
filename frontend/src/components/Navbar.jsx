import React, {useState} from 'react'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import './Navbar.css'
import logoImg from '../assets/final_logo.png' // Adjust path if needed

export const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate();

    const handleLogout = () => {
        // Optionally clear any auth state here
        navigate('/');
    }

    return (
        <nav>
            <Link to='' className='logo'>
                <img src={logoImg} alt="Logo" style={{height: '50px', marginLeft: '25px'}} />
            </Link>
            <div className='menu' onClick={() => {setMenuOpen(!menuOpen)}}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? 'open' : ''}>
                {/* <li>
                    <NavLink to='/home'>Home</NavLink>
                </li> */}
                <li>
                    <NavLink to='/story'>Story</NavLink>
                </li>
                <li>
                    <NavLink to='/safety_map'>Safety Map</NavLink>
                </li>
                <li>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </nav>
    )
}
