import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Grid3X3, 
  List, 
  Clock,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'month' | 'week' | 'day' | 'list';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  eventCount: number;
  className?: string;
}

const ViewToggle = ({ currentView, onViewChange, eventCount, className }: ViewToggleProps) => {
  const views = [
    {
      key: 'month' as ViewMode,
      label: 'Month',
      icon: CalendarIcon,
      description: 'Monthly calendar view',
    },
    {
      key: 'week' as ViewMode,
      label: 'Week',
      icon: Grid3X3,
      description: 'Weekly schedule view',
    },
    {
      key: 'day' as ViewMode,
      label: 'Day',
      icon: Clock,
      description: 'Daily detailed view',
    },
    {
      key: 'list' as ViewMode,
      label: 'List',
      icon: List,
      description: 'Event list view',
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">View:</span>
      </div>
      
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.key;
          
          return (
            <Button
              key={view.key}
              variant="ghost"
              size="sm"
              onClick={() => onViewChange(view.key)}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 h-auto transition-all duration-200",
                isActive 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={view.description}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{view.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-md border border-border/50 pointer-events-none" />
              )}
            </Button>
          );
        })}
      </div>
      
      {/* Event count badge */}
      <Badge variant="secondary" className="ml-2">
        {eventCount} events
      </Badge>
    </div>
  );
};

export default ViewToggle;
