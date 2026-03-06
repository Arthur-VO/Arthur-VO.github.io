import { Cpu, UserRound } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';
import { $mode, ensureModeSync, syncModeFromStorage, toggleMode } from '../stores/mode';

const modeSubscribe = (listener: () => void) => $mode.listen(() => listener());
const getModeSnapshot = () => $mode.get();

export default function ModeToggle() {
  const mode = useSyncExternalStore(modeSubscribe, getModeSnapshot, getModeSnapshot);
  const isTechMode = mode === 'tech';

  useEffect(() => {
    ensureModeSync();
    syncModeFromStorage();
  }, []);

  // Force document sync when mode changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.mode = mode;
    }
  }, [mode]);

  return (
    <button
      type="button"
      onClick={() => toggleMode()}
      aria-label="Toggle site mode"
      aria-pressed={isTechMode}
      className="relative inline-flex items-center rounded-md border px-1 py-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] active:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
      style={{ borderColor: 'var(--ui-border)' }}
    >
      {/* Toggle background */}
      <div 
        className="absolute inset-0 rounded-md transition-all duration-300 pointer-events-none"
        style={{
          backgroundColor: isTechMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(56, 189, 248, 0.1)',
        }}
      />
      
      {/* Human side */}
      <div
        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all duration-300 ${
          !isTechMode ? 'scale-110' : 'scale-100 opacity-70'
        }`}
        style={{
          transform: !isTechMode ? 'perspective(1000px) rotateY(0deg)' : 'perspective(1000px) rotateY(-180deg)',
          transformStyle: 'preserve-3d' as any,
        }}
      >
        <UserRound size={14} className="text-traces transition-all duration-300" aria-hidden="true" />
        <span className="text-xs tracking-[0.16em] text-text font-medium">HUMAN</span>
      </div>

      {/* Tech side */}
      <div
        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all duration-300 ${
          isTechMode ? 'scale-110' : 'scale-100 opacity-70'
        }`}
        style={{
          transform: isTechMode ? 'perspective(1000px) rotateY(0deg)' : 'perspective(1000px) rotateY(180deg)',
          transformStyle: 'preserve-3d' as any,
        }}
      >
        <span className="ascii-marker text-traces">[+]</span>
        <span className="text-xs tracking-[0.16em] text-text font-medium">TECH</span>
      </div>
    </button>
  );
}
