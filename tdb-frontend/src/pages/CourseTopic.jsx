import React, { useState, useEffect, useRef } from 'react';
import { Home, ClipboardList, BookOpen, Settings, LogOut, User, Sun, Moon, Search } from 'lucide-react';
import NavItem from '../components/NavItem';
import DropdownNavItem from '../components/DropdownNavItem';
import LogoutModal from '../components/LogoutModal';
import '../styles/CourseTopic.css';

import TDBLogo from '../assets/TDB logo.png';
import UPHSL from '../assets/uphsl.png';
import CCS from '../assets/CCS.png';

const MOCK_USER = "Dr. Dela Cruz";
const dataEntryItems = ["Course - Topic", "Test Encoding", "Test Question Editing"];

const courses = [
  { code: "BSCS", name: "Bachelor of Science in Computer Science, Specialization in Data Science" },
  { code: "BSIT", name: "Bachelor of Science in Information Technology, Specialization in Game Development" },
  { code: "BSEMC", name: "Bachelor of Science in Entertainment and Multimedia Computing" },
  { code: "BSCF", name: "Bachelor of Information Technology, Major in Cybersecurity and Forensics" }
];

const topicCodes = ["T001", "T002", "T003"];
const values = ["10", "20", "30"];

const CourseTopic = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Course topic form states
  const [course, setCourse] = useState("");
  const [topicCode, setTopicCode] = useState("");
  const [value, setValue] = useState("");
  const [topicDesc, setTopicDesc] = useState("");
  const [hours, setHours] = useState("");
  const [history, setHistory] = useState([]);

  const isDataEntryActive = dataEntryItems.includes(activeTab) || activeTab === 'Data Entry';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
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

  const handleSave = () => {
    if (!course || !topicCode || !value || !topicDesc || !hours) return;
    setHistory([...history, { course, topicCode, topicDesc, hours }]);
    setCourse(""); setTopicCode(""); setValue(""); setTopicDesc(""); setHours("");
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : ''}`}>
      <div className="background" style={{ backgroundImage: `url(${UPHSL})` }} />

      <div className="main-container">
        {/* Navbar (same as Dashboard.jsx) */}
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

        {/* Search bar (same as Dashboard.jsx) */}
        <div className="search-and-view" style={{ maxWidth: '1140px', margin: '0 auto 20px auto' }}>
          <div className="search-bar">
            <Search className="search-icon" />
            <input type="text" placeholder="Search Program/Course..." />
          </div>
        </div>

        {/* Course & Topic Container */}
        <div className="course-topic-container">
          <h2>Course & Topic Management</h2>

          {/* Program Header */}
          <div className="program-header-line">
            <img src={CCS} alt="CCS" className="program-logo large-logo" />
            <span className="program-name large-name">College of Computer Studies</span>
          </div>

          {/* Fields */}
          <div className="field-container">
            <label>Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="row-fields">
            <div className="field-container half-width">
              <label>Topic Code</label>
              <select value={topicCode} onChange={(e) => setTopicCode(e.target.value)}>
                <option value="">Select Topic Code</option>
                {topicCodes.map(tc => <option key={tc} value={tc}>{tc}</option>)}
              </select>
            </div>
            <div className="field-container half-width">
              <label>Value</label>
              <select value={value} onChange={(e) => setValue(e.target.value)}>
                <option value="">Select Value</option>
                {values.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="row-fields">
            <div className="field-container flex-2">
              <label>Topic Description</label>
              <input type="text" value={topicDesc} onChange={(e) => setTopicDesc(e.target.value)} />
            </div>
            <div className="field-container flex-1">
              <label>Hours Per Topic</label>
              <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
          </div>

          <button className="save-btn" onClick={handleSave}>Save</button>

          {/* History Table */}
          <div className="history-table">
            <div className="history-row header">
              <span>#</span>
              <span>Topic Code</span>
              <span>Topic Description</span>
              <span>Hours Per Topic</span>
            </div>
            {history.map((item, index) => (
              <div key={index} className="history-row">
                <span>{index + 1}</span>
                <span>{item.topicCode}</span>
                <span>{item.topicDesc}</span>
                <span>{item.hours}</span>
              </div>
            ))}
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

export default CourseTopic;
