import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Edit2, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { deleteArticle } from '../services/api';
import toast from 'react-hot-toast';

const ArticleCard = ({ article, onRefresh }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete this article?')) return;

        try {
            setIsDeleting(true);
            await deleteArticle(article._id);
            toast.success('Article deleted successfully');
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Failed to delete', error);
            toast.error('Failed to delete article');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="group relative bg-card overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            <div className="p-6 flex-grow relative z-10">
                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                </h3>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formattedDate}</span>
                    </div>
                    {article.references && article.references.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>{article.references.length} sources</span>
                        </div>
                    )}
                </div>

                {/* Content preview */}
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.original_content
                        ? article.original_content.substring(0, 150) + '...'
                        : 'No content available'}
                </p>
            </div>

            {/* Footer */}
            <div className="relative z-10 px-6 py-4 bg-muted/30 border-t border-border flex justify-between items-center">
                <Link
                    to={`/articles/${article._id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
                >
                    <span>View Details</span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </Link>

                <div className="flex gap-1">
                    <Link
                        to={`/articles/${article._id}/edit`}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Edit Article"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="Delete Article"
                    >
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
