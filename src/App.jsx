import React, { useState, useEffect } from 'react';
import { usePDF } from './context/PDFContext';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import PDFViewer from './components/PDFViewer';
import { Upload, FileText, Moon, Sun } from 'lucide-react';
import clsx from 'clsx'; // Assuming clsx might be used or standard template literal

const App = () => {
    const { pdfDocument, loadPDF, isSidebarOpen, isLoading, error, theme, toggleTheme } = usePDF();
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            loadPDF(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            loadPDF(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div
            className={`app-container ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <div className="main-layout">
                <header className="header">
                    <div className="logo-area">
                        <FileText className="logo-icon" />
                        <span className="logo-text">PDF Reader</span>
                    </div>
                    <Toolbar />
                </header>

                <div className="content-area">
                    {pdfDocument && isSidebarOpen && <Sidebar />}

                    <main className="viewer-area">
                        {!pdfDocument && (
                            <div className="upload-container">
                                <div className="upload-box">
                                    <Upload size={48} className="upload-icon" />
                                    <h2>Open a PDF to start reading</h2>
                                    <p>Drag and drop a file here, or click to select</p>
                                    <label className="upload-btn">
                                        Select PDF
                                        <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
                                    </label>
                                </div>
                                {isLoading && <p className="loading-text">Loading PDF...</p>}
                                {error && <p className="error-text">{error}</p>}
                            </div>
                        )}

                        {pdfDocument && <PDFViewer />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default App;
