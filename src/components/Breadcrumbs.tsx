import { useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export function Breadcrumbs() {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    
    // Define breadcrumb mappings
    const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
      '/': [{ label: 'Dashboard', current: true }],
      '/upload': [
        { label: 'Dashboard', href: '/' },
        { label: 'Upload Feed', current: true }
      ],
      '/mapping': [
        { label: 'Dashboard', href: '/' },
        { label: 'Field Mapping', current: true }
      ],
      '/schema': [
        { label: 'Dashboard', href: '/' },
        { label: 'Schema Design', current: true }
      ],
      '/export': [
        { label: 'Dashboard', href: '/' },
        { label: 'Export Feed', current: true }
      ],
      '/settings': [
        { label: 'Dashboard', href: '/' },
        { label: 'Settings', current: true }
      ]
    };

    return breadcrumbMap[path] || [{ label: 'Dashboard', href: '/', current: false }, { label: 'Unknown', current: true }];
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on dashboard
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {item.href && !item.current ? (
            <Link 
              to={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? 'text-foreground font-medium' : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}