import { MongoDatabaseEvents } from '../interfaces/QuickMongo';
declare class Emitter {
    /**
     * Listens to the event.
     * @param {keyof MongoDatabaseEvents} event Event name.
     * @param {(...args: MongoDatabaseEvents[K][]) => void} listener Listener function.
     */
    on<K extends keyof MongoDatabaseEvents>(event: K, listener: (...args: MongoDatabaseEvents[K][]) => void): this;
    /**
     * Listens to the event only for once.
     * @param {keyof MongoDatabaseEvents} event Event name.
     * @param {(...args: MongoDatabaseEvents[K][]) => void} listener Listener function.
     */
    once<K extends keyof MongoDatabaseEvents>(event: K, listener: (...args: MongoDatabaseEvents[K][]) => void): this;
    /**
     * Emits the event.
     * @param {keyof MongoDatabaseEvents} event Event name.
     * @param {MongoDatabaseEvents[K][]} args Listener arguments.
     */
    emit<K extends keyof MongoDatabaseEvents>(event: K, ...args: MongoDatabaseEvents[K][]): boolean;
}
export = Emitter;
