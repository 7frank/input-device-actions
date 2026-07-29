export interface ComboParam {
  type: string;
  combo: string | null;
  error?: string;
}

export interface ActionOptions {
  action: string;
  combo: ComboParam[];
  defaults: ComboParam[];
  category: string;
  selector: string | null;
  description: string;
  stopPropagation: boolean;
  preventDefault: boolean;
  error: string | false;
  title: string;
  elements: ActionOptions[];
  handler?: (e: Event) => void;
  extra?: (e: Event) => void;
  target?: EventTarget;
  el?: InputWrapper;
  "not-registered"?: boolean;
}

export interface EventEmitter {
  on(event: string, cb: (...args: unknown[]) => void): void;
  emit(event: string, ...args: unknown[]): void;
}

export interface JQueryLike {
  get(n: number): EventTarget;
}

export interface FocusableTarget extends HTMLElement {
  __hasFocusFixed?: boolean;
  __actions__?: Record<string, boolean>;
}

export interface HotkeysInstance {
  on(action: string, handler: (e: Event) => void, extra?: ((e: Event) => void) | null): HotkeysInstance;
  off(action: string, handler: (e: Event) => void, extra?: ((e: Event) => void) | null): HotkeysInstance;
}

export interface HumanInputInstance {
  on(event: string, handler: (e: Event) => void): void;
  off(event: string, handler?: (e: Event) => void): void;
  pause(): void;
  resume(): void;
}

export interface KeypressListener {
  register_combo(config: {
    keys: string;
    on_keydown: (e: Event) => void;
    on_keyup?: ((e: Event) => void) | undefined;
    prevent_default: boolean;
  }): void;
  unregister_combo(keys: string): void;
  stop_listening(): void;
  listen(): void;
}

export interface InputWrapper {
  _instance: unknown;
  bind(combo: string, handler: (e: Event) => void, handler2?: (e: Event) => void): void;
  unbind(combo: string): void;
  pause(): void;
  unpause(): void;
}
