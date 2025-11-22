import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* Top Mobile Navbar */}
      <nav className="bg-slate-900 text-white flex items-center justify-between px-4 py-3 h-14 shadow-md md:hidden fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          {/* <img src="/logo192.png" alt="Logo" className="w-8 h-8" /> */}
          <span className="text-lg font-bold">Chit-Chat</span>
        </div>

        <button
          onClick={toggleSidebar}
          className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  h-fit bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-14 left-0 h-fit w-full bg-slate-900 text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50 md:hidden w-60`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
    </>
  );
};

export default Navbar;
