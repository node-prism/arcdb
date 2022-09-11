import { QueryOptions } from ".";
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
    return source.every((_, key) => checkAgainstQuery(source[key], query[key]));
  }

  if (isObject(source) && isObject(query)) {
    return Ok(query).every((key) => {
      if (source[key] === query[key]) return true;

      const mods = [];

      // Operators are sometimes a toplevel key:
      // find({ $and: [{ a: 1 }, { b: 2 }] })
      if (key.startsWith("$")) mods.push(key);

      // Operators are sometimes a subkey:
      // find({ number: { $gt: 100 } })
      if (isObject(query[key]) && !isEmptyObject(query[key])) {
        Ok(query[key]).forEach((k) => {
          if (k.startsWith("$")) {
            mods.push(k);
          }
        });
      }

      if (mods.length) {
        let allmatch = true;

        mods.forEach((mod) => {
          const res = booleanOperators[mod](source, query);
          if (Array.isArray(res) && !res.length) allmatch = false;
          else if (!res) allmatch = false;
        });

        return allmatch;
      }

      return (
        safeHasOwnProperty(source, key) &&
        checkAgainstQuery(source[key], query[key])
      );
    });
  }

  if (Array.isArray(source) && isObject(query)) {
    return source.some((s) => checkAgainstQuery(s, query));
  }

  return false;
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

  function appendResult(item: object) {
    if (!item || isEmptyObject(item)) return;

    result = ensureArray(result);

    // ensure unique on returnKey
    if (Array.isArray(result)) {
      if (result.some((r) => r[options.returnKey] === item[options.returnKey])) return;
    }

    result = result.concat(item);
  }

  function processObject(item: object) {
    if (!item) return;

    if (safeHasOwnProperty(item, options.returnKey)) parentDocument = item;
    if (checkAgainstQuery(item, query)) appendResult(parentDocument);

    if (options.deep) {
      Ok(item).forEach((key) => {
        if (isObject(item[key]) || Array.isArray(item[key])) {
          appendResult(
            returnFound(item[key], query, options, parentDocument)
          );
        }
      });
    }
  }

  source = ensureArray(source);

  if (!isEmptyObject(query) && Array.isArray(source)) {
    source.forEach((item) => processObject(item));
  } else {
    return source;
  }

  return result;
}
