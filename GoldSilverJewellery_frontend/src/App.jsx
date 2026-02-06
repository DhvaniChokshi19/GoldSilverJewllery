import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Header from "./Components/Header";
import SignupPage from "./Pages/SignupPage";
import { LogIn } from "lucide-react";
const App = () => {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signup" element = {<SignupPage />}></Route>
        <Route path="/login" element = {<LogIn />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
