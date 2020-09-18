import React, { useEffect, useState, useRef } from 'react';
import './ReactChat.css';
import qs from 'qs';
import io from 'socket.io-client';

const socket = io.connect('http://127.0.0.1:8000');

const Messages = () => {
  // Get username and chatId from URL
  const { username, chatId } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  });
  const [messages, setMessages] = useState<any>([]);
  const msgRef = useRef<HTMLDivElement>(document.createElement('div'));

  const renderMessages = () =>
    messages.map((item: any, key: any) => (
      <div className="message" key={key}>
        <p className="meta">
          {item.username}: <span> {item.time}</span>
        </p>
        <p ref={msgRef} className="text">
          {item.text}
        </p>
      </div>
    ));

  const scrollToBottom = () => {
    msgRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Message from server
    socket.on('message', (msg: any) => {
      setMessages((message: any) => [...message, msg]);
    });
  }, []);

  useEffect(() => {
    // Join chatroom
    socket.emit('joinRoom', { username, chatId });
  }, [chatId, username]);

  useEffect(() => {
    if (!messages.length) return;
    scrollToBottom();
  }, [messages]);

  return (
    <main className="chat-main">
      <div className="chat-messages">{renderMessages()}</div>
    </main>
  );
};

const Input = () => {
  const onSubmit = (e: any) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value.trim();
    if (!msg) return;
    // Emit message to server
    socket.emit('chatMessage', msg);
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  };

  return (
    <div className="chat-form-container">
      <form id="chat-form" onSubmit={(e) => onSubmit(e)}>
        <input id="msg" type="text" placeholder="Type your message..." required />
        <button className="btn">Send</button>
      </form>
    </div>
  );
};

const ReactChat = () => {
  return (
    <div className="chat-container">
      <Messages />
      <Input />
    </div>
  );
};

export default ReactChat;
