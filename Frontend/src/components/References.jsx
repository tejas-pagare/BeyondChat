import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';

const References = ({ references }) => {
    if (!references || references.length === 0) {
        return null;
    }

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">References & Sources</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                The AI-enhanced content was informed by insights from the following sources:
            </p>
            <div className="space-y-2">
                {references.map((ref, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/50 hover:bg-muted transition-all duration-200 group"
                    >
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold group-hover:bg-primary/20 transition-colors">
                            {index + 1}
                        </span>
                        <a
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-grow text-sm text-primary hover:text-primary/80 font-medium break-all underline-offset-4 group-hover:underline"
                        >
                            {ref}
                        </a>
                        <ExternalLink className="flex-shrink-0 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                    These sources were analyzed to enhance the original content with additional insights and perspectives.
                </p>
            </div>
        </div>
    );
};

export default References;
