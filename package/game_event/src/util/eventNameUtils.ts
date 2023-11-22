/**
 * contains GameEvent type name helpers
 */

export function match(eventTypeName: string, eventListenerName: string) {
  const eventTypeNameArray = eventTypeName.split(".");
  const eventListenerNameArray = eventListenerName.split(".");

  for (
    let i = 0;
    i < eventTypeNameArray.length && i < eventListenerNameArray.length;
    i++
  ) {
    if (eventTypeNameArray[i] === eventListenerNameArray[i]) {
      continue;
    } else if (eventListenerNameArray[i] === "*") {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

export function getAllHandlers<T>(
  eventTypeName: string,
  listenerMap: Map<string, T[]>,
): T[] {
  const eventTypeNameArray = eventTypeName.split(".");
  const handlersToReturn: T[] = [];

  const curr = [];
  for (const str of eventTypeNameArray) {
    curr.push(str);
    const lstr = curr.join(".");
    if (listenerMap.has(lstr)) {
      handlersToReturn.push(...(listenerMap.get(lstr) as T[]));
    } else if (listenerMap.has(lstr + ".*")) {
      handlersToReturn.push(...(listenerMap.get(lstr + ".*") as T[]));
    }
  }

  return handlersToReturn;
}
