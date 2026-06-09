import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const searchParamsParsers = {
  q: parseAsString.withDefault(""),
  tab: parseAsString.withDefault("main"),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);