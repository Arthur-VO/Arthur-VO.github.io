import { atom } from 'nanostores';

export type Mode = 'human' | 'tech';

const STORAGE_KEY = 'site-mode';
const DEFAULT_MODE: Mode = 'human';

let hasModeSync = false;

const isMode = (value: string | null): value is Mode => value === 'human' || value === 'tech';

const getInitialMode = (): Mode => {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isMode(saved)) return saved;
    } catch {}
  }
  return DEFAULT_MODE;
};

export const $mode = atom<Mode>(getInitialMode());

export const toggleMode = () => {
  $mode.set($mode.get() === 'human' ? 'tech' : 'human');
};

const applyModeToDocument = (mode: Mode) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.mode = mode;
};

export const syncModeFromStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const savedMode = window.localStorage.getItem(STORAGE_KEY);
    if (isMode(savedMode)) {
      $mode.set(savedMode);
      applyModeToDocument(savedMode);
    } else {
      applyModeToDocument(DEFAULT_MODE);
    }
  } catch {
    applyModeToDocument(DEFAULT_MODE);
  }
};

export const ensureModeSync = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const savedMode = window.localStorage.getItem(STORAGE_KEY);

    if (isMode(savedMode)) {
      $mode.set(savedMode);
    }
  } catch {
    $mode.set(DEFAULT_MODE);
  }

  applyModeToDocument($mode.get());

  if (!hasModeSync) {
    hasModeSync = true;
    $mode.listen((mode) => {
      applyModeToDocument(mode);

      try {
        window.localStorage.setItem(STORAGE_KEY, mode);
      } catch {}
    });
  }
};