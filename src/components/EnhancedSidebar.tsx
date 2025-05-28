import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, FileJson, Database, Share2, Settings, Sun, Moon, ChevronDown, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { motion } from 'framer-motion';
import { useHistoryStore } from '../store/historyStore';

export function EnhancedSidebar() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const historyStore = useHistoryStore();

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

  // Primary navigation items
  const primaryNavItems = [
    { 
      to: '/', 
      icon: <LayoutDashboard className="h-4 w-4" />, 
      label: 'Dashboard',
      description: 'Overview and quick access'
    },
    { 
      to: '/upload', 
      icon: <Upload className="h-4 w-4" />, 
      label: 'Upload Feed',
      description: 'Import affiliate feeds',
      badge: historyStore.uploadHistory.length > 0 ? historyStore.uploadHistory.length : undefined
    },
    { 
      to: '/mapping', 
      icon: <FileJson className="h-4 w-4" />, 
      label: 'Field Mapping',
      description: 'Map source to target fields',
      badge: historyStore.mappingHistory.length > 0 ? historyStore.mappingHistory.length : undefined
    },
    { 
      to: '/schema', 
      icon: <Database className="h-4 w-4" />, 
      label: 'Schema Design',
      description: 'Design your feed structure',
      badge: historyStore.schemaHistory.length > 0 ? historyStore.schemaHistory.length : undefined
    },
    { 
      to: '/export', 
      icon: <Share2 className="h-4 w-4" />, 
      label: 'Export Feed',
      description: 'Generate API and exports',
      badge: historyStore.exportHistory.length > 0 ? historyStore.exportHistory.length : undefined
    },
    {
      to: '/data-explorer',
      icon: <Database className="h-4 w-4" />,
      label: 'Data Explorer',
      description: 'Explore all uploaded data'
    },
  ];

  // History navigation items
  const historyNavItems = [
    {
      to: '/upload',
      icon: <Upload className="h-3 w-3" />,
      label: 'Upload History',
      count: historyStore.uploadHistory.length
    },
    {
      to: '/mapping', 
      icon: <FileJson className="h-3 w-3" />,
      label: 'Mapping History',
      count: historyStore.mappingHistory.length
    },
    {
      to: '/schema',
      icon: <Database className="h-3 w-3" />,
      label: 'Schema History', 
      count: historyStore.schemaHistory.length
    },
    {
      to: '/export',
      icon: <Share2 className="h-3 w-3" />,
      label: 'Export History',
      count: historyStore.exportHistory.length
    }
  ];

  const totalHistoryCount = historyStore.uploadHistory.length + 
                           historyStore.mappingHistory.length + 
                           historyStore.schemaHistory.length + 
                           historyStore.exportHistory.length;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-sidebar-background border-r border-border hidden md:flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-6 border-b border-border/40">
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg"
        >
          f
        </motion.div>
        <div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            frugl flow
          </span>
          <p className="text-xs text-muted-foreground">Feed Aggregator</p>
        </div>
      </div>
      
      {/* Primary Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Workflow
        </div>
        
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `group flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium shadow-sm border border-primary/20' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
              }`
            }
          >
            <div className={`transition-transform group-hover:scale-110`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
          </NavLink>
        ))}

        {/* History Section */}
        {totalHistoryCount > 0 && (
          <>
            <Separator className="my-6" />
            
            <Collapsible open={historyExpanded} onOpenChange={setHistoryExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-2 h-auto text-left font-medium"
                >
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>History</span>
                    <Badge variant="outline" className="h-5 px-1.5 text-xs">
                      {totalHistoryCount}
                    </Badge>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${historyExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-1 mt-2">
                {historyNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40 rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <Badge variant="outline" className="h-4 px-1 text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
      </nav>
      
      {/* Footer */}
      <div className="p-4 space-y-3 border-t border-border/40">
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
            }`
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start gap-3 px-3" 
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </Button>
      </div>
    </aside>
  );
}