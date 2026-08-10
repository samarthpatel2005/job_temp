import axios from 'axios';
import { MessageSquare, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useSocket } from '../contexts/chatContext';

const ChatPage = () => {
  const { applicationId } = useParams();
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [application, setApplication] = useState(null);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchApplicationDetails = async () => {
        try {
            // I need an endpoint to get single application details
            // I will add this to the backend
            const { data } = await axios.get(`${API_BASE_URL}/api/v1/application/${applicationId}`, { withCredentials: true });
            setApplication(data.application);
        } catch(error){
            console.error("failed to fetch application details", error)
        }
    }
    fetchApplicationDetails();

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/v1/chat/${applicationId}`, { withCredentials: true });
        setMessages(data.messages);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    fetchMessages();
  }, [applicationId]);

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', applicationId);
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => socket.off('receiveMessage');
    }
  }, [socket, applicationId]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && application) {
      const receiver = user.role === 'Employer' ? application.applicantID.user : application.employerID.user;
      const messageData = {
        room: applicationId,
        sender: user._id,
        receiver: receiver,
        message: newMessage,
      };
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="mx-auto flex h-[80vh] max-w-5xl flex-col gap-4">
      <div className="surface-strong flex items-center justify-between px-6 py-5">
        <div>
          <p className="hero-badge"><MessageSquare className="h-4 w-4" /> Chat</p>
          <h1 className="mt-3 text-3xl font-black text-white">Conversation</h1>
        </div>
      </div>
      <div className="surface-soft flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender._id === user._id ? 'text-right' : 'text-left'}`}>
            <p className={`inline-block max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender._id === user._id ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950' : 'bg-white/8 text-slate-100 border border-white/10'}`}>
                <strong>{msg.sender.name}: </strong>{msg.message}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="surface-soft flex gap-3 p-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="field flex-grow"
          placeholder="Type a message..."
        />
        <button type="submit" className="primary-button">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatPage; 