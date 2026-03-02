import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStore } from '../store';
import { motion } from 'motion/react';

export const OscillatorNode = ({ data, id }: { data: any, id: string }) => {
  const updateNodeData = useStore(state => state.updateNodeData);
  const onNodesChange = useStore(state => state.onNodesChange);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { frequency: parseFloat(e.target.value) });
  };

  const handleTypeChange = (type: string) => {
    updateNodeData(id, { type });
  };

  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  return (
    <div className="metallic-frame rounded-xl p-0.5 min-w-[220px] shadow-2xl transition-all group hover:scale-[1.02]">
      <div className="glass-front rounded-[10px] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#38BDF8]">OSCILLATOR</span>
            <span className="text-[7px] font-mono text-slate-500">VCO-CORE-01</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all text-[9px] font-bold"
            >
              DISCARD
            </button>
            <div className={`w-2 h-2 rounded-full ${data.active ? 'bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]' : 'bg-slate-700'}`} />
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[9px] font-bold text-slate-400 tracking-wider">FREQUENCY</label>
              <span className="text-[11px] font-mono text-sky-400 font-bold">{data.frequency ?? 440}Hz</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="2000" 
              step="1"
              value={data.frequency ?? 440} 
              onChange={handleFrequencyChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {['sine', 'square', 'sawtooth'].map(type => (
              <button 
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`h-7 rounded-md border flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all
                  ${data.type === type 
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.2)]' 
                    : 'border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/5'}`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-sky-400 !border-2 !border-[#0F172A]"
      />
    </div>
  );
};

export const FilterNode = ({ data, id }: { data: any, id: string }) => {
  const updateNodeData = useStore(state => state.updateNodeData);
  const onNodesChange = useStore(state => state.onNodesChange);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { frequency: parseFloat(e.target.value) });
  };

  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  return (
    <div className="metallic-frame rounded-xl p-0.5 min-w-[220px] shadow-2xl transition-all group hover:scale-[1.02]">
      <div className="glass-front rounded-[10px] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400">FILTER</span>
            <span className="text-[7px] font-mono text-slate-500">VCF-ANALOG-X</span>
          </div>
          <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all text-[9px] font-bold">DISCARD</button>
        </div>
        <div className="space-y-5">
          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[9px] font-bold text-slate-400 tracking-wider">CUTOFF</label>
              <span className="text-[11px] font-mono text-teal-400 font-bold">{data.frequency ?? 1000}Hz</span>
            </div>
            <input type="range" min="20" max="10000" step="1" value={data.frequency ?? 1000} onChange={handleFrequencyChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400" />
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-teal-400 !border-2 !border-[#0F172A]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-teal-400 !border-2 !border-[#0F172A]" />
    </div>
  );
};

export const DelayNode = ({ data, id }: { data: any, id: string }) => {
  const updateNodeData = useStore(state => state.updateNodeData);
  const onNodesChange = useStore(state => state.onNodesChange);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { feedback: parseFloat(e.target.value) });
  };

  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  return (
    <div className="metallic-frame rounded-xl p-0.5 min-w-[220px] shadow-2xl transition-all group hover:scale-[1.02]">
      <div className="glass-front rounded-[10px] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">DELAY</span>
            <span className="text-[7px] font-mono text-slate-500">FX-ECHO-SPACE</span>
          </div>
          <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all text-[9px] font-bold">DISCARD</button>
        </div>
        <div className="space-y-5">
          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[9px] font-bold text-slate-400 tracking-wider">FEEDBACK</label>
              <span className="text-[11px] font-mono text-indigo-400 font-bold">{((data.feedback ?? 0.5) * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="0.95" step="0.01" value={data.feedback ?? 0.5} onChange={handleFeedbackChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-[#0F172A]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-[#0F172A]" />
    </div>
  );
};

export const NeuralSaturatorNode = ({ data, id }: { data: any, id: string }) => {
  const onNodesChange = useStore(state => state.onNodesChange);
  const handleDelete = () => onNodesChange([{ id, type: 'remove' }]);

  return (
    <div className="metallic-frame rounded-xl p-0.5 min-w-[260px] shadow-2xl transition-all group hover:scale-[1.02]">
      <div className="glass-front rounded-[10px] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Neural Saturator</span>
            <span className="text-[7px] font-mono text-slate-500">MODEL-X-TUBE</span>
          </div>
          <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all text-[9px] font-bold">DISCARD</button>
        </div>
        
        <div className="space-y-4">
          <div className="h-24 bg-black/40 rounded-lg border border-white/5 relative overflow-hidden flex items-end gap-0.5 p-1">
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i}
                className="flex-1 bg-gradient-to-t from-purple-600 via-pink-500 to-amber-400 rounded-t-sm"
                animate={{ height: [`${20 + Math.random() * 60}%`, `${10 + Math.random() * 80}%`, `${20 + Math.random() * 60}%`] }}
                transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Drive</span>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-2/3" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Bias</span>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#0F172A]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#0F172A]" />
    </div>
  );
};

export const ReverbNode = ({ data, id }: { data: any, id: string }) => {
  const onNodesChange = useStore(state => state.onNodesChange);
  const handleDelete = () => onNodesChange([{ id, type: 'remove' }]);

  return (
    <div className="metallic-frame rounded-xl p-0.5 min-w-[260px] shadow-2xl transition-all group hover:scale-[1.02]">
      <div className="glass-front rounded-[10px] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">WGPU Reverb</span>
            <span className="text-[7px] font-mono text-slate-500">SPATIAL-ENGINE-01</span>
          </div>
          <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all text-[9px] font-bold">DISCARD</button>
        </div>
        
        <div className="space-y-4">
          <div className="h-24 bg-black/40 rounded-lg border border-white/5 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <motion.path 
                d="M 0 40 Q 20 10 40 30 T 80 20 T 100 35 L 100 40 L 0 40"
                fill="url(#reverb-grad)"
                animate={{ d: [
                  "M 0 40 Q 20 10 40 30 T 80 20 T 100 35 L 100 40 L 0 40",
                  "M 0 40 Q 20 15 40 25 T 80 15 T 100 30 L 100 40 L 0 40",
                  "M 0 40 Q 20 10 40 30 T 80 20 T 100 35 L 100 40 L 0 40"
                ]}}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="reverb-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                  <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col items-center">
              <span className="text-[6px] font-bold text-slate-500 uppercase mb-1">Decay</span>
              <div className="w-6 h-6 rounded-full border border-white/10 bg-black/20 flex items-center justify-center">
                <div className="w-1 h-3 bg-sky-400 rounded-full rotate-45" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[6px] font-bold text-slate-500 uppercase mb-1">Size</span>
              <div className="w-6 h-6 rounded-full border border-white/10 bg-black/20 flex items-center justify-center">
                <div className="w-1 h-3 bg-sky-400 rounded-full -rotate-12" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[6px] font-bold text-slate-500 uppercase mb-1">Mix</span>
              <div className="w-6 h-6 rounded-full border border-white/10 bg-black/20 flex items-center justify-center">
                <div className="w-1 h-3 bg-sky-400 rounded-full rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-sky-400 !border-2 !border-[#0F172A]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-sky-400 !border-2 !border-[#0F172A]" />
    </div>
  );
};

export const OutputNode = ({ data, id }: { data: any, id: string }) => {
  const onNodesChange = useStore(state => state.onNodesChange);

  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  return (
    <div className="metallic-frame rounded-xl p-0.5 min-w-[200px] shadow-2xl group">
      <div className="glass-front rounded-[10px] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">MASTER OUT</span>
            <span className="text-[7px] font-mono text-slate-500">FINAL-STAGE-01</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all text-[9px] font-bold"
            >
              DISCARD
            </button>
            <div className="flex gap-1">
              <div className="w-1.5 h-5 bg-slate-800 rounded-full relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" style={{ height: '60%' }} />
              </div>
              <div className="w-1.5 h-5 bg-slate-800 rounded-full relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" style={{ height: '45%' }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-bold text-slate-400 tracking-wider">OUTPUT LEVEL</span>
            <span className="text-xs font-mono text-sky-400 font-bold">-12.4dB</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-amber-400 w-[70%]" />
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-sky-400 !border-2 !border-[#0F172A]"
      />
    </div>
  );
};
