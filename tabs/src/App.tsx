import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Users from './Users';
import FooterComponent from './components/FooterComponent';
import './App.css';
import Rewards from './Rewards';
import Wallet from './Wallet';
import YourWallet from './YourWallet';


const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/Rewards" element={<Rewards />} />
            <Route path="/Wallet" element={<Wallet />} />
            <Route path="/YourWallet" element={<YourWallet />} />
          </Routes>
        </header>
        <FooterComponent />
      </div>
    </Router>
  );
};

export default App;
