import React, { useState, useEffect } from 'react';
import { usePDF } from '../context/PDFContext';
import * as aiService from '../utils/aiService';
import {
    BarChart3,
    TrendingUp,
    Hourglass,
    AlertTriangle,
    Zap,
    BrainCircuit,
    CheckCircle2,
    Loader2
} from 'lucide-react';

const AnalyticsDashboard = () => {
    const {
        pdfDocument,
        fileName,
        conceptMastery, setConceptMastery,
        knowledgeGraph,
        masteryEstimates, setMasteryEstimates
    } = usePDF();

    const [isLoading, setIsLoading] = useState(false);

    const handleRunAnalytics = async () => {
        if (!pdfDocument) return;
        setIsLoading(true);
        try {
            // Get concepts from knowledge graph or default
            const concepts = knowledgeGraph.nodes?.map(n => n.id) || ["Core Theory", "Application", "Case Studies"];

            // Mock behavioral data (in real app, track scroll, zoom, chat)
            const mockBehavior = {
                pagesRead: 12,
                avgTimePerPage: "45s",
                questionsAsked: 5,
                focusScore: 0.85
            };

            const mastery = await aiService.estimateMastery(mockBehavior, concepts);
            setConceptMastery(mastery);

            // Mock estimates
            setMasteryEstimates({
                timeToMaster: "6.5 focused hours",
                decayNextAlert: "Eigenvalues (in 3 days)"
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!pdfDocument) return <div className="p-4 text-center">Load a PDF to view your learning analytics.</div>;

    const masteryEntries = Object.entries(conceptMastery);

    return (
        <div className="analytics-dashboard p-4">
            <h3 className="flex items-center gap-2 mb-4 text-primary font-bold">
                <BrainCircuit size={20} className="text-accent" />
                Learning Analytics
            </h3>

            {masteryEntries.length === 0 ? (
                <div className="p-6 bg-secondary/50 rounded-xl border border-dashed text-center">
                    <TrendingUp size={32} className="mx-auto text-secondary opacity-30 mb-2" />
                    <p className="text-xs text-secondary mb-3">AI hasn't calculated your concept mastery yet.</p>
                    <button
                        onClick={handleRunAnalytics}
                        className="text-xs font-bold text-accent py-2 px-4 border border-accent rounded-full hover:bg-accent hover:text-white transition"
                    >
                        Analyze My Progress
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Mastery List */}
                    <div className="bg-secondary p-4 rounded-xl border">
                        <h4 className="text-[10px] font-bold text-secondary uppercase mb-4 tracking-widest">Concept Mastery Scores</h4>
                        <div className="space-y-4">
                            {masteryEntries.map(([concept, score]) => (
                                <div key={concept}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium text-primary">{concept}</span>
                                        <span className={`text-xs font-bold ${score > 75 ? 'text-success' : score > 40 ? 'text-accent' : 'text-error'}`}>
                                            {score}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-primary rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${score > 75 ? 'bg-success' : score > 40 ? 'bg-accent' : 'bg-error'}`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Estimates Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-secondary p-3 rounded-xl border flex flex-col gap-2">
                            <Hourglass size={16} className="text-accent" />
                            <p className="text-[9px] font-bold text-secondary uppercase">Time to Mastery</p>
                            <p className="text-sm font-bold text-primary">{masteryEstimates.timeToMaster}</p>
                        </div>
                        <div className="bg-secondary p-3 rounded-xl border flex flex-col gap-2">
                            <AlertTriangle size={16} className="text-error" />
                            <p className="text-[9px] font-bold text-secondary uppercase">Knowledge Decay</p>
                            <p className="text-xs font-bold text-primary truncate">{masteryEstimates.decayNextAlert}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleRunAnalytics}
                        className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-primary border py-2 rounded-lg hover:bg-secondary transition"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                        Refresh Insights
                    </button>
                </div>
            )}

            <div className="mt-6 p-4 bg-gradient-to-r from-accent to-purple-600 rounded-xl text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                    <p className="text-[10px] items-center flex gap-1 font-bold uppercase tracking-widest opacity-80 mb-1">
                        <TrendingUp size={12} /> Adaptive Goal
                    </p>
                    <h4 className="text-sm font-bold">Improve Diagonalization by 15%</h4>
                    <p className="text-[10px] opacity-90 mt-1">Study Pgs 45-52 for ~18 mins</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                    <BrainCircuit size={80} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
