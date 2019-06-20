import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button, Form, Header, Icon, Modal } from 'semantic-ui-react';
import { SupportMessage } from './support-message';
import { useChat } from './use-chat.hook';
import { useSubsidiary } from './use-commerce.hook';
import './chat-view.scss';

interface ComponentProps {
  activeChat: Chat;
}

export const ChatView: React.FC<ComponentProps> = ({ activeChat }) => {
  const messageList = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>('');
  const [modalState, setModalState] = useState<boolean>(false);
  const { chatMessages, sendMessage, finalizeChat } = useChat(activeChat.id);
  const { subsidiary } = useSubsidiary((activeChat.user as User).id);

  function handleMessageChange(event: ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
  }

  function openModal() {
    setModalState(true);
  }

  function closeModal() {
    setModalState(false);
  }

  async function handleMessageSubmition() {
    await sendMessage(message);
    setMessage('');
  }

  async function handleFinalizeConfirmation() {
    closeModal();
    await finalizeChat();
  }

  useEffect(() => {
    messageList.current.scrollTo(0, messageList.current.scrollHeight);
  }, [chatMessages]);

  return (
    <div className="chat-view-container">
      <div className="user-information">
        <div className="info-section">
          {subsidiary && (
            <React.Fragment>
              <img className="user-image" src={activeChat.user.profileImage} />
              <div className="user-name">{activeChat.user.name} {activeChat.user.lastname}</div>
              <div className="divisor" />
              <div className="commerce-info">
                <img className="commerce-logo" src={subsidiary.commerce.logoImage} />
                <div className="commerce-name">{subsidiary.name}</div>
                <div className="commerce-name">{subsidiary.commerce.tinNumber}</div>
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="button-section">
          <Modal
            trigger={<Button onClick={openModal} fluid>Finalizar Chat</Button>}
            open={modalState}
            size="tiny"
          >
            <Modal.Content>
              <Modal.Description>
                <Header>Finalizar Chat</Header>
                <p>Desea finalizar el chat en curso?</p>
              </Modal.Description>

            </Modal.Content>
            <Modal.Actions>
              <Button onClick={closeModal}>
                <Icon name="times" /> Cancelar
              </Button>
              <Button color="green" onClick={handleFinalizeConfirmation}>
                <Icon name="checkmark" /> Finalizar
              </Button>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
      <div className="message-list" ref={messageList}>
        {chatMessages && chatMessages.map(message => (
          <SupportMessage
            key={message.id}
            message={message}
            isUserMessage={message.sender.id === (activeChat.user as User).id}
          />
        ))}
      </div>
      <div className="input-section">
        <Form className="message-form">
          <div className="input-message-container">
            <Form.Field>
              <input
                value={message}
                onChange={handleMessageChange}
                placeholder="Nuevo Mensaje.."
              />
            </Form.Field>
          </div>
          <Button
            primary
            disabled={message.length === 0}
            onClick={handleMessageSubmition}
          >
            Enviar
          </Button>
        </Form>
      </div>
    </div>
  );
};
