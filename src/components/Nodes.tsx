import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStore } from '../store';

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
    <div className="bg-[#151619] border border-[#333] rounded-lg p-4 min-w-[200px] shadow-2xl hover:border-[#444] transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9299]">OSCILLATOR</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 text-[#8E9299] hover:text-red-500 transition-all text-[10px]"
          >
            DELETE
          </button>
          <div className={`w-2 h-2 rounded-full ${data.active ? 'bg-[#00FF00] shadow-[0_0_8px_#00FF00]' : 'bg-red-500'}`} />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[9px] font-mono text-[#8E9299]">FREQUENCY</label>
            <span className="text-[10px] font-mono text-white">{data.frequency ?? 440}Hz</span>
          </div>
          <input 
            type="range" 
            min="20" 
            max="2000" 
            step="1"
            value={data.frequency ?? 440} 
            onChange={handleFrequencyChange}
            className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#00FF00]"
          />
        </div>
        
        <div className="h-[1px] bg-[#333]" />
        
        <div className="grid grid-cols-3 gap-1">
          {['sine', 'square', 'sawtooth'].map(type => (
            <button 
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`h-6 border flex items-center justify-center text-[8px] font-mono cursor-pointer transition-colors
                ${data.type === type ? 'bg-[#00FF00] text-black border-[#00FF00]' : 'border-[#333] text-[#8E9299] hover:border-[#555]'}`}
            >
              {type.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-[#00FF00] border-2 border-[#151619]"
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
    <div className="bg-[#151619] border border-[#333] rounded-lg p-4 min-w-[200px] shadow-2xl hover:border-[#444] transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9299]">FILTER</span>
        <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-[#8E9299] hover:text-red-500 transition-all text-[10px]">DELETE</button>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[9px] font-mono text-[#8E9299]">CUTOFF</label>
            <span className="text-[10px] font-mono text-white">{data.frequency ?? 1000}Hz</span>
          </div>
          <input type="range" min="20" max="10000" step="1" value={data.frequency ?? 1000} onChange={handleFrequencyChange} className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#00FF00]" />
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#00FF00] border-2 border-[#151619]" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#00FF00] border-2 border-[#151619]" />
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
    <div className="bg-[#151619] border border-[#333] rounded-lg p-4 min-w-[200px] shadow-2xl hover:border-[#444] transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9299]">DELAY</span>
        <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-[#8E9299] hover:text-red-500 transition-all text-[10px]">DELETE</button>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[9px] font-mono text-[#8E9299]">FEEDBACK</label>
            <span className="text-[10px] font-mono text-white">{((data.feedback ?? 0.5) * 100).toFixed(0)}%</span>
          </div>
          <input type="range" min="0" max="0.95" step="0.01" value={data.feedback ?? 0.5} onChange={handleFeedbackChange} className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#00FF00]" />
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#00FF00] border-2 border-[#151619]" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#00FF00] border-2 border-[#151619]" />
    </div>
  );
};

export const OutputNode = ({ data, id }: { data: any, id: string }) => {
  const onNodesChange = useStore(state => state.onNodesChange);

  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  return (
    <div className="bg-[#151619] border border-[#333] rounded-lg p-4 min-w-[180px] shadow-2xl group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9299]">MASTER OUT</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 text-[#8E9299] hover:text-red-500 transition-all text-[10px]"
          >
            DELETE
          </button>
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-[#333] relative overflow-hidden">
              <div className="absolute bottom-0 w-full bg-[#00FF00]" style={{ height: '60%' }} />
            </div>
            <div className="w-1 h-4 bg-[#333] relative overflow-hidden">
              <div className="absolute bottom-0 w-full bg-[#00FF00]" style={{ height: '45%' }} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[9px] font-mono text-[#8E9299]">LEVEL</span>
          <span className="text-xs font-mono text-white">-12.4dB</span>
        </div>
        <div className="h-1 bg-[#333] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00FF00] to-yellow-400 w-[70%]" />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-[#00FF00] border-2 border-[#151619]"
      />
    </div>
  );
};
