import { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

function CustomNode({ data }) {
    const { handleNodeHover, handleNodeLeave, handleNodeClick, hoveredNode } = useApp();
    const IconComponent = data.icon;
    const isHovered = hoveredNode === data.id;

    const onMouseEnter = useCallback(() => handleNodeHover(data.id), [data.id, handleNodeHover]);
    const onMouseLeave = useCallback(() => handleNodeLeave(), [handleNodeLeave]);
    const onClick = useCallback(() => handleNodeClick(data.id), [data.id, handleNodeClick]);

    return (
        <>
            <Handle type="target" position={Position.Top} className="!bg-zinc-700 !border-zinc-600 !w-2 !h-2" />
            <Handle type="target" position={Position.Left} className="!bg-zinc-700 !border-zinc-600 !w-2 !h-2" />

            <motion.div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative cursor-pointer select-none"
                style={{
                    background: '#0a0a0c',
                    border: `1px solid ${isHovered ? data.borderColor : '#27272a'}`,
                    padding: '16px 20px',
                    minWidth: '200px',
                    boxShadow: isHovered
                        ? `0 0 20px ${data.accentColor}33, 0 0 60px ${data.accentColor}11, inset 0 0 20px ${data.accentColor}08`
                        : '0 0 0 transparent',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
            >
                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                    }}
                />

                {/* Top accent bar */}
                <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${data.accentColor}, transparent)`,
                        opacity: isHovered ? 1 : 0.3,
                        transition: 'opacity 0.3s ease',
                    }}
                />

                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="p-1.5 border"
                        style={{
                            borderColor: data.accentColor + '44',
                            color: data.accentColor,
                        }}
                    >
                        <IconComponent size={16} />
                    </div>
                    <div>
                        <div className="text-xs font-semibold tracking-wider text-slate-50">
                            {data.label}
                        </div>
                        <div className="text-[10px] tracking-widest" style={{ color: data.accentColor + 'aa' }}>
                            {data.subtitle}
                        </div>
                    </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1.5 mt-2">
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            backgroundColor: data.accentColor,
                            boxShadow: `0 0 4px ${data.accentColor}`,
                            animation: 'blink 2s ease-in-out infinite',
                        }}
                    />
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
                        {data.id === 'self' ? 'root_access' : 'node_active'}
                    </span>
                </div>
            </motion.div>

            <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !border-zinc-600 !w-2 !h-2" />
            <Handle type="source" position={Position.Right} className="!bg-zinc-700 !border-zinc-600 !w-2 !h-2" />
        </>
    );
}

export default memo(CustomNode);
