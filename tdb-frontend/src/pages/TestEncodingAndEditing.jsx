import React, { useState, useRef, useEffect } from 'react';
import { 
    Home, ClipboardList, BookOpen, Settings, LogOut, User, Sun, Moon, Search, 
    Clock, FileText, Save, Plus, Edit2, Trash2 
} from 'lucide-react';
import NavItem from '../components/NavItem';
import DropdownNavItem from '../components/DropdownNavItem';
import LogoutModal from '../components/LogoutModal';
import '../styles/TestEncodingAndEditing.css';

import TDBLogo from '../assets/TDB logo.png';
import UPHSL from '../assets/uphsl.png';
import CCS from '../assets/CCS.png';

const MOCK_USER = "Dr. Dela Cruz";
const dataEntryItems = ["Course - Topic", "Test Encoding", "Test Question Editing"];

const TestEncodingAndEditing = () => {
    const [activeTab, setActiveTab] = useState('Test Encoding');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const userMenuRef = useRef(null);

    const [searchText, setSearchText] = useState("");
    const [questions, setQuestions] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const isDataEntryActive = dataEntryItems.includes(activeTab) || activeTab === 'Data Entry';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark' : '';
    }, [isDarkMode]);

    const handleUserAction = (action) => {
        setIsUserMenuOpen(false);
        if (action === 'Logout') setIsLogoutModalOpen(true);
        else console.log('Navigate to', action);
    };

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        console.log('Logged out (placeholder)');
    };

    return (
        <div className={`dashboard test-encoding ${isDarkMode ? 'dark' : ''}`}>
            <div className="background" style={{ backgroundImage: `url(${UPHSL})` }} />

            <div className="main-container" style={{ marginTop: '2rem' }}>
                {/* --- NAVIGATION BAR --- */}
                <nav className={`navbar ${isDarkMode ? 'dark' : ''}`}>
                    <div className="nav-left">
                        <button onClick={() => setActiveTab('Home')} className="logo-btn">
                            <img src={TDBLogo} alt="TDB Logo" className="logo" />
                            <span className="logo-text">TEST DATABANK</span>
                        </button>
                    </div>

                    <div className="nav-center">
                        <NavItem icon={Home} label="Home" isActive={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
                        <DropdownNavItem
                            icon={ClipboardList}
                            label="Data Entry"
                            isActive={isDataEntryActive}
                            dropdownItems={dataEntryItems}
                            onSelect={(item) => setActiveTab(item)}
                        />
                        <NavItem icon={BookOpen} label="Reports" isActive={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
                    </div>

                    <div className="nav-right" ref={userMenuRef}>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`mode-switch ${isDarkMode ? 'dark' : ''}`}>
                            <div className="circle">{isDarkMode ? <Moon /> : <Sun />}</div>
                        </button>

                        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className={`user-btn ${isUserMenuOpen ? 'active' : ''}`}>
                            <div className="user-pic">{MOCK_USER.charAt(4)}</div>
                            <span className="user-name">{MOCK_USER}</span>
                        </button>

                        {isUserMenuOpen && (
                            <div className="user-dropdown show">
                                <button onClick={() => handleUserAction('User Management')}><Settings /> User Management</button>
                                <button onClick={() => handleUserAction('Edit Account')}><User /> Edit Account</button>
                                <button className="logout-btn" onClick={() => handleUserAction('Logout')}><LogOut /> Logout</button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* --- SEARCH BAR --- */}
                <div className={`search-bar ${isDarkMode ? 'dark' : ''}`}>
                    <Search className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search Question/Topic..." 
                        value={searchText} 
                        onChange={(e) => setSearchText(e.target.value)} 
                        className={isDarkMode ? 'dark' : ''}
                    />
                </div>

                {/* --- TEST ENCODING AND EDITING CONTAINER --- */}
                <div className="main-card">
                    {/* Header Section */}
                    <div className="header-section" style={{ justifyContent: 'center' }}>
                        <h1 className="page-title">{activeTab}</h1>
                    </div>

                    {/* Example of Question Encoding / Editing Fields */}
                    <div className="question-block">
                        <label>
                            <FileText size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                            Sample Question
                        </label>
                        <textarea placeholder="Enter question text..." />
                    </div>

                    <div className="choices-grid">
                        <div className="choice-block">
                            <label>Choice A</label>
                            <textarea placeholder="Enter choice A..." />
                        </div>
                        <div className="choice-block">
                            <label>Choice B</label>
                            <textarea placeholder="Enter choice B..." />
                        </div>
                        <div className="choice-block">
                            <label>Choice C</label>
                            <textarea placeholder="Enter choice C..." />
                        </div>
                        <div className="choice-block">
                            <label>Choice D</label>
                            <textarea placeholder="Enter choice D..." />
                        </div>
                    </div>

                    <div className="answer-key-section">
                        <div className="correct-answer-field">
                            <input type="text" placeholder="Correct Answer" />
                        </div>
                        <div className="answer-key-description">
                            <textarea placeholder="Answer Key Explanation..." />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons list-actions">
                        <button className="btn-save">
                            <Save size={20} /> Save Question
                        </button>
                        <button className="btn-add">
                            <Plus size={20} /> Add Question
                        </button>
                    </div>

                    {/* Question Editing List / History */}
                    <div className="question-editing-list">
                        <h3>Questions List</h3>
                        <div className="history-table-container">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Question</th>
                                        <th>Answer</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.length === 0 ? (
                                        <tr><td colSpan={4} className="no-questions">No questions yet.</td></tr>
                                    ) : questions.map((q, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{q.text}</td>
                                            <td>{q.correctAnswer}</td>
                                            <td className="actions-cell">
                                                <button className="action-edit"><Edit2 size={16} /></button>
                                                <button className="action-delete"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Logout Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default TestEncodingAndEditing;
