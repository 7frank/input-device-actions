import { createContext, useContext, useRef } from "react";

const HotkeysContext = createContext(null);

/**
 * Scopes all useHotkeys() calls inside to this div element.
 * The div automatically receives focus on hover so keyboard
 * events are captured when the user mouses over it.
 */
export function HotkeysScope({ children, style, className }) {
  const ref = useRef(null);
  return (
    <HotkeysContext.Provider value={ref}>
      <div
        ref={ref}
        style={style}
        className={className}
        tabIndex={-1}
        onMouseEnter={(e) => e.currentTarget.focus()}
        onMouseLeave={(e) => e.currentTarget.blur()}
      >
        {children}
      </div>
    </HotkeysContext.Provider>
  );
}

export function useHotkeysScope() {
  return useContext(HotkeysContext);
}
