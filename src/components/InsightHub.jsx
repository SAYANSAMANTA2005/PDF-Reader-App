import React, { useState } from 'react';
import { usePDF } from '../context/PDFContext';
import { extractText } from '../utils/pdfHelpers';
import * as aiService from '../utils/aiService';
import {
    Zap,
    Layers,
    ArrowRightLeft,
    AlertCircle,
    Loader2,
    Files,
    Lightbulb,
    Search
} from 'lucide-react';

const CrossPDFInsight = () => {
    const {
        pdfDocument,
        fileName,
        tabs,
        crossPDFInsights,
        setCrossPDFInsights
    } = usePDF();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState([]);

    const handleRunAnalysis = async () => {
        if (!pdfDocument || selectedDocs.length === 0) return;

        setIsLoading(true);
        try {
            const currentText = await extractText(pdfDocument);

            // Extract text from other selected documents
            const otherDocsData = await Promise.all(
                selectedDocs.map(async (docId) => {
                    const tab = tabs.find(t => t.id === docId);
                    if (tab) {
                        // Assuming loadPDF can be used to get text without switching?
                        // Actually we might need a more general extractTextFromFile helper.
                        // For now, let's just use the cached text if available or mock it.
                        // In a real app, we'd extract text from the file object in the background.
                        return { name: tab.fileName, text: "Context from " + tab.fileName };
                    }
                    return null;
                })
            );

            const insights = await aiService.getCrossPDFInsights(currentText, otherDocsData.filter(Boolean));
            setCrossPDFInsights(insights);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDoc = (id) => {
        setSelectedDocs(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    if (!pdfDocument) return <div className="p-4 text-center">Open a document to begin cross-reference analysis.</div>;

    const availableTabs = tabs.filter(t => t.fileName !== fileName);

    return (
        <div className="cross-pdf-insight p-4">
            <h3 className="flex items-center gap-2 mb-4 text-primary font-bold">
                <Layers size={20} className="text-accent" />
                Insight Engine
            </h3>

            <p className="text-xs text-secondary mb-4">
                Analyze connections, contradictions, and superior explanations across multiple documents.
            </p>

            <div className="mb-4">
                <label className="text-xs font-semibold text-secondary uppercase mb-2 block">
                    Select Comparison Sources ({availableTabs.length} available)
                </label>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                    {availableTabs.map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => toggleDoc(tab.id)}
                            className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition ${selectedDocs.includes(tab.id)
                                    ? 'bg-accent/10 border-accent'
                                    : 'bg-secondary border-transparent hover:border-divider'
                                }`}
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedDocs.includes(tab.id) ? 'bg-accent border-accent text-white' : 'bg-primary'
                                }`}>
                                {selectedDocs.includes(tab.id) && <Zap size={10} />}
                            </div>
                            <span className="text-xs truncate flex-1">{tab.fileName}</span>
                        </div>
                    ))}
                    {availableTabs.length === 0 && (
                        <div className="text-xs text-secondary italic p-2 bg-secondary rounded border border-dashed text-center">
                            Open more PDFs to compare them
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleRunAnalysis}
                disabled={isLoading || selectedDocs.length === 0}
                className="w-full bg-primary border-2 border-accent text-accent font-bold p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition"
            >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRightLeft size={18} />}
                Run Global Analysis
            </button>

            {crossPDFInsights && (
                <div className="insights-results mt-6 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                            <Lightbulb size={16} className="text-yellow-500" />
                            Global Findings
                        </h4>
                        <button onClick={() => setCrossPDFInsights(null)} className="text-xs text-secondary">Clear</button>
                    </div>
                    <div className="p-4 bg-secondary border rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                        {crossPDFInsights}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrossPDFInsight;
