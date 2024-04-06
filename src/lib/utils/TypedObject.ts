import { TupleOrArray } from '../../types/utils'

export class TypedObject {
    public static keys<K extends TupleOrArray<string> = string[]>(obj: any): K {
        return Object.keys(obj || {}) as K
    }

    public static values<V>(obj: any): TupleOrArray<V> {
        return Object.values(obj || {}) as TupleOrArray<V>
    }
}
