import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Loader2, AlertCircle, Plus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await getArticles();
            setArticles(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
            setError('Failed to load articles. Please check if the backend is running.');
            toast.error('Could not connect to the server');
        } finally {
            setLoading(false);
        }
    };

    if (loading && articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="relative h-12 w-12 text-primary animate-spin mb-4" />
                </div>
                <p className="text-muted-foreground font-medium">Loading your articles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Connection Error</h2>
                <p className="text-muted-foreground max-w-md mb-6">{error}</p>
                <button
                    onClick={fetchArticles}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -z-10" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">Content Dashboard</h1>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">
                            Manage your articles and AI-enhanced content in one place
                        </p>
                    </div>

                    <Link
                        to="/articles/new"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:shadow-md"
                    >
                        <Plus className="h-4 w-4" />
                        Create Article
                    </Link>
                </div>
            </div>

            {/* Articles Grid */}
            {articles.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border-2 border-dashed border-border">
                    <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No articles yet</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                        Get started by creating your first article and let AI enhance it
                    </p>
                    <Link
                        to="/articles/new"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Create Your First Article
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <ArticleCard key={article._id} article={article} onRefresh={handleRefresh} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
