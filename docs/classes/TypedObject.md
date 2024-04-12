# **`TypedObject` Class**

# Intro
Utility class for working with objects.

Provides **static** methods for retrieving keys and values of an object.

This class enhances type safety by providing better typings for object keys and values.


# References in this doc
- Types:
  - [`TupleOrArray<T>`](../types/TupleOrArray.md)


## Constructor
*none*

## Notice
This class includes static methods to work with objects. It's **not intended** to create instances from this class.

## Methods

## `static keys<K extends TupleOrArray<string> = string[]>(obj: any): K `
Returns the names of the enumerable string properties and methods of an object.

- **Type Parameters:**
  - `K` (`TupleOrArray<string>`, defaults to `string[]`): The type of the array containing the names of the enumerable string properties and methods.

- **Parameters:**
  - `obj` (`any`): Object that contains the properties and methods.

- **Returns:** `K` - Array of names of the enumerable string properties and methods of the specified object.


## `static values<V extends TupleOrArray<any> = any[]>(obj: any): V`
Returns an array of values of the enumerable properties of an object.

- **Type Parameters:**
  - `TObjectReturnValue` (`TupleOrArray<any>`, defaults to `any[]`): The type of the array containing the values of the enumerable properties.

- **Parameters:**
  - `obj` (`any`): Object that contains the properties and methods.

- **Returns:** `V` - Array of values of the enumerable properties of the specified object.
