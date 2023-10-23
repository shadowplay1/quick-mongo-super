import { EventEmitter } from 'events'
const emitter = new EventEmitter()

export class Emitter<E extends Record<string, any>> {

    /**
     * Listens to the event.
     * @param {string} event Event name.
     * @param {Function} listener Listener function.
     */
    public on<K extends Exclude<keyof E, number>>(event: K, listener: (...args: E[K]) => any): Emitter<E> {
        emitter.on(event, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {string} event Event name.
     * @param {Function} listener Listener function.
     */
    public once<K extends Exclude<keyof E, number>>(event: K, listener: (...args: E[K]) => any): Emitter<E> {
        emitter.once(event, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {string} event Event name.
     * @param {any[]} args Listener arguments.
     * @returns {boolean} `true` if the event had listeners, `false` otherwise.
     */
    public emit<K extends Exclude<keyof E, number>>(event: K, ...args: E[K]): boolean {
        return emitter.emit(event, ...args as any[])
    }
}
