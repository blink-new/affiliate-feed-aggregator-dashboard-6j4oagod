import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Upload, FileJson, Database, Share2, Settings, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { motion } from 'framer-motion';

export function MainLayout() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard />, label: 'Dashboard' },
    { to: '/upload', icon: <Upload />, label: 'Upload Feed' },
    { to: '/mapping', icon: <FileJson />, label: 'Field Mapping' },
    { to: '/schema', icon: <Database />, label: 'Schema Design' },
    { to: '/export', icon: <Share2 />, label: 'Export Feed' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-sidebar-background border-r border-border hidden md:flex flex-col">
        <div className="flex items-center gap-2 p-6">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold"
          >
            F
          </motion.div>
          <span className="text-xl font-bold">FeedFlow</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 space-y-4">
          <Separator />
          <NavLink
            to="/settings"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`
            }
          >
            <Settings size={16} />
            Settings
          </NavLink>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start" 
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background flex items-center justify-between px-4 md:hidden z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            F
          </div>
          <span className="text-xl font-bold">FeedFlow</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}