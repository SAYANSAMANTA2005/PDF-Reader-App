import React, { useState } from 'react';
import { usePDF } from '../context/PDFContext';
import {
    Brain,
    Lock,
    Zap,
    Eye,
    ChevronRight,
    MessageCircle,
    CheckCircle
} from 'lucide-react';

const ActiveRecallOverlay = ({ pageNum, onReveal }) => {
    const { mentorPersona } = usePDF();
    const [userExplanation, setUserExplanation] = useState('');
    const [isEvaluated, setIsEvaluated] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleEvaluate = () => {
        if (userExplanation.length < 20) {
            setFeedback("Try to be more specific. Explain the core mechanism of this page.");
            return;
        }
        setIsEvaluated(true);
        setFeedback(`Good attempt! You mentioned the core concepts. Revealed for final verification.`);
    };

    return (
        <div className="active-recall-overlay absolute inset-0 z-[100] flex items-center justify-center p-8 bg-primary/95 backdrop-blur-md">
            <div className="max-w-md w-full animate-in zoom-in-95">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-accent/10 rounded-full">
                        <Lock size={32} className="text-accent animate-pulse" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-primary mb-2">Active Recall First</h2>
                        <p className="text-sm text-secondary">
                            Page {pageNum} is locked. {mentorPersona} wants you to explain what you expect to see or what you've learned from previous pages.
                        </p>
                    </div>

                    {!isEvaluated ? (
                        <div className="w-full space-y-4">
                            <textarea
                                className="w-full h-32 p-4 bg-secondary border-2 border-divider rounded-xl text-sm focus:border-accent transition outline-none"
                                placeholder="Explain the derivation or core concept in your own words..."
                                value={userExplanation}
                                onChange={(e) => setUserExplanation(e.target.value)}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleEvaluate}
                                    className="flex-1 bg-accent text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition"
                                >
                                    <Zap size={18} /> Evaluate My Answer
                                </button>
                                <button
                                    onClick={onReveal}
                                    className="p-3 bg-secondary text-secondary hover:text-primary rounded-xl border transition"
                                    title="Skip Active Recall"
                                >
                                    <Eye size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="evaluation-result w-full p-6 bg-secondary rounded-xl border-2 border-success animate-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-2 text-success font-bold mb-3">
                                <CheckCircle size={20} />
                                Mastery Check Pass
                            </div>
                            <p className="text-sm text-primary leading-relaxed mb-4">
                                {feedback}
                            </p>
                            <button
                                onClick={onReveal}
                                className="w-full bg-success text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-success/20 transition"
                            >
                                <ChevronRight size={18} /> Reveal Content
                            </button>
                        </div>
                    )}

                    <div className="mt-6 flex items-center gap-2 text-[10px] text-secondary font-medium uppercase tracking-widest">
                        <MessageCircle size={12} /> Guided by {mentorPersona}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveRecallOverlay;
