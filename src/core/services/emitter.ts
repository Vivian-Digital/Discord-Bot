import { EventEmitter } from 'tseep';

/* TypeSafe Node EventEmitter */
export const AppEvents = new EventEmitter<{
    onReady: () => Promise<void>,
    onDBReady: () => Promise<void>,
    fetchActiveChannels: () => void,
    onSession: () => void,
    Ready: () => void
}>()
