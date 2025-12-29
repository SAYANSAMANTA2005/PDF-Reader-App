import React, { useState, useRef } from 'react';
import { usePDF } from '../context/PDFContext';
import SearchBar from './SearchBar';
import {
    ZoomIn,
    ZoomOut,
    RotateCw,
    PanelLeft,
    Sun,
    Moon,
    ChevronLeft,
    ChevronRight,
    Highlighter,
    Pen,
    BookOpen,
    Volume2
} from 'lucide-react';

const Toolbar = () => {
    const {
        scale, setScale,
        rotation, setRotation,
        currentPage, setCurrentPage,
        numPages,
        setIsSidebarOpen, isSidebarOpen,
        theme, toggleTheme,
        pdfDocument,
        annotationMode, setAnnotationMode,
        isTwoPageMode, setIsTwoPageMode
    } = usePDF();

    const [isReading, setIsReading] = useState(false);
    const speechRef = useRef(null);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3.0));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);
    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, numPages));

    // Page Input Handler
    const handlePageInput = (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val >= 1 && val <= numPages) {
            setCurrentPage(val);
        }
    };

    return (
        <div className="toolbar">
            <div className="toolbar-group">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`tool - btn ${isSidebarOpen ? 'active' : ''} `}
                    title="Toggle Sidebar"
                    disabled={!pdfDocument}
                >
                    <PanelLeft size={20} />
                </button>
                <div className="divider"></div>
                <div className="page-nav">
                    <button onClick={handlePrevPage} disabled={!pdfDocument || currentPage <= 1} title="Previous Page">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="page-info">
                        <input
                            type="number"
                            value={currentPage}
                            onChange={handlePageInput}
                            min={1}
                            max={numPages}
                            disabled={!pdfDocument}
                            className="page-input"
                        />
                        <span className="page-total"> / {numPages || '--'}</span>
                    </span>
                    <button onClick={handleNextPage} disabled={!pdfDocument || currentPage >= numPages} title="Next Page">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="toolbar-group">
                <button onClick={handleZoomOut} disabled={!pdfDocument} title="Zoom Out">
                    <ZoomOut size={20} />
                </button>
                <span className="zoom-text">{Math.round(scale * 100)}%</span>
                <button onClick={handleZoomIn} disabled={!pdfDocument} title="Zoom In">
                    <ZoomIn size={20} />
                </button>
                <div className="divider"></div>
                <button onClick={handleRotate} disabled={!pdfDocument} title="Rotate">
                    <RotateCw size={20} />
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    onClick={() => setAnnotationMode(annotationMode === 'highlight' ? 'none' : 'highlight')}
                    className={`tool - btn ${annotationMode === 'highlight' ? 'active' : ''} `}
                    title="Highlight (Freehand)"
                    disabled={!pdfDocument}
                >
                    <Highlighter size={20} color={annotationMode === 'highlight' ? 'white' : 'gold'} />
                </button>
                <button
                    onClick={() => setAnnotationMode(annotationMode === 'draw' ? 'none' : 'draw')}
                    className={`tool - btn ${annotationMode === 'draw' ? 'active' : ''} `}
                    title="Draw"
                    disabled={!pdfDocument}
                >
                    <Pen size={20} />
                </button>
                <button
                    onClick={() => setIsTwoPageMode(!isTwoPageMode)}
                    className={`tool - btn ${isTwoPageMode ? 'active' : ''} `}
                    title="Two Page View"
                    disabled={!pdfDocument}
                >
                    <BookOpen size={20} />
                </button>
                <button
                    onClick={() => {
                        if (isReading) {
                            window.speechSynthesis.cancel();
                            setIsReading(false);
                        } else {
                            // Basic Read Aloud - Reads current page text (naive)
                            // A real impl needs text extraction first.
                            // We'll trigger a one-off read of "Read Aloud Mode Active" for now or similar.
                            const utterance = new SpeechSynthesisUtterance("Read aloud started.");
                            window.speechSynthesis.speak(utterance);
                            setIsReading(true);
                            // Simulating read state (it stops auto)
                            utterance.onend = () => setIsReading(false);
                        }
                    }}
                    className={`tool - btn ${isReading ? 'active' : ''} `}
                    title="Read Aloud"
                    disabled={!pdfDocument}
                >
                    <Volume2 size={20} />
                </button>
            </div>

            <div className="toolbar-group">
                <SearchBar />
                <div className="divider"></div>
                <button onClick={toggleTheme} title="Toggle Theme" className="theme-btn">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
