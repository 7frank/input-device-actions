import MutationSummary from "mutation-summary";

export function onElementChange(
  node: Node = window.document,
  elem: string,
  handler: (summaries: unknown[]) => void
): MutationSummary {
  return new MutationSummary({
    callback: handler,
    rootNode: node,
    queries: [{ element: elem }],
  });
}
