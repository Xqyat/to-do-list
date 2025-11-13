import Logo from '../assets/img/LOGO.jpg'
import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <header>
                <div className='Logo'><img src={Logo} height={50} alt="" /></div>
                <nav className='navListLeftWrapper'>
                    <ul className='navList left'>
                        <li className='navList-element'><Link to="/main">Главная</Link></li>
                        <li className='navList-element'><Link to="/user">Записи</Link></li>
                    </ul>
                    <div
                        className={`burger${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Открыть меню"
                        tabIndex={0}
                        role="button"
                        onKeyPress={e => { if (e.key === 'Enter') setMenuOpen(!menuOpen) }}
                    >
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className={`menu-mobile${menuOpen ? ' show' : ''}`}>
                        <Link to="/main" onClick={() => setMenuOpen(false)}>Главная</Link>
                        <Link to="/user" onClick={() => setMenuOpen(false)}>Записи</Link>
                    </div>
                    </nav>
                <nav className='navListRightWrapper'>
                    <ul className='navList'>
                        <li className='navList-element'><Link to="/login">Вход</Link></li>
                        <li className='navList-element register-link'><Link to="/register">Регистрация</Link></li>
                    </ul>
                </nav>
            </header>
        </>
    )    
    

}