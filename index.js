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
 *
 *
 */

import {onElementChange} from "./listeners"
import {assignIn as extend} from 'lodash';

import Mousetrap from 'mousetrap';
import $ from 'jquery';

var _keys = {};
var _already_set_combos = {}
var _events = $({})

/**
 *
 * @param action -  TODO action should contain the category string
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
        category: "default",
        target: window.document,
        selector: null,
        description: "-/-",
        stopPropagation: true,
        preventDefault: true,
        error: false
    }

    options = extend(defaults, options)

    options.action = action
    options.combo = combo
    options.defaults = combo


    options.handler = handler
    options.extra = extra


    //creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256
    var instance=new Mousetrap(options.target)
    options.el=instance


    var t = hasSecondHandler(options) ? 'up/down' : 'keypress'


    if (_keys[action]) {
        console.warn("action '" + action + "' already set");
        return;
    }


    _keys[action] = options




    function applyHandlers(target) {

        bind(options,target)


    }

//have a list of combos and their previously set actions
    if (_already_set_combos[combo + '-' + t]) {

        _keys[action].error = "already set by '" + _already_set_combos[combo + '-' + t] + "'"

        return
    }
    _already_set_combos[combo + '-' + t] = action


    applyHandlers(options.target)


    if (options.selector != null)
        onElementChange(options.target, options.selector, function onTargetChanged(arr) {

            console.log("hotkeys target ...", arguments)

            applyHandlers(arr[0].added[0])

        })

    _events.trigger("change", [])


}


Hotkeys.onChange = function (handler) {
    _events.on("change", handler)


}

/**
 *
 *
 * @param opt
 * @param target - FIXME this value changes for "live" bound objects .. this interferes with unbinding as it is of now, which bunbinds the options.target only
 */
function bind(opt,target) {

    function handlerWrapper(e) {

        if (opt.stopPropagation)
            e.stopPropagation()

        if (opt.preventDefault)
            e.preventDefault()


        return opt.handler.apply(this, arguments)
    }

    function handlerWrapper2(e) {

        if (opt.stopPropagation)
            e.stopPropagation()

        if (opt.preventDefault)
            e.preventDefault()


        return opt.extra.apply(this, arguments)
    }

//creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256
    var instance=opt.el


//NOTE: make sure that the ctrl sequence is lowercase, otherwise mousetrap will ignore it completely
    if (!hasSecondHandler(opt)) {
        instance.bind(opt.combo.toLowerCase(), handlerWrapper);
    } else {
        instance.bind(opt.combo.toLowerCase(), handlerWrapper, 'keydown');
        instance.bind(opt.combo.toLowerCase(), handlerWrapper2, 'keyup');
    }

}

export function isBound(combo) {
    return _already_set_combos[combo] != null
}

export function isBoundTo(combo) {
    return _already_set_combos[combo]
}

export function rebind(action, newCombo) {
    _already_set_combos[newCombo] = action
    var opt = _keys[action]


    var instance=opt.el

    if (!hasSecondHandler(opt)) {
        instance.unbind(opt.combo);
    } else {
        instance.unbind(opt.combo, 'keydown');
        instance.unbind(opt.combo, 'keyup');
    }

    opt.combo = newCombo


    console.log("action to rebind",action)
setTimeout(function(){

    bind(opt)
},500)



}

function hasSecondHandler(o) {
    return typeof o.extra == "function"
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

        if (typeof v.extra == 'function') {
            row.append('  (release to undo)');
        }

        dlg.append(row);
    });

    dlg.toggle();
}
