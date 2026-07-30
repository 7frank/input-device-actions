import { useEffect, useRef } from "react";
import { mount, unmount, type Component } from "svelte";

export function useSvelteComponent(Component: Component, props: Record<string, unknown> = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const instance = mount(Component, { target: ref.current!, props });
    return () => { unmount(instance); };
  }, []);

  return ref;
}
