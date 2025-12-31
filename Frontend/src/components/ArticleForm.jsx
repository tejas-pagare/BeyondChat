import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createArticle, getArticleById, updateArticle } from '../services/api';
import { articleSchema } from '../lib/validations';
import MarkdownEditor from './MarkdownEditor';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: '',
            original_content: '',
            original_url: '',
            updated_content: '',
            references: '',
        },
    });

    useEffect(() => {
        if (isEditMode) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            const response = await getArticleById(id);
            const article = response.data;
            setValue('title', article.title);
            setValue('original_content', article.original_content);
            setValue('original_url', article.original_url);
            setValue('updated_content', article.updated_content || '');
            setValue('references', article.references ? article.references.join(', ') : '');
        } catch (error) {
            console.error('Failed to fetch article', error);
            toast.error('Failed to load article details');
            navigate('/');
        } finally {
            setInitialLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await updateArticle(id, data);
                toast.success('Article updated successfully');
            } else {
                await createArticle(data);
                toast.success('Article created successfully');
            }
            navigate('/');
        } catch (error) {
            console.error('Failed to save article', error);
            const errorMessage = error.response?.data?.message || 'Failed to save article';
            toast.error(errorMessage);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    {isEditMode ? 'Edit Article' : 'Create New Article'}
                </h1>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-xl shadow-sm border border-border">
                {/* Title */}
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-foreground">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        {...register('title')}
                        className={`w-full rounded-lg border ${errors.title ? 'border-red-500' : 'border-border'
                            } bg-background text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        placeholder="Enter article title"
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.title.message}
                        </p>
                    )}
                </div>

                {/* Original URL */}
                <div className="space-y-2">
                    <label htmlFor="original_url" className="block text-sm font-medium text-foreground">
                        Original URL <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        id="original_url"
                        {...register('original_url')}
                        className={`w-full rounded-lg border ${errors.original_url ? 'border-red-500' : 'border-border'
                            } bg-background text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        placeholder="https://example.com/article"
                    />
                    {errors.original_url && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.original_url.message}
                        </p>
                    )}
                </div>

                {/* Original Content */}
                <Controller
                    name="original_content"
                    control={control}
                    render={({ field }) => (
                        <MarkdownEditor
                            label={
                                <>
                                    Original Content <span className="text-red-500">*</span>
                                </>
                            }
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Paste the original article content here..."
                            error={errors.original_content?.message}
                        />
                    )}
                />

                {/* Updated Content */}
                <Controller
                    name="updated_content"
                    control={control}
                    render={({ field }) => (
                        <MarkdownEditor
                            label="Updated Content (AI Version)"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="AI-enhanced content will appear here..."
                            error={errors.updated_content?.message}
                        />
                    )}
                />

                {/* References */}
                <div className="space-y-2">
                    <label htmlFor="references" className="block text-sm font-medium text-foreground">
                        References (comma separated URLs)
                    </label>
                    <input
                        type="text"
                        id="references"
                        {...register('references')}
                        className={`w-full rounded-lg border ${errors.references ? 'border-red-500' : 'border-border'
                            } bg-background text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        placeholder="https://site1.com, https://site2.com"
                    />
                    {errors.references && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.references.message}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Enter up to 10 URLs separated by commas
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-border">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="-ml-1 mr-2 h-4 w-4" />
                                {isEditMode ? 'Update Article' : 'Create Article'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ArticleForm;
