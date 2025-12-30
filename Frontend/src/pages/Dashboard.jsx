import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Loader2, AlertCircle, Plus } from 'lucide-react';
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

    const handleRefresh = () => {
        fetchArticles();
    };

    if (loading && articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading articles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
                <p className="text-gray-600 max-w-md mb-6">{error}</p>
                <button
                    onClick={fetchArticles}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                        {articles.length} Article{articles.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <Link
                    to="/articles/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    Create New Article
                </Link>
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                    <p className="text-gray-500 text-lg">No articles found.</p>
                    <p className="text-gray-400 text-sm mt-1 mb-6">Get started by creating a new article.</p>
                    <Link
                        to="/articles/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="-ml-1 mr-2 h-4 w-4" />
                        Create Article
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
