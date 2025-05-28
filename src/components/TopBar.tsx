import { useState } from 'react';
import { Search, Plus, Bell, User, Settings, LogOut, Command, History, Upload, FileJson, Database, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { formatDistanceToNow } from 'date-fns';
import { CommandPalette } from './CommandPalette';

export function TopBar() {

  const [historyOpen, setHistoryOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const navigate = useNavigate();

  const historyStore = useHistoryStore();

  // Quick actions for dropdown
  const quickActions = [
    { icon: <Upload className="h-4 w-4" />, label: 'Upload Feed', path: '/upload' },
    { icon: <FileJson className="h-4 w-4" />, label: 'Map Fields', path: '/mapping' },
    { icon: <Database className="h-4 w-4" />, label: 'Design Schema', path: '/schema' },
    { icon: <Share2 className="h-4 w-4" />, label: 'Export Feed', path: '/export' },
  ];

  // Recent activity (combined from all history types)
  const recentActivity = [
    ...historyStore.uploadHistory.map(item => ({
      ...item,
      type: 'upload',
      title: `Uploaded ${item.fileInfo.name}`,
      icon: <Upload className="h-4 w-4" />,
      color: 'bg-blue-500'
    })),
    ...historyStore.mappingHistory.map(item => ({
      ...item,
      type: 'mapping',
      title: item.name,
      icon: <FileJson className="h-4 w-4" />,
      color: 'bg-amber-500'
    })),
    ...historyStore.schemaHistory.map(item => ({
      ...item,
      type: 'schema',
      title: item.name,
      icon: <Database className="h-4 w-4" />,
      color: 'bg-purple-500'
    })),
    ...historyStore.exportHistory.map(item => ({
      ...item,
      type: 'export',
      title: item.name,
      icon: <Share2 className="h-4 w-4" />,
      color: 'bg-green-500'
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  const unreadNotifications = 0; // Placeholder for future notifications

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              F
            </div>
            <span className="text-xl font-bold">frugl flow</span>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search feeds, schemas, history... (⌘K)"
              className="pl-10 pr-4 cursor-pointer"
              onClick={() => setCommandOpen(true)}
              readOnly
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Create Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {quickActions.map((action) => (
                <DropdownMenuItem
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="gap-2"
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* History Button */}
          <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Recent Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No activity yet.</p>
                    <p className="text-sm mt-1">Start by uploading a feed file.</p>
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </header>
  );
}