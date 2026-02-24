import { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { NODE_DATA } from '../data/nodes';

const BOOT_MESSAGES = [
    '> Booting system...',
    '> Scanning topology...',
    '> 5 nodes found.',
    '> System ready. Click a node to inspect.',
];

export default function TerminalWidget() {
    const { hoveredNode, activeNode } = useApp();
    const [lines, setLines] = useState([]);
    const [currentText, setCurrentText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const scrollRef = useRef(null);
    const typeTimeoutRef = useRef(null);
    const bootDoneRef = useRef(false);

    // Boot sequence on mount
    useEffect(() => {
        let i = 0;
        const bootInterval = setInterval(() => {
            if (i < BOOT_MESSAGES.length) {
                setLines(prev => [...prev, BOOT_MESSAGES[i]]);
                i++;
            } else {
                clearInterval(bootInterval);
                bootDoneRef.current = true;
            }
        }, 600);
        return () => clearInterval(bootInterval);
    }, []);

    // Typewriter effect for contextual messages
    useEffect(() => {
        if (!bootDoneRef.current) return;

        const nodeId = hoveredNode || activeNode;
        if (!nodeId) return;

        const nodeData = NODE_DATA[nodeId];
        if (!nodeData) return;

        const message = `> ${nodeData.terminalMessage}`;

        // Cancel previous typing
        if (typeTimeoutRef.current) {
            clearTimeout(typeTimeoutRef.current);
        }

        setIsTyping(true);
        setCurrentText('');

        let charIndex = 0;
        const typeChar = () => {
            if (charIndex < message.length) {
                setCurrentText(message.slice(0, charIndex + 1));
                charIndex++;
                typeTimeoutRef.current = setTimeout(typeChar, 15 + Math.random() * 25);
            } else {
                setIsTyping(false);
                setLines(prev => {
                    const newLines = [...prev, message];
                    // Keep last 20 lines
                    return newLines.slice(-20);
                });
                setCurrentText('');
            }
        };

        typeTimeoutRef.current = setTimeout(typeChar, 200);

        return () => {
            if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
        };
    }, [hoveredNode, activeNode]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, currentText]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="fixed bottom-4 right-4 z-50"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
            <div
                className="border border-zinc-800 overflow-hidden"
                style={{
                    background: '#0c0c0e',
                    width: isExpanded ? '380px' : '200px',
                    boxShadow: '0 0 30px rgba(34,197,94, 0.05)',
                }}
            >
                {/* Title bar */}
                <div
                    className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 cursor-pointer select-none"
                    onClick={() => setIsExpanded(e => !e)}
                    style={{ background: '#111113' }}
                >
                    <div className="flex items-center gap-2">
                        <Terminal size={12} className="text-green-500" />
                        <span className="text-[10px] text-green-500 tracking-widest uppercase font-semibold">
                            observer.sh
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500/60" />
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 160 }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            ref={scrollRef}
                            className="overflow-y-auto p-3 relative scanlines"
                            style={{ scrollbarGutter: 'stable' }}
                        >
                            {lines.map((line, i) => (
                                <div key={i} className="flex items-start gap-1.5 mb-0.5">
                                    <span
                                        className="text-[11px] leading-relaxed break-all"
                                        style={{ color: line.includes('ERROR') ? '#ef4444' : '#22c55e' }}
                                    >
                                        {line}
                                    </span>
                                </div>
                            ))}

                            {/* Currently typing line */}
                            {currentText && (
                                <div className="flex items-start gap-1.5">
                                    <span className="text-[11px] text-green-400 leading-relaxed break-all">
                                        {currentText}
                                        <span className="cursor-blink text-green-500">█</span>
                                    </span>
                                </div>
                            )}

                            {/* Idle cursor */}
                            {!isTyping && !currentText && (
                                <div className="flex items-center gap-1 mt-1">
                                    <ChevronRight size={10} className="text-green-600" />
                                    <span className="cursor-blink text-green-500 text-[11px]">█</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
