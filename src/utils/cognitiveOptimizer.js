import { useEffect, useRef } from 'react';
import { usePDF } from '../context/PDFContext';

export const useCognitiveOptimizer = () => {
    const {
        currentPage,
        scale,
        cognitiveLoad, setCognitiveLoad,
        mentorPersona
    } = usePDF();

    const lastInteraction = useRef(Date.now());
    const interactionHistory = useRef([]);
    const pageViewTimes = useRef({});

    useEffect(() => {
        const handleInteraction = () => {
            lastInteraction.current = Date.now();

            // Track behavioral patterns
            const now = Date.now();
            interactionHistory.current.push({ type: 'scroll/zoom', time: now });

            // Limit history size
            if (interactionHistory.current.length > 50) interactionHistory.current.shift();

            // Detect frantic behavior (possible fatigue or confusion)
            const recent = interactionHistory.current.filter(i => now - i.time < 10000);
            if (recent.length > 20) {
                setCognitiveLoad(prev => ({ ...prev, fatigueLevel: Math.min(prev.fatigueLevel + 10, 100) }));
            }
        };

        window.addEventListener('scroll', handleInteraction, true);
        window.addEventListener('wheel', handleInteraction, true);

        return () => {
            window.removeEventListener('scroll', handleInteraction, true);
            window.removeEventListener('wheel', handleInteraction, true);
        };
    }, []);

    // Detect Re-reading (Stuck state)
    useEffect(() => {
        const now = Date.now();
        if (!pageViewTimes.current[currentPage]) {
            pageViewTimes.current[currentPage] = { count: 0, lastTime: now };
        }

        pageViewTimes.current[currentPage].count += 1;

        if (pageViewTimes.current[currentPage].count > 5) {
            setCognitiveLoad(prev => ({ ...prev, stuckDetected: true }));
            console.warn("Stuck detection: User has return to page " + currentPage + " multiple times.");
        }
    }, [currentPage]);

    // Detect high zoom dependency
    useEffect(() => {
        if (scale > 2.0) {
            console.log("High cognitive load: Large zoom levels might indicate struggle with complexity or visuals.");
        }
    }, [scale]);

    return cognitiveLoad;
};
