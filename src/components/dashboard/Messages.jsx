import React from "react";
import "./Messages.css"

const Messages = ({ messages, onRead }) => {
    return (
        <div style={{ marginBottom: "30px" }}>
            <h3>Messages</h3>
            {messages.length === 0 ? (
                <p>No messages found.</p>
            ) : (
                messages.map((msg) => (
                    <div className="messages"
                        key={msg.id}
                    >
                        <div className="message-item">
                            <strong>{msg.from}:</strong>
                            <p style={{ margin: "5px 0" }}>{msg.text}</p>
                        </div>
                        {/* {!msg.read && (
              <button
                onClick={() => onRead(msg.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Mark as Read
              </button>
            )} */}
                    </div>
                ))
            )}
        </div>
    );
};

export default Messages;
