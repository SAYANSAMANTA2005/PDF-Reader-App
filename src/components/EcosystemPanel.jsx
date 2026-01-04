import React, { useState } from 'react';
import { usePDF } from '../context/PDFContext';
import {
    Users,
    Globe,
    Share2,
    MessageCircle,
    MoreVertical,
    Heart,
    ArrowUpCircle,
    PlayCircle,
    UserCircle,
    Plus
} from 'lucide-react';

const EcosystemPanel = () => {
    const { mentorPersona, setMentorPersona } = usePDF();
    const [activeTab, setActiveTab] = useState('rooms'); // rooms, public, persona

    return (
        <div className="ecosystem-panel h-full flex flex-col">
            <div className="p-4 border-bottom">
                <div className="flex bg-secondary p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('rooms')}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${activeTab === 'rooms' ? 'bg-primary text-accent shadow-sm' : 'text-secondary'}`}
                    >
                        Study Rooms
                    </button>
                    <button
                        onClick={() => setActiveTab('public')}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${activeTab === 'public' ? 'bg-primary text-accent shadow-sm' : 'text-secondary'}`}
                    >
                        Global Hub
                    </button>
                    <button
                        onClick={() => setActiveTab('persona')}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${activeTab === 'persona' ? 'bg-primary text-accent shadow-sm' : 'text-secondary'}`}
                    >
                        Persona
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'rooms' && (
                    <div className="space-y-6">
                        <section>
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest">Active Study Rooms</h4>
                                <button className="p-1 text-accent hover:bg-accent/10 rounded-full transition"><Plus size={16} /></button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: "JEE Physics 2026", users: 12, topic: "Electromagnetism" },
                                    { name: "Linear Algebra Depth", users: 8, topic: "Eigenspaces" },
                                    { name: "PhD Thesis Review", users: 3, topic: "Chapter 4 Ref" }
                                ].map((room, i) => (
                                    <div key={i} className="bg-secondary p-3 rounded-xl border hover:border-accent transition group cursor-pointer">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-primary group-hover:text-accent transition">{room.name}</span>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(j => <UserCircle key={j} size={14} className="text-secondary bg-primary rounded-full border border-secondary" />)}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[9px] text-secondary">Topic: <span className="text-primary font-medium">{room.topic}</span></span>
                                            <button className="text-[9px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">Join Room</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-4 bg-primary border-2 border-dashed border-divider rounded-xl text-center">
                            <Users size={32} className="mx-auto text-secondary opacity-20 mb-2" />
                            <p className="text-xs font-bold text-secondary">Start a Shared View Session</p>
                            <button className="mt-2 text-[10px] bg-accent text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition">Create Private Room</button>
                        </div>
                    </div>
                )}

                {activeTab === 'public' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest">Trending Insight</h4>
                            <Globe size={14} className="text-accent" />
                        </div>
                        {[
                            { user: "AlexP", content: "Condensed summary of Diagonalization using matrix similarity. Must read!", upvotes: 42 },
                            { user: "SarahStudy", content: "Found a contradiction between Spivak and Stewart on Pg 45.", upvotes: 89 },
                            { user: "ResearchBot", content: "New bibtex mapping for ML papers (2025 update).", upvotes: 156 }
                        ].map((post, i) => (
                            <div key={i} className="bg-secondary p-3 rounded-xl border transition cursor-pointer">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center text-accent text-[8px] font-bold">{post.user[0]}</div>
                                    <span className="text-[10px] font-bold text-primary">{post.user}</span>
                                    <span className="ml-auto text-[9px] text-secondary">2h ago</span>
                                </div>
                                <p className="text-[11px] text-secondary leading-relaxed line-clamp-2">"{post.content}"</p>
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-divider/50">
                                    <button className="flex items-center gap-1 text-[9px] font-bold text-accent"><ArrowUpCircle size={12} /> {post.upvotes}</button>
                                    <button className="flex items-center gap-1 text-[9px] font-bold text-secondary hover:text-accent"><Share2 size={12} /> Add to Notes</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'persona' && (
                    <div className="space-y-4">
                        <section>
                            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">AI Mentor Persona</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'Friendly Tutor', desc: "Patient, encouraging, uses analogies", icon: "✨" },
                                    { id: 'Strict Exam Coach', desc: "Demanding, rigorous, exam-focused", icon: "🔥" },
                                    { id: 'Research Advisor', desc: "Academic tone, citation-focused", icon: "🎓" },
                                    { id: 'Explain Like I\'m 12', desc: "Simple terms, fun examples", icon: "👶" }
                                ].map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setMentorPersona(p.id)}
                                        className={`flex items-start gap-3 p-3 rounded-xl border transition text-left ${mentorPersona === p.id
                                                ? 'bg-accent/10 border-accent'
                                                : 'bg-secondary border-transparent hover:border-divider'
                                            }`}
                                    >
                                        <span className="text-xl">{p.icon}</span>
                                        <div>
                                            <p className="text-xs font-bold text-primary">{p.id}</p>
                                            <p className="text-[10px] text-secondary">{p.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="mt-6 p-4 bg-accent/5 rounded-xl border border-accent/20">
                            <h4 className="text-[10px] font-bold text-accent uppercase mb-1">Learning style adaptation</h4>
                            <p className="text-[10px] text-primary leading-relaxed italic">
                                "{mentorPersona} will now adjust diagrams, text difficulty, and questioning style to match your behavior."
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EcosystemPanel;
