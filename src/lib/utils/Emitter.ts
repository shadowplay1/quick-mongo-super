import { EventEmitter } from 'events'

export class Emitter<E extends Record<string, any>> {
    private _emitter = new EventEmitter()

    /**
     * Listens to the event.
     * @param {string} event Event name.
     * @param {Function} listener Listener function.
     */
    public on<K extends Exclude<keyof E, number>>(event: K, listener: (...args: E[K]) => any): Emitter<E> {
        this._emitter.on(event, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {string} event Event name.
     * @param {Function} listener Listener function.
     */
    public once<K extends Exclude<keyof E, number>>(event: K, listener: (...args: E[K]) => any): Emitter<E> {
        this._emitter.once(event, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {string} event Event name.
     * @param {any[]} args Listener arguments.
     * @returns {boolean} `true` if the event had listeners, `false` otherwise.
     */
    public emit<K extends Exclude<keyof E, number>>(event: K, ...args: E[K]): boolean {
        return this._emitter.emit(event, ...args as any[])
    }
}
