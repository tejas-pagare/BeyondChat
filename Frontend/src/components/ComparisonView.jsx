import React from 'react';
import ReactMarkdown from 'react-markdown';

const ComparisonView = ({ original, updated }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-full">
            {/* Original Column */}
            <div className="flex flex-col h-[500px] lg:h-full bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-border bg-muted/50 flex justify-between items-center flex-shrink-0 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
                    <h3 className="text-sm font-semibold text-foreground">Original Content</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md font-medium">Read Only</span>
                </div>
                <div className="p-4 lg:p-6 overflow-y-auto flex-grow">
                    {original ? (
                        <div className="prose prose-neutral prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{original}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                            <p className="text-sm">No original content available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Updated Column */}
            <div className="flex flex-col h-[500px] lg:h-full bg-card rounded-xl border border-border overflow-hidden shadow-md ring-1 ring-primary/10">
                <div className="px-6 py-4 border-b border-border bg-primary/5 flex justify-between items-center flex-shrink-0 backdrop-blur supports-[backdrop-filter]:bg-primary/5">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        AI-Enhanced Version
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                    </h3>
                    <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-md font-medium border border-primary/20">Enhanced</span>
                </div>
                <div className="p-4 lg:p-6 overflow-y-auto flex-grow">
                    {updated ? (
                        <div className="prose prose-neutral prose-sm max-w-none dark:prose-invert
                                      prose-headings:font-semibold prose-headings:tracking-tight
                                      prose-h1:text-3xl prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b
                                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                                      prose-p:leading-7 prose-p:mb-4
                                      prose-strong:font-semibold prose-strong:text-foreground
                                      prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                                      prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                                      prose-li:mb-2
                                      prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:font-medium
                                      prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                                      prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm">
                            <ReactMarkdown>{updated}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <svg className="w-12 h-12 mb-3 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p className="text-sm font-medium">Content awaiting enhancement</p>
                            <p className="text-xs text-muted-foreground mt-1">Run the enhancement script to generate optimized content</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonView;
