import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 bg-blue-950 text-white fixed top-0 left-0 h-screen">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col md:ml-60">
        {/* Mobile Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 mt-14 md:mt-0 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
