import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useDashboardTheme } from '@/contexts/DashboardThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showLabel?: boolean;
}

const ThemeToggle = ({ 
  className, 
  size = 'default', 
  variant = 'outline',
  showLabel = false 
}: ThemeToggleProps) => {
  const { theme, toggleTheme } = useDashboardTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        className
      )}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
      {showLabel && (
        <span className="hidden sm:inline">
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;
