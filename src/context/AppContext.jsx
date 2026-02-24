import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [hoveredNode, setHoveredNode] = useState(null);
    const [activeNode, setActiveNode] = useState(null);
    const [showGlowDots, setShowGlowDots] = useState(false);

    const handleNodeHover = useCallback((nodeId) => {
        setHoveredNode(nodeId);
        setShowGlowDots(nodeId === 'synaptic' || nodeId === 'self');
    }, []);

    const handleNodeLeave = useCallback(() => {
        setHoveredNode(null);
        setShowGlowDots(false);
    }, []);

    const handleNodeClick = useCallback((nodeId) => {
        setActiveNode(nodeId);
    }, []);

    const handleClosePanel = useCallback(() => {
        setActiveNode(null);
    }, []);

    return (
        <AppContext.Provider value={{
            hoveredNode,
            activeNode,
            showGlowDots,
            handleNodeHover,
            handleNodeLeave,
            handleNodeClick,
            handleClosePanel,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
