import React, { useEffect, useState, useRef } from 'react';
import { usePDF } from '../context/PDFContext';
import { extractText } from '../utils/pdfHelpers';
import * as aiService from '../utils/aiService';
import {
    GitBranch,
    Maximize2,
    RefreshCw,
    Activity,
    Layout,
    Info,
    Loader2
} from 'lucide-react';

const KnowledgeGraph = () => {
    const { pdfDocument, knowledgeGraph, setKnowledgeGraph } = usePDF();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const containerRef = useRef(null);

    const handleBuildGraph = async () => {
        if (!pdfDocument) return;
        setIsLoading(true);
        try {
            const text = await extractText(pdfDocument);
            const graph = await aiService.buildKnowledgeGraph(text);
            setKnowledgeGraph(graph);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!pdfDocument) return <div className="p-4 text-center">Open a PDF to map your Knowledge Graph.</div>;

    const nodes = knowledgeGraph.nodes || [];
    const links = knowledgeGraph.links || [];

    return (
        <div className="knowledge-graph-container p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center gap-2 font-bold text-primary">
                    <GitBranch size={20} className="text-accent" />
                    Personal Knowledge Graph
                </h3>
                <button
                    onClick={handleBuildGraph}
                    disabled={isLoading}
                    className="p-1 hover:bg-secondary rounded-full transition"
                    title="Re-scan Document"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                </button>
            </div>

            <p className="text-[10px] text-secondary mb-4 uppercase tracking-widest font-bold">
                Nodes = Concepts | Edges = Prerequisites
            </p>

            {nodes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 bg-secondary/50 rounded-xl border-2 border-dashed border-divider p-8">
                    <Layout size={48} className="text-secondary opacity-20" />
                    <div>
                        <p className="text-sm font-semibold">Graph is Empty</p>
                        <p className="text-xs text-secondary max-w-[200px] mt-1">AI needs to analyze your document to map concepts and dependencies.</p>
                    </div>
                    <button
                        onClick={handleBuildGraph}
                        className="bg-accent text-white px-6 py-2 rounded-full text-xs font-bold hover:shadow-lg transition"
                    >
                        Map Concepts Now
                    </button>
                </div>
            ) : (
                <div className="flex-1 relative bg-secondary rounded-xl overflow-hidden border">
                    {/* Simplified Graph Representation */}
                    <div className="absolute inset-0 p-4 overflow-auto">
                        <div className="flex flex-wrap gap-3">
                            {nodes.map(node => (
                                <div
                                    key={node.id}
                                    onClick={() => setSelectedNode(node)}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedNode?.id === node.id
                                            ? 'bg-accent text-white border-accent scale-105 shadow-md'
                                            : 'bg-primary border-divider hover:border-accent'
                                        }`}
                                >
                                    <span className="text-xs font-bold">{node.id}</span>
                                </div>
                            ))}
                        </div>

                        {/* Dependency List instead of complex SVG for now */}
                        <div className="mt-8">
                            <h4 className="text-[10px] font-bold text-secondary uppercase mb-2">Key Relationships</h4>
                            <div className="space-y-2">
                                {links.map((link, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-[11px] text-primary bg-primary/50 p-2 rounded border border-divider">
                                        <span className="font-bold text-accent">{link.source}</span>
                                        <span className="text-secondary">➔</span>
                                        <span className="font-bold">{link.target}</span>
                                        <span className="ml-auto text-[10px] bg-secondary px-1 rounded text-secondary italic">{link.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {selectedNode && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-primary border-t shadow-2xl animate-in slide-in-from-bottom-full">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-accent text-sm">{selectedNode.id}</h4>
                                <button onClick={() => setSelectedNode(null)} className="text-secondary hover:text-primary"><Maximize2 size={14} /></button>
                            </div>
                            <p className="text-xs text-secondary leading-relaxed mb-3">
                                {selectedNode.description || "No definition extracted yet. Run deep scan for details."}
                            </p>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-accent/10 text-accent text-[10px] font-bold py-2 rounded hover:bg-accent/20 transition">Show in PDF</button>
                                <button className="flex-1 bg-secondary text-primary text-[10px] font-bold py-2 rounded border hover:bg-primary transition">Explain Connections</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20 flex items-center gap-3">
                <Activity size={18} className="text-accent" />
                <div>
                    <p className="text-[11px] font-bold text-primary">Mastery Context</p>
                    <p className="text-[10px] text-secondary">Concept graph helps AI detect if you're missing prerequisites.</p>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeGraph;
