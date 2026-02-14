import { useState } from 'react';
import { Menu } from 'lucide-react';
import AppSidebar from './AppSidebar';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-hero-pattern">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-deep-blue-950/90 backdrop-blur-xl border-b border-deep-blue-800/50 flex items-center px-4">
        <button onClick={() => setCollapsed(false)} className="p-2 rounded-lg text-deep-blue-300 hover:text-white hover:bg-deep-blue-800/50">
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 text-lg font-bold"><span className="text-white">Sana</span><span className="gradient-text">Path</span></span>
      </div>
      <main
        className="transition-all duration-300 md:ml-0"
        style={{ marginLeft: collapsed ? undefined : undefined }}
      >
        <div className="hidden md:block" style={{ marginLeft: collapsed ? 72 : 256 }}>
          <div className="p-6 lg:p-8">{children}</div>
        </div>
        <div className="md:hidden pt-14">
          <div className="p-4">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
