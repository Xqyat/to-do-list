import Logo from '../assets/img/LOGO.jpg'
import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };
    return (
        <>
            <header>
                <div className='Logo'><img src={Logo} height={50} alt="" /></div>
                <nav className='navListLeftWrapper'>
                    <ul className='navList left'>
                        <li className='navList-element'><Link to="/main">Главная</Link></li>
                        <li className='navList-element'><Link to="/create">Новая запись</Link></li>
                        <li className='navList-element'><Link to="/catalog">Каталог</Link></li>
                        <li className='navList-element'><Link to="/favorites">Избранные</Link></li>
                        <li className='navList-element'><Link to="/">Лендинг</Link></li>
                        <li className='navList-element'><Link to="/admin/sections">Админ-панель</Link></li>
                    </ul>
                    <div className={`burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                        <span></span>  
                        <span></span>  
                        <span></span>  
                    </div>
                    <div className={`menu-mobile${menuOpen ? ' show' : ''}`}>
                        <Link to="/main" onClick={() => setMenuOpen(false)}>Главная</Link>
                        <Link to="/create" onClick={() => setMenuOpen(false)}>Новая запись</Link>
                    </div>
                </nav>
                {token && (
                    <button onClick={handleLogout} className="btn-logout">
                    Выйти
                    </button>
                )}
            </header>
        </>
    )    
}