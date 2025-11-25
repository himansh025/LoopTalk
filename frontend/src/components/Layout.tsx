import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="flex  bg-slate-50">
      <aside className="hidden md:flex w-72 flex-col h-full shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <Navbar />

        <main className="flex-1 overflow-hidden flex flex-col mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
