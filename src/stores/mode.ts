import { atom } from 'nanostores';

export type Mode = 'human' | 'tech';

const STORAGE_KEY = 'site-mode';
const DEFAULT_MODE: Mode = 'human';

let hasModeSync = false;

export const $mode = atom<Mode>(DEFAULT_MODE);

export const toggleMode = () => {
  $mode.set($mode.get() === 'human' ? 'tech' : 'human');
};

const isMode = (value: string | null): value is Mode => value === 'human' || value === 'tech';

const applyModeToDocument = (mode: Mode) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.mode = mode;
};

export const ensureModeSync = () => {
  if (hasModeSync || typeof window === 'undefined') {
    return;
  }

  hasModeSync = true;

  try {
    const savedMode = window.localStorage.getItem(STORAGE_KEY);

    if (isMode(savedMode)) {
      $mode.set(savedMode);
    }
  } catch {
    $mode.set(DEFAULT_MODE);
  }

  applyModeToDocument($mode.get());

  $mode.listen((mode) => {
    applyModeToDocument(mode);

    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  });
};