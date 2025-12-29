import React from 'react';
import { usePDF } from '../context/PDFContext';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
    const { searchQuery, setSearchQuery, searchResults, currentMatchIndex, setSearchResults, setCurrentMatchIndex, pdfDocument, setCurrentPage } = usePDF();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim() || !pdfDocument) return;

        // Very basic search implementation (finds pages with text, doesn't highlight exact bounds yet)
        // Implementing full text search with highlighting is complex.
        // We will just find pages containing the string for navigation.

        try {
            const results = [];
            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const textContent = await page.getTextContent();
                const text = textContent.items.map(item => item.str).join(' ');

                if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
                    results.push(i);
                }
            }
            setSearchResults(results);
            setCurrentMatchIndex(results.length > 0 ? 0 : -1);
            if (results.length > 0) {
                // Context or App should handle navigation to searchResults[0]
                // But we can do it here via side-effect or callback?? 
                // We don't have access to navigation here easily unless we add it to context.
            }
        } catch (error) {
            console.error("Search error", error);
        }
    };

    // Navigation effect
    React.useEffect(() => {
        if (searchResults.length > 0 && currentMatchIndex !== -1) {
            setCurrentPage(searchResults[currentMatchIndex]);
        }
    }, [searchResults, currentMatchIndex, setCurrentPage]);

    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="clear-btn">
                        <X size={14} />
                    </button>
                )}
            </div>
            {searchResults.length > 0 && (
                <div className="search-nav">
                    <span>{currentMatchIndex + 1} / {searchResults.length} matches (pages)</span>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
