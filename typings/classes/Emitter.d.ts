import { DatabaseEvents } from '../interfaces/QuickMongo';
declare class Emitter {
    /**
     * Listens to the event.
     * @param {keyof DatabaseEvents} event Event name.
     * @param {(...args: DatabaseEvents[K][]) => void} listener Listener function.
     */
    on<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K][]) => void): this;
    /**
     * Listens to the event only for once.
     * @param {keyof DatabaseEvents} event Event name.
     * @param {(...args: DatabaseEvents[K][]) => void} listener Listener function.
     */
    once<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K][]) => void): this;
    /**
     * Emits the event.
     * @param {keyof DatabaseEvents} event Event name.
     * @param {DatabaseEvents[K][]} args Listener arguments.
     */
    emit<K extends keyof DatabaseEvents>(event: K, ...args: DatabaseEvents[K][]): boolean;
}
export = Emitter;
