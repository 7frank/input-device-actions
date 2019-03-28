



| |
| :---: |
| <h1>keyboard-interactions</h1> |
| Wrapper around keyboard inputs  |
| [![Build Status][ci-image]][ci-url] [![Project License][license-image]][license-url] |
| [![Grade Badge][codacy-grade-image]][codacy-grade-url] [![Coverage Badge][coverage-image]][coverage-url]   |
| [![Dependencies][dep-status-image]][dep-status-url] [![Dev Dependencies][devdep-status-image]][devdep-status-url] |


# Project Overview

This library contains a simple wrapper for *different* input methods. By introducing an 'action' to bind multiple input combos plus their handlers with it a better customisation by the user may be achieved.

For example:

```javascript
     
        Hotkeys.register("unique-action-name", 'space', {
            //target:window, // the default target that watches events 
            category: "default",
            description: "if user presses this combination all listeners will be triggered"
        });

        // add listeners somewhere 
        Hotkeys(/*target*/) // change the target to another dom element to restrict targets
        .on("unique-action-name", (evt) => {
            console.log("action was triggerd",evt)
         
        });
``` 



For the time being this is not meant to be a stand alone library
But rather as a backend for a compatible GUI.
For the reference implementation dowload npm "@nk/core-components" and check out the "nk-hotkey-dialog" example


## Features
* Better Usability by customizing Keyboard Inputs

## credits, references, acknowledgements
* Mousetrap.js -  [ccampbell/mousetrap](https://github.com/ccampbell/mousetrap)
* Keypress.js -   [dmauro/Keypress](https://github.com/dmauro/Keypress/)

## technical goals
* function as a no-gui backend for UI components that implement a keymap dialog


## possible extensions
 
* interface for other HID  
    * gyro+ accelerometer - https://github.com/dorukeker/gyronorm.js/
    * mouse and touch - http://hammerjs.github.io/recognizer-pinch/
* though the library is primarily targeted to solve they keymap via actions, we should expose the same functionality without the actions 
    * (this is useful where no configuration will be necessary ike with the gyro maybe) 
    
    

<!-- ASSETS and LINKS -->
<!-- License -->
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: 


<!-- travis-ci -->
[ci-image]: https://travis-ci.org/frank1147/input-device-actions.svg?branch=master
[ci-url]: https://travis-ci.org/frank1147/input-device-actions

 [![Build Status](https://travis-ci.org/frank1147/input-device-actions.svg?branch=master)]()

<!-- Codacy Badge Grade -->
[codacy-grade-image]: https://api.codacy.com/project/badge/Grade/7a47a8ae8682467b9e33a3d47a6fbd54
[codacy-grade-url]: https://www.codacy.com/app/frank1147/input-device-actions?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=frank1147/input-device-actions&amp;utm_campaign=Badge_Grade

<!-- Codacy Badge Coverage -->
[coverage-image]: https://api.codacy.com/project/badge/Coverage/7a47a8ae8682467b9e33a3d47a6fbd54
[coverage-url]: https://www.codacy.com/app/frank1147/input-device-actions?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=frank1147/input-device-actions&amp;utm_campaign=Badge_Coverage

[dep-status-image]: https://david-dm.org/frank1147/input-device-actions/status.svg
[dep-status-url]: https://david-dm.org/frank1147/input-device-actions#info=dependencies
[devdep-status-image]: https://david-dm.org/frank1147/input-device-actions/dev-status.svg
[devdep-status-url]: https://david-dm.org/frank1147/input-device-actions#info=devDependencies

<!-- Screenshots -->

