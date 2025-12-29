import React from 'react';
import { usePDF } from '../context/PDFContext';
import Thumbnails from './Thumbnails';
import { Grid, Bookmark, FileText } from 'lucide-react';
import SummaryPanel from './SummaryPanel';

const Sidebar = () => {
    const { activeSidebarTab, setActiveSidebarTab } = usePDF();

    return (
        <aside className="sidebar">
            <div className="sidebar-tabs">
                <button
                    className={`sidebar-tab ${activeSidebarTab === 'thumbnails' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTab('thumbnails')}
                >
                    <Grid size={18} style={{ marginBottom: '4px' }} />
                    <div>Thumbnails</div>
                </button>
                <button
                    className={`sidebar-tab ${activeSidebarTab === 'bookmarks' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTab('bookmarks')}
                >
                    <Bookmark size={18} style={{ marginBottom: '4px' }} />
                    <div>Bookmarks</div>
                </button>
                <button
                    className={`sidebar-tab ${activeSidebarTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTab('summary')}
                >
                    <FileText size={18} style={{ marginBottom: '4px' }} />
                    <div>Summary</div>
                </button>
            </div>
            <div className="sidebar-content">
                {activeSidebarTab === 'thumbnails' && <Thumbnails />}
                {activeSidebarTab === 'bookmarks' && <div className="p-4 text-center text-secondary">Bookmarks not yet implemented</div>}
                {activeSidebarTab === 'summary' && <SummaryPanel />}
            </div>
        </aside>
    );
};

export default Sidebar;
