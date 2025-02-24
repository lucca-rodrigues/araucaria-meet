import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { Sidebar } from "../Sidebar";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    id: "profile",
    label: "Perfil",
    path: "/profile",
  },
];

export function ProtectedLayout() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar menuItems={menuItems} />
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
