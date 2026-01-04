import React, { useState, useEffect } from 'react';
import { usePDF } from '../context/PDFContext';
import { extractText } from '../utils/pdfHelpers';
import * as aiService from '../utils/aiService';
import { Sparkles, Search, MessageSquare, Key, RefreshCw, Loader2 } from 'lucide-react';

const SummaryPanel = () => {
    const { pdfDocument, fileName, numPages } = usePDF();
    const [summary, setSummary] = useState(null);
    const [aiSummary, setAiSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [apiKeys, setApiKeys] = useState(() => {
        const saved = aiService.getApiKeys();
        const initial = ['', '', '', '', ''];
        saved.forEach((key, i) => { if (i < 5) initial[i] = key; });
        return initial;
    });
    const [showApiKeyInput, setShowApiKeyInput] = useState(!aiService.hasApiKey());
    const [error, setError] = useState(null);

    const handleKeyChange = (index, value) => {
        const newKeys = [...apiKeys];
        newKeys[index] = value;
        setApiKeys(newKeys);
    };

    const handleSaveApiKeys = () => {
        const cleanedKeys = apiKeys.map(k => k.trim()).filter(k => k !== '');
        if (cleanedKeys.length > 0) {
            aiService.setApiKeys(cleanedKeys);
            setShowApiKeyInput(false);
            setError(null);
        } else {
            setError("Please enter at least one valid API key.");
        }
    };

    const handleClearKeys = () => {
        aiService.clearApiKey();
        setApiKeys(['', '', '', '', '']);
        setShowApiKeyInput(true);
        setError("All API Keys removed. Multi-key failover disabled.");
    };

    const handleGenerateAiSummary = async () => {
        if (!pdfDocument || !aiService.hasApiKey()) {
            setShowApiKeyInput(true);
            return;
        }

        setIsAiLoading(true);
        setError(null);
        try {
            const text = await extractText(pdfDocument);
            const result = await aiService.generateSummary(text);
            setAiSummary(result);
        } catch (err) {
            console.error("AI Summary generation failed", err);
            setError(err.message || "Failed to generate AI summary. Check your API keys or connection.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSemanticSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim() || !pdfDocument || !aiService.hasApiKey()) {
            if (!aiService.hasApiKey()) setShowApiKeyInput(true);
            return;
        }

        setIsSearching(true);
        setError(null);
        try {
            const text = await extractText(pdfDocument);
            const result = await aiService.semanticSearch(searchQuery, text);
            setSearchResults(result);
        } catch (err) {
            console.error("Semantic search failed", err);
            setError("Semantic search failed.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleGetSuggestions = async () => {
        if (!pdfDocument || !aiService.hasApiKey()) return;

        setIsSuggestionsLoading(true);
        try {
            const text = await extractText(pdfDocument);
            const result = await aiService.getSmartSuggestions(text);
            const lines = result.split('\n').filter(l => l.trim().length > 5).slice(0, 3);
            setSuggestions(lines);
        } catch (err) {
            console.error("Suggestions failed", err);
        } finally {
            setIsSuggestionsLoading(false);
        }
    };

    useEffect(() => {
        if (pdfDocument && aiService.hasApiKey()) {
            handleGetSuggestions();
        }
    }, [pdfDocument]);

    if (!pdfDocument) {
        return <div className="p-4 text-center text-secondary">No PDF loaded.</div>;
    }

    return (
        <div className="summary-panel p-6 space-y-8 h-full overflow-y-auto bg-primary/20">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold gradient-text">AI Intelligence</h2>
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Multi-Key Failover Engine</p>
                </div>
                <button
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className={`p-2 rounded-lg transition ${showApiKeyInput ? 'bg-accent text-white' : 'bg-secondary text-secondary'}`}
                >
                    <Key size={20} />
                </button>
            </header>

            {showApiKeyInput && (
                <div className="glass-card p-5 space-y-4 border-l-4 border-l-accent animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-secondary uppercase tracking-widest px-1">Configure Failover Keys</label>
                        <p className="text-[10px] text-secondary/60 px-1">System will automatically rotate keys if rate limits are hit.</p>
                    </div>

                    <div className="space-y-2">
                        {apiKeys.map((key, index) => (
                            <div key={index} className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-secondary/40">#{index + 1}</span>
                                <input
                                    type="password"
                                    value={key}
                                    onChange={(e) => handleKeyChange(index, e.target.value)}
                                    placeholder={`Gemini API Key Slot ${index + 1}`}
                                    className="premium-input !pl-8"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 space-y-3">
                        <button
                            onClick={handleSaveApiKeys}
                            className="premium-btn w-full"
                        >
                            Deploy Engine
                        </button>

                        {aiService.hasApiKey() && (
                            <button
                                onClick={handleClearKeys}
                                className="w-full py-2 text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
                            >
                                Purge All Credentials
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-divider">
                        <span className="text-[9px] text-secondary font-bold">Encrypted local storage only.</span>
                        {aiService.hasApiKey() && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter">System Active</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in shake duration-500">
                    <div className="bg-red-500 text-white p-1 rounded-md">
                        <Key size={14} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-red-700">Security Alert</p>
                        <p className="text-[10px] text-red-600 mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* AI Summary Section */}
            <section style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Document Summary</h4>
                    {!aiSummary && (
                        <button
                            onClick={handleGenerateAiSummary}
                            disabled={isAiLoading}
                            style={{
                                fontSize: '0.8rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--accent-color)',
                                color: 'var(--accent-color)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                            }}
                        >
                            {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                            Generate AI Summary
                        </button>
                    )}
                </div>

                {isAiLoading ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
                        <Loader2 className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                        <p style={{ fontSize: '0.85rem' }}>Analyzing document...</p>
                    </div>
                ) : aiSummary ? (
                    <div style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {aiSummary}
                        <button
                            onClick={() => setAiSummary(null)}
                            style={{ display: 'block', marginTop: '1rem', border: 'none', background: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Clear Summary
                        </button>
                    </div>
                ) : (
                    <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        padding: '1rem',
                        border: '1px dashed var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                    }}>
                        No AI summary generated yet.
                    </div>
                )}
            </section>

            {/* Semantic Search Section */}
            <section style={{ marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>Semantic Search</h4>
                <form onSubmit={handleSemanticSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ask anything about the PDF..."
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'white',
                            border: 'none',
                            padding: '0 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                        }}
                    >
                        {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    </button>
                </form>

                {searchResults && (
                    <div style={{
                        fontSize: '0.85rem',
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'pre-wrap'
                    }}>
                        <strong>Results:</strong>
                        <div style={{ marginTop: '0.5rem' }}>{searchResults}</div>
                        <button
                            onClick={() => setSearchResults(null)}
                            style={{ display: 'block', marginTop: '0.75rem', border: 'none', background: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                            Clear Results
                        </button>
                    </div>
                )}
            </section>

            {/* Smart Suggestions Section */}
            <section style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquare size={16} />
                    Smart Suggestions
                </h4>

                {isSuggestionsLoading ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Loader2 size={14} className="animate-spin" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Coming up with ideas...</span>
                    </div>
                ) : suggestions.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSearchQuery(suggestion.replace(/^\d+\.\s*/, '').replace(/^- \s*/, ''));
                                    // Optionally trigger search automatically
                                }}
                                style={{
                                    padding: '0.6rem',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    hover: { backgroundColor: 'var(--bg-primary)' }
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        {aiService.hasApiKey() ? "No suggestions available." : "Add API key to see suggestions."}
                    </div>
                )}
            </section>

            <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.6, textAlign: 'center' }}>
                <p>Powered by Google Gemini AI</p>
                <p>File: {fileName} ({numPages} pages)</p>
            </div>
        </div>
    );
};

export default SummaryPanel;
