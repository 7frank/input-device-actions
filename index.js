//import "./interactions"


/**
 * Conatins some wrappers to customise hotkeys for keyboard input.
 * By default hotkeys for lets say an action "save" are bound like "ctrl+s".
 * This plugin allows for the user to later remap the key combo used to trigger the "save" action via dialog.
 *
 *
 *
 *
 * TODO make sure that only one combo at a time is bound
 * TODO make sure that there may not be more than one action defined and throw error otherwise
 * TODO class and package structure
 */
import Mousetrap from 'mousetrap';
import $ from 'jquery';

var _keys = {};
/**
 *
 * @param action
 * @param {(string|array)}combo -  eg. ctrl+s
 * @param handler - based on extra param is handler for keypress or keydown event
 * @param extra - if extra is a function, it will be interpreted as keyup event  and the handler will be keydown event else handler is keypress
 * @constructor
 */
export function Hotkeys(action, combo, handler, extra = null) {
    if (_keys[combo]) {
        console.error("key '" + combo + "' already set");
        return;
    }

    _keys[combo + '-' + extra] = {action, combo, handler, extra: extra ? 'keypress' : 'up/down'};

    if (!extra) {
        Mousetrap.bind(combo, handler);
    } else {
        Mousetrap.bind(combo, handler, 'keydown');
        Mousetrap.bind(combo, extra, 'keyup');
    }
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
