# arc

Lightweight, in-memory, optionally persistent, 100% JavaScript document database with no binary dependencies.

*This library is under active development and the API is likely to evolve as features are expanded, however it's unlikely that there will be any breaking changes.*

* [Installation](#installation)
* [API overview](#api-overview)
  * [Creating a collection](#creating-a-collection)
  * [Inserting](#inserting)
  * [Finding](#finding)
  * [Updating](#updating)
  * [Removing](#removing)
  * [Query options](#query-options)
    * [ifNull](#ifnull)
    * [ifEmpty](#ifempty)
    * [Sorting](#sorting)
    * [Skip & take (i.e. LIMIT)](#skip--take-ie-limit)
    * [Projection](#projection)
      * [Implicit exclusion](#implicit-exclusion)
      * [Implicit inclusion](#implicit-inclusion)
      * [Explicit](#explicit)
    * [Aggregation](#aggregation)
    * [Joining](#joining)
  * [Misc](#misc)
    * [Renaming builtin property names](#renaming-builtin-property-names)
    * [Documents](#documents)

# Installation

```bash
npm i @prsm/arc
```

# API overview

For a more thorough API reference, please look at the tests in this repository.

## Creating a collection

A collection is just a `.json` file when you're using the default `FilesystemAdapter`.

```typescript
import { Collection } from "@prsm/arc";

type Planet = {
  planet: string;
  diameter: number;
  population?: number;
  temp: {
    avg: number;
  };
};

// from `./.data` load or create `planets.json`
const collection = new Collection<Planet>(".data", "planets");
```

## Inserting

See [inserting tests](tests/specs/insert/basic.test.ts) for more examples.

```typescript
insert({ planet: "Mercury", diameter: 4_880, temp: { avg: 475 } });
insert([
  { planet: "Venus", diameter: 12_104, temp: { avg: 737_000 } },
  { planet: "Earth", diameter: 12_742, temp: { avg: 288 } },
]);
```

## Finding

See [finding tests](tests/specs/finding/basic.test.ts) for more examples.

```typescript
// finds Earth document
find({ avg: 288 }); // implicit deep searching
find({ planet: "Earth" });

// finds Venus and Earth documents
find({ diameter: { $gt: 12_000 } });

// finds Mercury and Earth documents
find({ temp: { avg: { $lt: 1_000 } } });

// finds Mercury and Earth documents
find({ $and: [{ avg: { $gt: 100 } }, { avg: { $lt: 10_000 } }] });

// etc.
find({ $not: { a: 1, b: 2 } });
find({ $and: [{ $not: { a: { $lte: 2 }}}, { $not: { a: { $gte: 5 }}}] });
find({ $xor: [{ a: { $includes: "ba" } }, { num: { $lt: 9 } }] });
find({ a: { $oneOf: [2, 3] } });
find({ a: { $length: 3 } }); // string length, array length
```

## Updating

Any queries that work with `Collection.find` will also work with `Collection.update`.

Updating documents involves applying various mutation operators to whichever documents match the provided query, i.e.: `update(query, mutations)`.

The following mutation operators are available, and should support most, if not all, use cases:

- [$set](tests/specs/operators/mutation/set.test.ts)

  ```typescript
  // given
  // { a: 1 }
  update({ a: 1 }, { $set: { a: 2 }}) // -> { a: 2 }
  update({ a: 1 }, { $set: { b: 2 }}) // -> { a: 1, b: 2 }
  update({ a: 1 }, { $set: { ...someObject }}) // -> { a: 1, ...someObject }
  ```

- [$unset](tests/specs/operators/mutation/unset.test.ts)

  ```typescript
  // given
  // { a: 1, b: { c: 2 } }
  update({ a: 1 }, { $unset: "b.c" }) // -> { a: 1 }
  update({ a: 1 }, { $unset: ["a", "b.c"] }) // -> {}
  // given
  // { a: 1, b: [{ c: 1, d: 1 }, { c: 2, d: 2 }] }
  update({ a: 1 }, { $unset: "b.*.c" }) // -> { a: 1, b: [{ d: 1 }, { d: 2 }] }
  ```

- [$change](tests/specs/operators/mutation/change.test.ts)

  `$set`, but refuses to create new properties.

  ```typescript
  // given
  // { a: 1 }
  update({ a: 1 }, { $change: { a: 2 }}) // -> { a: 2 }
  update({ a: 1 }, { $change: { b: 2 }}) // -> { a: 1 }, no property created
  ```

- [$push](tests/specs/operators/mutation/push.test.ts)

  Push will concat an item or items to an array. It refuses to create the target array if it does not exist.

  ```typescript
  // given
  // { a: 1, b: [1] }
  update({ a: 1 }, { $push: { b: 2 }}) // -> { a: 1, b: [1, 2] }
  update({ a: 1 }, { $push: { b: [2, 3] }}) // -> { a: 1, b: [1, 2, 3] }
  // given
  // { a: 1 }
  update({ a: 1 }, { $push: { b: 2 }}) // -> { a: 1 }, no property created
  // given
  // { a: 1, b: { c: [] } }
  update({ $has: "b.c" }, { $push: { "b.c": 1 }}) // -> { a: 1, b: { c: [1] } }
  ```

- [$merge](tests/specs/operators/mutation/merge.test.ts)

  Merge the provided object into the documents that match the query.

  ```typescript
  // given
  // { a: 1, b: { c: 5 }}
  update({ a: 1 }, { $merge: { a: 2, b: { d: 6 }}}) // -> { a: 2, b: { c: 5, d: 6 } }
  update({ c: 5 }, { $merge: { a: 2 }}) // -> { a: 1, b: { c: 5, a: 2 }}
  update({ c: 5 }, { $merge: { ...someObject }}) // -> { a: 1, b: { c: 5, ...someObject }}
  ```

- [$map](tests/specs/operators/mutation/map.test.ts)

  Effectively `Array.map` against only the documents that match the query.

  ```typescript
  // given
  // { a: 1 }
  // { a: 2 }
  update({ a: 1 }, { $map: (doc) => ({ ...doc, d: 1 }) }) // -> { a: 1, d: 1 }, { a: 2 }
  ```

- [$inc, $dec, $mult, $div](tests/specs/operators/mutation/math.test.ts)

  ```typescript
  // increase population, creating the property if it doesn't exist.
  update({ planet: "Earth" }, { $inc: { population: 1 } });
  ```

## Removing

See [remove tests](tests/specs/remove/basic.test.ts) for more examples.

Any queries that work with `.find` work with `.remove`.

```typescript
// remove every planet except Earth
remove({ $not: { planet: "Earth" } });
```

## Query options

`find`, `update` and `remove` accept a `QueryOptions` object.

```typescript
{
  /** When true, attempts to deeply match the query against documents. */
  deep: boolean;

  /** Provide fallback values for null or undefined properties */
  ifNull: Record<string, any>;

  /** Provide fallback values for 'empty' properties ([], {}, "") */
  ifEmpty: Record<string, any>;

  /** Provide fallback values for null, undefined, or 'empty' properties. */
  ifNullOrEmpty: Record<string, any>;

  /**
   * -1 || 0: descending
   *  1: ascending
   */
  sort: { [property: string]: -1 | 0 | 1 };

  /**
   * Particularly useful when sorting, `skip` defines the number of documents
   * to ignore from the beginning of the result set.
   */
  skip: number;

  /** Determines the number of documents returned. */
  take: number;

  /**
   * 1: property included in result document
   * 0: property excluded from result document
   */
  project: {
    [property: string]: 0 | 1;
  };

  aggregate: {
    [property: string]:
      Record<"$floor", string> |
      Record<"$ceil", string> |
      Record<"$sub", (string|number)[]> |
      Record<"$mult", (string|number)[]> |
      Record<"$div", (string|number)[]> |
      Record<"$add", (string|number)[]> |
      Record<"$fn", (document) => unknown>;
  };

  join: Array<{
    /** The collection to join on. */
    collection: Collection<any>;

    /** The property containing the foreign key(s). */
    from: string;

    /** The property on the joining collection that the foreign key should point to. */
    on: string;

    /** The name of the property to be created while will contain the joined documents. */
    as: string;

    /** QueryOptions that will be applied to the joined collection. */
    options?: QueryOptions;
  }>;
}
```

### ifNull

See [ifNull.test.ts](tests/specs/options/ifNull.test.ts) for more examples.

```typescript
// [
//   { a: 1, b: 2, c: 3 },
// ];

find({ a: 1 }, { ifNull: { d: 4 } });

// [
//   { a: 1, b: 2, c: 3, d: 4 },
// ];
```

### ifEmpty

See [ifEmpty.test.ts](tests/specs/options/ifEmpty.test.ts) for more examples.

```typescript
// [
//   { a: 1, b: 2, c: 3, d: "  " },
//   { a: 1, b: 2, c: 3, d: [] },
//   { a: 1, b: 2, c: 3, d: {} },
// ];

find({ a: 1 }, { ifEmpty: { d: 4 } });

// [
//   { a: 1, b: 2, c: 3, d: 4 },
//   { a: 1, b: 2, c: 3, d: 4 },
//   { a: 1, b: 2, c: 3, d: 4 },
// ];
```

### Sorting

See [sort.test.ts](tests/specs/options/sort.test.ts) for more examples.

```typescript
// [
//   { name: "Deanna Troi", age: 28 },
//   { name: "Worf", age: 24 },
//   { name: "Xorf", age: 24 },
//   { name: "Zorf", age: 24 },
//   { name: "Jean-Luc Picard", age: 59 },
//   { name: "William Riker", age: 29 },
// ];

find({ age: { $gt: 1 } }, { sort: { age: 1, name: -1 } });
//                                                  └─ asc    └─ desc

// [
//   { name: "Zorf", age: 24 },
//   { name: "Xorf", age: 24 },
//   { name: "Worf", age: 24 },
//   { name: "Deanna Troi", age: 28 },
//   { name: "William Riker", age: 29 },
//   { name: "Jean-Luc Picard", age: 59 },
// ];
```

### Skip & take (i.e. LIMIT)

See [skip_take.test.ts](tests/specs/options/skip_take.test.ts) for more examples.

Mostly useful when paired with `sort`.

```typescript
// [
//   { a: 1, b: 1, c: 1 },
//   { a: 2, b: 2, c: 2 },
//   { a: 3, b: 3, c: 3 },
// ];

find({ a: { $gt: 0 } }, { skip: 1, take: 1 });

// [
//   { a: 2, b: 2, c: 2 },
// ];
```

### Projection

See [project.test.ts](tests/specs/options/project.test.ts) for more examples.

The ID property of a document is always included unless explicitly excluded.

#### Implicit exclusion

When all projected properties have a value of `1`, this
is "implicit exclusion" mode.

In this mode, all document properties that are not defined
in the projection are excluded from the result document.

```typescript
// [
//   { a: 1, b: 1, c: 1 },
// ];

find({ a: 1 }, { project: { b: 1 } });

// [
//   { _id: .., b: 1 },
// ];
```

#### Implicit inclusion

When all projected properties have a value of `0`, this
is "implicit inclusion" mode.

In this mode, all document properties that are not defined
in the projection are included from the result document.

```typescript
// [
//   { a: 1, b: 1, c: 1 },
// ];

find({ a: 1 }, { project: { b: 0 } });

// [
//   { _id: .., a: 1, c: 1 },
// ];
```

#### Explicit

In the only remaining case, all document properties
are included unless explicitly removed with a `0`.

This is effectively the same behavior as implicit inclusion.

```typescript
// [
//   { a: 1, b: 1, c: 1 },
// ];

find({ a: 1 }, { project: { b: 1, c: 0 } });

// [
//   { _id: .., a: 1, b: 1 },
// ];
```

### Aggregation

See [project.test.ts](tests/specs/options/project.test.ts) for more examples.

You can use aggregation to create intermediate properties derived from other document properties, and then project those intermediate properties out of the result set.

```typescript
// [
//   { math: 72, english: 82, science: 92 },
//   { math: 60, english: 70, science: 80 },
//   { math: 90, english: 72, science: 84 }
// ]

find(
  {},
  {
    aggregate: {
      total: { $add: ["math", "english", "science"] },
      average: { $div: ["total", 3] },
    },
    project: {
      _id: 0,
      total: 0,
    },
  }
);

// [
//   { math: 72, english: 82, science: 92, average: 82 },
//   { math: 60, english: 70, science: 80, average: 70 },
//   { math: 90, english: 72, science: 84, average: 82 },
// ]
```

You can also use dot notation to reference deeply-nested properties, e.g.:

```typescript
find(
  {},
  aggregate: {
    // ...
    total: { $add: ["scores.math", "scores.english", "scores.science" ] },
    // ...
  }
);
```

Define arbitrary functions to be used as the aggregation handler:

```typescript
find(
  { $has: ["first", "last"] },
  {
    aggregate: {
      fullName: { $fn: (doc) => `${doc.first} ${doc.last}` },
    },
  }
);
```

### Joining

See [join.test.ts](tests/specs/options/join.test.ts) for more examples.

Joining allows you to join data from other collections.

```typescript
// "users" collection

// [
//   { name: "Alice", purchasedTicketIds: [1, 2] },
// ];

// "tickets" collection

// [
//   { _id: 0, seat: "A1" },
//   { _id: 1, seat: "B1" },
//   { _id: 2, seat: "C1" },
//   { _id: 3, seat: "D1" },
// ];

users.find(
  { name: "Alice" },
  {
    join: [
      {
        collection: tickets,
        from: "purchasedTicketIds",
        on: "_id",
        as: "tickets",
        options: {
          project: { _id: 0 },
        },
      },
    ],
  }
);

// [
//   {
//     name: "Alice",
//     purchasedTicketIds: [1, 2],
//     tickets: [
//       { seat: "B1" },
//       { seat: "C1" },
//     ],
//   },
// ];
```

You can also use dot notation when defining the `from` or `as` fields:

```typescript
// "inventory" collection

// {
//   name: "Bob",
//   items: [
//     { itemId: 3, quantity: 1 }, <-- we want to join on these `id` properties
//     { itemId: 5, quantity: 2 },
//   ],
// }

// "items" collection

// [
//   { _id: 3, name: "The Unstoppable Force", atk: 100 },
//   { _id: 4, name: "Sneakers", agi: 100 },
//   { _id: 5, name: "The Immovable Object", def: 100 },
// ]

users.find(
  { name: "Bob" },
  {
    join: [
      {
        collection: items,
        from: "items.*.itemId",
        on: "_id",
        as: "items.*.meta", // creates a new `meta` property for each item in `from`
        options: {
          project: { _id: 0, _created_at: 0, _updated_at: 0 },
        }
      },
    ],
  }
);

// [
//   {
//     name: "Bob",
//     items: [
//       { itemId: 3, quantity: 1, meta: { name: "The Unstoppable Force", atk: 100 } },
//       { itemId: 5, quantity: 2, meta: { name: "The Immovable Object", def: 100 } },
//     ],
//   }
// ]
```

`join` allows for `options` (type `QueryOptions`) which in turn allows for `join`.
Said another way, joins can be nested infinitely for more hierarchical relationships between collections.

```typescript
users.find(
  { .. },
  {
    join: [{
      collection: tickets,
      options: {
        join: [{
          collection: seats,
          options: {
            join: [{
              collection: auditoriums,
            }]
          }
        }]
      }
    }]
  }
);
```

## Misc

### Renaming builtin property names

The default property names for document ID (default `_id`), "created at"
(default `_created_at`) and "updated at" (default `_updated_at`) timestamps can all be changed.

```typescript
import { ID_KEY, CREATED_AT_KEY, UPDATED_AT_KEY } from "@prsm/arc";

ID_KEY = "id";
CREATED_AT_KEY = "createdAt";
UPDATED_AT_KEY = "updatedAt";
```

If you do this, make sure to do it at the beginning of collection creation.

### Documents

The returned value from `find`, `update` and `remove` is always an array, even when there
are no results.
