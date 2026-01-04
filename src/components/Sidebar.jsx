import React from 'react';
import { usePDF } from '../context/PDFContext';
import Thumbnails from './Thumbnails';
import SummaryPanel from './SummaryPanel';
import LearningPanel from './LearningPanel';
import PublishingPanel from './PublishingPanel';
import WorkspacePanel from './WorkspacePanel';
import TabManager from './TabManager';
import SemanticHub from './SemanticHub';
import AnnotationHistory from './AnnotationHistory';
import ProStudyEngine from './ProStudyEngine';
import InsightHub from './InsightHub';
import KnowledgeGraph from './KnowledgeGraph';
import AnalyticsDashboard from './AnalyticsDashboard';
import ResearchExplorer from './ResearchExplorer';
import EcosystemPanel from './EcosystemPanel';
import {
    Grid,
    Bookmark,
    Sparkles,
    BookOpen,
    Share2,
    Layers,
    Layout,
    Palette,
    Database,
    Clock,
    Target,
    GitBranch,
    Users,
    TrendingUp
} from 'lucide-react';

const Sidebar = () => {
    const { activeSidebarTab, setActiveSidebarTab, sidebarWidth, setSidebarWidth } = usePDF();

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const newWidth = Math.min(Math.max(startWidth + deltaX, 220), 600);
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
    };

    const tabs = [
        { id: 'tabmanager', icon: <Layout size={16} />, label: 'Files' },
        { id: 'thumbnails', icon: <Grid size={16} />, label: 'Nodes' },
        { id: 'summary', icon: <Sparkles size={16} />, label: 'AI' },
        { id: 'graph', icon: <GitBranch size={16} />, label: 'Graph' },
        { id: 'analytics', icon: <TrendingUp size={16} />, label: 'Stats' },
        { id: 'exams', icon: <Target size={16} />, label: 'Goal' },
        { id: 'research', icon: <Database size={16} />, label: 'Source' },
        { id: 'ecosystem', icon: <Users size={16} />, label: 'Room' },
        { id: 'workspace', icon: <Layers size={16} />, label: 'Pro' },
    ];

    return (
        <aside className="sidebar select-none" style={{ width: `${sidebarWidth}px`, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', position: 'relative' }}>
            <div className="sidebar-tabs" style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(60px, 1fr))`,
                padding: '4px',
                gap: '4px',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`sidebar-tab ${activeSidebarTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveSidebarTab(tab.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 4px',
                            gap: '4px',
                            border: 'none',
                            borderRadius: '8px',
                            background: activeSidebarTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                            color: activeSidebarTab === tab.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.6rem',
                            fontWeight: activeSidebarTab === tab.id ? '800' : '600',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeSidebarTab === tab.id ? '0 2px 4px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.1)' : 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}
                    >
                        <div className={`transition-transform duration-200 ${activeSidebarTab === tab.id ? 'scale-110' : 'scale-100'}`}>
                            {tab.icon}
                        </div>
                        <span style={{ fontSize: '0.55rem' }}>{tab.label}</span>
                    </button>
                ))}
            </div>


            <div className="sidebar-content" style={{ flex: 1, overflowY: 'auto' }}>
                {activeSidebarTab === 'tabmanager' && <TabManager />}
                {activeSidebarTab === 'thumbnails' && <Thumbnails />}
                {activeSidebarTab === 'summary' && <SummaryPanel />}
                {activeSidebarTab === 'exams' && <ProStudyEngine />}
                {activeSidebarTab === 'insights' && <InsightHub />}
                {activeSidebarTab === 'graph' && <KnowledgeGraph />}
                {activeSidebarTab === 'analytics' && <AnalyticsDashboard />}
                {activeSidebarTab === 'research' && <ResearchExplorer />}
                {activeSidebarTab === 'ecosystem' && <EcosystemPanel />}
                {activeSidebarTab === 'workspace' && <WorkspacePanel />}
                {activeSidebarTab === 'bookmarks' && (
                    <div className="p-4 text-center text-secondary">Bookmarks not yet implemented</div>
                )}
            </div>

            <div className="sidebar-resizer" onMouseDown={handleMouseDown} style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                cursor: 'col-resize',
                backgroundColor: 'transparent',
                zIndex: 10,
                transition: 'background-color 0.2s'
            }} onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
            </div>
        </aside>
    );
};

export default Sidebar;
