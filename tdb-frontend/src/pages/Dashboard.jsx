import React, { useState, useEffect, useRef } from 'react';
import { Home, ClipboardList, BookOpen, Settings, LogOut, User, Sun, Moon, Search, Grid, List, School, Tag, FileText, Save, Plus } from 'lucide-react'; // Added icons for the new view
import NavItem from '../components/NavItem';
import DropdownNavItem from '../components/DropdownNavItem';
import LogoutModal from '../components/LogoutModal';
import '../styles/Dashboard.css';

import TDBLogo from '../assets/TDB logo.png';
import UPHSL from '../assets/uphsl.png';
import CCS from '../assets/CCS.png';
import CRIM from '../assets/CRIM.png';
import CAS from '../assets/CAS.png';

const MOCK_USER = "Dr. Dela Cruz";
const MOCK_PROGRAMS = [
  { id: 1, name: "College of Computer Studies", logo: CCS },
  { id: 2, name: "College of Criminology", logo: CRIM },
  { id: 3, name: "College of Arts and Sciences", logo: CAS },
];

// Mock Data for the new view
const MOCK_COURSES = ['BS Computer Science', 'BS Criminology', 'BS Psychology'];
const MOCK_LECTURERS = ['Mr. Santos', 'Ms. Reyes', 'Dr. Cruz'];
const MOCK_DEPARTMENTS = [
    { name: "College of Computer Studies", logo: CCS }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [programView, setProgramView] = useState('grid');
  const userMenuRef = useRef(null);

  // New State for Course/Topic Data Entry Form
  const [topicFormData, setTopicFormData] = useState({
    course: '',
    topic: '',
    description: '',
    lecturer: '',
  });

  // Effect and Handlers for Navigation and Logout
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserAction = (action) => {
    setIsUserMenuOpen(false);
    if (action === 'Logout') setIsLogoutModalOpen(true);
    else console.log('Navigate to', action);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    console.log('Logged out (placeholder)');
  };

  // Handlers for the New Course/Topic View
  const handleTopicFormChange = (e) => {
    setTopicFormData({ ...topicFormData, [e.target.name]: e.target.value });
  };

  const handleTopicFormSave = () => {
    console.log('Saving Course/Topic:', topicFormData);
    // Add your save logic here
  };

  const handleTopicFormClear = () => {
    setTopicFormData({
      course: '',
      topic: '',
      description: '',
      lecturer: '',
    });
  };

  const dataEntryItems = ["Course - Topic", "Test Encoding", "Test Question Editing"];
  const isDataEntryActive = dataEntryItems.includes(activeTab) || activeTab === 'Data Entry';

  useEffect(() => { document.body.className = isDarkMode ? 'dark' : ''; }, [isDarkMode]);

  // Determine the class name for the main content card based on the active tab
  const cardClassName = activeTab !== 'Home' ? 'main-card test-encoding' : 'main-card';
  
  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : ''}`}>
      <div className="background" style={{ backgroundImage: `url(${UPHSL})` }} />

      <div className="main-container">
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

        {/* Dynamic Card Class for layout adjustment */}
        <div className={cardClassName}> 

          {/* === 1. HOME VIEW === */}
          {activeTab === 'Home' && (
            <>
              <div className="welcome-card">
                <h2>Welcome {MOCK_USER},</h2>
                <p>To the new and improved Test Data Bank System 2.0! You are now logged in. This updated version offers a faster, more organized, and user-friendly experience for managing exams and test items.</p>
              </div>

              <div className="search-and-view">
                <div className="search-bar">
                  <Search className="search-icon" />
                  <input type="text" placeholder="Search Program/Course..." />
                </div>

                <div className="view-toggle">
                  <button className={programView === 'grid' ? 'active' : ''} onClick={() => setProgramView('grid')} title="Logo View">
                    <Grid />
                  </button>
                  <button className={programView === 'list' ? 'active' : ''} onClick={() => setProgramView('list')} title="Text View">
                    <List />
                  </button>
                </div>
              </div>

              <h3>Your Programs</h3>

              {programView === 'grid' ? (
                <div className="program-grid">
                  {MOCK_PROGRAMS.map(program => (
                    <div key={program.id} className="program-card">
                      <img src={program.logo} alt={program.name} onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/96x96/FFFFFF/1C4DA1?text=LOGO'}} />
                      <p>{program.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="program-list">
                  {MOCK_PROGRAMS.map(program => (
                    <div key={program.id} className="program-list-item">
                      <p>{program.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* === 2. COURSE - TOPIC DATA ENTRY VIEW (Similar to TestEncodingAndEditing) === */}
          {activeTab === 'Course - Topic' && (
            <>
              {/* HEADER SECTION (Similar to Test Encoding) */}
              <div className="header-section">
                <img src={MOCK_DEPARTMENTS[0].logo} alt="Dept Logo" className="dept-logo" />

                <div className="title-block">
                  <hr />
                  <h1 className="page-title">Course/Topic Data Entry</h1>
                  <hr />
                </div>
                <div className="logo-spacer"></div>
              </div>

              {/* SELECTION FIELDS */}
              <div className="selection-fields">
                <div className="input-group">
                  <label htmlFor="course">Select Course</label>
                  <select id="course" name="course" value={topicFormData.course} onChange={handleTopicFormChange}>
                    <option value="" disabled>Select Course</option>
                    {MOCK_COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="lecturer">Assign Lecturer</label>
                  <select id="lecturer" name="lecturer" value={topicFormData.lecturer} onChange={handleTopicFormChange}>
                    <option value="" disabled>Select Lecturer</option>
                    {MOCK_LECTURERS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                
                {/* Empty group for layout balance */}
                <div className="input-group"></div>
              </div>
              
              {/* TOPIC INPUT BLOCK (Using .question-block style) */}
              <div className="question-block"> 
                <label>
                  <Tag size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  New Topic Name
                </label>
                <input
                  type="text"
                  name="topic"
                  placeholder="Enter the name of the new module or topic (e.g., Introduction to Networking)"
                  value={topicFormData.topic}
                  onChange={handleTopicFormChange}
                />
              </div>

              {/* TOPIC DESCRIPTION BLOCK (Using .question-block style) */}
              <div className="question-block">
                <label>
                  <FileText size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  Topic Description / Scope
                </label>
                
                {/* Mock Rich Text Toolbar - Reusing existing class for style */}
                <div className="rich-text-toolbar">
                  <button title="Bold">B</button>
                  <button title="Italic">I</button>
                  <button title="List">&#x2022;</button>
                </div>
                
                <textarea
                  name="description"
                  placeholder="Provide a brief description of the topic's scope and objectives..."
                  value={topicFormData.description}
                  onChange={handleTopicFormChange}
                  rows="5"
                />
                <p className="placeholder-rt-icon">
                    <School size={16}/> Use basic formatting only.
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="action-buttons list-actions">
                <button className="btn-cancel" onClick={handleTopicFormClear}>
                  <Plus size={20} /> Clear Fields
                </button>
                <button className="btn-save" onClick={handleTopicFormSave}>
                  <Save size={20} /> Save Course & Topic
                </button>
              </div>
            </>
          )}

          {/* === 3. TEST ENCODING VIEW PLACEHOLDER === */}
          {activeTab === 'Test Encoding' && (
            <div className="test-encoding">
                <h2 className="page-title" style={{textAlign: 'center', margin: '2rem 0'}}>Test Encoding View (Content goes here)</h2>
                <p style={{textAlign: 'center'}}>This page content should mirror the layout structure we used in the previous steps.</p>
            </div>
          )}
          
          {/* === 4. TEST QUESTION EDITING VIEW PLACEHOLDER === */}
          {activeTab === 'Test Question Editing' && (
            <div className="test-encoding">
                <h2 className="page-title" style={{textAlign: 'center', margin: '2rem 0'}}>Test Question Editing View (Content goes here)</h2>
                <p style={{textAlign: 'center'}}>This page content should mirror the layout structure we used in the previous steps.</p>
            </div>
          )}

        </div>
      </div>

      {/* Logout Modal - Centralized Component */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Dashboard;