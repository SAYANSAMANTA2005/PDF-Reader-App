import React, { createContext, useContext, useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Use local worker for offline support
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PDFContext = createContext();

export const usePDF = () => {
    const context = useContext(PDFContext);
    if (!context) {
        throw new Error('usePDF must be used within a PDFProvider');
    }
    return context;
};

export const PDFProvider = ({ children }) => {
    const [pdfDocument, setPdfDocument] = useState(null);
    const [pdfFile, setPdfFile] = useState(null); // File object or URL
    const [fileName, setFileName] = useState("No file selected");
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSidebarTab, setActiveSidebarTab] = useState('thumbnails'); // 'thumbnails', 'bookmarks'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('light');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
    const [annotationMode, setAnnotationMode] = useState('none'); // 'none', 'highlight', 'draw', 'text'
    const [annotations, setAnnotations] = useState({}); // { [pageNum]: [ { type, ...data } ] }
    const [annotationColor, setAnnotationColor] = useState('#ffff00'); // Default highlight color
    const [isTwoPageMode, setIsTwoPageMode] = useState(false);

    // Initial Theme Load
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const loadPDF = async (file) => {
        setIsLoading(true);
        setError(null);
        setPdfDocument(null);
        setPdfFile(file);
        setNumPages(0);
        setCurrentPage(1);
        setSearchQuery('');
        setSearchResults([]);

        try {
            let loadingTask;
            if (typeof file === 'string') {
                loadingTask = pdfjsLib.getDocument(file);
                setFileName(file.split('/').pop());
            } else if (file instanceof File) {
                const arrayBuffer = await file.arrayBuffer();
                loadingTask = pdfjsLib.getDocument(arrayBuffer);
                setFileName(file.name);
            } else {
                throw new Error("Invalid file format");
            }

            const pdf = await loadingTask.promise;
            setPdfDocument(pdf);
            setNumPages(pdf.numPages);
        } catch (err) {
            console.error("Error loading PDF:", err);
            setError("Failed to load PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        pdfDocument,
        pdfFile,
        fileName,
        currentPage,
        setCurrentPage,
        numPages,
        scale,
        setScale,
        rotation,
        setRotation,
        isSidebarOpen,
        setIsSidebarOpen,
        activeSidebarTab,
        setActiveSidebarTab,
        isLoading,
        error,
        theme,
        toggleTheme,
        loadPDF,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        currentMatchIndex,
        setCurrentMatchIndex,
        annotationMode,
        setAnnotationMode,
        annotations,
        setAnnotations,
        annotationColor,
        setAnnotationColor,
        isTwoPageMode,
        setIsTwoPageMode
    };

    return (
        <PDFContext.Provider value={value}>
            {children}
        </PDFContext.Provider>
    );
};
