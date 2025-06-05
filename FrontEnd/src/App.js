import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes'; // Import AppRouter từ thư mục routes (routes/index.js)


function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;