|                                |
| :----------------------------: |
| <h1>keyboard-interactions</h1> |
| Action-based hotkey management with swappable input adapters |

## Overview

Bind keyboard (and other input) combos to named **actions**. Actions can be rebound at runtime via a built-in UI dialog. The library ships as three independent packages:

| Import | Contents |
|---|---|
| `@nk11/keyboard-interactions` | Core — action registry, mousetrap adapter |
| `@nk11/keyboard-interactions/ui` | Svelte components — `KeybindingsEditorDialog`, `KeyBindingsEditor`, `DebugLog` |
| `@nk11/keyboard-interactions/adapters/humaninput` | HumanInput adapter (gamepad, touch, speech, …) |
| `@nk11/keyboard-interactions/adapters/keypress` | Keypress.js adapter |

## Installation

```bash
npm install @nk11/keyboard-interactions
```

## Basic usage

```ts
import { Hotkeys } from "@nk11/keyboard-interactions";

// 1. Register actions (once, at app init)
Hotkeys.register("save", "ctrl+s", { title: "Save", description: "Save the document" });
Hotkeys.register("undo", "ctrl+z", { title: "Undo" });

// 2. Bind handlers (scoped to window by default, or any DOM element)
const hk = Hotkeys(window);

hk.on("save", (e) => save());
hk.on("undo", (e) => undo());

// 3. Unbind
hk.off("save", handler);
```

Scope hotkeys to a specific element:

```ts
const hk = Hotkeys(document.querySelector("#my-panel"));
hk.on("move-up", () => moveUp());
```

## Theming

```ts
import "@nk11/keyboard-interactions/ui/index.css";

// pick one:
import "@nk11/keyboard-interactions/ui/themes/dark.css";
import "@nk11/keyboard-interactions/ui/themes/light.css";
```

Or define your own CSS variables — see `src/gui/themes/dark.css` for the full list.

## Pluggable adapters

Core ships with [mousetrap](https://github.com/ccampbell/mousetrap) as the default keyboard adapter. To use an alternative, import the adapter and register it:

```ts
import { Hotkeys } from "@nk11/keyboard-interactions";
import { getHumanInputInstance } from "@nk11/keyboard-interactions/adapters/humaninput";
import { getKJSInstance } from "@nk11/keyboard-interactions/adapters/keypress";

Hotkeys.registerInputType("humaninput", getHumanInputInstance);
Hotkeys.registerInputType("keypress", getKJSInstance);

// then use the type in your combo params:
Hotkeys.register("jump", [{ type: "humaninput", combo: "space" }], { title: "Jump" });
```

Adapters not imported are never bundled — fully tree-shakeable.

## React helper

```ts
import { useHotkeys, HotkeysDef } from "./useHotkeys"; // see ladle/src/useHotkeys.ts

const keys = {
  pause: { keys: "p", title: "Pause" },
  restart: { keys: "r", title: "Restart" },
} satisfies HotkeysDef;

useHotkeys(keys, canvasRef)
  .on("pause",   () => togglePause())
  .on("restart", () => restart());
```

## API

### `Hotkeys.register(action, combo, options?)`

| Param | Type |
|---|---|
| `action` | `string` — unique action name |
| `combo` | `string \| ComboParam \| (string \| ComboParam)[]` |
| `options` | `Partial<ActionOptions>` — `title`, `description`, `category`, `preventDefault`, `stopPropagation`, `persistent` |

### `Hotkeys(target?)`

Returns a `HotkeysInstance` scoped to `target` (default: `window`).

- `.on(action, handler, extraHandler?)` — bind keydown (+ optional keyup)
- `.off(action, handler)` — unbind

### Static methods

| Method | Description |
|---|---|
| `Hotkeys.register(...)` | Declare an action |
| `Hotkeys.clearRegistered()` | Remove all non-persistent actions |
| `Hotkeys.registerInputType(type, factory)` | Plug in a custom adapter |
| `Hotkeys.getRegistered()` | Return all registered actions |
| `Hotkeys.onChange(handler)` | Subscribe to registry changes |
| `Hotkeys.onAction(handler)` | Subscribe to action triggers |

### Utilities

- `rebind(action, comboIndex, newCombo)` — remap a combo at runtime
- `resetActionCombosToDefault(action, comboIndex?)` — restore defaults
- `addComboForAction(action)` — append a new empty combo slot
- `getActionByName(action)` — look up a registered action

## Credits

- [mousetrap](https://github.com/ccampbell/mousetrap) — Craig Campbell
- [Keypress.js](https://github.com/dmauro/Keypress/) — David Mauro
- [HumanInput](https://github.com/liftoff/HumanInput) — Dan McDougall
