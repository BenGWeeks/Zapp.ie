import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './pages/admin/Home';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Hello, world!</h1>
        <Link to="/admin">Admin</Link>
        <Route path="/admin" component={Home} />
      </div>
    </Router>
  );
};

export default App;
