# **`TypedObject` Class *(static)***

# Intro
Utility class for working with objects.

Provides **static** methods for retrieving keys and values of an object with addition of types.

This class enhances type safety by providing better typings for object keys and values.


# References in this doc
- Types:
  - [`ExtractObjectKeys<T>`](../types/ExtractObjectKeys.md)
  - [`ExtractObjectValues<T>`](../types/ExtractObjectValues.md)
  - [`ExtractObjectEntries<T>`](../types/ExtractObjectEntries.md)

## Constructor
*none*

## Notice
This class includes static methods to work with objects. It's **not intended** to create instances from this class.

## Methods

## `static keys<TObject extends Record<string, any>>(obj: TObject): ExtractObjectKeys<TObject>[]`
Returns the names of the enumerable string properties and methods of an object.

- **Type Parameters:**
  - `TObject` (`Record<string, any>`): The object to get the object keys types from.

- **Parameters:**
  - `obj` (`TObject`): Object to get the keys from.

- **Returns:** `ExtractObjectKeys<TObject>[]` - Array of names of the enumerable string properties and methods of the specified object.


## `static values<TObject extends Record<string, any>>(obj: TObject): ExtractObjectValues<TObject>[]`
Returns an array of values of the enumerable properties of an object.

- **Type Parameters:**
  - `TObject` (`Record<string, any>`): The object to get the object values types from.

- **Parameters:**
  - `obj` (`TObject`): Object to get the values from.

- **Returns:** `ExtractObjectValues<TObject>[]` - Array of values of the enumerable properties of the specified object.


## `static entries<TObject extends Record<string, any>>(obj: TObject): ExtractObjectEntries<TObject>[]`
Returns an array of entries (key-value pairs) of the enumerable properties of an object.

- **Type Parameters:**
  - `TObject` (`Record<string, any>`): The object to get the object entries types (key-value pairs types) from.

- **Parameters:**
  - `obj` (`TObject`): Object to get the entries from.

- **Returns:** `ExtractObjectEntries<TObject>[]` - Array of entries (key-value pairs) of the enumerable properties of the specified object.
