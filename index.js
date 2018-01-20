//import "./interactions"


/**
 * Conatins some wrappers to customise hotkeys for keyboard input.
 * By default hotkeys for lets say an action "save" are bound like "ctrl+s".
 * This plugin allows for the user to later remap the key combo used to trigger the "save" action via dialog.
 *
 *
 *
 * TODO add storage interface, by default with simple cookies
 * TODO make sure that only one combo at a time is bound
 * TODO make sure that there may not be more than one action defined and throw error otherwise
 * TODO class and package structure
 */

import {onElementChange} from "./listeners"
import {assignIn as extend} from 'lodash';

import Mousetrap from 'mousetrap';
import $ from 'jquery';

var _keys = {};

/**
 *
 * @param action -  TODO action shoud contain the category string
 * @param {(string|array)}combo - one or many combos eg. ctrl+s TODO touch gestures would be nice for customisation
 * @param handler - based on extra param is handler for keypress or keydown event
 * @param extra - if extra is a function, it will be interpreted as keyup event  and the handler will be keydown event else handler is keypress
 * @param options - contains additional options, might be passed in place of param 'extra' if no keyup handler is needed
 * @param {(string|array[string])} options.category -  example: "Default.save File" or array of string ["Default","File safe"]
 * @param {(HTMLElement|undefined)} options.target -  the element to bind the action to
 * @param {string} options.selector -   selector-string for binding existing or later added elements
 * @param {string} options.description -  some text with additional information about the binding
 * @constructor
 *
 */
export function Hotkeys(action, combo, handler, extra = null, options) {

    if (typeof extra == "object")
        options = extra;


    var defaults = {
        category: "",
        target: window.document,
        selector: null,
        description: "-/-",
        stopPropagation:true,
        preventDefault:true
    }


    options = extend(defaults, options)


    var hasSecondHandler = typeof extra == "function";

    if (_keys[combo]) {
        console.error("key '" + combo + "' already set");
        return;
    }

    var t = hasSecondHandler ? 'up/down' : 'keypress'

    _keys[combo + '-' + t] = {action, combo, handler, extra: t,defaults:combo};


    function applyHandlers(target) {

        function handlerWrapper(e){

            if (options.stopPropagation)
                e.stopPropagation()

            if (options.preventDefault)
                e.preventDefault()


            return handler.apply(this,arguments)
        }


        if (!hasSecondHandler) {
            Mousetrap(target).bind(combo, handlerWrapper);
        } else {
            Mousetrap(target).bind(combo, handlerWrapper, 'keydown');
            Mousetrap(target).bind(combo, extra, 'keyup');
        }
    }


    applyHandlers(options.target)


    if (options.selector != null)
        onElementChange(options.target, options.selector, function onTargetChanged(arr) {

            console.log("hotkeys target ...", arguments)

            applyHandlers(arr[0].added[0])

        })


}


export function getRegistered() {
    return _keys

}

export function showHotkeyList() {
    var style = `

    display:none;
    position:absolute;
    left:20%;
    top:20%;
    bottom:20%;
    right:20%;
    background-color: rgba(255,255,255,0.3);
    overflow: auto;
    padding: 2em;
    pointer-events:none;
 
  
  `;

    var dlg = $('body').children('.hotkeys-dialog');

    if (dlg.length == 0) {
        dlg = $('<div>').addClass('hotkeys-dialog').attr('style', style).appendTo('body');
    }

    dlg.html('');

    dlg.append('<div>------------Hotkeys & Actions defined--------------</div><hr>');

    $.each(_keys, function (k, v) {
        var row = $('<div>').append(v.action, "'", v.combo, "'");

        if (v.extra == 'keypress') {
            row.append('  (release to undo)');
        }

        dlg.append(row);
    });

    dlg.toggle();
}
