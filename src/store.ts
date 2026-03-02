import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { audioEngine } from './audioEngine';

export type View = 'ENGINE' | 'ROUTING' | 'PATCHES' | 'SYSTEM';

export interface DSPNodeData {
  [key: string]: unknown;
  label: string;
  type?: string;
  frequency?: number;
  cutoff?: number;
  feedback?: number;
  active?: boolean;
}

export type DSPNode = Node<DSPNodeData>;

export interface Patch {
  id: string;
  name: string;
  nodes: DSPNode[];
  edges: Edge[];
  createdAt: number;
}

export interface SystemSettings {
  sampleRate: number;
  bufferSize: number;
  theme: 'dark' | 'light' | 'matrix';
  autoStart: boolean;
}

interface DSPState {
  nodes: DSPNode[];
  edges: Edge[];
  cpuUsage: number;
  xruns: number;
  isRunning: boolean;
  currentView: View;
  patches: Patch[];
  systemSettings: SystemSettings;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: Partial<DSPNodeData>) => void;
  setRunning: (running: boolean) => void;
  updateStats: (cpu: number, xruns: number) => void;
  addNode: (type: 'oscillator' | 'output' | 'filter' | 'delay', position: { x: number, y: number }) => void;
  setView: (view: View) => void;
  savePatch: (name: string) => void;
  loadPatch: (patchId: string) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
}

export const useStore = create<DSPState>((set, get) => ({
  nodes: [
    {
      id: 'osc-1',
      type: 'oscillator',
      data: { label: 'OSC 1', type: 'sine', frequency: 440, active: true },
      position: { x: 100, y: 100 },
    },
    {
      id: 'out-1',
      type: 'output',
      data: { label: 'MASTER OUT', type: 'output', active: true },
      position: { x: 500, y: 200 },
    },
  ],
  edges: [],
  cpuUsage: 0,
  xruns: 0,
  isRunning: false,
  currentView: 'ROUTING',
  patches: [
    {
      id: 'p1',
      name: 'Init Sine',
      nodes: [
        { id: 'osc-1', type: 'oscillator', data: { label: 'OSC 1', type: 'sine', frequency: 440, active: true }, position: { x: 100, y: 100 } },
        { id: 'out-1', type: 'output', data: { label: 'MASTER OUT', type: 'output', active: true }, position: { x: 500, y: 200 } }
      ],
      edges: [],
      createdAt: Date.now()
    }
  ],
  systemSettings: {
    sampleRate: 48000,
    bufferSize: 128,
    theme: 'dark',
    autoStart: false
  },
  onNodesChange: (changes) => {
    const currentNodes = get().nodes;
    const nextNodes = applyNodeChanges(changes, currentNodes as any) as unknown as DSPNode[];
    
    changes.forEach(change => {
      if (change.type === 'remove') {
        audioEngine.removeNode(change.id);
      }
    });

    set({ nodes: nextNodes });
  },
  onEdgesChange: (changes) => {
    const currentEdges = get().edges;
    const nextEdges = applyEdgeChanges(changes, currentEdges);

    changes.forEach(change => {
      if (change.type === 'remove') {
        const edge = currentEdges.find(e => e.id === change.id);
        if (edge) {
          audioEngine.disconnect(edge.source, edge.target);
        }
      }
    });

    set({ edges: nextEdges });
  },
  onConnect: (connection) => {
    const newEdge: Edge = { 
      ...connection, 
      id: `e-${connection.source}-${connection.target}`, 
      animated: true, 
      style: { stroke: '#00ff00' } 
    } as Edge;
    set({
      edges: addEdge(newEdge, get().edges),
    });
    audioEngine.connect(connection.source!, connection.target!);
  },
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          const nextData = { ...node.data, ...data };
          audioEngine.updateNode(nodeId, nextData);
          return { ...node, data: nextData };
        }
        return node;
      }),
    });
  },
  setRunning: (running) => {
    if (running) {
      const state = get();
      state.nodes.forEach(node => {
        audioEngine.createNode(node.id, node.type!, node.data);
      });
      state.edges.forEach(edge => {
        audioEngine.connect(edge.source, edge.target);
      });
    }
    set({ isRunning: running });
  },
  updateStats: (cpu, xruns) => set({ cpuUsage: cpu, xruns }),
  addNode: (type, position) => {
    const id = `${type}-${Date.now()}`;
    const newNode: DSPNode = {
      id,
      type,
      position,
      data: { 
        label: type.toUpperCase(), 
        type: type === 'oscillator' ? 'sine' : type,
        frequency: type === 'oscillator' ? 440 : undefined,
        active: true 
      },
    };
    
    if (get().isRunning) {
      audioEngine.createNode(id, type, newNode.data);
    }

    set({ nodes: [...get().nodes, newNode] });
  },
  setView: (view) => set({ currentView: view }),
  savePatch: (name) => {
    const newPatch: Patch = {
      id: `patch-${Date.now()}`,
      name,
      nodes: get().nodes,
      edges: get().edges,
      createdAt: Date.now()
    };
    set({ patches: [...get().patches, newPatch] });
  },
  loadPatch: (patchId) => {
    const patch = get().patches.find(p => p.id === patchId);
    if (patch) {
      // Stop engine before loading
      const wasRunning = get().isRunning;
      if (wasRunning) {
        audioEngine.stop();
        set({ isRunning: false });
      }

      // Clear current audio engine nodes
      get().nodes.forEach(n => audioEngine.removeNode(n.id));

      set({ nodes: patch.nodes, edges: patch.edges });

      // Restart if it was running
      if (wasRunning) {
        patch.nodes.forEach(node => {
          audioEngine.createNode(node.id, node.type!, node.data);
        });
        patch.edges.forEach(edge => {
          audioEngine.connect(edge.source, edge.target);
        });
        set({ isRunning: true });
      }
    }
  },
  updateSystemSettings: (settings) => set({ systemSettings: { ...get().systemSettings, ...settings } }),
}));
