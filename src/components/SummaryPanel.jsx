import React, { useState, useEffect } from 'react';
import { usePDF } from '../context/PDFContext';

const SummaryPanel = () => {
    const { pdfDocument, fileName, numPages } = usePDF();
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Simple pseudo-summary (meta data + first page text extract)
    const generateSummary = async () => {
        if (!pdfDocument) return;

        setIsLoading(true);
        try {
            // Get Metadata
            const metadata = await pdfDocument.getMetadata();

            // Get First Page Text
            const page = await pdfDocument.getPage(1);
            const textContent = await page.getTextContent();
            const text = textContent.items.map(item => item.str).join(' ');

            // Simply truncate for preview
            const previewText = text.substring(0, 1000) + "...";

            setSummary({
                info: metadata.info,
                preview: previewText
            });
        } catch (error) {
            console.error("Summary generation failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!pdfDocument) {
        return <div className="p-4 text-center text-secondary">No PDF loaded.</div>;
    }

    return (
        <div className="summary-panel" style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Document Summary</h3>

            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <p><strong>File:</strong> {fileName}</p>
                <p><strong>Pages:</strong> {numPages}</p>
            </div>

            {!summary ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        Generate a quick overview of this document.
                    </p>
                    <button
                        onClick={generateSummary}
                        disabled={isLoading}
                        style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 500
                        }}
                    >
                        {isLoading ? 'Generating...' : 'Generate Overview'}
                    </button>
                    <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                        *Uses local text extraction. For AI summary, backend integration required.
                    </p>
                </div>
            ) : (
                <div className="summary-content">
                    {summary.info?.Title && (
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Title:</strong> {summary.info.Title}
                        </div>
                    )}
                    {summary.info?.Author && (
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Author:</strong> {summary.info.Author}
                        </div>
                    )}

                    <div style={{ marginTop: '1rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Content Preview (Page 1):</strong>
                        <p style={{
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-primary)',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {summary.preview}
                        </p>
                    </div>
                    <button
                        onClick={() => setSummary(null)}
                        style={{
                            marginTop: '1.5rem',
                            color: 'var(--accent-color)',
                            fontSize: '0.875rem',
                            textDecoration: 'underline'
                        }}
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

export default SummaryPanel;
