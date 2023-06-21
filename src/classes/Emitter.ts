import { EventEmitter } from 'events'
const emitter = new EventEmitter()

export class Emitter<E extends object> {

    /**
     * Listens to the event.
     * @param {keyof E} event Event name.
     * @param {(...args: E[K][]) => void} listener Listener function.
     */
    public on<K extends keyof E>(event: K, listener: (...args: E[K][]) => void): this {
        emitter.on(event as string, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {keyof E} event Event name.
     * @param {(...args: E[K][]) => void} listener Listener function.
     */
    public once<K extends keyof E>(event: K, listener: (...args: E[K][]) => void): this {
        emitter.once(event as string, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {keyof E} event Event name.
     * @param {E[K][]} args Listener arguments.
     */
    public emit<K extends keyof E>(event: K, ...args: E[K][]): boolean {
        return emitter.emit(event as string, ...args)
    }
}
