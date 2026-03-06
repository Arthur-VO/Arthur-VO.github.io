import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { $mode, ensureModeSync } from '../stores/mode';

interface BlogPost {
    id: string;
    slug: string;
    data: {
        title: string;
        tags?: string[];
    };
}

interface Props {
    posts: BlogPost[];
}

const modeSubscribe = (listener: () => void) => $mode.listen(() => listener());
const getModeSnapshot = () => $mode.get();

export default function BlogGraph({ posts }: Props) {
    useEffect(() => { ensureModeSync(); }, []);
    const mode = useSyncExternalStore(modeSubscribe, getModeSnapshot, getModeSnapshot);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

    // Zorgt ervoor dat het canvas altijd de breedte van de module volgt
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setDimensions({ width: entry.contentRect.width, height: 450 });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Genereer de knooppunten (nodes) en verbindingen (links) uit je blog data
    const graphData = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        const tags = new Set<string>();

        posts.forEach(post => {
            // De blogpost zelf is een grote node
            nodes.push({ id: post.slug, name: post.data.title, type: 'post', val: 6 });

            if (post.data.tags) {
                post.data.tags.forEach(tag => {
                    tags.add(tag);
                    // Creëer een zwaartekracht-link van post naar tag
                    links.push({ source: post.slug, target: tag });
                });
            }
        });

        // Maak een kleine node voor elke unieke tag
        tags.forEach(tag => {
            nodes.push({ id: tag, name: `#${tag}`, type: 'tag', val: 3 });
        });

        return { nodes, links };
    }, [posts]);

    const themeColors = {
        bg: 'transparent',
        post: mode === 'tech' ? '#8B5CF6' : '#F8FAFC', // Paars in Tech, Zilver/Wit in Human
        tag: '#38BDF8', // IJsblauw
        link: 'rgba(255,255,255,0.15)',
        text: '#94A3B8' // Slate
    };

    return (
        <section className="w-full pb-20">
            <div className="module overflow-hidden bg-[#05050A]/80 border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="module-header border-b border-white/10 bg-white/5 text-[#8B5CF6]">
                    <span>[ SYS://KNOWLEDGE/NEURAL_GRAPH ]</span>
                    <span className="text-white/40">{posts.length} POSTS // {graphData.nodes.length - posts.length} TAGS</span>
                </div>

                {/* Container voor de Force Graph */}
                <div ref={containerRef} className="w-full relative cursor-crosshair">
                    {/* We renderen de canvas pas als we in de browser zijn om SSR fouten te voorkomen */}
                    {typeof window !== 'undefined' && (
                        <ForceGraph2D
                            width={dimensions.width}
                            height={dimensions.height}
                            graphData={graphData}
                            backgroundColor={themeColors.bg}
                            linkColor={() => themeColors.link}
                            linkWidth={1}
                            nodeRelSize={1}
                            // Teken de knooppunten en de tekst (labels) op het canvas
                            nodeCanvasObject={(node: any, ctx, globalScale) => {
                                const label = node.name;
                                const fontSize = (node.type === 'post' ? 14 : 10) / Math.max(globalScale, 0.5);

                                ctx.font = `${fontSize}px ${mode === 'tech' ? 'monospace' : 'sans-serif'}`;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';

                                // Teken de cirkel (Node)
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
                                ctx.fillStyle = node.type === 'post' ? themeColors.post : themeColors.tag;
                                ctx.fill();

                                // Glow effect voor posts
                                if (node.type === 'post') {
                                    ctx.shadowColor = themeColors.post;
                                    ctx.shadowBlur = 10;
                                    ctx.fill();
                                    ctx.shadowBlur = 0; // Reset
                                }

                                // Teken de tekst eronder
                                ctx.fillStyle = themeColors.text;
                                ctx.fillText(label, node.x, node.y + node.val + (fontSize * 1.2));
                            }}
                            // Navigeer naar de blogpost als je op een grote node klikt
                            onNodeClick={(node: any) => {
                                if (node.type === 'post') {
                                    window.location.href = `/blog/${node.id}`;
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}