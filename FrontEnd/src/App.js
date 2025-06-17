import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes'; // Import AppRouter từ thư mục routes (routes/index.js)


function App() {
  return (
      <AppRouter />
  );
}

export default App;