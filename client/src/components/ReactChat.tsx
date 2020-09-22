import React, { useEffect, useState, useRef } from 'react';
import qs from 'qs';
import io from 'socket.io-client';
import styled from 'styled-components';

// server address for local dev is 'http://127.0.0.1:8000'
// no param passed to connect when deployed to heroku
const socket = io.connect();

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
    <ChatContainer>
      <Messages />
      <Input />
    </ChatContainer>
  );
};

export default ReactChat;

const ChatContainer = styled.div`
  background: #fff;
  overflow: hidden;
  .btn {
    cursor: pointer;
    padding: 5px 15px;
    background: var(--light-color);
    color: var(--dark-color-a);
    border: 0;
    font-size: 17px;
  }

  .chat-header {
    background: var(--dark-color-a);
    color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .chat-messages {
    padding: 30px;
    height: calc(100vh - 40px);
    overflow-y: scroll;
    .message {
      padding: 10px;
      margin-bottom: 15px;
      background-color: var(--light-color);
      border-radius: 5px;
      overflow-wrap: break-word;
      .meta {
        font-size: 12px;
        font-weight: bold;
        color: var(--dark-color-b);
        opacity: 0.7;
        margin-bottom: 7px;
        span {
          color: #777;
        }
      }
      .text {
        font-size: 14px;
      }
    }
  }

  .chat-form-container {
    border-top: 1px solid rgb(232, 232, 232);
    form {
      display: flex;
    }
    input[type='text'] {
      width: 100%;
      padding: 12px 14px;
      outline: 0;
      border: 0;
    }
  }
`;
