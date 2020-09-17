import React from 'react';
import './ReactChat.css';

const ReactChat = () => {
  return (
    <div className="chat-container">
      <main className="chat-main">
        <div className="chat-messages"></div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form">
          <input id="msg" type="text" placeholder="Type your message..." required />
          <button className="btn">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ReactChat;
