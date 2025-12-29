import * as pdfjsLib from 'pdfjs-dist';

// Define the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// This file is just a placeholder to ensure the public directory works as expected if we need a local worker later.
// We are using a CDN for the worker to avoid complex build configurations for now,
// as moving the worker file manually is often required with Vite + PDF.js.
