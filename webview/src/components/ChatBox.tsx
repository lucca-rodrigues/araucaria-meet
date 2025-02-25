import React, { useState, useEffect, useRef } from 'react';
import WebSocketService from '@infra/services/websocket';
import { Message } from '@infra/services/api';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatBoxProps {
  roomId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inscrever para receber mensagens
    const unsubscribe = WebSocketService.onMessageReceived((updatedMessages) => {
      setMessages(updatedMessages);
    });

    // Scrollar para o final quando mensagens são atualizadas
    scrollToBottom();

    // Limpar inscrição quando componente for desmontado
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    WebSocketService.sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        Chat
      </Typography>

      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id || index}>
            <ListItem
              alignItems="flex-start"
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar>{msg.userName ? msg.userName[0].toUpperCase() : '?'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography component="span" variant="body1" fontWeight="bold">
                    {msg.userName}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {msg.content}
                    </Typography>
                    <Typography component="div" variant="caption" color="text.secondary">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < messages.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </List>

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={!newMessage.trim()}
        >
          Enviar
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatBox;
