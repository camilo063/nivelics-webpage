import Sidebar from "@/components/admin/layout/Sidebar";
import Topbar from "@/components/admin/layout/Topbar";
import { ToastProvider } from "@/components/admin/ui/Toast";

export default function AuthenticatedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen">
        <Sidebar />
        <div style={{ paddingLeft: 240 }}>
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
