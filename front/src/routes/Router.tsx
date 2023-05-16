import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";

export const Router = () => {
  return (
    <Routes>
        <Route path="/" element={<Navigate replace to="/login" />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/home" element={<Home />} />
    </Routes>
  );
};