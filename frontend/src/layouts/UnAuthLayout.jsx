import { Outlet } from "react-router-dom"

export default function UnAuthLayout() {
    return (
        <div className="min-h-screen w-full">
            <Outlet />
        </div>
    )
}