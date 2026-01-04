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
    ArrowRight,
    Zap
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

    if (!pdfDocument) return (
        <div className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <Target size={32} />
            </div>
            <p className="text-secondary font-medium">Open a PDF to access Pro Study features.</p>
        </div>
    );

    return (
        <div className="pro-study-engine p-6 space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold gradient-text">Goal Central</h2>
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Exam & Mastery Optimization</p>
                </div>
                <div className="bg-accent/10 p-2 rounded-lg">
                    <Target size={24} className="text-accent" />
                </div>
            </header>

            <section className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <CalendarClock size={16} className="text-accent" />
                    Study Blueprint
                </h3>

                {!studyPlan ? (
                    <div className="glass-card p-5 space-y-4 border-l-4 border-l-accent">
                        <div className="input-group">
                            <label className="input-label">Target Exam</label>
                            <input
                                type="text"
                                className="premium-input"
                                placeholder="e.g. UPSC, CFA, Final Exam"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Exam Date</label>
                            <input
                                type="date"
                                className="premium-input"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleGenerateBlueprint}
                            disabled={isLoading || !examName || !examDate}
                            className="premium-btn w-full"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                            Generate Study Strategy
                        </button>
                    </div>
                ) : (
                    <div className="study-plan-container animate-in fade-in slide-in-from-bottom-4 space-y-3">
                        <div className="flex justify-between items-center px-2">
                            <div className="flex items-center gap-2">
                                <span className="category-badge">{examConfig.name}</span>
                                <span className="text-[10px] font-bold text-secondary">{examConfig.date}</span>
                            </div>
                            <button onClick={() => setStudyPlan(null)} className="text-[10px] font-bold text-accent hover:underline">RECONFIGURE</button>
                        </div>
                        <div className="study-plan-content max-h-96 overflow-y-auto whitespace-pre-wrap">
                            {studyPlan}
                        </div>
                    </div>
                )}
            </section>

            <div className="h-px bg-divider opacity-50" />

            <section className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" />
                    Predictive Performance
                </h3>

                {!readinessReport ? (
                    <div className="glass-card p-6 text-center space-y-4 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/10 dark:to-blue-950/10">
                        <Trophy size={40} className="mx-auto text-emerald-500 opacity-80" />
                        <div>
                            <p className="text-sm font-bold">Predict Your Success</p>
                            <p className="text-[11px] text-secondary mt-1">Our AI analyzes your reading patterns and mastery data to predict your readiness.</p>
                        </div>
                        <button
                            onClick={handlePredictReadiness}
                            disabled={isLoading}
                            className="premium-btn w-full !bg-emerald-500 hover:!bg-emerald-600 shadow-emerald-500/20"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                            Predict Readiness
                        </button>
                    </div>
                ) : (
                    <div className="readiness-report glass-card p-5 border-l-4 border-l-emerald-500 animate-in zoom-in-95">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-primary">
                            {readinessReport}
                        </div>
                        <button
                            onClick={() => setReadinessReport(null)}
                            className="mt-6 w-full py-2 text-[10px] font-extrabold text-secondary hover:text-emerald-500 transition border-t border-divider pt-4"
                        >
                            RUN NEW ANALYSIS
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};


export default ProStudyEngine;
