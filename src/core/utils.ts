export function hasSecondHandler(o: { extra?: unknown }): boolean {
  return typeof o.extra === "function";
}
