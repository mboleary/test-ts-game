import { match } from "path-to-regexp";

export type UrlMatchesResult = {
  match: boolean;
  params: Record<string, string> | null;
};

export function urlMatches(path: string, url: string): UrlMatchesResult {
  const matchFunc = match("/ws/:id", { decode: decodeURIComponent });
  const matchResults = matchFunc(url);

  if (matchResults === false) {
    return {
      match: false,
      params: null
    };
  } else {
    return {
      match: true,
      params: matchResults.params as Record<string, string>
    }
  }
}

export function parseUrlQueryParams(url: string, host: string) {
  const urlObj = new URL(url, `ws://${host}`);
  const toRet: Record<string, string[]> = {};
  for (const key of urlObj.searchParams.keys()) {
    toRet[key] = urlObj.searchParams.getAll(key);
  }
  return toRet;
}
