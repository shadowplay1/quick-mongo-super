export declare class Emitter<E extends object> {
    /**
     * Listens to the event.
     * @param {keyof E} event Event name.
     * @param {(...args: E[K][]) => void} listener Listener function.
     */
    on<K extends keyof E>(event: K, listener: (...args: E[K][]) => void): this;
    /**
     * Listens to the event only for once.
     * @param {keyof E} event Event name.
     * @param {(...args: E[K][]) => void} listener Listener function.
     */
    once<K extends keyof E>(event: K, listener: (...args: E[K][]) => void): this;
    /**
     * Emits the event.
     * @param {keyof E} event Event name.
     * @param {E[K][]} args Listener arguments.
     */
    emit<K extends keyof E>(event: K, ...args: E[K][]): boolean;
}
