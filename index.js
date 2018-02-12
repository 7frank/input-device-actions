/**
 * Contains some wrappers to customise hotkeys for keyboard input.
 * By default hotkeys for lets say an action "save" are bound like "ctrl+s".
 * This plugin allows for the user to later remap the key combo used to trigger the "save" action via dialog.
 *
 *
 *
 * TODO add storage interface, by default with simple cookies
 * TODO make sure that only one combo at a time is bound
 * TODO make sure that there may not be more than one action defined and throw error otherwise
 * TODO class and package structure
 * FIXME handle umlaute and other international equivalent characters via e.key
 *
 */

//import "./interactions"

import {onElementChange} from "./listeners"
import {assignIn as extend} from 'lodash';

import Mousetrap from 'mousetrap';
import * as keypress from 'keypress.js/keypress-2.1.4.min';



import $ from 'jquery';

var _keys = {};
var _already_set_combos = {};
var _events = $({});

/**
 *
 * @param action -  TODO action should contain the category string
 * @param {(string|array[string]|array[object])}combo - one or many combos eg. ctrl+s TODO touch gestures would be nice for customisation
 * @param handler - based on extra param is handler for keypress or keydown event
 * @param extra - if extra is a function, it will be interpreted as keyup event  and the handler will be keydown event else handler is keypress
 * @param options - contains additional options, might be passed in place of param 'extra' if no keyup handler is needed
 * @param {(string|array[string])} options.category -  example: "Default.save File" or array of string ["Default","File safe"]
 * @param {(HTMLElement|undefined)} options.target -  the element to bind the action to
 * @param {string} options.selector -   selector-string for binding existing or later added elements
 * @param {string} options.description -  some text with additional information about the binding
 * @param {string} options.title -  a brief title fr the action (can be used for internationalisation). If left blank, the 'action' attribute will be used in place
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
        description: "",
        stopPropagation: true,
        preventDefault: true,
        error: false,
        title: null
    };

    options = extend(defaults, options);

    options.action = action;
    options.combo = convertComboParams(combo);
    options.defaults =  _.values(extend({},  options.combo));


    options.handler = handler;
    options.extra = extra;


    if (!options.title) options.title = options.action

    //init the wrapper
    options.el =getMousetrapInstance(options)


    //NOTE: keyboard.js does have problems with special characters like öä# on non english keyboards
    //therefore we will rely on mousetrap once again and not support arbitrary combo features k.js does have to offer
    //options.el =getKJSInstance(options)


    var t = hasSecondHandler(options) ? 'up/down' : 'keypress';


    if (_keys[action]) {
        console.warn("action '" + action + "' already set");
        return;
    }


    _keys[action] = options;


    function applyHandlers(target) {

        bindAllCombos(options, options.combo, target)
        // bindSingleCombo(options,options.combo,target)


    }

//have a list of combos and their previously set actions
    if (_already_set_combos[combo + '-' + t]) {

        _keys[action].error = "already set by '" + _already_set_combos[combo + '-' + t] + "'";

        return
    }
    _already_set_combos[combo + '-' + t] = action;


    applyHandlers(options.target);


    if (options.selector != null)
        onElementChange(options.target, options.selector, function onTargetChanged(arr) {

            console.log("hotkeys target ...", arguments);

            applyHandlers(arr[0].added[0])

        });

    _events.trigger("change", [])


}


Hotkeys.onChange = function (handler) {
    _events.on("change", handler)


};

/**
 * converts the combo parameter into an array of valid combo parameters
 */

function convertComboParams(comboParams) {

    function def() {


        var defaults = {
            type: "keyboard",
            combo: null
        };
        return defaults
    }

    function strToObj(comboParam) {
        return extend(def(), {combo: comboParam});

    }

    if (typeof comboParams === "string")
        comboParams = [strToObj(comboParams)]


    comboParams = _.map(comboParams, (comboParam) => {
        if (typeof comboParam === "string")
            return strToObj(comboParam)
        else
            return extend(def(), comboParam);
    })

    return comboParams
}

/**
 * one to bind 'em all
 *
 *
 * @param {object[]} comboParams - an array of combo param objects
 */
function bindAllCombos(options, comboParams, target) {
    _.each(comboParams, function (comboParam, k) {

        bindSingleCombo(options, comboParam, target)

    })
}


/**
 *
 *
 * @param opt
 * @param target - FIXME this value changes for "live" bound objects .. this interferes with unbinding as it is of now, which unbinds the options.target only
 */
function bindSingleCombo(opt, comboParam, target) {

    if (comboParam.combo == null) {

        console.warn("action " + opt.action + " invalid combo:", comboParam)
        return
    }

    function handlerWrapper(e) {

        if (opt.stopPropagation)
            e.stopPropagation();

        if (opt.preventDefault)
            e.preventDefault();


        return opt.handler.apply(this, arguments)
    }

    function handlerWrapper2(e) {

        if (opt.stopPropagation)
            e.stopPropagation();

        if (opt.preventDefault)
            e.preventDefault();


        return opt.extra.apply(this, arguments)
    }

//creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256
    var instance =  opt.el;


//NOTE: make sure that the ctrl sequence is lowercase, otherwise mousetrap will ignore it completely
   instance.bind(comboParam.combo.toLowerCase(), handlerWrapper)



}

/**
 * A simple wrapper for different keyboard libs. In this case Mousetrap.js
 *
 * @param options
 * @returns {{bind: (function(*=, *=)), unbind: (function(*=)), pause: pause, unpause: unpause}}
 */

function getMousetrapInstance(options)
{

    //creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256
    var instance = new Mousetrap(options.target);



    return {
        bind(comboParam,handlerWrapper){
            if (!hasSecondHandler(options)) {
                instance.bind(comboParam, handlerWrapper);
            } else {
                instance.bind(comboParam, handlerWrapper, 'keydown');
                instance.bind(comboParam, options.extra, 'keyup');
            }

        }, unbind(prevCombo){

            if (!hasSecondHandler(options)) {
                instance.unbind(prevCombo);
            } else {
                instance.unbind(prevCombo, 'keydown');
                instance.unbind(prevCombo, 'keyup');
            }
        },pause:function(){

            instance.pause()

        },
        unpause:function(){

            instance.unpause()

        }}


}


/**
 * Another wrapper like {@see getMousetrapInstance}
 *
 * @param options
 * @returns {{bind: (function())}}
 */
function getKJSInstance(options)
{

    //creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256

    var instance =new keypress.Listener(options.target);



    return {
        bind(comboParam,handlerWrapper){


            //place default "+" operator
            comboParam= _.replace(comboParam,new RegExp("\\+","g")," ")



         //   if (!hasSecondHandler(options)) {
          //      instance.simple_combo(comboParam, handlerWrapper);


           // } else {
               // instance.bind(comboParam, handlerWrapper, 'keydown');
               // instance.bind(comboParam, handlerWrapper2, 'keyup');

                instance.register_combo({
                    "keys"              : comboParam,
                    "on_keydown"        : handlerWrapper,
                    "on_keyup"          : options.extra,
                    //"on_release"        : null,
                   // "this"              : undefined,
                    "prevent_default"   : options.preventDefault,
                   /* "prevent_repeat"    : false,
                    "is_unordered"      : false,
                    "is_counting"       : false,
                    "is_exclusive"      : false,
                    "is_solitary"       : false,
                    "is_sequence"       : false*/
                });


         //   }

        }, unbind(prevCombo){

            //place default "+" operator
            prevCombo= _.replace(prevCombo,new RegExp("\\+","g")," ")

          //  if (!hasSecondHandler(options)) {
                instance.unregister_combo(prevCombo)
          /*  } else {
                instance.unbind(prevCombo, 'keydown');
                instance.unbind(prevCombo, 'keyup');
            }*/
        },pause:function(){

            instance.stop_listening()

        },
        unpause:function(){

            instance.listen()

        }}


}


export function isBound(combo) {
    return _already_set_combos[combo] != null
}

export function isBoundTo(combo) {
    return _already_set_combos[combo]
}


function getActionByName(action) {
    return _keys[action]

}


/**
 * Note: mousetrap needs its sequences to be lower case otherwise it will fail silently
 *
 * @param opt - the config object
 * @param prevCombo - a single entry for a single combo of a config object
 */
function unbind(opt,prevCombo) {



    var instance = opt.el;

     instance.unbind(prevCombo.combo.toLowerCase())

}



/**
 * TODO rebind should only work if an action was previously bound
 * TODO newCombo should be the object containing type and actual combo
 * @param action
 * @param {number} entryID - the id of the entry within the array
 * @param newCombo
 */
export function rebind(action, entryID, newCombo) {


    if (typeof action != "string") console.error("must be a valid action")
    if (typeof entryID != "number") console.error("must be a number")
    if (typeof newCombo == "undefined") console.error("there must be a new combo specified to override old one")

    _already_set_combos[newCombo] = action;
    var opt = getActionByName(action);


    var instance = opt.el;


    var prevCombo = opt.combo[entryID]

    if (typeof prevCombo != "object") console.error("no combo found for params", action, entryID)

/*
    if (!hasSecondHandler(opt)) {
        instance.unbind(prevCombo.combo);
    } else {
        instance.unbind(prevCombo.combo, 'keydown');
        instance.unbind(prevCombo.combo, 'keyup');
    }
*/
    unbind(opt,prevCombo)


    //opt.combo = newCombo;
    opt.combo[entryID] = convertComboParams(newCombo)[0]

    console.log("action to rebind", action, opt.combo[entryID]);
    //TODO check if timeoout still necessary
    setTimeout(function () {
        bindSingleCombo(opt, opt.combo[entryID])
    }, 500)


}

/**
 *
 *
 * @param {string} action - the action which shall  be reset
 * @param {(string)} [comboID] - If no specific id is given all combos are reset to default.
 */
export function resetActionCombosToDefault(action, comboID) {


    var options = getActionByName(action)

    var reset = (val, key) => {




        if (options.defaults[key])
        {
            rebind(action, key, options.defaults[key].combo);
            options.combo[key]=cloneObject(options.defaults[key])

        }
        else {

            unbind(options, options.combo[key])
            delete options.combo[key]

        }

    }


    if (comboID != null)
        reset(options.combo, comboID)
    else
        _.each(options.combo, reset)

    //remove null values
    options.combo= _.compact(options.combo);


    _events.trigger("change", [])


}

/**
 * creates a placeholder element which has an error state by default
 * @param action
 */

export function addComboForAction(action)
{
    var options = getActionByName(action)


    var param=convertComboParams("")[0]

    param.error="create a valid combo"

    options.combo.push(param)
    // options.defaults.push(cloneObject(param))


    _events.trigger("change", [])

    return param

}

function cloneObject(options)
{

    return extend({},options)

}

/**
 *
 * @param o - the option object that may have a second handler defined
 * @returns {boolean}
 */
function hasSecondHandler(o) {
    return typeof o.extra == "function"
}


export function getRegistered() {
    return _keys

}


/**
 *
 * TODO only have a console log here
 * */
export function logHotkeyList() {


    console.log('');
    console.log('------------Hotkeys & Actions defined--------------');

    $.each(_keys, function (k, v) {

        console.log(v.action, v.combo, v)

    });

    console.log('------------Hotkeys & Actions end--------------');
    console.log('');
}


