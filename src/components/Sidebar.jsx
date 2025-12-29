import React from 'react';
import { usePDF } from '../context/PDFContext';
import Thumbnails from './Thumbnails';
import { Grid, Bookmark } from 'lucide-react';

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
            </div>
            <div className="sidebar-content">
                {activeSidebarTab === 'thumbnails' ? <Thumbnails /> : <div className="p-4 text-center text-secondary">Bookmarks not yet implemented</div>}
            </div>
        </aside>
    );
};

export default Sidebar;
