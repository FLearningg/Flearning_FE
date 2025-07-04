import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { MessageOutlined, CloseOutlined, RobotOutlined } from '@ant-design/icons';
import GeminiChatBox from './GeminiChatBox';
import './FloatingChatButton.css';

const FloatingChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={`chatbox-wrapper ${isOpen ? 'open' : ''}`}>
               <div className="chatbox-header">
                   {/* Thay đổi tên ở đây */}
                   <span><RobotOutlined /> F-Learning Assistant</span> 
                   <Button
                       type="text"
                       icon={<CloseOutlined />}
                       onClick={toggleChat}
                       size="small"
                       className="close-chat-button"
                   />
               </div>
                <GeminiChatBox />
            </div>

            <Tooltip title={isOpen ? "Close Chat" : "Chat with AI Assistant"} placement="left">
                <Button
                    className="floating-chat-button"
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
                    onClick={toggleChat}
                />
            </Tooltip>
        </>
    );
};

export default FloatingChatButton;