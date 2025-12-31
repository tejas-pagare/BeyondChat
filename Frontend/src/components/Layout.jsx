import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Github, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all" />
                                <div className="relative p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                    ContentHub
                                </span>
                                <span className="text-xs text-muted-foreground -mt-0.5">
                                    AI-Powered Blog Manager
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <Link
                                to="/"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/' || location.pathname.startsWith('/articles')
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                {theme === 'light' ? (
                                    <Moon className="h-5 w-5" />
                                ) : (
                                    <Sun className="h-5 w-5" />
                                )}
                            </button>

                            {/* GitHub Link (optional) */}
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                                title="View on GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-muted-foreground">
                        Made with ❤️ by Tejas Pagare
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
