import React from 'react';
import { Segment } from 'semantic-ui-react';
import './waiting-new-chat.scss';

export const WaitingNewChat: React.FC = () => (
  <Segment className="waiting-chat-container">
    <h1>Esperando nuevo chat...</h1>
  </Segment>
);
