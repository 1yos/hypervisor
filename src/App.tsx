import React, { useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from './store';
import { OscillatorNode, OutputNode, FilterNode, DelayNode, NeuralSaturatorNode, ReverbNode } from './components/Nodes';
import { audioEngine } from './audioEngine';
import { Activity, Cpu, Zap, Settings, Play, Square, Layers, Save, FolderOpen, Database, Monitor, ShieldCheck, HardDrive, Sparkles, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          strokeWidth: 4, 
          stroke: 'rgba(56, 189, 248, 0.2)',
        }} 
      />
      <motion.path
        d={edgePath}
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth={2}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <circle r="2.5" fill="#06B6D4" className="shadow-[0_0_8px_#06B6D4]">
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="2" fill="#3B82F6" className="shadow-[0_0_8px_#3B82F6]">
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} begin="1.25s" />
      </circle>
      <defs>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </>
  );
}

const nodeTypes = {
  oscillator: OscillatorNode,
  output: OutputNode,
  filter: FilterNode,
  delay: DelayNode,
  neuralSaturator: NeuralSaturatorNode,
  reverb: ReverbNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

function EngineView() {
  const { cpuUsage, xruns, isRunning } = useStore();
  
  return (
    <div className="p-12 max-w-5xl mx-auto space-y-12">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-12 h-12 rounded-2xl metallic-frame flex items-center justify-center shadow-xl shadow-sky-500/10">
          <HardDrive className="w-7 h-7 text-sky-400" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Engine Core</h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Kernel v2.4.0-STABLE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="metallic-frame rounded-3xl p-0.5 shadow-2xl">
          <div className="glass-front rounded-[22px] p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-sky-400" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Real-time Performance</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-3 tracking-wider">
                  <span className="text-slate-500 uppercase">CPU LOAD</span>
                  <span className={cpuUsage > 80 ? 'text-rose-400' : 'text-sky-400'}>{cpuUsage.toFixed(2)}%</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-sky-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.4)]" 
                    animate={{ width: `${cpuUsage}%` }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">XRUNS</div>
                  <span className={`text-2xl font-mono font-bold ${xruns > 0 ? 'text-rose-400' : 'text-slate-200'}`}>{xruns}</span>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Stability</div>
                  <span className="text-2xl font-mono font-bold text-teal-400">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="metallic-frame rounded-3xl p-0.5 shadow-2xl">
          <div className="glass-front rounded-[22px] p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Memory Arena Map</h3>
            </div>
            
            <div className="grid grid-cols-8 gap-1">
              {[...Array(32)].map((_, i) => (
                <motion.div 
                  key={i}
                  className={`aspect-square rounded-sm border border-white/5 ${i < 12 ? 'bg-sky-500/40' : i < 20 ? 'bg-teal-500/20' : 'bg-slate-800/40'}`}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: i * 0.1 }}
                />
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-[8px] text-slate-500 font-bold uppercase">Alloc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-[8px] text-slate-500 font-bold uppercase">Cache</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">1.2 GB / 4.0 GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatchesView() {
  const { patches, loadPatch, savePatch } = useStore();
  const [newPatchName, setNewPatchName] = React.useState('');

  const handleSave = () => {
    if (newPatchName.trim()) {
      savePatch(newPatchName);
      setNewPatchName('');
    }
  };

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl metallic-frame flex items-center justify-center shadow-xl shadow-sky-500/10">
            <Database className="w-7 h-7 text-sky-400" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">Patch Library</h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Persistent Storage</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="NEW_PATCH_IDENTIFIER"
            value={newPatchName}
            onChange={(e) => setNewPatchName(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-sky-400 focus:border-sky-500/50 outline-none w-64 shadow-inner"
          />
          <button 
            onClick={handleSave}
            className="flex items-center gap-3 px-6 py-2 bg-sky-500 text-slate-950 rounded-xl font-bold text-[10px] tracking-widest hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
          >
            <Save className="w-4 h-4" /> COMMIT_STATE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {patches.map(patch => (
          <motion.div 
            key={patch.id} 
            whileHover={{ y: -4 }}
            className="metallic-frame rounded-2xl p-0.5 cursor-pointer group shadow-xl" 
            onClick={() => loadPatch(patch.id)}
          >
            <div className="glass-front rounded-[14px] p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h3 className="font-bold text-sm text-slate-100 tracking-tight">{patch.name}</h3>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">ID: {patch.id.slice(0, 8)}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <FolderOpen className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nodes</div>
                  <div className="text-xs font-mono font-bold text-sky-400">{patch.nodes.length}</div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mb-1">Edges</div>
                  <div className="text-xs font-mono font-bold text-teal-400">{patch.edges.length}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Last Modified</span>
                <span className="text-[8px] font-mono text-slate-500">{new Date(patch.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SystemView() {
  const { systemSettings, updateSystemSettings } = useStore();

  return (
    <div className="p-12 max-w-4xl mx-auto space-y-12">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-12 h-12 rounded-2xl metallic-frame flex items-center justify-center shadow-xl shadow-sky-500/10">
          <Settings className="w-7 h-7 text-sky-400" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">System Diagnostics</h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Hardware Abstraction Layer</span>
        </div>
      </div>

      <div className="metallic-frame rounded-3xl p-0.5 shadow-2xl">
        <div className="glass-front rounded-[22px] divide-y divide-white/5">
          <div className="p-8 flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-100 tracking-tight">AUTO_START_ENGINE</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Initialize audio context on boot.</div>
            </div>
            <button 
              onClick={() => updateSystemSettings({ autoStart: !systemSettings.autoStart })}
              className={`w-14 h-7 rounded-full relative transition-all shadow-inner ${systemSettings.autoStart ? 'bg-sky-500/20 border border-sky-500/50' : 'bg-slate-900 border border-white/5'}`}
            >
              <motion.div 
                className={`absolute top-1 left-1 w-5 h-5 rounded-full shadow-lg ${systemSettings.autoStart ? 'bg-sky-400' : 'bg-slate-700'}`}
                animate={{ x: systemSettings.autoStart ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="p-8 flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-100 tracking-tight">VISUAL_THEME</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interface aesthetic profile.</div>
            </div>
            <select 
              value={systemSettings.theme}
              onChange={(e) => updateSystemSettings({ theme: e.target.value as any })}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-sky-400 outline-none focus:border-sky-500/50 shadow-inner tracking-widest"
            >
              <option value="dark">TWILIGHT_BRUSHED</option>
              <option value="light">HIGH_CONTRAST</option>
              <option value="matrix">NEURAL_GRID</option>
            </select>
          </div>

          <div className="p-8 flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-100 tracking-tight">SECURITY_PROTOCOL</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DSP sandboxing and memory protection.</div>
            </div>
            <div className="flex items-center gap-3 bg-teal-500/10 border border-teal-500/30 px-4 py-2 rounded-xl text-teal-400 text-[10px] font-bold tracking-widest shadow-lg shadow-teal-500/5">
              <ShieldCheck className="w-4 h-4" />
              ENCRYPTED_LOCKED
            </div>
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
    <div className="w-full h-screen text-slate-200 overflow-hidden flex flex-col relative font-sans">
      <div className="twilight-bg" />
      
      {/* Header / Top Bar */}
      <header className="h-16 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl metallic-frame flex items-center justify-center shadow-lg shadow-sky-500/10">
              <Zap className="text-sky-400 w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.3em] text-sky-500/80 uppercase">DSP Hypervisor</span>
              <div className="bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent font-bold text-sm tracking-tight">
                DEEP STATE SYNTH
              </div>
            </div>
          </div>
          
          <div className="h-8 w-[1px] bg-white/5" />
          
          <div className="metallic-frame px-4 py-1.5 rounded-lg shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Project: </span>
            <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-widest">Nebula</span>
          </div>

          <nav className="flex gap-8 ml-4">
            {(['ENGINE', 'ROUTING', 'PATCHES', 'SYSTEM'] as const).map(item => (
              <button 
                key={item} 
                onClick={() => setView(item)}
                className={`text-[10px] font-bold tracking-[0.2em] transition-all relative py-1 ${currentView === item ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {item}
                {currentView === item && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-slate-500 tracking-wider">CPU LOAD</span>
              <span className={`text-xs font-mono font-bold ${cpuUsage > 80 ? 'text-rose-400' : 'text-sky-400'}`}>
                {cpuUsage.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-slate-500 tracking-wider">XRUNS</span>
              <span className={`text-xs font-mono font-bold ${xruns > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                {xruns}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-[10px] tracking-widest transition-all shadow-lg
              ${isRunning 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 shadow-rose-500/5' 
                : 'bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 shadow-sky-500/5'}`}
          >
            {isRunning ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            {isRunning ? 'HALT CORE' : 'ENGAGE CORE'}
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
                edgeTypes={edgeTypes}
                fitView
                className="bg-transparent"
                colorMode="dark"
                defaultEdgeOptions={{
                  type: 'custom',
                }}
              >
                <Background color="rgba(56, 189, 248, 0.05)" gap={24} size={1} />
                <Controls className="!bg-[#151619] !border-[#333] !fill-white" />
                
                <Panel position="top-left" className="m-6 space-y-6">
                  <div className="metallic-frame rounded-2xl p-0.5 w-72 shadow-2xl">
                    <div className="glass-front rounded-[14px] p-5 space-y-5">
                      <div className="flex items-center gap-2 text-sky-400">
                        <Activity className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Signal Monitor</span>
                      </div>
                      <SignalMonitor isRunning={isRunning} />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-1">Rate</div>
                          <div className="text-[11px] font-mono font-bold text-slate-300">48.0 kHz</div>
                        </div>
                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-1">Buffer</div>
                          <div className="text-[11px] font-mono font-bold text-slate-300">128 spls</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="metallic-frame rounded-2xl p-0.5 w-72 shadow-2xl">
                    <div className="glass-front rounded-[14px] p-5">
                      <div className="flex items-center gap-2 text-sky-400 mb-5">
                        <Layers className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Node Library</span>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Synths</div>
                          <div className="grid grid-cols-1 gap-2">
                            <button onClick={() => handleAddNode('oscillator')} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-xl border border-white/5 transition-all flex items-center px-4 gap-3 group">
                              <Zap className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" /> 
                              <span className="tracking-widest">OSCILLATOR</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Effects</div>
                          <div className="grid grid-cols-1 gap-2">
                            <button onClick={() => handleAddNode('filter')} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-xl border border-white/5 transition-all flex items-center px-4 gap-3 group">
                              <Activity className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" /> 
                              <span className="tracking-widest">ANALOG FILTER</span>
                            </button>
                            <button onClick={() => handleAddNode('delay')} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-xl border border-white/5 transition-all flex items-center px-4 gap-3 group">
                              <Monitor className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" /> 
                              <span className="tracking-widest">SPACE DELAY</span>
                            </button>
                            <button onClick={() => handleAddNode('reverb')} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-xl border border-white/5 transition-all flex items-center px-4 gap-3 group">
                              <Waves className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" /> 
                              <span className="tracking-widest">WGPU REVERB</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Neural Models</div>
                          <div className="grid grid-cols-1 gap-2">
                            <button onClick={() => handleAddNode('neuralSaturator')} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-xl border border-white/5 transition-all flex items-center px-4 gap-3 group">
                              <Cpu className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" /> 
                              <span className="tracking-widest">NEURAL SATURATOR</span>
                            </button>
                          </div>
                        </div>
                      </div>
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
      <footer className="h-10 border-t border-white/5 bg-slate-950/60 backdrop-blur-xl flex items-center justify-between px-6 text-[10px] font-bold text-slate-500 tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'bg-rose-500'}`} />
            <span className={isRunning ? 'text-sky-400' : 'text-rose-500'}>{isRunning ? 'CORE_ACTIVE' : 'CORE_IDLE'}</span>
          </div>
          <div className="h-4 w-[1px] bg-white/5" />
          <div className="flex items-center gap-2">
            <span className="text-slate-600">CREATIVE FLOW:</span>
            <span className="text-teal-400">STEADY</span>
          </div>
          <div className="h-4 w-[1px] bg-white/5" />
          <div className="flex items-center gap-2">
            <span className="text-slate-600">NEURAL HARMONY:</span>
            <span className="text-indigo-400">94%</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">DETERMINISM:</span>
            <span className="text-slate-300">99.998%</span>
          </div>
          <div className="h-4 w-[1px] bg-white/5" />
          <div className="flex items-center gap-2">
            <span className="text-slate-600">CLOCK:</span>
            <span className="text-slate-300">INTERNAL</span>
          </div>
          <div className="h-4 w-[1px] bg-white/5" />
          <span className="text-slate-200 font-mono">00:00:00:00</span>
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
