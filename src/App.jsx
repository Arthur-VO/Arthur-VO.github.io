import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AppProvider } from './context/AppContext';
import CustomNode from './components/CustomNode';
import DetailPanel from './components/DetailPanel';
import TerminalWidget from './components/TerminalWidget';
import { initialNodes, initialEdges } from './data/nodes';

function FlowCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="grid-bg"
      >
        <Background
          variant="dots"
          gap={40}
          size={1}
          color="#27272a"
        />
        <Controls
          showInteractive={false}
          position="bottom-left"
        />
        <MiniMap
          nodeColor={() => '#27272a'}
          maskColor="rgba(0, 0, 0, 0.7)"
          position="top-right"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="w-full h-screen bg-[#09090b] overflow-hidden">
        <FlowCanvas />
        <DetailPanel />
        <TerminalWidget />
      </div>
    </AppProvider>
  );
}
