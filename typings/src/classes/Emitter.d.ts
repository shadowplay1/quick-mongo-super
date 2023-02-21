import { IDatabaseEvents } from '../interfaces/QuickMongo';
declare class Emitter {
    /**
     * Listens to the event.
     * @param {keyof IDatabaseEvents} event Event name.
     * @param {(...args: IDatabaseEvents[K][]) => void} listener Listener function.
     */
    on<K extends keyof IDatabaseEvents>(event: K, listener: (...args: IDatabaseEvents[K][]) => void): this;
    /**
     * Listens to the event only for once.
     * @param {keyof IDatabaseEvents} event Event name.
     * @param {(...args: IDatabaseEvents[K][]) => void} listener Listener function.
     */
    once<K extends keyof IDatabaseEvents>(event: K, listener: (...args: IDatabaseEvents[K][]) => void): this;
    /**
     * Emits the event.
     * @param {keyof IDatabaseEvents} event Event name.
     * @param {IDatabaseEvents[K][]} args Listener arguments.
     */
    emit<K extends keyof IDatabaseEvents>(event: K, ...args: IDatabaseEvents[K][]): boolean;
}
export = Emitter;
