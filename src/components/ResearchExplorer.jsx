import React, { useState } from 'react';
import { usePDF } from '../context/PDFContext';
import { extractText } from '../utils/pdfHelpers';
import * as aiService from '../utils/aiService';
import {
    Link2,
    Link,
    User,
    Calendar,
    FileText,
    ExternalLink,
    Loader2,
    Database
} from 'lucide-react';

const ResearchExplorer = () => {
    const { pdfDocument, citations, setCitations } = usePDF();
    const [isLoading, setIsLoading] = useState(false);

    const handleExtract = async () => {
        if (!pdfDocument) return;
        setIsLoading(true);
        try {
            const text = await extractText(pdfDocument);
            const data = await aiService.extractCitations(text);
            setCitations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!pdfDocument) return (
        <div className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <Database size={32} />
            </div>
            <p className="text-secondary font-medium">Open a PDF to explore its citations and references.</p>
        </div>
    );

    return (
        <div className="research-explorer p-6 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold gradient-text">Source Library</h2>
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Semantic Reference Extraction</p>
                </div>
                <div className="bg-amber-100/50 dark:bg-amber-900/20 p-2 rounded-lg">
                    <Database size={24} className="text-amber-600" />
                </div>
            </header>

            {citations.length === 0 ? (
                <div className="glass-card p-8 border-dashed flex flex-col items-center text-center gap-6">
                    <div className="relative">
                        <Link2 size={48} className="text-secondary opacity-20" />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 size={48} className="text-accent animate-spin" />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-bold">No references found yet</p>
                        <p className="text-[11px] text-secondary">AI will deep-scan the document for academic citations and cross-references.</p>
                    </div>
                    <button
                        onClick={handleExtract}
                        disabled={isLoading}
                        className="premium-btn w-full !bg-amber-600 hover:!bg-amber-700 shadow-amber-600/20"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Link size={18} />}
                        Scan for Citations
                    </button>
                </div>
            ) : (
                <div className="space-y-5">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest">
                            {citations.length} References Extracted
                        </span>
                        <button onClick={handleExtract} className="text-[10px] font-bold text-accent hover:underline">RE-SCAN</button>
                    </div>

                    <div className="citations-list grid gap-4">
                        {citations.map((cite, i) => (
                            <div key={i} className="glass-card p-4 hover:border-amber-400 group cursor-pointer border-l-4 border-l-amber-500/30 hover:border-l-amber-500 transition-all">
                                <h4 className="text-xs font-extrabold text-primary mb-2 line-clamp-2 leading-tight transition group-hover:text-amber-600">
                                    {cite.title}
                                </h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                                    <div className="flex items-center gap-1.5 text-[10px] text-secondary font-medium">
                                        <User size={12} className="text-amber-500" />
                                        <span className="truncate max-w-[120px]">{cite.authors}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-secondary font-medium">
                                        <Calendar size={12} className="text-amber-500" />
                                        <span>{cite.year}</span>
                                    </div>
                                </div>
                                <div className="bg-primary p-2.5 rounded-lg text-[10px] text-secondary italic leading-relaxed border border-divider/50">
                                    "{cite.snippet || "Reference context not indexed"}"
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center gap-2 text-[9px] font-extrabold text-amber-600 opacity-80 hover:opacity-100 transition">
                                    <ExternalLink size={12} /> SEARCH SEMANTIC SCHOLAR
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/10 rounded-xl border border-amber-200/50 dark:border-amber-900/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Link size={14} className="text-amber-600" />
                            <h4 className="text-[10px] font-extrabold text-secondary uppercase">Impact Quotient</h4>
                        </div>
                        <p className="text-[11px] text-primary font-medium">
                            This document shares <span className="text-amber-600 font-bold">3 core references</span> with your other active research papers.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ResearchExplorer;
