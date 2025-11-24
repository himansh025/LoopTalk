import { useState } from "react";
import { Menu, X, Code2 } from "lucide-react";
import Sidebar from "./Sidebar";
import { Button } from "./ui/Button";

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* Top Mobile Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-slate-900/95 px-4 py-3 text-white shadow-md backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <Code2 size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight">LoopTalk</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed bottom-0 left-0 top-14 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
    </>
  );
};

export default Navbar;
