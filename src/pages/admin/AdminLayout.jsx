import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-[#F7F8FA] flex">
            <AdminSidebar />
            <main className="flex-1 min-w-0">
                <Outlet />
            </main>
        </div>
    );
}