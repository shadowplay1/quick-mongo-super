import { EventEmitter } from 'events'
import { IDatabaseEvents } from '../interfaces/QuickMongo'

const emitter = new EventEmitter()

class Emitter {

    /**
     * Listens to the event.
     * @param {keyof IDatabaseEvents} event Event name.
     * @param {(...args: IDatabaseEvents[K][]) => void} listener Listener function.
     */
    public on<K extends keyof IDatabaseEvents>(event: K, listener: (...args: IDatabaseEvents[K][]) => void): this {
        emitter.on(event as any, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {keyof IDatabaseEvents} event Event name.
     * @param {(...args: IDatabaseEvents[K][]) => void} listener Listener function.
     */
    public once<K extends keyof IDatabaseEvents>(event: K, listener: (...args: IDatabaseEvents[K][]) => void): this {
        emitter.once(event as any, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {keyof IDatabaseEvents} event Event name.
     * @param {IDatabaseEvents[K][]} args Listener arguments.
     */
    public emit<K extends keyof IDatabaseEvents>(event: K, ...args: IDatabaseEvents[K][]): boolean {
        return emitter.emit(event as any, ...args)
    }
}

export = Emitter
