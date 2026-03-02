import React, { useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from './store';
import { OscillatorNode, OutputNode, FilterNode, DelayNode } from './components/Nodes';
import { audioEngine } from './audioEngine';
import { Activity, Cpu, Zap, Settings, Play, Square, Layers, Save, FolderOpen, Database, Monitor, ShieldCheck, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const nodeTypes = {
  oscillator: OscillatorNode,
  output: OutputNode,
  filter: FilterNode,
  delay: DelayNode,
};

function EngineView() {
  const { cpuUsage, xruns, isRunning } = useStore();
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <HardDrive className="w-8 h-8 text-[#00FF00]" />
        <h2 className="text-2xl font-mono font-bold tracking-tighter">DSP_ENGINE_CORE</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#151619] border border-[#333] rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-mono text-[#8E9299] uppercase tracking-widest">Real-time Performance</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-2">
                <span>CPU LOAD</span>
                <span className={cpuUsage > 80 ? 'text-red-500' : 'text-[#00FF00]'}>{cpuUsage.toFixed(2)}%</span>
              </div>
              <div className="h-2 bg-[#0A0A0B] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#00FF00]" 
                  animate={{ width: `${cpuUsage}%` }}
                  transition={{ type: 'spring', bounce: 0 }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-[#8E9299]">XRUNS (BUFFER ERRORS)</span>
              <span className={`text-xl font-mono ${xruns > 0 ? 'text-red-500' : 'text-white'}`}>{xruns}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#151619] border border-[#333] rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-mono text-[#8E9299] uppercase tracking-widest">Audio Configuration</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#333] pb-2">
              <span className="text-[10px] font-mono text-[#8E9299]">SAMPLE RATE</span>
              <span className="text-sm font-mono">48000 Hz</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#333] pb-2">
              <span className="text-[10px] font-mono text-[#8E9299]">BUFFER SIZE</span>
              <span className="text-sm font-mono">128 samples</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#333] pb-2">
              <span className="text-[10px] font-mono text-[#8E9299]">DRIVER</span>
              <span className="text-sm font-mono text-[#00FF00]">WebAudio_v2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatchesView() {
  const { patches, loadPatch, savePatch, currentView } = useStore();
  const [newPatchName, setNewPatchName] = React.useState('');

  const handleSave = () => {
    if (newPatchName.trim()) {
      savePatch(newPatchName);
      setNewPatchName('');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Database className="w-8 h-8 text-[#00FF00]" />
          <h2 className="text-2xl font-mono font-bold tracking-tighter">PATCH_LIBRARY</h2>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="NEW_PATCH_NAME"
            value={newPatchName}
            onChange={(e) => setNewPatchName(e.target.value)}
            className="bg-[#0A0A0B] border border-[#333] rounded px-3 py-1 text-xs font-mono focus:border-[#00FF00] outline-none"
          />
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1 bg-[#00FF00] text-black rounded font-mono text-[10px] font-bold hover:bg-[#00CC00] transition-colors"
          >
            <Save className="w-3 h-3" /> SAVE_CURRENT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patches.map(patch => (
          <div key={patch.id} className="bg-[#151619] border border-[#333] rounded-lg p-4 hover:border-[#00FF00] transition-all group cursor-pointer" onClick={() => loadPatch(patch.id)}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-mono text-sm text-white">{patch.name}</h3>
              <FolderOpen className="w-4 h-4 text-[#8E9299] group-hover:text-[#00FF00]" />
            </div>
            <div className="space-y-1">
              <div className="text-[8px] font-mono text-[#8E9299]">NODES: {patch.nodes.length}</div>
              <div className="text-[8px] font-mono text-[#8E9299]">EDGES: {patch.edges.length}</div>
              <div className="text-[8px] font-mono text-[#8E9299]">CREATED: {new Date(patch.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemView() {
  const { systemSettings, updateSystemSettings } = useStore();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Settings className="w-8 h-8 text-[#00FF00]" />
        <h2 className="text-2xl font-mono font-bold tracking-tighter">SYSTEM_DIAGNOSTICS</h2>
      </div>

      <div className="bg-[#151619] border border-[#333] rounded-lg divide-y divide-[#333]">
        <div className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-mono text-white">AUTO_START_ENGINE</div>
            <div className="text-[10px] font-mono text-[#8E9299]">Automatically initialize audio context on boot.</div>
          </div>
          <button 
            onClick={() => updateSystemSettings({ autoStart: !systemSettings.autoStart })}
            className={`w-12 h-6 rounded-full relative transition-colors ${systemSettings.autoStart ? 'bg-[#00FF00]' : 'bg-[#333]'}`}
          >
            <motion.div 
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
              animate={{ x: systemSettings.autoStart ? 24 : 0 }}
            />
          </button>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-mono text-white">VISUAL_THEME</div>
            <div className="text-[10px] font-mono text-[#8E9299]">Select the interface aesthetic.</div>
          </div>
          <select 
            value={systemSettings.theme}
            onChange={(e) => updateSystemSettings({ theme: e.target.value as any })}
            className="bg-[#0A0A0B] border border-[#333] rounded px-3 py-1 text-xs font-mono text-[#00FF00] outline-none"
          >
            <option value="dark">DARK_MATTE</option>
            <option value="light">LIGHT_HIGH_CONTRAST</option>
            <option value="matrix">MATRIX_GREEN</option>
          </select>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-mono text-white">SECURITY_PROTOCOL</div>
            <div className="text-[10px] font-mono text-[#8E9299]">DSP sandboxing and memory protection.</div>
          </div>
          <div className="flex items-center gap-2 text-[#00FF00] text-[10px] font-mono">
            <ShieldCheck className="w-4 h-4" />
            ENCRYPTED_LOCKED
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalMonitor({ isRunning }: { isRunning: boolean }) {
  const [path, setPath] = React.useState("M 0 20 L 100 20");
  const requestRef = React.useRef<number>();

  const animate = useCallback(() => {
    if (isRunning) {
      const waveform = audioEngine.getWaveform() as Float32Array;
      if (waveform && waveform.length > 0) {
        let newPath = `M 0 ${20 + waveform[0] * 15}`;
        for (let i = 1; i < waveform.length; i++) {
          const x = (i / (waveform.length - 1)) * 100;
          const y = 20 + waveform[i] * 15;
          newPath += ` L ${x} ${y}`;
        }
        setPath(newPath);
      }
    } else {
      setPath("M 0 20 L 100 20");
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <div className="h-24 bg-black/50 rounded border border-[#333] relative overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path 
          d={path} 
          fill="none" 
          stroke="#00FF00" 
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] font-mono text-[#333] tracking-[0.2em]">SIGNAL_OFFLINE</span>
        </div>
      )}
    </div>
  );
}

function Flow() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    cpuUsage, 
    xruns, 
    isRunning, 
    setRunning,
    updateStats,
    addNode,
    currentView,
    setView
  } = useStore();

  // Initialize audio engine and stats loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        // Simulate real-time DSP stats
        const newCpu = Math.min(100, Math.max(0, cpuUsage + (Math.random() - 0.5) * 5));
        const newXruns = Math.random() > 0.98 ? xruns + 1 : xruns;
        updateStats(newCpu, newXruns);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, cpuUsage, xruns, updateStats]);

  const handleToggleAudio = async () => {
    if (!isRunning) {
      await audioEngine.start();
      setRunning(true);
    } else {
      audioEngine.stop();
      setRunning(false);
    }
  };

  const handleAddNode = (type: any) => {
    addNode(type, { x: Math.random() * 400, y: Math.random() * 400 });
  };

  return (
    <div className="w-full h-screen bg-[#0A0A0B] text-white overflow-hidden flex flex-col">
      {/* Header / Top Bar */}
      <header className="h-14 border-b border-[#1A1A1C] bg-[#0F0F11] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00FF00] rounded flex items-center justify-center">
              <Zap className="text-black w-5 h-5" />
            </div>
            <span className="font-mono font-bold tracking-tighter text-lg">HYPERVISOR_v1.0</span>
          </div>
          <div className="h-6 w-[1px] bg-[#1A1A1C]" />
          <nav className="flex gap-6">
            {(['ENGINE', 'ROUTING', 'PATCHES', 'SYSTEM'] as const).map(item => (
              <button 
                key={item} 
                onClick={() => setView(item)}
                className={`text-[10px] font-mono tracking-widest transition-colors ${currentView === item ? 'text-[#00FF00]' : 'text-[#8E9299] hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-[#8E9299]">CPU LOAD</span>
              <span className={`text-xs font-mono ${cpuUsage > 80 ? 'text-red-500' : 'text-[#00FF00]'}`}>
                {cpuUsage.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-[#8E9299]">XRUNS</span>
              <span className={`text-xs font-mono ${xruns > 0 ? 'text-red-500' : 'text-white'}`}>
                {xruns}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-[#8E9299]">LATENCY</span>
              <span className="text-xs font-mono text-white">2.4ms</span>
            </div>
          </div>
          
          <button 
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs transition-all
              ${isRunning 
                ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                : 'bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/50 hover:bg-[#00FF00]/20'}`}
          >
            {isRunning ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            {isRunning ? 'STOP ENGINE' : 'START ENGINE'}
          </button>
        </div>
      </header>

      <main className="flex-1 relative overflow-auto">
        <AnimatePresence mode="wait">
          {currentView === 'ROUTING' && (
            <motion.div 
              key="routing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-[#0A0A0B]"
                colorMode="dark"
              >
                <Background color="#1A1A1C" gap={20} />
                <Controls className="!bg-[#151619] !border-[#333] !fill-white" />
                
                <Panel position="top-left" className="m-4 space-y-4">
                  <div className="bg-[#151619]/80 backdrop-blur-md border border-[#333] rounded p-4 w-64 space-y-4 shadow-2xl">
                    <div className="flex items-center gap-2 text-[#00FF00]">
                      <Activity className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Signal Monitor</span>
                    </div>
                    <SignalMonitor isRunning={isRunning} />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/30 p-2 rounded border border-[#333]">
                        <div className="text-[7px] text-[#8E9299] uppercase">Sample Rate</div>
                        <div className="text-[10px] font-mono">48.0 kHz</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded border border-[#333]">
                        <div className="text-[7px] text-[#8E9299] uppercase">Buffer Size</div>
                        <div className="text-[10px] font-mono">128 spls</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#151619]/80 backdrop-blur-md border border-[#333] rounded p-4 w-64 shadow-2xl">
                    <div className="flex items-center gap-2 text-[#00FF00] mb-3">
                      <Layers className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Node Library</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <button onClick={() => handleAddNode('oscillator')} className="w-full py-2 bg-[#333] hover:bg-[#444] text-[10px] font-mono rounded border border-[#444] transition-colors flex items-center justify-center gap-2">
                        <Zap className="w-3 h-3" /> OSCILLATOR
                      </button>
                      <button onClick={() => handleAddNode('filter')} className="w-full py-2 bg-[#333] hover:bg-[#444] text-[10px] font-mono rounded border border-[#444] transition-colors flex items-center justify-center gap-2">
                        <Activity className="w-3 h-3" /> FILTER
                      </button>
                      <button onClick={() => handleAddNode('delay')} className="w-full py-2 bg-[#333] hover:bg-[#444] text-[10px] font-mono rounded border border-[#444] transition-colors flex items-center justify-center gap-2">
                        <Monitor className="w-3 h-3" /> DELAY
                      </button>
                    </div>
                  </div>
                </Panel>
              </ReactFlow>
            </motion.div>
          )}

          {currentView === 'ENGINE' && (
            <motion.div key="engine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <EngineView />
            </motion.div>
          )}

          {currentView === 'PATCHES' && (
            <motion.div key="patches" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PatchesView />
            </motion.div>
          )}

          {currentView === 'SYSTEM' && (
            <motion.div key="system" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <SystemView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Status Bar */}
      <footer className="h-8 border-t border-[#1A1A1C] bg-[#0F0F11] flex items-center justify-between px-4 text-[9px] font-mono text-[#8E9299]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#00FF00]' : 'bg-red-500'}`} />
            <span>{isRunning ? 'ENGINE_ACTIVE' : 'ENGINE_IDLE'}</span>
          </div>
          <span>|</span>
          <span>DETERMINISM: 99.998%</span>
        </div>
        <div className="flex items-center gap-4">
          <span>CLOCK: INTERNAL</span>
          <span>|</span>
          <span>SYNC: LOCKED</span>
          <span className="text-white">00:00:00:00</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
