import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Header from "./Components/Header";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({children}) => {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to= "/login" />
// };


const App = () => {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signup" element = {<SignupPage />}></Route>
        <Route path="/login" element = {<LoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
