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