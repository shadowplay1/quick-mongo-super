import { EventEmitter } from 'events'
import MongoDatabaseEvents from '../interfaces/MongoDatabaseEvents'

const emitter = new EventEmitter()

class Emitter {
    constructor() { }

    /**
     * Listens to the event.
     * @param {keyof MongoDatabaseEvents} event Event name.
     * @param {(...args: MongoDatabaseEvents[K][]) => void} listener Listener function.
     */
    on<K extends keyof MongoDatabaseEvents>(event: K, listener: (...args: MongoDatabaseEvents[K][]) => void): this {
        emitter.on(event, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {keyof MongoDatabaseEvents} event Event name.
     * @param {(...args: MongoDatabaseEvents[K][]) => void} listener Listener function.
     */
    once<K extends keyof MongoDatabaseEvents>(event: K, listener: (...args: MongoDatabaseEvents[K][]) => void): this {
        emitter.once(event, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {keyof MongoDatabaseEvents} event Event name.
     * @param {MongoDatabaseEvents[K][]} args Listener arguments.
     */
    emit<K extends keyof MongoDatabaseEvents>(event: K, ...args: MongoDatabaseEvents[K][]): boolean {
        return emitter.emit(event, ...args)
    }
}

export = Emitter