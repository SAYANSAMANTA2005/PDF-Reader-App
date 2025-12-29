import React from 'react';
import { usePDF } from '../context/PDFContext';
import Thumbnails from './Thumbnails';
import { Grid, Bookmark, FileText } from 'lucide-react';
import SummaryPanel from './SummaryPanel';

const Sidebar = () => {
    const { activeSidebarTab, setActiveSidebarTab, sidebarWidth, setSidebarWidth } = usePDF();

    const handleMouseDown = (e) => {
        // Prevent default text selection during drag
        e.preventDefault();

        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const newWidth = Math.min(Math.max(startWidth + deltaX, 200), 600); // Constraints: 200px - 600px
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

    return (
        <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
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

            <div className="sidebar-resizer" onMouseDown={handleMouseDown}></div>
        </aside>
    );
};

export default Sidebar;
