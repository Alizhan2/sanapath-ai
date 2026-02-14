import { useState } from 'react';
import AppSidebar from './AppSidebar';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-hero-pattern">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? 72 : 256 }}
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
