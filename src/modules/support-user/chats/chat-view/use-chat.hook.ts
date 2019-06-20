import gql from 'graphql-tag';
import { useMutation, useQuery, useSubscription } from 'react-apollo-hooks';

const chatMessagesQuery = gql`
  query chatMessages($chatId: String!){
    chatMessages(chatId: $chatId){
      id
      createdAt
      content
      sender{
        id
        name
        profileImage
      }
    }
  }
`;

const chatMessageSub = gql`
  subscription chatMessageSub($chatId: String!) {
    chatMessage:chatMessageSubscription(chatId: $chatId) {
      id
      createdAt
      content
      sender {
        id
        name
        profileImage
      }
    }
  }
`;

const addChatMessageMut = gql`
  mutation addChatMessage($chatId: String!, $message: String!){
    addChatMessage(chatId: $chatId, message: $message){
      message
      success
    }
  }
`;

const finalizeChatMut = gql`
  mutation finalizeChat($chatId: String!){
    finalizeChat(chatId: $chatId){
      success
      message
    }
  }
`;

export const useChat = (chatId: string) => {
  const addChatMessage = useMutation(addChatMessageMut);
  const finalizeChatMutation = useMutation(finalizeChatMut);
  const { data: { chatMessages }, updateQuery } = useQuery<{ chatMessages: ChatMessage[] }>(
    chatMessagesQuery,
    { variables: { chatId } },
  );

  useSubscription<{ chatMessage: ChatMessage }>(chatMessageSub, {
    variables: { chatId },
    onSubscriptionData({ subscriptionData: { data: { chatMessage } } }) {
      updateQuery(prev => ({ ...prev, chatMessages: [...prev.chatMessages, chatMessage] }));
    },
  });

  function sendMessage(message: string) {
    return addChatMessage({
      variables: { chatId, message },
    });
  }

  function finalizeChat() {
    return finalizeChatMutation({
      variables: { chatId },
    });
  }

  return { chatMessages, sendMessage, finalizeChat };
};
