class Utils {

    /**
    * Checks for is the item object and returns it.
    * @param {any} item The item to check.
    * @returns {Boolean} Is the item object or not.
    */
    public isObject<K>(item: K): boolean {
        return !Array.isArray(item)
            && typeof item == 'object'
            && item !== null
    }
}

export = Utils