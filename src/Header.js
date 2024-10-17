// src/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
    return (
        <header id="header" role="banner" style={{ background: '#282c34', padding: '10px', color: 'white' }}>
            <div className="aui-header-inner">
                <div className="aui-header-before">
                    <span id="logo" className="aui-header-logo">
                        <a href="/" aria-label="Go to home page">
                            <img src="/path/to/logo.png" alt="Logo" style={{ height: '40px' }} />
                        </a>
                    </span>
                </div>
                <nav className="aui-header" aria-label="Site" style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ margin: '0 20px' }}>
                        PROJECTS <FontAwesomeIcon icon={faFolderOpen} style={{ color: 'white' }} />
                    </h2>
                    <ul className="aui-nav" style={{ listStyle: 'none', display: 'flex', margin: '0', padding: '0' }}>
                        <li style={{ margin: '0 10px' }}>
                            <a href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboards</a>
                        </li>
                        <li style={{ margin: '0 10px' }}>
                            <a href="/projects" style={{ color: 'white', textDecoration: 'none' }}>Projects</a>
                        </li>
                        <li style={{ margin: '0 10px' }}>
                            <a href="/issues" style={{ color: 'white', textDecoration: 'none' }}>Issues</a>
                        </li>
                        <li style={{ margin: '0 10px' }}>
                            <a href="/help" style={{ color: 'white', textDecoration: 'none' }}>Help</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
