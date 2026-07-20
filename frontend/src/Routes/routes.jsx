import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Chat = lazy(() => import("@/pages/Chat"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
import { Routes, Route } from "react-router-dom";

export default function AppRoutes() {
    return (
        <Routes>

            {/* Auth Pages */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Dashboard Pages */}
            <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                {/* <Route path="/search" element={<Search />} /> */}
                <Route path="/chat/:id" element={<Chat />} />
            </Route>

        </Routes>
    )
}