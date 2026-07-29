import { useEffect, useRef } from "react";
import { mount, unmount } from "svelte";

export function useSvelteComponent(Component, props = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const instance = mount(Component, { target: ref.current, props });
    return () => unmount(instance);
  }, []);

  return ref;
}
