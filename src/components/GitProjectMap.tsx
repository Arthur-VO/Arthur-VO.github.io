import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CircleDot, GitBranch, GitMerge } from 'lucide-react';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { $mode, ensureModeSync, type Mode } from '../stores/mode';

interface Project {
    id: string;
    slug: string;
    data: {
        title: string;
        status: 'active' | 'completed' | 'archived';
        topic: string;
        startDate: Date;
        endDate?: Date;
        tagline_human: string;
        tagline_tech: string;
        url: string;
    };
}

interface Props {
    projects: Project[];
}

const modeSubscribe = (listener: () => void) => $mode.listen(() => listener());
const getModeSnapshot = () => $mode.get();

// Uitgebreid 2026 AI / Cyberpunk kleurenpalet voor dynamische toewijzing
const PALETTE = [
    '#38BDF8', // Ice Blue
    '#8B5CF6', // Soft Purple
    '#10B981', // Emerald
    '#F43F5E', // Rose
    '#F59E0B', // Amber
    '#0EA5E9', // Sky
    '#D946EF', // Pink
    '#14B8A6'  // Teal
];

const LANE_SPACING = 80; // Verticale ruimte tussen branches
const PADDING_Y = 80;    // Padding boven en onder in de SVG

export default function GitProjectMap({ projects }: Props) {
    useEffect(() => { ensureModeSync(); }, []);
    const mode = useSyncExternalStore(modeSubscribe, getModeSnapshot, getModeSnapshot);
    const [activeProject, setActiveProject] = useState<Project | null>(null);

    // 1. Dynamische configuratie voor lanes en kleuren
    const layoutConfig = useMemo(() => {
        const uniqueTopics = Array.from(new Set(projects.map(p => p.data.topic))).sort();
        const topBranches = Math.ceil(uniqueTopics.length / 2);
        const bottomBranches = Math.floor(uniqueTopics.length / 2);
        const mainY = PADDING_Y + (topBranches * LANE_SPACING);
        const svgHeight = mainY + (bottomBranches * LANE_SPACING) + PADDING_Y;

        const colors = new Map<string, string>();
        const lanes = new Map<string, number>();

        uniqueTopics.forEach((topic, index) => {
            colors.set(topic, PALETTE[index % PALETTE.length]);
            const direction = index % 2 === 0 ? -1 : 1;
            const step = Math.floor(index / 2) + 1;
            lanes.set(topic, mainY + (direction * step * LANE_SPACING));
        });

        return { colors, lanes, mainY, svgHeight, uniqueTopics };
    }, [projects]);

    // 2. Bereken de topologie (X-coördinaten en event volgorde)
    const topology = useMemo(() => {
        const events: { type: 'start' | 'merge'; date: Date; project: Project }[] = [];

        projects.forEach(p => {
            events.push({ type: 'start', date: p.data.startDate, project: p });
            if (p.data.status === 'completed' && p.data.endDate) {
                events.push({ type: 'merge', date: p.data.endDate, project: p });
            }
        });

        events.sort((a, b) => a.date.getTime() - b.date.getTime());

        const isCompact = projects.length <= 3;
        const startX = isCompact ? 80 : 100;
        const endPadding = isCompact ? 180 : 150;
        const compactTargetWidth = 900;
        const compactStep = Math.max(
            120,
            Math.floor((compactTargetWidth - startX - endPadding) / Math.max(events.length, 1))
        );
        const xStep = isCompact ? compactStep : 180;
        let currentX = startX;
        const projectCoords = new Map<string, { startX: number; endX?: number; y: number }>();

        events.forEach(event => {
            const topicY = layoutConfig.lanes.get(event.project.data.topic) || layoutConfig.mainY;
            const existing = projectCoords.get(event.project.id) || { startX: 0, y: topicY };

            if (event.type === 'start') {
                existing.startX = currentX;
            } else if (event.type === 'merge') {
                existing.endX = currentX;
            }

            projectCoords.set(event.project.id, existing);
            currentX += xStep;
        });

        return { coords: projectCoords, maxX: currentX + endPadding };
    }, [projects, layoutConfig]);

    const renderMaxX = topology.maxX;

    const buildBranchPath = (startX: number, endX: number | undefined, y: number) => {
        const actualEndX = endX ?? renderMaxX;
        const isActive = !endX;
        const mainY = layoutConfig.mainY;

        const path = `M ${startX} ${mainY} 
                  C ${startX + 40} ${mainY}, ${startX + 40} ${y}, ${startX + 80} ${y} 
                  L ${actualEndX - (isActive ? 0 : 80)} ${y}`;

        if (!isActive) {
            return path + ` C ${actualEndX - 40} ${y}, ${actualEndX - 40} ${mainY}, ${actualEndX} ${mainY}`;
        }
        return path;
    };

    const getNodeX = (startX: number, endX?: number) => {
        if (endX) {
            return startX + (endX - startX) / 2;
        }

        const preferredX = startX + (renderMaxX - startX) * 0.7;
        const minX = startX + 80;
        const maxX = renderMaxX - 160;

        if (maxX <= minX) {
            return startX + (renderMaxX - startX) / 2;
        }

        return Math.min(maxX, Math.max(minX, preferredX));
    };

    return (
        <section className="w-full pb-20">
            <div className="module overflow-hidden bg-[#05050A]/80 border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="module-header border-b border-white/10 bg-white/5 text-[#38BDF8]">
                    <span>[ SYS://PROJECTS/GIT_TOPOLOGY ]</span>
                    <span className="text-white/40">{layoutConfig.uniqueTopics.length} TOPICS // {projects.length} BRANCHES</span>
                </div>

                <div className="overflow-hidden">
                    <div className="relative w-full" style={{ height: layoutConfig.svgHeight }}>
                        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${renderMaxX} ${layoutConfig.svgHeight}`} preserveAspectRatio="none" aria-hidden="true">
                            {/* Main Branch Line */}
                            <line x1="0" y1={layoutConfig.mainY} x2={renderMaxX} y2={layoutConfig.mainY} stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                            <text x="20" y={layoutConfig.mainY - 15} fill="rgba(255,255,255,0.3)" fontSize="12" fontFamily="monospace" letterSpacing="2">main</text>

                            {/* Render de Branches */}
                            {projects.map(project => {
                                const coords = topology.coords.get(project.id)!;
                                const color = layoutConfig.colors.get(project.data.topic) || '#94A3B8';
                                const isSelected = activeProject?.id === project.id;

                                // NIEUW: Bepaal of de branch naar beneden of naar boven groeit
                                const isBranchingDown = coords.y > layoutConfig.mainY;
                                // Zet het label aan de tegenovergestelde kant van de aftakking
                                const labelY = isBranchingDown ? layoutConfig.mainY - 15 : layoutConfig.mainY + 22;

                                return (
                                    <g key={`branch-${project.id}`}>
                                        {/* Branch Lijn */}
                                        <motion.path
                                            d={buildBranchPath(coords.startX, coords.endX, coords.y)}
                                            stroke={color}
                                            strokeWidth={isSelected ? 4 : 2}
                                            fill="none"
                                            opacity={isSelected ? 1 : 0.6}
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />

                                        {/* Start Commit (Branch-off) op de main branch */}
                                        <circle cx={coords.startX} cy={layoutConfig.mainY} r="6" fill="#05050A" stroke={color} strokeWidth="2" />

                                        {/* Topic Label (Verplaatst naar de main branch node!) */}
                                        <text
                                            x={coords.startX}
                                            y={labelY}
                                            fill={color}
                                            fontSize="10"
                                            fontFamily="monospace"
                                            letterSpacing="1"
                                            textAnchor="middle" /* Zorgt dat de tekst perfect gecentreerd boven/onder het bolletje staat */
                                        >
                                            {project.data.topic.toUpperCase().replace(/\s+/g, '-')}
                                        </text>

                                        {/* Work/Active Node op de project branch */}
                                        <circle
                                            cx={getNodeX(coords.startX, coords.endX)}
                                            cy={coords.y}
                                            r="6"
                                            fill={color}
                                        />

                                        {/* End Commit (Merge) als afgerond */}
                                        {coords.endX && (
                                            <circle cx={coords.endX} cy={layoutConfig.mainY} r="6" fill="#05050A" stroke={color} strokeWidth="2" />
                                        )}
                                    </g>
                                );
                            })}
                        </svg>

                        {projects.map(project => {
                            const coords = topology.coords.get(project.id)!;
                            const color = layoutConfig.colors.get(project.data.topic) || '#94A3B8';
                            const middleX = getNodeX(coords.startX, coords.endX);
                            const middleXPct = (middleX / renderMaxX) * 100;
                            const isSelected = activeProject?.id === project.id;

                            return (
                                <button
                                    key={`btn-${project.id}`}
                                    className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 z-10"
                                    style={{ left: `${middleXPct}%`, top: coords.y }}
                                    // DE FIX: Geen hover meer, maar een klik die het project selecteert (of deselecteert)
                                    onClick={() => setActiveProject(isSelected ? null : project)}
                                >
                                    <div className={`mt-4 flex flex-col items-center bg-[#05050A]/90 px-3 py-2 rounded-lg backdrop-blur-md shadow-xl whitespace-nowrap transition-colors ${isSelected ? 'border-2' : 'border'}`} style={{ borderColor: isSelected ? color : 'rgba(255,255,255,0.1)' }}>
                                        <span className="text-white font-bold text-sm mb-1">{project.data.title}</span>
                                        <div className="flex gap-2 items-center text-[10px] uppercase tracking-widest" style={{ color }}>
                                            {project.data.status === 'active' ? <CircleDot size={12} /> : <GitMerge size={12} />}
                                            {project.data.status}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Info paneel */}
                <div className="min-h-[120px] border-t border-white/5 bg-white/[0.02] p-6">
                    <AnimatePresence mode="wait">
                        {activeProject ? (
                            <motion.div
                                key={activeProject.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                        <GitBranch size={20} className="text-[#38BDF8]" />
                                        {activeProject.data.title}
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        {mode === 'tech' ? activeProject.data.tagline_tech : activeProject.data.tagline_human}
                                    </p>
                                </div>
                                <div className="flex flex-col justify-center items-start md:items-end border-l border-white/10 pl-6">
                                    <span className="text-xs uppercase tracking-widest text-slate-500 mb-1">Project Lifecycle</span>
                                    <span className="text-sm font-mono text-white/80">
                                        {activeProject.data.startDate.toISOString().split('T')[0]}
                                        {' → '}
                                        {activeProject.data.endDate ? activeProject.data.endDate.toISOString().split('T')[0] : 'PRESENT'}
                                    </span>
                                    {/* De link is nu veilig klikbaar! */}
                                    <a href={activeProject.data.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#38BDF8] hover:text-white transition-colors">
                                        View Repository <ArrowUpRight size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm tracking-widest uppercase">
                                {/* Tekst geüpdatet voor duidelijkheid */}
                                Select a project to view data
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}