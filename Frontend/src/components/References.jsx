import React from 'react';
import { Link2 } from 'lucide-react';

const References = ({ references }) => {
    if (!references || references.length === 0) return null;

    return (
        <div className="mt-8 bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Link2 className="h-5 w-5 mr-2 text-indigo-600" />
                References & Citations
            </h3>
            <ul className="space-y-3">
                {references.map((ref, index) => (
                    <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-3 mt-0.5">
                            {index + 1}
                        </span>
                        <div className="text-sm text-gray-600 break-all">
                            {/* Check if ref is a URL or just text */}
                            {ref.startsWith('http') ? (
                                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                    {ref}
                                </a>
                            ) : (
                                <span>{ref}</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default References;
