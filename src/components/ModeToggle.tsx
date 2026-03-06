import { Cpu, UserRound } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';
import { $mode, ensureModeSync, toggleMode } from '../stores/mode';

const modeSubscribe = (listener: () => void) => $mode.listen(() => listener());
const getModeSnapshot = () => $mode.get();

export default function ModeToggle() {
  useEffect(() => {
    ensureModeSync();
  }, []);

  const mode = useSyncExternalStore(modeSubscribe, getModeSnapshot, getModeSnapshot);
  const isTechMode = mode === 'tech';

  return (
    <button
      type="button"
      onClick={() => toggleMode()}
      aria-label="Toggle site mode"
      aria-pressed={isTechMode}
      className="inline-flex items-center gap-3 rounded-md border px-3 py-1.5 text-xs tracking-[0.16em] text-text transition-colors duration-200 hover:border-traces"
      style={{ borderColor: 'var(--ui-border)' }}
    >
      {isTechMode ? (
        <>
          <span className="ascii-marker">[+]</span>
          <span>TECH</span>
          <span className="ascii-marker">|</span>
        </>
      ) : (
        <>
          <UserRound size={14} className="human-icon text-traces" aria-hidden="true" />
          <span>HUMAN</span>
          <Cpu size={14} className="human-icon text-traces" aria-hidden="true" />
        </>
      )}
    </button>
  );
}
