import React, { useEffect, useRef } from 'react';
import { usePDF } from '../context/PDFContext';

const Thumbnails = () => {
    const { numPages, currentPage, setCurrentPage, pdfDocument } = usePDF();
    const containerRef = useRef(null);

    // Helper to render thumbnail
    const renderThumbnail = async (pageValue, canvasRef) => {
        if (!pdfDocument || !canvasRef) return;

        try {
            const page = await pdfDocument.getPage(pageValue);
            const viewport = page.getViewport({ scale: 0.2 }); // Small scale for thumbnail
            const canvas = canvasRef;
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;
        } catch (error) {
            console.error("Error rendering thumbnail", error);
        }
    };

    return (
        <div className="thumbnails-container" ref={containerRef}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                <div
                    key={pageNum}
                    className={`thumbnail-wrapper ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{ marginBottom: '1rem', cursor: 'pointer', textAlign: 'center' }}
                >
                    <ThumbnailCanvas pageNum={pageNum} renderThumbnail={renderThumbnail} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pageNum}</span>
                </div>
            ))}
        </div>
    );
};

// Separate component to handle individual canvas rendering lifecycle
const ThumbnailCanvas = ({ pageNum, renderThumbnail }) => {
    const canvasRef = useRef(null);
    const hasRendered = useRef(false);

    useEffect(() => {
        if (canvasRef.current && !hasRendered.current) {
            renderThumbnail(pageNum, canvasRef.current);
            hasRendered.current = true;
        }
    }, [pageNum, renderThumbnail]);

    return <canvas ref={canvasRef} style={{ border: '1px solid var(--border-color)', borderRadius: '4px' }} />;
};

export default Thumbnails;
