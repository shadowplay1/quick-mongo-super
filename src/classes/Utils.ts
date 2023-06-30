export class Utils {

    /**
     * Checks for is the item object and returns it.
     * @param {T} item The item to check.
     * @returns {boolean} Is the item object or not.
     */
    public isObject<T>(item: T): boolean {
        return !Array.isArray(item)
            && typeof item == 'object'
            && item !== null
    }
}
