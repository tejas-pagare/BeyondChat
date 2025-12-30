import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, FileText, Edit2, Trash2, Loader2 } from 'lucide-react';
import { deleteArticle } from '../services/api';
import toast from 'react-hot-toast';

const ArticleCard = ({ article, onRefresh }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleDelete = async (e) => {
        e.preventDefault(); // Prevent navigation if wrapped in Link (it's not, but good practice)
        if (!window.confirm('Are you sure you want to delete this article?')) return;

        try {
            setIsDeleting(true);
            await deleteArticle(article._id);
            toast.success('Article deleted');
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Failed to delete', error);
            toast.error('Failed to delete article');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                        {article.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {article.updated_content ? 'Enhanced' : 'Original'}
                    </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formattedDate}
                    </div>
                    <div className="flex items-center" title="Original ID">
                        <FileText className="h-4 w-4 mr-1" />
                        ID: {article._id.substring(0, 8)}...
                    </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {article.original_content ? article.original_content.substring(0, 150) + '...' : 'No content available'}
                </p>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                <Link
                    to={`/articles/${article._id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    View Comparison <ArrowRight className="ml-1 h-4 w-4" />
                </Link>

                <div className="flex space-x-2">
                    <Link
                        to={`/articles/${article._id}/edit`}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Edit Article"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Article"
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
