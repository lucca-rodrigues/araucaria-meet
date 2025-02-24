import { Link } from "react-router-dom";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

export function Sidebar({ menuItems }: SidebarProps) {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">Boilerplate</h1>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link to={item.path} className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
