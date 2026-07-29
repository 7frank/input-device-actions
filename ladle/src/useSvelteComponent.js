import { useEffect, useRef } from "react";

export function useSvelteComponent(Component, props = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const instance = new Component({ target: ref.current, props });
    return () => instance.$destroy();
  }, []);

  return ref;
}
