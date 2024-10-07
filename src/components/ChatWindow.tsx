import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { generateResponse, generateSuggestedResponse } from '../services/api';
import { saveConversation, getConversation } from '../utils/storage';

interface Message {
  text: string;
  sender: 'user' | 'other';
}

interface ChatUser {
  id: string;
  name: string;
  avatarPath: string;
  systemPromptPath: string;
}

const ChatWindow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [suggestedResponses, setSuggestedResponses] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/data/users/user${id}.json`);
      const userData = await response.json();
      setChatUser(userData);

      const promptResponse = await fetch(userData.systemPromptPath);
      const promptText = await promptResponse.text();
      setSystemPrompt(promptText);

      const storedMessages = getConversation(id!);
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      } else {
        setMessages([
          { text: '你好！', sender: 'other' },
          { text: '你好！我能为你做些什么？', sender: 'user' },
        ]);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const generateSuggestions = async () => {
      if (messages.length > 0) {
        const conversation = messages.map(m => `${m.sender === 'user' ? '用户' : '对方'}: ${m.text}`).join('\n');
        const suggestion = await generateSuggestedResponse(conversation);
        setSuggestedResponses(prevSuggestions => [...prevSuggestions.slice(-2), suggestion]);
      }
    };

    generateSuggestions();
  }, [messages]);

  const handleSend = async (text: string) => {
    const newMessages = [...messages, { text, sender: 'user' }];
    setMessages(newMessages);
    setInputText('');
    saveConversation(id!, newMessages);

    const conversation = [
      { role: "system", content: systemPrompt },
      ...newMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
    ];

    try {
      const response = await generateResponse(conversation);
      const updatedMessages = [...newMessages, { text: response, sender: 'other' }];
      setMessages(updatedMessages);
      saveConversation(id!, updatedMessages);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = { text: "抱歉，我现在无法回答。请稍后再试。", sender: 'other' as const };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      saveConversation(id!, [...newMessages, errorMessage]);
    }
  };

  if (!chatUser) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 flex items-center">
        <button onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
          <img src={chatUser.avatarPath} alt={chatUser.name} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-xl font-semibold">与 {chatUser.name} 聊天</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white">
        <div className="flex space-x-2 mb-2">
          {suggestedResponses.map((response, index) => (
            <button
              key={index}
              onClick={() => handleSend(response)}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {response}
            </button>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border rounded-l-lg p-2"
            placeholder="请输入信息..."
          />
          <button
            onClick={() => handleSend(inputText)}
            className="bg-blue-500 text-white p-2 rounded-r-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;