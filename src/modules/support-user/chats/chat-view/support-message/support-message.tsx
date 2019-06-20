import React from 'react';
import moment from 'moment';
import './support-message.scss';

interface ComponentProps {
  isUserMessage?: boolean;
  message: ChatMessage;
}

export const SupportMessage: React.FC<ComponentProps> = ({ isUserMessage, message }) => {
  const { sender: { profileImage }, createdAt, content } = message;
  const messageDate = moment(new Date(createdAt));

  return (
    <div
      className={`support-message-container ${isUserMessage ? 'user-message' : 'support-message'}`}
    >
      <div className="message-date">
        <div>{messageDate.format('h:mm')}</div>
        <div>{messageDate.format('A')}</div>
      </div>
      <div className="user-image-container">
        <img src={profileImage} className="user-image" alt=" " />
      </div>
      <div className="message-content">
        <p>{content}</p>
      </div>
    </div>
  );
};
