import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Activity, ArrowUpRight, Radio } from 'lucide-react';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { $mode, ensureModeSync, type Mode } from '../stores/mode';

type NodeId = 'root' | 'signal' | 'portier' | 'mainframe';

interface SpiderWebNode {
  id: NodeId;
  route: string;
  labels: Record<Mode, string>;
  title: string;
  summary: Record<Mode, string>;
  meta: string;
  href: string;
  external?: boolean;
}

export type { SpiderWebNode };

interface Props {
  nodes: SpiderWebNode[];
}

const center = { x: 500, y: 320 };
const TRACE_BASE = 'rgba(255, 255, 255, 0.15)';
const ICE_BLUE = '#38BDF8';
const SOFT_PURPLE = '#8B5CF6';

const nodePositions: Record<NodeId, { x: number; y: number }> = {
  root: { x: 500, y: 130 },
  signal: { x: 235, y: 260 },
  portier: { x: 315, y: 515 },
  mainframe: { x: 785, y: 330 }
};

const modeSubscribe = (listener: () => void) => $mode.listen(() => listener());
const getModeSnapshot = () => $mode.get();

const buildPCBTracePath = (origin: { x: number; y: number }, destination: { x: number; y: number }) => {
  const dx = destination.x - origin.x;
  const dy = destination.y - origin.y;
  const dirX = dx >= 0 ? 1 : -1;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx > absDy) {
    const straightX = (absDx - absDy) / 2;
    const pt1x = origin.x + straightX * dirX;
    const pt2x = pt1x + absDy * dirX;
    return `M ${origin.x} ${origin.y} L ${pt1x} ${origin.y} L ${pt2x} ${destination.y} L ${destination.x} ${destination.y}`;
  } else {
    const midX = origin.x + dx / 2;
    return `M ${origin.x} ${origin.y} L ${midX} ${origin.y} L ${midX} ${destination.y} L ${destination.x} ${destination.y}`;
  }
};

export default function SpiderWebMap({ nodes }: Props) {
  useEffect(() => { ensureModeSync(); }, []);

  const mode = useSyncExternalStore(modeSubscribe, getModeSnapshot, getModeSnapshot);
  const [activeNodeId, setActiveNodeId] = useState<NodeId | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<NodeId | null>(null);

  // States voor de levende interface effecten
  const [isBooting, setIsBooting] = useState(false);
  const [metrics, setMetrics] = useState({ ping: 12, cpu: 4 });

  // Genereer stabiele en willekeurige snelheden voor de datapakketjes en LED's per node
  const nodeConfigs = useMemo(() => {
    const configs: Record<string, { dur: number }> = {};
    nodes.forEach(n => {
      configs[n.id] = { dur: 1.5 + Math.random() * 2 };
    });
    return configs;
  }, [nodes]);

  // Update de live metrics elke 2.5 seconden voor een "werkend systeem" effect
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics({
        ping: Math.floor(Math.random() * 20) + 8,
        cpu: Math.floor(Math.random() * 15) + 2
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Simuleer een server-laadtijd bij het openen van een module
  useEffect(() => {
    if (activeNodeId) {
      setIsBooting(true);
      const t = setTimeout(() => setIsBooting(false), 500);
      return () => clearTimeout(t);
    }
  }, [activeNodeId]);

  const activeNode = useMemo(() => {
    if (!activeNodeId) return null;
    return nodes.find((node) => node.id === activeNodeId) ?? null;
  }, [activeNodeId, nodes]);

  const visibleNodes = useMemo(
    () => nodes.filter((node) => node.id !== activeNodeId),
    [activeNodeId, nodes]
  );

  const isHighlighted = (nodeId: NodeId) => nodeId === activeNodeId || nodeId === hoveredNodeId;
  const isDeepDive = activeNodeId !== null;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-20">
      <LayoutGroup>
        <div className="module">
          <div className="module-header">
            <span>[ DEVICE://ROOT/INFRASTRUCTURE ]</span>
          </div>

          <div className="module-body p-2 md:p-4">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/5 bg-black/20">

              {/* 1. DEEP DIVE ACHTERGROND (Zoomt en Blurt bij openen) */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: isDeepDive ? 1.08 : 1,
                  filter: isDeepDive ? 'blur(6px)' : 'blur(0px)',
                  opacity: isDeepDive ? 0.3 : 1
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 1000 640" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <pattern id="dot-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.05)" />
                    </pattern>

                    <filter id="ice-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="glow" />
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <linearGradient id="trace-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
                      <stop offset="45%" stopColor="rgba(56, 189, 248, 0.4)" />
                      <stop offset="50%" stopColor={ICE_BLUE} />
                      <stop offset="55%" stopColor="rgba(56, 189, 248, 0.4)" />
                      <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                      <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="1.2s" repeatCount="indefinite" />
                    </linearGradient>
                  </defs>

                  <rect width="100%" height="100%" fill="url(#dot-grid)" />

                  {nodes.map((node) => {
                    const highlighted = isHighlighted(node.id);
                    const path = buildPCBTracePath(center, nodePositions[node.id]);
                    const conf = nodeConfigs[node.id];

                    return (
                      <g key={`trace-${node.id}`}>
                        <motion.path
                          d={path}
                          stroke={highlighted ? 'url(#trace-pulse)' : TRACE_BASE}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          animate={{
                            strokeWidth: highlighted ? 2 : 1,
                            opacity: highlighted ? 1 : 0.5
                          }}
                          style={{ filter: highlighted ? 'url(#ice-glow)' : 'none' }}
                          transition={{ duration: 0.3 }}
                        />
                        {/* Actieve Datastroom (Telemetry Packet) */}
                        <circle r="2.5" fill={ICE_BLUE} style={{ filter: 'url(#ice-glow)' }}>
                          <animateMotion dur={`${conf.dur}s`} repeatCount="indefinite" path={path} />
                        </circle>
                      </g>
                    );
                  })}
                </svg>

                {/* Central CPU Socket Hub */}
                <div
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
                  style={{ left: `${center.x / 10}%`, top: `${center.y / 6.4}%` }}
                >
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/20 bg-black/40 backdrop-blur-sm"
                    animate={{ boxShadow: `0 0 20px ${TRACE_BASE}` }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="h-6 w-6 rounded-full border border-white/30 bg-white/5" />
                  </motion.div>
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-[#38BDF8]">
                    SYS_CORE // {metrics.cpu}%
                  </span>
                </div>
              </motion.div>

              {/* 2. NODES (Blijven op hun plek, vervagen bij Deep Dive) */}
              <div className="absolute inset-0 pointer-events-none">
                {visibleNodes.map((node) => {
                  const position = nodePositions[node.id];
                  const isPortier = node.id === 'portier';
                  const isSignal = node.id === 'signal';

                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      layoutId={`node-${node.id}`}
                      className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                      style={{ left: `${position.x / 10}%`, top: `${position.y / 6.4}%` }}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId((current) => (current === node.id ? null : current))}
                      onFocus={() => setHoveredNodeId(node.id)}
                      onBlur={() => setHoveredNodeId((current) => (current === node.id ? null : current))}
                      onClick={() => setActiveNodeId(node.id)}
                      animate={{
                        opacity: isDeepDive ? 0 : 1,
                        scale: isDeepDive ? 0.9 : 1,
                        filter: isDeepDive ? 'blur(4px)' : 'blur(0px)',
                      }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className={`relative flex items-center justify-center bg-black/40 backdrop-blur-sm transition-colors ${isPortier
                            ? 'h-10 w-12 rounded-lg border border-white/20 hover:border-[#38BDF8]'
                            : isSignal
                              ? 'h-10 w-10 rotate-45 rounded-md border border-white/20 hover:border-[#38BDF8]'
                              : 'h-8 w-12 rounded-full border border-white/20 hover:border-[#38BDF8]'
                          }`}
                      >
                        {/* LED Status Indicator */}
                        <div className="absolute -right-1 -top-1 flex h-2.5 w-2.5 items-center justify-center">
                          <span
                            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-60"
                            style={{ animationDuration: `${nodeConfigs[node.id].dur}s` }}
                          ></span>
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#38BDF8]"></span>
                        </div>

                        {isSignal && <Radio size={16} className="-rotate-45 text-white/70" />}
                        {isPortier && (
                          <div className="flex h-full w-full flex-col justify-evenly px-2">
                            <div className="h-px w-full bg-white/30" />
                            <div className="h-px w-full bg-white/30" />
                          </div>
                        )}
                      </div>

                      {/* Labels & Live Telemetry Data */}
                      <div className="mt-1 flex flex-col items-center gap-1">
                        <motion.span
                          key={mode} // Glitch animatie op de Human/Tech mode switch
                          initial={{ opacity: 0, x: (Math.random() - 0.5) * 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="rounded border border-white/5 bg-black/40 px-2 py-1 text-center text-[10px] uppercase tracking-widest text-white/70"
                        >
                          {node.labels[mode]}
                        </motion.span>
                        <span className="text-[8px] font-mono text-[#38BDF8]/60">
                          PNG: {metrics.ping + (node.id.length % 5)}ms
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* 3. MODAL WINDOW (Het terminal venster na aanklikken) */}
              <AnimatePresence>
                {activeNode ? (
                  <motion.div
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                    onClick={() => setActiveNodeId(null)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.article
                      layoutId={`node-${activeNode.id}`}
                      className="w-full max-w-xl cursor-auto overflow-hidden rounded-xl border border-white/10 bg-[#05050A]/80 shadow-2xl backdrop-blur-xl"
                      onClick={(event) => event.stopPropagation()}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
                        <span>{`> ACCESS: ${activeNode.route}`}</span>
                        <button
                          type="button"
                          onClick={() => setActiveNodeId(null)}
                          className="transition-colors hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Laad-scherm voor de terminal */}
                      {isBooting ? (
                        <div className="flex h-48 flex-col items-center justify-center gap-4 text-[#38BDF8]">
                          <Activity className="animate-pulse" size={32} />
                          <span className="animate-pulse font-mono text-xs tracking-widest">
                            ESTABLISHING SECURE LINK...
                          </span>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`p-8 ${mode === 'tech' ? 'font-mono' : 'font-sans'}`}
                        >
                          <h2 className="mb-4 text-2xl font-bold text-white">
                            {mode === 'tech' ? `SYS.${activeNode.title.toUpperCase()}` : activeNode.title}
                          </h2>

                          <div className="mb-6 border-l-2 border-[#8B5CF6] pl-5 leading-relaxed text-slate-300">
                            <p>{activeNode.summary[mode]}</p>
                          </div>

                          <p className="mb-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                            META: {activeNode.meta}
                          </p>

                          <div className="flex gap-4">
                            <a
                              href={activeNode.href}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#38BDF8] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#05050A] transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                              target={activeNode.external ? '_blank' : undefined}
                              rel={activeNode.external ? 'noreferrer' : undefined}
                            >
                              {mode === 'tech' ? '[ EXECUTE ]' : 'Open Module'}
                              <ArrowUpRight size={16} />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </motion.article>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </LayoutGroup>
    </section>
  );
}