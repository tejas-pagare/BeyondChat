import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById } from '../services/api';
import ComparisonView from '../components/ComparisonView';
import References from '../components/References';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticleDetails();
    }, [id]);

    const fetchArticleDetails = async () => {
        try {
            setLoading(true);
            const response = await getArticleById(id);
            setArticle(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch article details:', err);
            setError('Failed to load article details.');
            toast.error('Error loading article');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Loading content...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
                <p className="text-gray-600 mb-6">{error || 'Article not found'}</p>
                <Link
                    to="/"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-muted-foreground hover:bg-muted hover:text-primary transition-colors shadow-sm"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground line-clamp-1">{article.title}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Article ID: <span className="font-mono text-xs">{article._id}</span>
                        </p>
                    </div>
                </div>
                <Link
                    to={`/articles/${article._id}/edit`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-sm"
                >
                    Edit Article
                </Link>
            </div>

            <div className="flex-grow min-h-0">
                <ComparisonView
                    original={article.original_content}
                    updated={article.updated_content}
                />
            </div>

            <div className="mt-8 flex-shrink-0">
                <References references={article.references} />
            </div>

            {/* Spacer for bottom scrolling */}
            <div className="h-12"></div>
        </div>
    );
};

export default ArticleDetail;
