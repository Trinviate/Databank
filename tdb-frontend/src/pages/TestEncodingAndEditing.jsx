import React, { useState, useRef, useEffect } from 'react';
import { 
    Home, ClipboardList, BookOpen, Settings, LogOut, User, Sun, Moon, Search, 
    FileText, Save, Plus, Edit2, Trash2, 
    Bold, Italic, Underline, Link, List, ListOrdered, Sigma, Image, Edit, 
    Heading1, Heading2,
} from 'lucide-react';
import NavItem from '../components/NavItem';
import DropdownNavItem from '../components/DropdownNavItem';
import LogoutModal from '../components/LogoutModal';
import '../styles/TestEncodingAndEditing.css';

// Mock Assets (Replace with your actual paths)
import TDBLogo from '../assets/TDB logo.png';
import UPHSL from '../assets/uphsl.png';
import CCS from '../assets/CCS.png'; 

// --- MOCK DATA ---
const MOCK_USER = "Dr. Dela Cruz";
const dataEntryItems = ["Course - Topic", "Test Question Encoding", "Test Question Editing"];

const MOCK_SUBJECTS = [
    { code: "CS", name: "Computer Science" },
    { code: "IT", name: "Information Technology" },
    { code: "EMC", name: "Entertainment and Multimedia Computing" }
];

const MOCK_TOPICS = [
    { id: 1, topic: "Data Structures and Algorithms", subjectCode: "CS" },
    { id: 2, topic: "Database Management Systems", subjectCode: "CS" },
    { id: 3, topic: "Web Development Fundamentals (HTML/CSS)", subjectCode: "IT" },
    { id: 4, topic: "Networking Protocols (TCP/IP)", subjectCode: "IT" },
    { id: 5, topic: "Game Design Principles", subjectCode: "EMC" },
];

const MOCK_QUESTION_TYPES = [
    "Remembering and Understanding",
    "Applying and Analyzing",
    "Evaluation and Creating"
];

const MATH_SYMBOLS = [
    '=', '+', '−', '±', '×', '÷', '≠', '≈', '>', '<', '≥', '≤',
    'π', 'θ', 'α', 'β', 'γ', 'λ', 'Σ', '∫', '∂', 'Δ', '∇', '∞', 
    '∈', '∉', '∩', '∪', '⊂', '⊃', '∀', '∃', '∴', '∵',
    '⁰', '¹', '²', '³', '⁴', '⁵', '₆', '₇', '₈', '₉', 
    '√', '³√', '⁄',
    '°', '⊥', '∠', '∆', 
];
// -----------------


// --- MathSymbolPicker Component ---
const MathSymbolPicker = ({ position, onSelect, onClose }) => {
    if (!position) return null;
    return (
        <div 
            className="math-symbol-picker" 
            style={{ top: position.y, left: position.x }}
            // Critical: Stop click from propagating to prevent focus loss in contentEditable
            onMouseDown={(e) => e.stopPropagation()} 
        >
            <div className="picker-header">
                Select Symbol
                <button onClick={onClose} className="close-btn">×</button>
            </div>
            <div className="symbol-grid">
                {MATH_SYMBOLS.map((symbol) => (
                    <button 
                        key={symbol} 
                        onClick={() => onSelect(symbol)}
                        className="symbol-btn"
                        title={symbol}
                    >
                        {symbol}
                    </button>
                ))}
            </div>
        </div>
    );
};
// -----------------


// --- RichTextToolbar Component ---
const RichTextToolbar = ({ onFormat, onSaveRange }) => {
    
    // FIX: Ensures selection is saved and button click is prevented from losing focus
    const handleToolbarClick = (e, formatType, command, value) => {
        // Essential: Prevents the contentEditable area from losing focus/selection
        e.preventDefault(); 
        
        // Save current selection/cursor position BEFORE processing the format command
        onSaveRange(); 

        if (formatType === 'openPicker' && command === 'math') {
            onFormat('openPicker', 'math', e.currentTarget);
        } else {
            onFormat(formatType, command, value);
        }
    };

    return (
        // Critical: Prevent focus loss on the entire toolbar area
        <div className="rich-text-toolbar" onMouseDown={(e) => e.preventDefault()}> 
            <button title="Normal Text (P)" onMouseDown={(e) => handleToolbarClick(e, 'formatBlock', 'formatBlock', 'p')}>¶</button>
            <button title="Heading 1" onMouseDown={(e) => handleToolbarClick(e, 'formatBlock', 'formatBlock', 'h1')}><Heading1 size={18} /></button>
            <button title="Heading 2" onMouseDown={(e) => handleToolbarClick(e, 'formatBlock', 'formatBlock', 'h2')}><Heading2 size={18} /></button>
            <div className="separator" />
            
            <button title="Bold" onMouseDown={(e) => handleToolbarClick(e, 'style', 'bold')}><Bold size={18} /></button>
            <button title="Italic" onMouseDown={(e) => handleToolbarClick(e, 'style', 'italic')}><Italic size={18} /></button>
            <button title="Underline" onMouseDown={(e) => handleToolbarClick(e, 'style', 'underline')}><Underline size={18} /></button>
            
            <div className="separator" />
            <button title="Unordered List" onMouseDown={(e) => handleToolbarClick(e, 'list', 'insertunorderedlist')}><List size={18} /></button>
            <button title="Ordered List" onMouseDown={(e) => handleToolbarClick(e, 'list', 'insertorderedlist')}><ListOrdered size={18} /></button>
            <div className="separator" />
            <button title="Link" onMouseDown={(e) => handleToolbarClick(e, 'insert', 'createlink')}><Link size={18} /></button>
            <button title="Mathematical Symbols" 
                onMouseDown={(e) => handleToolbarClick(e, 'openPicker', 'math', e.currentTarget)}>
                <Sigma size={18} />
            </button>
            <button title="Insert Image" onMouseDown={(e) => handleToolbarClick(e, 'image', 'insertImage')}><Image size={18} /></button>
            <button title="Edit Image" onMouseDown={(e) => handleToolbarClick(e, 'image', 'editImage')}><Edit size={18} /></button>
        </div>
    );
};
// -----------------


// --- HeaderTitleBlock Component ---
const HeaderTitleBlock = ({ activeTab, isDarkMode }) => (
    <div className="header-section">
        <h1 className="page-title">{activeTab}</h1> 
        <hr className="header-separator-line" /> 
        <div className={`college-title-block centered-only ${isDarkMode ? 'dark' : ''}`}>
            <img src={CCS} alt="CCS Logo" className="dept-logo" /> 
            <span className="college-text">College of Computer Studies</span>
        </div>
        <hr className="header-separator-line" />
    </div>
);
// -----------------


// --- Main Component ---
const TestEncodingAndEditing = () => {
    const [activeTab, setActiveTab] = useState('Test Question Encoding');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const userMenuRef = useRef(null);

    const [subject, setSubject] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [questionType, setQuestionType] = useState("");

    // State for Rich Text Editor
    const [isMathPickerOpen, setIsMathPickerOpen] = useState(false);
    const [mathPickerPosition, setMathPickerPosition] = useState(null);
    const activeEditableRef = useRef(null); 
    const activeSetterRef = useRef(null); 
    const [savedRange, setSavedRange] = useState(null); // The critical saved selection range

    const [searchText, setSearchText] = useState("");
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState(''); 
    const [choiceA, setChoiceA] = useState('');
    const [choiceB, setChoiceB] = useState('');
    const [choiceC, setChoiceC] = useState('');
    const [choiceD, setChoiceD] = useState('');
    const [explanation, setExplanation] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(''); 

    // --- Effects & Handlers ---

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (isMathPickerOpen && !event.target.closest('.math-symbol-picker') && !event.target.closest('.rich-text-toolbar button[title="Mathematical Symbols"]')) {
                setIsMathPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMathPickerOpen]);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark' : '';
    }, [isDarkMode]);


    // Handler to save the current selection (cursor position or highlighted text)
    const handleSaveRange = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && activeEditableRef.current) {
             const range = selection.getRangeAt(0);
             // Only save the range if it belongs to the currently active contentEditable area
             if (activeEditableRef.current.contains(range.startContainer)) {
                 setSavedRange(range); 
             } else {
                 setSavedRange(null);
             }
        } else {
            setSavedRange(null);
        }
    };

    // Handler run on focus: sets the active element and saves the range
    const handleFocus = (e, setter) => { 
        activeEditableRef.current = e.target;
        activeSetterRef.current = setter; 
        handleSaveRange(); 
    };

    // The logic below for `handleFormat` is the new, definitive fix.
    const handleFormat = (type, command, value) => { 
        if (type === 'openPicker' && command === 'math') { 
            const element = value;
            const rect = element.getBoundingClientRect();
            setMathPickerPosition({ x: rect.left, y: rect.bottom + 5 });
            setIsMathPickerOpen(true); 
            return; 
        }
        
        const currentRef = activeEditableRef.current;
        if (!currentRef) { 
            alert("Click inside a content field first."); 
            return; 
        }

        const selection = window.getSelection();
        
        // 1. RESTORE: Restore the saved range (selection)
        if (savedRange && currentRef.contains(savedRange.startContainer)) { 
            selection.removeAllRanges(); 
            selection.addRange(savedRange); 
        }
        
        // 2. FOCUS: Ensure the element is focused for execCommand to work correctly
        currentRef.focus(); 
        
        // 3. EXECUTE: Execute the command immediately
        switch(type) {
            case 'style': 
            case 'list': 
            case 'formatBlock':
                document.execCommand(command, false, value || null); 
                break;
            case 'insert':
                if(command==='createlink'){ 
                    const url = prompt("Enter URL:"); 
                    if(url) { 
                        document.execCommand('createlink', false, url); 
                    }
                }
                break;
            case 'image':
                if(command==='insertImage'){ 
                    const url = prompt("Enter image URL:"); 
                    if(url) { 
                        document.execCommand('insertImage', false, url); 
                    }
                }
                else if(command==='editImage'){ 
                    alert("Image edit triggered."); 
                }
                break;
            default: 
                console.log(`Command ${command} not implemented.`);
        }

        // 4. UPDATE STATE: Update the state with the new content (including formatting)
        if(activeSetterRef.current) activeSetterRef.current(currentRef.innerHTML);
        
        // 5. RE-SAVE: Critical step - save the new range/cursor position 
        // This captures the nested formatting tags (e.g., <b><i>|</i></b>) for the next click.
        handleSaveRange(); 
    };

    // --- Utility Handlers (Logout, Data, etc.) ---
    const handleUserAction = (action) => {
        setIsUserMenuOpen(false);
        if (action === 'Logout') setIsLogoutModalOpen(true);
        else console.log('Navigate to', action);
    };

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        console.log('Logged out (placeholder)');
    };

    const insertSymbol = (symbol) => {
        const currentRef = activeEditableRef.current;
        setIsMathPickerOpen(false);
        if (!currentRef) return;
        currentRef.focus();
        const selection = window.getSelection();
        let rangeToUse = savedRange && currentRef.contains(savedRange.startContainer) 
            ? savedRange 
            : selection.rangeCount > 0 
                ? selection.getRangeAt(0) 
                : document.createRange();

        const textNode = document.createTextNode(symbol);
        rangeToUse.deleteContents(); 
        rangeToUse.insertNode(textNode);
        rangeToUse.setStartAfter(textNode);
        rangeToUse.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(rangeToUse);
        
        if(activeSetterRef.current) activeSetterRef.current(currentRef.innerHTML);
        setSavedRange(rangeToUse);
    };


    const handleContentChange = (e, setter) => { setter(e.target.innerHTML); };
    
    const handleAction = (type) => {
        if (!subject || !topicDescription || !questionType || !questionText || !correctAnswer) { alert("Fill all required fields."); return; }
        const newQ = { text: questionText, choiceA, choiceB, choiceC, choiceD, correctAnswer, explanation, subject, topic: topicDescription, type: questionType, id: Date.now() };
        setQuestions([...questions, newQ]);
        if(type==='add'){ setQuestionText(''); setChoiceA(''); setChoiceB(''); setChoiceC(''); setChoiceD(''); setExplanation(''); setCorrectAnswer(''); document.querySelectorAll('.content-editable-area').forEach(el=>el.innerHTML=''); }
        alert(`Question ${type==='save'?'saved':'added'} successfully!`);
    };

    const computeDataSummary = () => {
        const totalQuestions = questions.length;
        const counts = { 'Remembering and Understanding':0, 'Applying and Analyzing':0, 'Evaluation and Creating':0 };
        questions.forEach(q=>{ if(counts.hasOwnProperty(q.type)) counts[q.type]++; });
        const getPercent = (c)=>totalQuestions>0?((c/totalQuestions)*100).toFixed(1):0;
        const bloomData = [
            {level:'Remembering and Understanding', count:counts['Remembering and Understanding'], achieved:getPercent(counts['Remembering and Understanding']), target:30},
            {level:'Applying and Analyzing', count:counts['Applying and Analyzing'], achieved:getPercent(counts['Applying and Analyzing']), target:30},
            {level:'Evaluation and Creating', count:counts['Evaluation and Creating'], achieved:getPercent(counts['Evaluation and Creating']), target:40},
        ];
        return { totalQuestions, bloomData };
    };

    const summary = computeDataSummary();
    // -----------------

    return (
        <div className={`dashboard test-encoding ${isDarkMode?'dark':''}`}>
            <div className="background" style={{backgroundImage:`url(${UPHSL})`}} />
            {isMathPickerOpen && <MathSymbolPicker position={mathPickerPosition} onSelect={insertSymbol} onClose={()=>setIsMathPickerOpen(false)} />}
            
            <LogoutModal isOpen={isLogoutModalOpen} onClose={()=>setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />

            <div className="main-container" style={{marginTop:'2rem'}}>
                <nav className={`navbar ${isDarkMode?'dark':''}`}>
                    <div className="nav-left">
                        <button onClick={()=>setActiveTab('Home')} className="logo-btn">
                            <img src={TDBLogo} alt="TDB Logo" className="logo" />
                            <span className="logo-text">TEST DATABANK</span>
                        </button>
                    </div>
                    <div className="nav-center">
                        <NavItem icon={Home} label="Home" isActive={activeTab==='Home'} onClick={()=>setActiveTab('Home')} />
                        <DropdownNavItem icon={ClipboardList} label="Data Entry" isActive={dataEntryItems.includes(activeTab)} dropdownItems={dataEntryItems} onSelect={item=>setActiveTab(item)} />
                        <NavItem icon={BookOpen} label="Reports" isActive={activeTab==='Reports'} onClick={()=>setActiveTab('Reports')} />
                    </div>
                    <div className="nav-right" ref={userMenuRef}>
                        <button onClick={()=>setIsDarkMode(!isDarkMode)} className={`mode-switch ${isDarkMode?'dark':''}`}>
                            <div className="circle">{isDarkMode?<Moon/>:<Sun/>}</div>
                        </button>
                        <button onClick={()=>setIsUserMenuOpen(!isUserMenuOpen)} className={`user-btn ${isUserMenuOpen?'active':''}`}>
                            <div className="user-pic">{MOCK_USER.charAt(4)}</div>
                            <span className="user-name">{MOCK_USER}</span>
                        </button>
                        {isUserMenuOpen && (
                            <div className="user-dropdown show">
                                <button onClick={()=>handleUserAction('User Management')}><Settings size={18}/> User Management</button>
                                <button onClick={()=>handleUserAction('Edit Account')}><User size={18}/> Edit Account</button>
                                <button className="logout-btn" onClick={()=>handleUserAction('Logout')}><LogOut size={18}/> Logout</button>
                            </div>
                        )}
                    </div>
                </nav>

                <div className={`search-bar ${isDarkMode?'dark':''}`}>
                    <Search className="search-icon" />
                    <input type="text" placeholder="Search Question/Topic..." value={searchText} onChange={e=>setSearchText(e.target.value)} className={isDarkMode?'dark':''}/>
                </div>

                <div className="main-card">
                    <HeaderTitleBlock activeTab={activeTab} isDarkMode={isDarkMode} />
                    
                    {/* Selection Fields */}
                    <div className="selection-fields">
                        <div className="input-group">
                            <label htmlFor="subject">Subject</label>
                            <select id="subject" value={subject} onChange={e=>{setSubject(e.target.value); setTopicDescription('');}}>
                                <option value="" disabled>Select Subject Code</option>
                                {MOCK_SUBJECTS.map(s=><option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="topicDesc">Topic Description</label>
                            <select id="topicDesc" value={topicDescription} onChange={e=>setTopicDescription(e.target.value)} disabled={!subject}>
                                <option value="" disabled>{subject?"Select Topic from list":"Select Subject first"}</option>
                                {MOCK_TOPICS.filter(t=>t.subjectCode===subject).map(t=><option key={t.id} value={t.topic}>{t.topic}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="questionType">Type of Question</label>
                            <select id="questionType" value={questionType} onChange={e=>setQuestionType(e.target.value)}>
                                <option value="" disabled>Select Cognitive Level</option>
                                {MOCK_QUESTION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <hr className="section-separator" />

                    {/* Data Summary */}
                    <div className="data-summary-block separate-blooms-view">
                        <h3 className="data-summary-heading">Data Summary</h3>
                        <div className="summary-details-grid three-col-blooms">
                            <div className="summary-card total-stats">
                                <h4>Total Encoding Status</h4>
                                <p>Total Questions Encoded: <span style={{fontWeight:'bold'}}>{summary.totalQuestions}</span></p>
                                <div className="total-bar-check">Overall Coverage: <span style={{fontWeight:'bold'}}>{summary.totalQuestions>0?100:0}%</span></div>
                            </div>
                            {summary.bloomData.map((data,index)=>(
                                <div key={index} className={`summary-card bloom-card color-${index+1}`}>
                                    <h4 className="bloom-card-title">{data.level}</h4>
                                    <p className="bloom-card-count"><span style={{fontWeight:'bold'}}>{data.count}</span> Questions</p>
                                    <div className="bloom-progress-info">
                                        <span className="achieved-percent">Achieved: <span style={{fontWeight:'bold'}}>{data.achieved}%</span></span>
                                        <span className="target-percent">Target: {data.target}%</span>
                                    </div>
                                    <div className="aesthetic-progress-bar-container compact">
                                        <div className={`aesthetic-progress-fill color-${index+1} ${data.achieved>=data.target?'over-target':'under-target'}`} style={{width:`${Math.min(data.achieved,100)}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="section-separator" />

                    {/* Question Block and Choices */}
                    <div className="question-block">
                        <label><FileText size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Question</label>
                        <RichTextToolbar onFormat={handleFormat} onSaveRange={handleSaveRange} />
                        <div 
                            contentEditable="true" 
                            className={questionText?'content-editable-area':'content-editable-area placeholder-active'} 
                            data-placeholder="Enter question text..." 
                            onBlur={e=>handleContentChange(e,setQuestionText)} 
                            onFocus={e=>handleFocus(e,setQuestionText)} 
                            onKeyUp={handleSaveRange} // Save range on key press too
                            onMouseUp={handleSaveRange} // Save range on selection change
                            dangerouslySetInnerHTML={{__html:questionText}}
                        />
                    </div>

                    <div className="choices-grid">
                        {['A','B','C','D'].map((ch,index)=>{
                            const setter=[setChoiceA,setChoiceB,setChoiceC,setChoiceD][index];
                            const content=[choiceA,choiceB,choiceC,choiceD][index];
                            return (
                                <div className="choice-block" key={ch}>
                                    <label>Choice {ch}</label>
                                    <RichTextToolbar onFormat={handleFormat} onSaveRange={handleSaveRange} />
                                    <div 
                                        contentEditable="true" 
                                        className={content?'content-editable-area':'content-editable-area placeholder-active'} 
                                        data-placeholder={`Enter choice ${ch}...`} 
                                        onBlur={e=>handleContentChange(e,setter)} 
                                        onFocus={e=>handleFocus(e,setter)} 
                                        onKeyUp={handleSaveRange}
                                        onMouseUp={handleSaveRange}
                                        dangerouslySetInnerHTML={{__html:content}}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="answer-key-section">
                        <div className="correct-answer-field">
                            <input type="text" placeholder="Correct Answer (A, B, C, or D)" value={correctAnswer} onChange={e=>setCorrectAnswer(e.target.value.toUpperCase())} maxLength={1}/>
                        </div>
                        <div className="answer-key-description">
                            <RichTextToolbar onFormat={handleFormat} onSaveRange={handleSaveRange} />
                            <div 
                                contentEditable="true" 
                                className={explanation?'content-editable-area':'content-editable-area placeholder-active'} 
                                data-placeholder="Answer Key Explanation..." 
                                onBlur={e=>handleContentChange(e,setExplanation)} 
                                onFocus={e=>handleFocus(e,setExplanation)} 
                                onKeyUp={handleSaveRange}
                                onMouseUp={handleSaveRange}
                                dangerouslySetInnerHTML={{__html:explanation}}
                            />
                        </div>
                    </div>

                    <div className="action-buttons list-actions">
                        <button className="btn-save" onClick={()=>handleAction('save')}><Save size={20}/> Save Question</button>
                        <button className="btn-add" onClick={()=>handleAction('add')}><Plus size={20}/> Add Question</button>
                    </div>

                    <div className="question-editing-list">
                        <h3>Questions List</h3>
                        <div className="history-table-container">
                            <table className="history-table">
                                <thead>
                                    <tr><th>#</th><th>Question</th><th>Topic (Type)</th><th>Answer</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {questions.length===0?<tr><td colSpan={5} className="no-questions">No questions yet.</td></tr>:
                                        questions.map((q,idx)=>(
                                            <tr key={idx}>
                                                <td>{idx+1}</td>
                                                <td>{q.text.replace(/<[^>]*>?/gm,'').substring(0,50)+'...'}</td>
                                                <td>{q.topic} ({q.type.split(' ')[0]})</td>
                                                <td>{q.correctAnswer}</td>
                                                <td className="actions-cell">
                                                    <button className="action-edit" title="Edit" onClick={()=>alert(`Edit QID: ${q.id}`)}><Edit2 size={16}/></button>
                                                    <button className="action-delete" title="Delete" onClick={()=>alert(`Delete QID: ${q.id}`)}><Trash2 size={16}/></button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div> 
            </div> 
        </div> 
    );
};

export default TestEncodingAndEditing;