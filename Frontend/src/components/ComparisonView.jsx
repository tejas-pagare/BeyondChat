import React from 'react';

const ComparisonView = ({ original, updated }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Original Column */}
            <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center sticky top-0">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Original Content</h3>
                    <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">Read Only</span>
                </div>
                <div className="p-6 overflow-y-auto flex-grow prose prose-slate max-w-none text-gray-600 leading-relaxed">
                    {original ? (
                        <div dangerouslySetInnerHTML={{ __html: original.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <div className="flex items-center justify-center h-40 text-gray-400 italic">
                            No original content available
                        </div>
                    )}
                </div>
            </div>

            {/* Updated Column */}
            <div className="flex flex-col h-full bg-indigo-50/30 rounded-lg shadow-md border border-indigo-100 overflow-hidden ring-1 ring-indigo-500/20">
                <div className="px-4 py-3 border-b border-indigo-100 bg-indigo-50 flex justify-between items-center sticky top-0">
                    <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider flex items-center">
                        AI-Enhanced Version
                        <span className="ml-2 flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                    </h3>
                    <span className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded border border-indigo-200">Optimized</span>
                </div>
                <div className="p-6 overflow-y-auto flex-grow prose prose-indigo max-w-none text-gray-800 leading-relaxed font-medium">
                    {updated ? (
                        <div dangerouslySetInnerHTML={{ __html: updated.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-indigo-400/70">
                            <p>Content awaiting enhancement...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonView;
