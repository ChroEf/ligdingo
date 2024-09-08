if (process.env.NODE_ENV === 'production') {
  console.log = function () {}; // Disable console.log
  console.error = function () {}; // Disable console.error
  console.warn = function () {}; // Disable console.warn
}


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TwitchLoginButton from './components/TwitchLoginButton';
import Dashboard from './components/Dashboard';
import StreamerView from './components/StreamerView';
import LobbyView from './components/LobbyView';

const App = () => {
  return (
 
      <Router>
        <Routes>
          <Route path="/" element={<TwitchLoginButton />} />
          <Route path="/streamer-view" element={<StreamerView />} />
          <Route path="/lobby" element={<LobbyView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lobby/:code" element={<LobbyView />} />
        </Routes>
      </Router>

  );
};

export default App;
