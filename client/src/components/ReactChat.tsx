import React, { useEffect } from 'react';
import './ReactChat.css';
import qs from 'qs';
import io from 'socket.io-client';

const ReactChat = () => {
  // Get username and chatId from URL
  const { username, chatId } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  });

  const socket = io.connect('http://127.0.0.1:8000');

  const onSubmit = (e: any) => {
    // // Message submit
    e.preventDefault();
    // Get message text
    const msg = e.target.elements.msg.value.trim();
    if (!msg) return;
    // Emit message to server
    socket.emit('chatMessage', msg);
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  };

  useEffect(() => {
    // Join chatroom
    socket.emit('joinRoom', { username, chatId });
    // Message from server
    socket.on('message', (message: any) => {
      console.log('output message: ', message);
      // outputMessage(message);
      // Scroll down
      // chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }, [chatId, socket, username]);

  return (
    <div className="chat-container">
      <main className="chat-main">
        <div className="chat-messages"></div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={(e) => onSubmit(e)}>
          <input id="msg" type="text" placeholder="Type your message..." required />
          <button className="btn">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ReactChat;
