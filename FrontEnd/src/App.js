import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routes"; // Import AppRouter từ thư mục routes (routes/index.js)
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer autoClose={8000} />
    </>
  );
}

export default App;
