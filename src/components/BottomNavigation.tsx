import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center p-4 ${location.pathname === '/' ? 'text-blue-500' : 'text-gray-600'}`}
        >
          <MessageSquare size={24} />
          <span className="text-xs mt-1">聊天</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center p-4 ${location.pathname === '/profile' ? 'text-blue-500' : 'text-gray-600'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">我的</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;