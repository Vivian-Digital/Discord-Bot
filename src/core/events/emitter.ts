import { EventEmitter } from 'tseep';

export const AppEvents = new EventEmitter<{
    InstanceReady: () => void;
}>()
