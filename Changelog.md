### 2.0.0 => 3.0.0

**Build**
- Migrated from rollup to tsup + vite; separate ESM/CJS outputs for `core` and `ui`
- Full TypeScript rewrite of core (`index.ts`, `types.ts`, `listeners.ts`, `utils.ts`) and all adapter wrappers
- Svelte 5 compatibility

**Adapters**
- Extracted `mousetrap`, `humaninput`, and `keypress.js` wrappers into `src/adapters/` as separate tsup entry points (`dist/adapters/humaninput.mjs`, `dist/adapters/keypress.mjs`)
- Implemented `Hotkeys.registerInputType(type, factory)` — adapters can now be plugged in at runtime by importing and registering their factory function
- `ComboParam.type` field is now respected at bind/unbind time to dispatch to the correct adapter
- Core ships mousetrap as the default adapter; all other adapters are opt-in and tree-shakeable
- Added `./adapters/humaninput` and `./adapters/keypress` to package exports

**UI / Svelte components**
- Added CSS theming support: `dist/ui/themes/dark.css` and `dist/ui/themes/light.css`
- Improved `KeyBindingsEditor`, `KeyBindingsInputItem`, and `KeybindingsEditorDialog` components
- Added `DebugLog` component and `debugLog` utility, exported from `./ui`

**Stories (ladle)**
- Added React `useHotkeys` hook with fluent builder API and automatic cleanup
- Snake game story (scoped canvas hotkeys, rebindable keys, editor dialog)
- Asteroids game story
- Log story demonstrating `DebugLog`
- Scoped panels story
- Help overlay story
- Custom theming story
- Adapter comparison story demonstrating runtime adapter registration (mousetrap / HumanInput / keypress.js)

**API**
- `Hotkeys.register(action, combo, options)` — supports `string | ComboParam | (string | ComboParam)[]` for multi-adapter combos
- `Hotkeys.clearRegistered()` — clears non-persistent actions
- `Hotkeys.onChange` / `Hotkeys.onAction` event hooks
- `rebind`, `resetActionCombosToDefault`, `addComboForAction` utilities
- `persistent` flag on actions to survive `clearRegistered`

---

### 0.1.2 => 1.0.0

- hotkey-actions now are registered per target
- instead of Hotkeys(...all)
  - now Hotkeys.register() must be used to declare an action-combo binding explicitly before it can be used
  - Hotkeys(target).on(action_name,handler1,handler2)
  - Hotkeys(target).off(action_name,handler1,handler2)
    - are now the preferred way of binding actions

### 1.0.0 => 2.0.0

- migrating to rollup & svelte
  - provide separete builds for core & svelte components
