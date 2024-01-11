import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";

export enum RoutePath {
  HOME = "/home",
  NOTIFICATIONS = "/notifications",
}

export const Router = () => {
  return (
    <Routes>
        <Route path="/" element={<Navigate replace to="/login" />}/>
        <Route path="/login" element={<Login />}/>
        <Route path={RoutePath.HOME} element={<Home path={RoutePath.HOME} />} />
        <Route path={RoutePath.NOTIFICATIONS} element={<Home path={RoutePath.NOTIFICATIONS} />} />
    </Routes>
  );
};