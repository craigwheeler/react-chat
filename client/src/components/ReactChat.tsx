import React from 'react';
import './ReactChat.css';
import qs from 'qs';

const ReactChat = () => {
  // Get username and chatId from URL
  const { username, chatId } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  });

  console.log('username: ', username);
  console.log('chatId: ', chatId);

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
