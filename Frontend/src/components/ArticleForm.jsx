import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, getArticleById, updateArticle } from '../services/api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        original_content: '',
        original_url: '',
        updated_content: '',
        references: '',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            const response = await getArticleById(id);
            const article = response.data;
            setFormData({
                title: article.title,
                original_content: article.original_content,
                original_url: article.original_url,
                updated_content: article.updated_content || '',
                references: article.references ? article.references.join(', ') : '',
            });
        } catch (error) {
            console.error('Failed to fetch article', error);
            toast.error('Failed to load article details');
            navigate('/');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert references string to array
            const referencesArray = formData.references
                .split(',')
                .map((ref) => ref.trim())
                .filter((ref) => ref !== '');

            const payload = {
                ...formData,
                references: referencesArray,
            };

            if (isEditMode) {
                await updateArticle(id, payload);
                toast.success('Article updated successfully');
            } else {
                await createArticle(payload);
                toast.success('Article created successfully');
            }
            navigate('/');
        } catch (error) {
            console.error('Failed to save article', error);
            toast.error(error.response?.data?.message || 'Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Article' : 'Create New Article'}
                </h1>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        placeholder="Article Title"
                    />
                </div>

                <div>
                    <label htmlFor="original_url" className="block text-sm font-medium text-gray-700">
                        Original URL <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        id="original_url"
                        name="original_url"
                        required
                        value={formData.original_url}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        placeholder="https://example.com/article"
                    />
                </div>

                <div>
                    <label htmlFor="original_content" className="block text-sm font-medium text-gray-700">
                        Original Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="original_content"
                        name="original_content"
                        required
                        rows={6}
                        value={formData.original_content}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        placeholder="Paste the original article content here..."
                    />
                </div>

                <div>
                    <label htmlFor="updated_content" className="block text-sm font-medium text-gray-700">
                        Updated Content (AI Version)
                    </label>
                    <textarea
                        id="updated_content"
                        name="updated_content"
                        rows={6}
                        value={formData.updated_content}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        placeholder="AI-enhanced content..."
                    />
                </div>

                <div>
                    <label htmlFor="references" className="block text-sm font-medium text-gray-700">
                        References (comma separated)
                    </label>
                    <input
                        type="text"
                        id="references"
                        name="references"
                        value={formData.references}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        placeholder="https://site1.com, https://site2.com"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? (
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
