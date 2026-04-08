import { SidebarDashboard } from "../../components/common/SidebarDashboard";
import ProtectedRoute from "@/guards/ProtectedRoute";

export default function DashboardLayout({ children }) {
    return (
        <ProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-gray-50">
                {/* Sidebar */}
                <aside className="hidden md:flex md:flex-shrink-0">
                    <div className="flex flex-col w-60">
                        <SidebarDashboard />
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-6 space-y-4">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
