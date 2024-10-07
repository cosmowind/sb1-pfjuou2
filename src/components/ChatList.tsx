import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface ChatUser {
  id: string;
  name: string;
  age: number;
  avatarPath: string;
  lastMessage: string;
}

const ChatList: React.FC = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = [];
      for (let i = 1; i <= 7; i++) {
        try {
          const response = await fetch(`/src/data/users/user${i}.json`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const userData = await response.json();
          users.push(userData);
        } catch (error) {
          console.error(`Error fetching user${i}.json:`, error);
        }
      }
      setChatUsers(users);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <h1 className="text-2xl font-bold p-4">聊天列表</h1>
      <ul>
        {chatUsers.map((chat) => (
          <li key={chat.id} className="border-b last:border-b-0">
            <Link to={`/chat/${chat.id}`} className="flex items-center p-4 hover:bg-gray-50">
              <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                <img 
                  src={chat.avatarPath} 
                  alt={chat.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/src/assets/default-avatar.png';
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <h2 className="font-semibold">{chat.name}</h2>
                  <span className="text-sm text-gray-500">{chat.age} 岁</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;