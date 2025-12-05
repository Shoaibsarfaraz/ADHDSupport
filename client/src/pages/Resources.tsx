import React from 'react';
import { useState, useEffect } from 'react';
// Import useData for the global resource catalog and loading state
import { useData } from '../context/UserContext.js'; 
import { ExternalLink, FileText, BookOpen } from 'lucide-react';
import type { IResource } from '../types/index.js';

export const Resources = () => {
    // --- HOOKS ---
    // CORRECTED: Destructuring resources, setResources is no longer used for fetching.
    const { resources, loading: isDataLoading } = useData(); 
    const [filter, setFilter] = useState<'all' | 'article' | 'guide'>('all');

    // REMOVED: The useEffect hook that set mockResources is deleted.
    // Resources are now loaded by the DataProvider (in context/UserContext.tsx).

    const filteredResources = resources.filter(
        resource => filter === 'all' || resource.resourceCategory === filter
    );

    // specific categories for Articles and Books (Guides)
    const categories: { value: 'all' | 'article' | 'guide'; label: string; icon: React.ReactNode }[] = [
        { value: 'all', label: 'All', icon: <BookOpen size={18} /> },
        { value: 'article', label: 'Articles', icon: <FileText size={18} /> },
        { value: 'guide', label: 'Books', icon: <BookOpen size={18} /> },
    ];

    const getCategoryIcon = (category: IResource['resourceCategory']) => {
        switch (category) {
            case 'article':
                return <FileText className="text-[#469CA4]" size={20} />;
            case 'guide':
                return <BookOpen className="text-[#469CA4]" size={20} />;
            // Added support for other categories defined in IResource (if they existed)
            default:
                return <FileText className="text-[#469CA4]" size={20} />;
        }
    };
    
    // --- LOADING CHECK ---
    if (isDataLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-[#30506C]">Loading resources...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#D7E9ED]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#30506C] mb-2">Resources</h1>
                <p className="text-[#263A47] mb-8">Curated articles and books to support your ADHD journey</p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map(category => (
                        <button
                            key={category.value}
                            onClick={() => setFilter(category.value)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                                filter === category.value
                                    ? 'bg-[#469CA4] text-white'
                                    : 'bg-white text-[#263A47] hover:bg-[#D7E9ED]'
                            }`}
                        >
                            {category.icon}
                            <span>{category.label}</span>
                        </button>
                    ))}
                </div>

                {filteredResources.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-[#263A47] mb-4">No resources found</p>
                        {filter !== 'all' && (
                            <button
                                onClick={() => setFilter('all')}
                                className="text-[#469CA4] hover:underline font-medium"
                            >
                                View all resources
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map(resource => (
                            <div key={resource._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        {getCategoryIcon(resource.resourceCategory)}
                                        <span className="text-xs font-semibold uppercase text-[#469CA4] tracking-wider">
                                            {resource.resourceCategory === 'guide' ? 'Book' : resource.resourceCategory}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-[#30506C] mb-2 line-clamp-2">{resource.resourceTitle}</h3>
                                <p className="text-[#263A47] text-sm mb-4 line-clamp-3 flex-1">{resource.resourceDescription}</p>

                                <a
                                    href={resource.resourceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 text-[#469CA4] hover:text-[#3a7f8a] font-medium transition"
                                >
                                    <span>Read More</span>
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};