import { useEffect } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Upload, FileJson, Database, Share2, Settings, LayoutDashboard, History, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { formatDistanceToNow } from 'date-fns';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const historyStore = useHistoryStore();

  // Navigation commands
  const navigationCommands = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Go to dashboard overview',
      icon: <LayoutDashboard className="h-4 w-4" />,
      action: () => navigate('/')
    },
    {
      id: 'upload',
      title: 'Upload Feed',
      description: 'Upload a new feed file',
      icon: <Upload className="h-4 w-4" />,
      action: () => navigate('/upload')
    },
    {
      id: 'mapping',
      title: 'Field Mapping',
      description: 'Map fields to schema',
      icon: <FileJson className="h-4 w-4" />,
      action: () => navigate('/mapping')
    },
    {
      id: 'schema',
      title: 'Schema Design',
      description: 'Design feed schema',
      icon: <Database className="h-4 w-4" />,
      action: () => navigate('/schema')
    },
    {
      id: 'export',
      title: 'Export Feed',
      description: 'Export and generate API',
      icon: <Share2 className="h-4 w-4" />,
      action: () => navigate('/export')
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'App settings and preferences',
      icon: <Settings className="h-4 w-4" />,
      action: () => navigate('/settings')
    }
  ];

  // Recent history commands
  const recentHistory = [
    ...historyStore.uploadHistory.slice(0, 3).map(item => ({
      id: `upload-${item.id}`,
      title: `Upload: ${item.fileInfo.name}`,
      description: `${formatDistanceToNow(item.timestamp, { addSuffix: true })} • ${item.recordCount} records`,
      icon: <Upload className="h-4 w-4" />,
      action: () => {
        navigate('/upload');
        onOpenChange(false);
      }
    })),
    ...historyStore.schemaHistory.slice(0, 3).map(item => ({
      id: `schema-${item.id}`,
      title: `Schema: ${item.schemaName}`,
      description: `${formatDistanceToNow(item.timestamp, { addSuffix: true })} • ${item.fields.length} fields`,
      icon: <Database className="h-4 w-4" />,
      action: () => {
        navigate('/schema');
        onOpenChange(false);
      }
    }))
  ].sort((a, b) => {
    // Sort by timestamp if available
    const aHistory = historyStore.uploadHistory.find(h => `upload-${h.id}` === a.id) || 
                    historyStore.schemaHistory.find(h => `schema-${h.id}` === a.id);
    const bHistory = historyStore.uploadHistory.find(h => `upload-${h.id}` === b.id) ||
                    historyStore.schemaHistory.find(h => `schema-${h.id}` === b.id);
    
    if (aHistory && bHistory) {
      return bHistory.timestamp - aHistory.timestamp;
    }
    return 0;
  }).slice(0, 5);

  const handleCommand = (command: { action: () => void }) => {
    command.action();
    onOpenChange(false);
  };

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search commands, pages, history..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6">
            <Search className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No results found.</p>
          </div>
        </CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => handleCommand(command)}
              className="flex items-center gap-3 px-3 py-2"
            >
              {command.icon}
              <div className="flex-1">
                <p className="font-medium">{command.title}</p>
                <p className="text-xs text-muted-foreground">{command.description}</p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        {recentHistory.length > 0 && (
          <CommandGroup heading="Recent Activity">
            {recentHistory.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => handleCommand(command)}
                className="flex items-center gap-3 px-3 py-2"
              >
                {command.icon}
                <div className="flex-1">
                  <p className="font-medium">{command.title}</p>
                  <p className="text-xs text-muted-foreground">{command.description}</p>
                </div>
                <History className="h-3 w-3 text-muted-foreground" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}