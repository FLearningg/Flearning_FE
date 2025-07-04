import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Button, Spin, Avatar } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './GeminiChatBox.css';

const GeminiChatBox = () => {
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef(null);

    const [currentUser, setCurrentUser] = useState(null);
    const CHAT_HISTORY_KEY = 'flearning_chat_history';

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Error parsing currentUser from localStorage:", err);
        }

        try {
            const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
            if (savedHistory) {
                setChatHistory(JSON.parse(savedHistory));
            } else {
                 setChatHistory([{
                    role: 'model',
                    text: 'Hello! How can I help you today?'
                 }]);
            }
        } catch (e) {
            console.error("Error reading chat history from localStorage:", e);
        }
    }, []);

    useEffect(() => {
        try {
            if (chatHistory.length > 1 || (chatHistory.length === 1 && chatHistory[0].role !== 'model')) {
               localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
            }
        } catch (e) {
            console.error("Could not save chat history to localStorage:", e);
        }
    }, [chatHistory]);


    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(scrollToBottom, [chatHistory, isSending]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = useCallback(async () => {
        const userMessageText = inputValue.trim();
        if (!userMessageText || isSending) return;

        const newUserMessage = { role: 'user', text: userMessageText };
        
        const updatedChatHistory = [...chatHistory, newUserMessage];
        setChatHistory(updatedChatHistory);
        
        setInputValue('');
        setIsSending(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chatbot/query', {
                prompt: userMessageText,
            });
            const botMessage = { role: 'model', text: response.data.reply };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error fetching bot reply:', error);
            const errorMessage = {
                role: 'model',
                text: "Sorry, I'm having trouble connecting. Please try again later."
            };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    }, [inputValue, isSending, chatHistory]);

    const handlePressEnter = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="gemini-chatbox-container">
            <div className="chat-display-area">
                {chatHistory.map((item, index) => (
                    <div key={index} className={`message-row ${item.role === 'user' ? 'user-row' : 'bot-row'}`}>
                        {item.role === 'model' && (
                             <Avatar size={32} src="https://i.imgur.com/jCVN75w.jpeg" icon={<RobotOutlined />} className="chat-avatar" />
                        )}
                        <div className="message-bubble">
                            {item.role === 'user' && <div className="message-author">You</div>}
                            {item.role === 'model' && <div className="message-author">F-Learning Bot</div>}
                            <div className="message-text">
                                <ReactMarkdown components={{ a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}>
                                    {item.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                        {/* THAY ĐỔI CHÍNH: Avatar người dùng được render ở đây, sau bubble */}
                         {item.role === 'user' && (
                            currentUser?.userImage ?
                            <Avatar size={32} src={currentUser.userImage} className="chat-avatar" /> :
                            <Avatar size={32} icon={<UserOutlined />} className="chat-avatar" />
                        )}
                    </div>
                ))}

                {isSending && (
                     <div className="message-row bot-row">
                         <Avatar size={32} src="https://i.imgur.com/jCVN75w.jpeg" icon={<RobotOutlined />} className="chat-avatar" />
                         <div className="message-bubble">
                            <div className="message-author">F-Learning Bot</div>
                            <div className="message-text typing-indicator">
                                <Spin size="small" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area">
                 <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Ask a question..."
                    onPressEnter={handlePressEnter}
                    disabled={isSending}
                    className="chat-input-field"
                 />
                 <Button
                    type="text"
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={isSending}
                    disabled={!inputValue.trim()}
                    className="send-button"
                 />
            </div>
        </div>
    );
};

export default GeminiChatBox;