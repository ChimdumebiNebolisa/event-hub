import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DashboardTheme = 'light' | 'dark';

interface DashboardThemeContextType {
  theme: DashboardTheme;
  toggleTheme: () => void;
  setTheme: (theme: DashboardTheme) => void;
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined);

interface DashboardThemeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'eventhub_dashboard_theme';

export const DashboardThemeProvider = ({ children }: DashboardThemeProviderProps) => {
  const [theme, setThemeState] = useState<DashboardTheme>(() => {
    // Get theme from localStorage or default to light
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as DashboardTheme;
      return savedTheme || 'light';
    }
    return 'light';
  });

  const setTheme = (newTheme: DashboardTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    
    // Apply theme to dashboard container
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
      dashboardContainer.className = `dashboard-theme-${newTheme}`;
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
      dashboardContainer.className = `dashboard-theme-${theme}`;
    }
  }, [theme]);

  return (
    <DashboardThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  );
};

export const useDashboardTheme = () => {
  const context = useContext(DashboardThemeContext);
  if (context === undefined) {
    throw new Error('useDashboardTheme must be used within a DashboardThemeProvider');
  }
  return context;
};
