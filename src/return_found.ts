import { QueryOptions } from ".";
import dot from "dot-wild";
import { booleanOperators } from "./operators";
import {
  ensureArray,
  isEmptyObject,
  isObject,
  Ok,
  safeHasOwnProperty,
} from "./utils";

export function checkAgainstQuery(source: object, query: object): boolean {
  if (typeof source !== typeof query) return false;

  if (Array.isArray(source) && Array.isArray(query)) {
    // if any item in source OR query is either an object or an array, return
    // checkAgainstQuery(source, query) for each item in source and query
    if (
      source.some((item) => isObject(item) || Array.isArray(item)) ||
      query.some((item) => isObject(item) || Array.isArray(item))
    ) {
      return source.every((_, key) =>
        checkAgainstQuery(source[key], query[key])
      );
    }

    // otherwise stringify each item and compare equality
    return [...source].map((i) => `${i}`).sort().join(",") === [...query].map((i) => `${i}`).sort().join(",");
  }

  if (isObject(source) && isObject(query)) {
    return Ok(query).every((key) => {
      if (source[key] === query[key]) return true;

      if (typeof key === "string" && key.includes(".")) {
        return dot.get(source, key) === query[key];
      }

      let mods = [];

      // Operators are sometimes a toplevel key:
      // find({ $and: [{ a: 1 }, { b: 2 }] })
      if (key.startsWith("$")) mods.push(key);

      // Operators are sometimes a subkey:
      // find({ number: { $gt: 100 } })
      // $not is a special case: it calls `returnFound` so will handle subkey mods itself.
      if (key !== "$not" && (isObject(query[key]) && !isEmptyObject(query[key]))) {
        mods = mods.concat(Ok(query[key]).filter((k) => k.startsWith("$")));
      }

      if (mods.length) {
        return mods.every((mod) => {
          if (mod === "$not") {
            return !booleanOperators[mod](source, query);
          }
          return booleanOperators[mod](source, query);
        });
      }

      return (
        safeHasOwnProperty(source, key) &&
        checkAgainstQuery(source[key], query[key])
      );
    });
  }

  return source === query;
}

export function returnFound(
  source: any,
  query: any,
  options: QueryOptions,
  parentDocument: object = null
): any[] | undefined {
  if (source === undefined) return undefined;

  // don't bother with private map
  source["__private"] && delete source["__private"];

  if (safeHasOwnProperty(source, options.returnKey)) {
    parentDocument = source;
  }

  let result = undefined;

  // If the query included mods, then we defer to the result of those mods
  // to determine if we should return a document.
  const queryHasMods = Object.keys(query).some((key) => key.startsWith("$"));

  function appendResult(item: object) {
    if (!item || isEmptyObject(item)) return;

    result = ensureArray(result);
    item = ensureArray(item);

    // Ensure unique on returnKey
    if (Array.isArray(result) && Array.isArray(item)) {
      const resultIds = result.map((r) => r[options.returnKey]);
      if (item.some((i) => resultIds.includes(i[options.returnKey]))) return;
    }

    result = result.concat(item);
  }

  function processObject(item: object) {
    if (!item) return;

    if (safeHasOwnProperty(item, options.returnKey)) parentDocument = item;
    if (checkAgainstQuery(item, query)) {
      appendResult(parentDocument);
    } else {
      if (options.deep && !queryHasMods) {
        Ok(item).forEach((key) => {
          if (isObject(item[key]) || Array.isArray(item[key])) {
            appendResult(returnFound(item[key], query, options, parentDocument));
          }
        });
      }
    }
  }

  source = ensureArray(source);

  if (isObject(query) && Array.isArray(source) && !queryHasMods) {
    source.forEach((sourceObject, _index) => {
      if (safeHasOwnProperty(sourceObject, options.returnKey)) {
        parentDocument = sourceObject;
      }

      Ok(query).forEach((key) => {
        if (isObject(sourceObject)) {
          if (checkAgainstQuery(source[_index], query[key])) {
            appendResult(parentDocument);
          }
        } else if (checkAgainstQuery(source, query[key])) {
          appendResult(parentDocument);
        }
      });
    });
  }

  if (!isEmptyObject(query) && Array.isArray(source)) {
    source.forEach((item) => processObject(item));
  } else {
    return source;
  }

  return result;
}
