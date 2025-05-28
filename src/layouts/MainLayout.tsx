import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { EnhancedSidebar } from '../components/EnhancedSidebar';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1">
          <div className="container max-w-7xl mx-auto px-6 py-8">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay for Sidebar (for future mobile implementation) */}
      <div className="md:hidden fixed inset-0 z-40 bg-black/50 hidden" />
    </div>
  );
}