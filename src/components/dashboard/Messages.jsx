// import React from "react";
// import "./Messages.css"

// const Messages = ({ messages, onRead }) => {
//     return (
//         <div style={{ marginBottom: "30px" }}>
//             <h3>Messages</h3>
//             {messages.length === 0 ? (
//                 <p>No messages found.</p>
//             ) : (
//                 messages.map((msg) => (
//                     <div className="messages"
//                         key={msg.id}
//                     >
//                         <div className="message-item">
//                             <strong>{msg.from}:</strong>
//                             <p style={{ margin: "5px 0" }}>{msg.text}</p>
//                         </div>
//                         {/* {!msg.read && (
//               <button
//                 onClick={() => onRead(msg.id)}
//                 style={{
//                   position: "absolute",
//                   top: "10px",
//                   right: "10px",
//                   background: "#007bff",
//                   color: "#fff",
//                   border: "none",
//                   padding: "4px 8px",
//                   fontSize: "12px",
//                   borderRadius: "4px",
//                   cursor: "pointer"
//                 }}
//               >
//                 Mark as Read
//               </button>
//             )} */}
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// export default Messages;

import "./Messages.css"

const Messages = ({ messages, onRead }) => {
    const formatTime = (timestamp) => {
        // Mock time formatting - replace with actual timestamp formatting
        return "2 hours ago";
    };

    const getPriority = (message) => {
        // Mock priority logic - replace with actual priority determination
        return message.priority || 'medium';
    };

    return (
        <div className="messages-container">
            <h3 className="messages-title">
                <span className="messages-icon">💬</span>
                Messages
            </h3>
            <div className="messages-list">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <div className="no-messages-icon">📭</div>
                        <p>No messages found.</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.8 }}>
                            You'll see notifications and updates here.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div 
                            key={msg.id}
                            className="message-item"
                        >
                            {!msg.read && <div className="unread-indicator"></div>}
                            
                            <div className="message-header">
                                <div className="message-from">
                                    <svg className="sender-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {msg.from}
                                </div>
                                <div className="message-time">
                                    {formatTime(msg.timestamp)}
                                </div>
                            </div>
                            
                            <p className="message-text">{msg.text}</p>
                            
                            <div className={`message-priority ${getPriority(msg)}`}>
                                {getPriority(msg)}
                            </div>
                            
                            {!msg.read && onRead && (
                                <button
                                    onClick={() => onRead(msg.id)}
                                    className="mark-read-btn"
                                >
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Messages;