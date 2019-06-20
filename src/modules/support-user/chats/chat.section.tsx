import React from 'react';
import { ChatView } from './chat-view';
import { WaitingNewChat } from './waiting-new-chat';
import './chat.section.scss';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const supportUserChat = gql`
  query supportUserChat{
    activeChat{
      id
        active
        createdAt
        user{
          id
          name
          lastname
          username
          email
          profileImage
        }
    }
  }
`;

const activatedChatSub = gql`
  subscription {
    asignedChat:chatAsigned{
      id
      active
      createdAt
      user{
        id
        name
        lastname
        username
        email
        profileImage
      }
    }
  }
`;

const expiredChatSub = gql`
  subscription {
    expiredChat:chatExpired{
      id
    }
  }
`;

export const ChatSection: React.FC = () => {
  const { data: { activeChat }, updateQuery } = useQuery<{ activeChat: Chat }>(supportUserChat);

  useSubscription<{ asignedChat: Chat }>(activatedChatSub, {
    onSubscriptionData({ subscriptionData: { data } }) {
      updateQuery(prev => ({ ...prev, activeChat: data.asignedChat }));
    },
  });

  useSubscription<{ expiredChat: Chat }>(expiredChatSub, {
    onSubscriptionData({ subscriptionData: { data: { expiredChat } } }) {
      updateQuery((prev => prev.activeChat.id === expiredChat.id ? ({
        ...prev, activeChat: null,
      }) : prev));
    },
  });

  return (
    <div className="chat-section-container">
      {activeChat ? <ChatView activeChat={activeChat} /> : <WaitingNewChat />}
    </div>
  );
};
