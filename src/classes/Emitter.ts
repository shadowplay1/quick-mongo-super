import { EventEmitter } from 'events'
import { DatabaseEvents } from '../interfaces/QuickMongo'

const emitter = new EventEmitter()

class Emitter {

    /**
     * Listens to the event.
     * @param {keyof DatabaseEvents} event Event name.
     * @param {(...args: DatabaseEvents[K][]) => void} listener Listener function.
     */
    on<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K][]) => void): this {
        emitter.on(event, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {keyof DatabaseEvents} event Event name.
     * @param {(...args: DatabaseEvents[K][]) => void} listener Listener function.
     */
    once<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K][]) => void): this {
        emitter.once(event, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {keyof DatabaseEvents} event Event name.
     * @param {DatabaseEvents[K][]} args Listener arguments.
     */
    emit<K extends keyof DatabaseEvents>(event: K, ...args: DatabaseEvents[K][]): boolean {
        return emitter.emit(event, ...args)
    }
}

export = Emitter