import React, { useState, useEffect } from 'react';
import { usePDF } from '../context/PDFContext';
import { extractText } from '../utils/pdfHelpers';
import * as aiService from '../utils/aiService';
import {
    Target,
    Calendar,
    Trophy,
    TrendingUp,
    AlertCircle,
    Loader2,
    CalendarClock,
    BookOpen,
    HelpCircle,
    ArrowRight
} from 'lucide-react';

const ProStudyEngine = () => {
    const {
        pdfDocument,
        fileName,
        masteryMetrics, setMasteryMetrics,
        examConfig, setExamConfig,
        studyPlan, setStudyPlan
    } = usePDF();

    const [examName, setExamName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [readinessReport, setReadinessReport] = useState(null);

    const handleGenerateBlueprint = async () => {
        if (!pdfDocument || !examName || !examDate) return;
        setIsLoading(true);
        try {
            const text = await extractText(pdfDocument);
            const blueprint = await aiService.generateExamBlueprint(examName, examDate, text);
            setStudyPlan(blueprint);
            setExamConfig({ name: examName, date: examDate });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePredictReadiness = async () => {
        if (!pdfDocument) return;
        setIsLoading(true);
        try {
            // Mock mastery data if empty
            const currentMastery = Object.keys(masteryMetrics).length > 0 ? masteryMetrics : {
                "Foundations": 45,
                "Core Concepts": 30,
                "Advanced Theory": 12
            };
            const report = await aiService.predictExamReadiness(currentMastery, fileName);
            setReadinessReport(report);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!pdfDocument) return <div className="p-4 text-center">Open a PDF to access Pro Study features.</div>;

    return (
        <div className="pro-study-engine p-4">
            <h3 className="flex items-center gap-2 mb-4 text-primary font-bold">
                <Target size={20} className="text-accent" />
                Exam Blueprint Mode
            </h3>

            {!studyPlan ? (
                <div className="blueprint-setup flex flex-col gap-3 p-4 bg-secondary rounded-lg border">
                    <div>
                        <label className="text-xs text-secondary uppercase font-semibold">Exam Name</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-primary border rounded mt-1"
                            placeholder="e.g. JEE, CFA Level 1, University Final"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-secondary uppercase font-semibold">Exam Date</label>
                        <input
                            type="date"
                            className="w-full p-2 bg-primary border rounded mt-1"
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleGenerateBlueprint}
                        disabled={isLoading || !examName || !examDate}
                        className="w-full bg-accent text-white p-2 rounded-lg mt-2 flex items-center justify-center gap-2 hover:opacity-90 transition"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <CalendarClock size={18} />}
                        Create Study Strategy
                    </button>
                </div>
            ) : (
                <div className="study-plan-container animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-accent">{examConfig.name}</span>
                        <button onClick={() => setStudyPlan(null)} className="text-xs text-secondary hover:underline">Reset</button>
                    </div>
                    <div className="p-4 bg-secondary border rounded-lg max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed">
                        {studyPlan}
                    </div>
                </div>
            )}

            <hr className="my-6 border-divider" />

            <h3 className="flex items-center gap-2 mb-4 text-primary font-bold">
                <TrendingUp size={20} className="text-success" />
                Predictive Readiness
            </h3>

            {!readinessReport ? (
                <div className="readiness-cta p-4 bg-gradient-to-br from-secondary to-primary rounded-lg border border-dashed border-accent flex flex-col items-center text-center gap-2">
                    <Trophy size={32} className="text-accent opacity-50" />
                    <p className="text-xs text-secondary">AI will analyze your mastery and predict your score.</p>
                    <button
                        onClick={handlePredictReadiness}
                        disabled={isLoading}
                        className="text-xs font-bold text-accent px-4 py-2 border border-accent rounded-full hover:bg-accent hover:text-white transition"
                    >
                        Analyze Readiness
                    </button>
                </div>
            ) : (
                <div className="readiness-report p-4 bg-secondary rounded-lg border border-success/30 animate-in zoom-in-95">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {readinessReport}
                    </div>
                    <button onClick={() => setReadinessReport(null)} className="mt-4 w-full text-xs text-secondary hover:underline">New Analysis</button>
                </div>
            )}
        </div>
    );
};

export default ProStudyEngine;
