import { Server, Cpu, BrainCircuit, Network, Radio } from 'lucide-react';

export const NODE_DATA = {
    self: {
        id: 'self',
        label: '0.0.0.0 / SELF',
        subtitle: 'IDENTITY_ROOT',
        icon: Server,
        accentColor: '#22c55e',
        borderColor: '#22c55e',
        terminalMessage: 'Accessing NODE_0.0.0.0... Identity verified. Root access granted. System operator online.',
        content: {
            headline: 'ACCESS GRANTED: NODE_0.0.0.0 // IDENTITY_ROOT',
            body: `While the world obsesses over the latest shiny cloud tool, I guard the backbone. I manage the systems that *cannot* fail. Where others pioneer sandcastles in the 'Wild West' of the cloud, I build foundations of steel and mainframe logic.`,
            philosophy: [
                'Mainframes keep the world upright. The cloud is a playground; the mainframe is the engine room.',
                'AI is a scalpel, not a hammer. I believe in intelligence that fortifies systems, not soulless wrappers.',
                'Stop the AI-SaaS clutter. I build architecture that will stand in 10 years, not the trend of the week.',
            ],
            status: 'Online. Intelligence: Optimized. Bullshit: Filtered.',
        },
    },
    legacy: {
        id: 'legacy',
        label: 'LEGACY_CORE',
        subtitle: 'MAINFRAME_SYSTEMS',
        icon: Cpu,
        accentColor: '#a1a1aa',
        borderColor: '#a1a1aa',
        terminalMessage: 'Analyzing Legacy Core... Efficiency: 99.999%. Robustness: Absolute. Uptime: Infinite.',
        content: {
            headline: 'LEGACY_CORE // MAINFRAME & SYSTEMS',
            projects: [
                {
                    name: 'High-Velocity Transaction Integrity',
                    desc: 'Bridged Z-series logic with modern APIs. No downtime. Zero data loss. Millions of transactions per second flowing through steel and silicon.',
                    skills: ['z/OS', 'CICS', 'API Connect'],
                },
                {
                    name: 'The Hybrid-Cloud Lockdown',
                    desc: 'Hybrid infrastructure keeping the sensitive core behind mainframe iron, using cloud only as a pass-through. Security is not optional.',
                    skills: ['Network Security', 'RACF', 'Hybrid Cloud'],
                },
                {
                    name: 'Legacy Refactoring',
                    desc: "Transformed 90s spaghetti code into modular, AI-ready systems. No rewrite — surgical precision refactoring.",
                    skills: ['JCL', 'COBOL', 'Optimization'],
                },
            ],
        },
    },
    synaptic: {
        id: 'synaptic',
        label: 'SYNAPTIC_OVERLAY',
        subtitle: 'AI_INTELLIGENCE',
        icon: BrainCircuit,
        accentColor: '#3b82f6',
        borderColor: '#a855f7',
        terminalMessage: 'Synaptic Overload... System intelligence detected. Model does not hallucinate. Precision: Absolute.',
        content: {
            headline: 'SYNAPTIC_OVERLAY // AI × DEEP SYSTEMS',
            projects: [
                {
                    name: 'Predictive System Pulse',
                    desc: 'Neural networks trained on mainframe logs to predict hardware failures before they happen. Prevention, not reaction.',
                    skills: ['TensorFlow', 'Time Series', 'z/OS Logs'],
                },
                {
                    name: 'The Anti-SaaS Architect',
                    desc: 'On-premise, distributed LLMs. Sovereign AI for sovereign systems. No third-party API dependencies. Your data stays yours.',
                    skills: ['LLM Deployment', 'On-Premise', 'Privacy'],
                },
                {
                    name: 'Autonomous Traffic Routing',
                    desc: 'Reinforcement learning models that reroute packet flow in real-time based on latency, load, and threat vectors.',
                    skills: ['RL', 'Network Optimization', 'Real-time'],
                },
            ],
        },
    },
    packet: {
        id: 'packet',
        label: 'PACKET_TRAFFIC',
        subtitle: 'NETWORK_LAYER',
        icon: Network,
        accentColor: '#22c55e',
        borderColor: '#22c55e',
        terminalMessage: 'Scanning packet routes... Latency nominal. All ports monitored. DDoS shield: ACTIVE.',
        content: {
            headline: 'PACKET_TRAFFIC // NETWORK ARCHITECTURE',
            body: 'Moving data is easy. Guaranteeing its arrival under DDoS conditions is an art. I design network topologies that withstand everything from syn-floods to state-level intrusion attempts.',
            capabilities: [
                'Topology Design & Optimization',
                'Routing Protocol Architecture (BGP, OSPF, EIGRP)',
                'DDoS Mitigation & Threat Response',
                'Deep Packet Inspection & Traffic Analysis',
                'Zero Trust Network Architecture',
                'Software-Defined Networking (SDN)',
            ],
        },
    },
    contact: {
        id: 'contact',
        label: 'OPEN_PORT_80',
        subtitle: 'COMMUNICATION',
        icon: Radio,
        accentColor: '#a855f7',
        borderColor: '#a855f7',
        terminalMessage: 'Port 80 open... Listening for incoming connections. Authentication: Pending. Send your ping.',
        content: {
            headline: 'OPEN_PORT_80 // SEND A PING',
            type: 'contact',
        },
    },
};

export const initialNodes = [
    {
        id: 'self',
        type: 'custom',
        position: { x: 450, y: 300 },
        data: NODE_DATA.self,
    },
    {
        id: 'legacy',
        type: 'custom',
        position: { x: 50, y: 100 },
        data: NODE_DATA.legacy,
    },
    {
        id: 'synaptic',
        type: 'custom',
        position: { x: 850, y: 80 },
        data: NODE_DATA.synaptic,
    },
    {
        id: 'packet',
        type: 'custom',
        position: { x: 100, y: 520 },
        data: NODE_DATA.packet,
    },
    {
        id: 'contact',
        type: 'custom',
        position: { x: 800, y: 530 },
        data: NODE_DATA.contact,
    },
];

export const initialEdges = [
    { id: 'e-self-legacy', source: 'self', target: 'legacy', animated: true, style: { stroke: '#27272a', strokeWidth: 2 } },
    { id: 'e-self-synaptic', source: 'self', target: 'synaptic', animated: true, style: { stroke: '#27272a', strokeWidth: 2 } },
    { id: 'e-self-packet', source: 'self', target: 'packet', animated: true, style: { stroke: '#27272a', strokeWidth: 2 } },
    { id: 'e-self-contact', source: 'self', target: 'contact', animated: true, style: { stroke: '#27272a', strokeWidth: 2 } },
    { id: 'e-legacy-synaptic', source: 'legacy', target: 'synaptic', animated: true, style: { stroke: '#1a1a1e', strokeWidth: 1 } },
    { id: 'e-packet-legacy', source: 'packet', target: 'legacy', animated: true, style: { stroke: '#1a1a1e', strokeWidth: 1 } },
    { id: 'e-synaptic-contact', source: 'synaptic', target: 'contact', animated: true, style: { stroke: '#1a1a1e', strokeWidth: 1 } },
];
