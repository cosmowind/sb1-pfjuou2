import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Profile from './components/Profile';
import BottomNavigation from './components/BottomNavigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <ChatList />
              <BottomNavigation />
            </>
          } />
          <Route path="/chat/:id" element={<ChatWindow />} />
          <Route path="/profile" element={
            <>
              <Profile />
              <BottomNavigation />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;