import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NODE_DATA } from '../data/nodes';
import GlitchText from './GlitchText';

/* ─── Stagger wrapper: each child line prints in sequence ─── */
function ConsoleLine({ children, delay = 0, className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.08, ease: 'linear' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─── Skill tag with accent glow on hover ─── */
function SkillTag({ skill, accentColor, delay }) {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.05, ease: 'linear' }}
            className="inline-block mr-2 mb-1 text-[11px] text-zinc-500 cursor-default transition-all duration-200 hover:text-white select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            whileHover={{
                textShadow: `0 0 8px ${accentColor}, 0 0 16px ${accentColor}66`,
                color: '#ffffff',
            }}
        >
            [ {skill} ]
        </motion.span>
    );
}

/* ─── Project formatted as system log ─── */
function ProjectLog({ project, index, accentColor, baseDelay }) {
    const d = baseDelay + index * 0.18;
    return (
        <div className="mb-5 border-l-2 border-zinc-800 pl-4 hover:border-zinc-600 transition-colors">
            <ConsoleLine delay={d}>
                <span className="text-[10px] text-zinc-600 tracking-widest">
                    ── LOG_ENTRY_{String(index + 1).padStart(2, '0')} ──
                </span>
            </ConsoleLine>

            <ConsoleLine delay={d + 0.04}>
                <span className="text-xs text-zinc-500">EXEC_PROJECT: </span>
                <span className="text-xs text-slate-50 font-semibold uppercase tracking-wider">
                    {project.name}
                </span>
            </ConsoleLine>

            <ConsoleLine delay={d + 0.08}>
                <span className="text-xs text-zinc-500">STATUS: </span>
                <span className="text-xs" style={{ color: accentColor }}>Deployed</span>
            </ConsoleLine>

            <ConsoleLine delay={d + 0.12}>
                <span className="text-xs text-zinc-600">LOG: </span>
                <span className="text-[11px] text-zinc-500 leading-relaxed">{project.desc}</span>
            </ConsoleLine>

            {project.skills && (
                <ConsoleLine delay={d + 0.16} className="mt-2">
                    <span className="text-xs text-zinc-600">STACK: </span>
                    {project.skills.map((skill, i) => (
                        <SkillTag key={skill} skill={skill} accentColor={accentColor} delay={d + 0.18 + i * 0.03} />
                    ))}
                </ConsoleLine>
            )}
        </div>
    );
}

/* ─── Contact form styled as terminal prompt ─── */
function ContactForm({ baseDelay }) {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [identity, setIdentity] = useState('human');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !message) return;
        const subject = encodeURIComponent(`[PING] from ${name}`);
        const body = encodeURIComponent(`Source: ${name}\nIdentity: ${identity}\n\n${message}`);
        window.location.href = `mailto:contact@example.com?subject=${subject}&body=${body}`;
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <ConsoleLine delay={baseDelay}>
                <label className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1.5">
                    {'>'} input --field="Source IP / Name"
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-green-400 text-sm px-3 py-2.5 outline-none focus:border-green-500/50 transition-colors placeholder-zinc-700"
                    placeholder="your.name.here"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", borderRadius: 0 }}
                />
            </ConsoleLine>

            <ConsoleLine delay={baseDelay + 0.08}>
                <label className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1.5">
                    {'>'} input --field="Payload / Message"
                </label>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-black border border-zinc-800 text-green-400 text-sm px-3 py-2.5 outline-none focus:border-green-500/50 transition-colors resize-none placeholder-zinc-700"
                    placeholder="Enter message payload..."
                    style={{ fontFamily: "'IBM Plex Mono', monospace", borderRadius: 0 }}
                />
            </ConsoleLine>

            <ConsoleLine delay={baseDelay + 0.16}>
                <label className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-2">
                    {'>'} verify --identity
                </label>
                <div className="flex flex-col gap-1.5">
                    {['human', 'bot', 'saas-dropshipper'].map((option) => (
                        <label
                            key={option}
                            className={`flex items-center gap-2 cursor-pointer px-2 py-1.5 border transition-all text-xs uppercase tracking-wider ${identity === option
                                    ? 'border-green-500/30 bg-green-500/5 text-green-400'
                                    : 'border-zinc-800/50 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
                                }`}
                            style={{ borderRadius: 0 }}
                        >
                            <span className="text-zinc-700">{identity === option ? '[■]' : '[ ]'}</span>
                            {option}
                        </label>
                    ))}
                </div>
            </ConsoleLine>

            <ConsoleLine delay={baseDelay + 0.24}>
                <button
                    type="submit"
                    className="w-full border-2 border-green-500/30 bg-green-500/5 text-green-400 text-xs uppercase tracking-widest py-3 hover:bg-green-500/20 hover:border-green-500/60 transition-all flex items-center justify-center gap-2 group"
                    style={{ borderRadius: 0 }}
                >
                    <Send size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    EXECUTE PAYLOAD
                </button>
            </ConsoleLine>

            <AnimatePresence>
                {sent && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[11px] text-green-500 text-center py-2"
                    >
                        {'>'} PAYLOAD_DISPATCHED. Awaiting ACK...
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}

/* ─── Main Panel ─── */
export default function DetailPanel() {
    const { activeNode, handleClosePanel } = useApp();
    const [blinkVisible, setBlinkVisible] = useState(true);

    // Blink the SYS_REQ text
    useEffect(() => {
        if (!activeNode) return;
        const interval = setInterval(() => setBlinkVisible(v => !v), 800);
        return () => clearInterval(interval);
    }, [activeNode]);

    if (!activeNode) return null;

    const node = NODE_DATA[activeNode];
    if (!node) return null;

    const { content, accentColor } = node;

    return (
        <AnimatePresence>
            {activeNode && (
                <>
                    {/* Backdrop — dim but keep map interactive */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'linear' }}
                        className="fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
                        onClick={handleClosePanel}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.2, ease: 'linear' }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[40%] flex flex-col overflow-hidden border-l-4 border-zinc-700"
                        style={{ background: '#09090b' }}
                    >
                        {/* CRT scanlines overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none z-10"
                            style={{
                                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
                            }}
                        />

                        {/* ── Terminal Header ── */}
                        <div
                            className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 shrink-0 relative z-20"
                            style={{ background: '#111113' }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-zinc-600">{'>'}</span>
                                <span
                                    className="text-[11px] tracking-widest uppercase font-semibold"
                                    style={{ color: accentColor, opacity: blinkVisible ? 1 : 0.3, transition: 'opacity 0.1s' }}
                                >
                                    SYS_REQ: {node.label}
                                </span>
                            </div>

                            <button
                                onClick={handleClosePanel}
                                className="text-[10px] tracking-widest uppercase text-zinc-500 border border-zinc-800 px-3 py-1 transition-all duration-150 hover:bg-red-600 hover:text-black hover:border-red-600 select-none"
                                style={{ borderRadius: 0, fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                [ TERMINATE ]
                            </button>
                        </div>

                        {/* ── Scrollable Content ── */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-6 relative z-20">

                            {/* Headline with glitch */}
                            <ConsoleLine delay={0.1} className="mb-1">
                                <span className="text-[10px] text-zinc-700 tracking-widest">
                                    ════════════════════════════════════
                                </span>
                            </ConsoleLine>

                            <ConsoleLine delay={0.15} className="mb-1">
                                <h2 className="text-sm md:text-base font-bold text-slate-50 tracking-wide leading-snug">
                                    <GlitchText>{content.headline}</GlitchText>
                                </h2>
                            </ConsoleLine>

                            <ConsoleLine delay={0.2} className="mb-5">
                                <span className="text-[10px] text-zinc-700 tracking-widest">
                                    ════════════════════════════════════
                                </span>
                            </ConsoleLine>

                            {/* ── SELF node ── */}
                            {activeNode === 'self' && (
                                <>
                                    <ConsoleLine delay={0.28} className="mb-4">
                                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                                            <span className="text-zinc-600">{'>'} </span>
                                            {content.body}
                                        </p>
                                    </ConsoleLine>

                                    <ConsoleLine delay={0.36} className="mb-2">
                                        <span className="text-[10px] text-green-500/70 tracking-widest uppercase">
                                            ── PHILOSOPHY_DUMP ──
                                        </span>
                                    </ConsoleLine>

                                    {content.philosophy.map((item, i) => (
                                        <ConsoleLine key={i} delay={0.42 + i * 0.08} className="mb-2 pl-2 border-l border-zinc-800">
                                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                                                <span className="text-green-600">{'>'} </span>
                                                {item}
                                            </p>
                                        </ConsoleLine>
                                    ))}

                                    <ConsoleLine delay={0.7} className="mt-5 border border-zinc-800 p-3" style={{ background: '#0c0c0e' }}>
                                        <span className="text-[10px] text-zinc-600">STATUS: </span>
                                        <span className="text-[11px] text-green-400">{content.status}</span>
                                    </ConsoleLine>
                                </>
                            )}

                            {/* ── Project-based nodes (legacy, synaptic) ── */}
                            {content.projects && (
                                <>
                                    <ConsoleLine delay={0.25} className="mb-3">
                                        <span className="text-[10px] tracking-widest uppercase" style={{ color: accentColor + '88' }}>
                                            ── PROJECT_MANIFEST ──
                                        </span>
                                    </ConsoleLine>

                                    {content.projects.map((project, i) => (
                                        <ProjectLog
                                            key={i}
                                            project={project}
                                            index={i}
                                            accentColor={accentColor}
                                            baseDelay={0.3}
                                        />
                                    ))}
                                </>
                            )}

                            {/* ── Packet node ── */}
                            {activeNode === 'packet' && (
                                <>
                                    <ConsoleLine delay={0.28} className="mb-4">
                                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                                            <span className="text-zinc-600">{'>'} </span>
                                            {content.body}
                                        </p>
                                    </ConsoleLine>

                                    <ConsoleLine delay={0.36} className="mb-3">
                                        <span className="text-[10px] text-green-500/70 tracking-widest uppercase">
                                            ── CAPABILITY_REGISTER ──
                                        </span>
                                    </ConsoleLine>

                                    {content.capabilities.map((cap, i) => (
                                        <ConsoleLine key={i} delay={0.42 + i * 0.06} className="mb-1.5 flex items-center gap-2">
                                            <span className="text-zinc-700 text-[10px]">[{String(i).padStart(2, '0')}]</span>
                                            <span className="text-[11px] text-zinc-500">{cap}</span>
                                        </ConsoleLine>
                                    ))}
                                </>
                            )}

                            {/* ── Contact node ── */}
                            {content.type === 'contact' && (
                                <>
                                    <ConsoleLine delay={0.25} className="mb-3">
                                        <span className="text-[10px] text-purple-500/70 tracking-widest uppercase">
                                            ── OPEN_CHANNEL ──
                                        </span>
                                    </ConsoleLine>

                                    <ConsoleLine delay={0.3} className="mb-4">
                                        <p className="text-[11px] text-zinc-500">
                                            <span className="text-zinc-600">{'>'} </span>
                                            Listening on port 80. Transmit your payload below.
                                        </p>
                                    </ConsoleLine>

                                    <ContactForm baseDelay={0.35} />
                                </>
                            )}

                            {/* Bottom padding for scroll */}
                            <div className="h-8" />
                        </div>

                        {/* ── Bottom status bar ── */}
                        <div
                            className="flex items-center justify-between px-4 py-1.5 border-t border-zinc-800 shrink-0 relative z-20"
                            style={{ background: '#111113' }}
                        >
                            <span className="text-[9px] text-zinc-700 tracking-widest uppercase">
                                node:{node.id} • conn:secure
                            </span>
                            <span className="text-[9px] tracking-widest uppercase" style={{ color: accentColor + '77' }}>
                                ■ active
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
