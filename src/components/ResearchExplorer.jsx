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

    if (!pdfDocument) return <div className="p-4 text-center">Open a PDF to explore its citations and references.</div>;

    return (
        <div className="research-explorer p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center gap-2 font-bold text-primary">
                    <Database size={20} className="text-accent" />
                    Reference Explorer
                </h3>
            </div>

            {citations.length === 0 ? (
                <div className="p-6 bg-secondary/50 rounded-xl border border-dashed text-center flex flex-col items-center gap-3">
                    <Link2 size={32} className="text-secondary opacity-30" />
                    <p className="text-xs text-secondary">Extract academic citations and build your reference graph.</p>
                    <button
                        onClick={handleExtract}
                        disabled={isLoading}
                        className="text-xs font-bold text-accent py-2 px-6 border-2 border-accent rounded-full hover:bg-accent hover:text-white transition flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Link size={14} />}
                        Scan for Citations
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{citations.length} References Found</span>
                        <button onClick={handleExtract} className="text-[10px] text-accent font-bold hover:underline">Re-scan</button>
                    </div>

                    <div className="citations-list space-y-3">
                        {citations.map((cite, i) => (
                            <div key={i} className="citation-card bg-secondary p-4 rounded-xl border hover:border-accent/50 transition-all cursor-pointer group">
                                <h4 className="text-xs font-bold text-primary mb-2 line-clamp-2 leading-tight group-hover:text-accent transition">
                                    {cite.title}
                                </h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                                    <div className="flex items-center gap-1 text-[10px] text-secondary">
                                        <User size={10} />
                                        <span className="truncate max-w-[100px]">{cite.authors}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-secondary">
                                        <Calendar size={10} />
                                        <span>{cite.year}</span>
                                    </div>
                                </div>
                                <div className="bg-primary/50 p-2 rounded text-[10px] text-secondary italic border-l-2 border-accent/20">
                                    "{cite.snippet || "Context not available"}"
                                </div>
                                <button className="mt-3 w-full flex items-center justify-center gap-1 text-[9px] font-bold text-accent opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                                    <ExternalLink size={10} /> View in Semantic Scholar
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-secondary rounded-xl border border-accent/20">
                        <h4 className="text-[10px] font-bold text-secondary uppercase mb-2">Cross-Reference Graph</h4>
                        <p className="text-[10px] text-primary leading-relaxed">
                            "This paper is cited by <span className="font-bold text-accent">3 other PDFs</span> in your workspace."
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResearchExplorer;
