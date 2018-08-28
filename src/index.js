/**
 * Wrappers to customise hotkeys for keyboard input / human input (HI).
 * By default hotkeys for lets say an action "save" are bound like "ctrl+s".
 * This plugin allows for the user to later remap the key combo used to trigger the "save" action via dialog.
 *
 * - 1.0.2 - Now triggers the action on the bound element so that listeners get notified.
 *
 * TODO add storage interface, by default with simple cookies
 * TODO make sure that only one combo at a time is bound
 * TODO make sure that there may not be more than one action defined and throw error otherwise
 * TODO improve class and package structure
 *
 * NOTE: mousetrap does handle umlaut and other international equivalent characters that are set via  KeydownEvent.key in state-of-the-art browsers
 *      This is something the other HI and keypress.js to the authors knowledge don't .
 *
 * TODO support keypress.js js combos via keyboard-alt?
 * TODO integrate HI instead "https://github.com/liftoff/HumanInput"
 * TODO support mouse clicks and meta keys
 *
 *
 *
 *  see {@link https://github.com/fernandojsg/aframe-input-mapping-component} for thoughts
 *  TODO contact author on potential things to include
 */

//import "./interactions"

import {onElementChange} from "../listeners"
import * as _ from 'lodash';
import {assignIn as extend, forEach} from 'lodash';
//import $ from 'jquery';
import Emitter from 'tiny-emitter';


import {getMousetrapInstance} from "./mousetrap-wrapper";
import {hasSecondHandler} from "./utils";

/**
 * will add additional handlers to be able to send keyboard events to target
 * @param target
 */
function fixFocusAndOtherThingsForNow(target) {
    if (target.__hasFocusFixed) return

    if (target.hasAttribute && !target.hasAttribute("tabIndex"))
        target.setAttribute("tabIndex", "-1")

//TODO handle cases where this is not wanted
    if (target.style)
        target.style.outline = "none";
//TODO handle cases where this is not wanted
    target.addEventListener("mouseenter", () => target.focus())
    target.addEventListener("mouseleave", () => target.blur())

    target.__hasFocusFixed = true

}

var debug = false

var _keys = {};
var _already_set_combos = {};
//var _events = $({});
var _events = new Emitter();

/**
 *
 * @param handler - based on extra param is handler for keypress or keydown event
 * @param extra - if extra is a function, it will be interpreted as keyup event  and the handler will be keydown event else handler is keypress
 */


export function Hotkeys(target = window) {

    var that = this;

    //FIXME put this somewhere else as an option or something
    fixFocusAndOtherThingsForNow(target)


    return {
        on: function (action, handler, extra = null) {

            if (typeof handler != "function") throw new Error("param 2 must be an instance of a function")
            if (extra != undefined && typeof extra != "function") throw new Error("keyup handler, param 3 must be an instance of a function")


            //global options
            let defaults = _keys[action];

            //FIXME wait for Hotkeys.register if no defaults exist

            var options = extend({}, defaults);
            options.handler = handler;
            options.extra = extra;
            options.target = target


            //---------------------------------

            //TODO to be able to use multiple keyboard and input libraries we need to put the options.el into the options.combo[n].el namespace
            //or we'll need one map that contains once instance (options.els[n]) per library
            // used
            //init the wrapper

            //FIXME have one options object or input device instance per target

         /*
            options.handlerInstances={}

            // have a descriptive  getter instead of the "el" param
            options.getElFor_Options_Combo=function(combo)
            {
                this.handlerInstances[combo.type]

            }

            options.combo.forEach( function(c) {

            var factory;
            switch(c.type)
            {
            case "keyboard":  factory=getMousetrapInstance;break
            case "human-input":factory=getHumanInputInstance;break
            default:console.error("unknown type")
            }


            if (!options.handlerInstances[c.type])
                options.handlerInstances[c.type]=factory(options)

            })
            */

            options.el = getMousetrapInstance(options)

            //TODO check what problems occurred with this library
            // - startRecording stopRecording where too verbose and thus resulted in to bloated descriptions
            // - TODO create some test case for it


            // options.el = getHumanInputInstance(options)
            //problems with identifying combos from


            //NOTE: keyboard.js does have problems with special characters like öä# on non english keyboards
            //therefore we will rely on mousetrap once again and not support arbitrary combo features which keyboard.js would offer
            //options.el =getKJSInstance(options)


            //TODO refactor
            defaults.elements.push(options)


            //---------------------------------


            function applyHandlers(target) {

                if (debug) console.log("applyHandlers", options, options.combo, target)
                bindAllCombos(options, options.combo)


            }


            applyHandlers(options.target);


            if (options.selector != null)
                onElementChange(options.target, options.selector, function onTargetChanged(arr) {

                    if (debug) console.log("hotkeys target ...", arguments);

                    applyHandlers(arr[0].added[0])

                });
            return that;
        },
        off: function (action, handler, extra = null) {

            throw new Error("implementation")
            // unbind(opt, prevCombo)


            return that;
        }


    }

}


Hotkeys.setDebug = function (doDebug) {
    debug = doDebug

}


/**
 * @param action -  TODO action should contain the category string default.sample-action
 * @param {(string|array[string]|array[object])}combo - one or many combos eg. ctrl+s TODO touch gestures would be nice for customisation
 * @param options - contains additional options, might be passed in place of param 'extra' if no keyup handler is needed
 * @param {(string|array[string])} options.category -  example: "Default.save File" or array of string ["Default","File safe"]
 * @param {(HTMLElement|undefined)} options.target -  the element to bind the action to
 * @param {string} options.selector -   selector-string for binding existing or later added elements
 * @param {string} options.description -  some text with additional information about the binding
 * @param {string} options.title -  a brief title fr the action (can be used for internationalisation). If left blank, the 'action' attribute will be used in place
 * @constructor
 *
 */

Hotkeys.register = function (action, combo, options) {

    var defaults = {
        category: "default",
        // target: window,
        selector: null,
        description: "",
        stopPropagation: true, //by default the human input (HI) will be caught and be converted into a bubbling action event thus we don't need to propagate the HI-event
        preventDefault: true,
        error: false,
        title: null,
        elements: []
    };

    options = extend(defaults, options);

    options.action = action;
    options.combo = convertComboParams(combo);
    options.defaults = _.values(extend({}, options.combo));


    // options.handler = handler;
    // options.extra = extra;


    if (!options.title) options.title = options.action


    if (_keys[action]) {
        console.warn("action '" + action + "' already set");
        return;
    }


    _keys[action] = options;

    //--------------------------------

    //have a list of combos and their previously set actions
    //FIXME foreach combo

    var t = hasSecondHandler(options) ? 'up/down' : 'keypress';


    if (_already_set_combos[combo + '-' + t]) {

        _keys[action].error = "already set by '" + _already_set_combos[combo + '-' + t] + "'";

        return
    }
    _already_set_combos[combo + '-' + t] = action;

    //--------------------------------


    _events.emit("change", {type: "register", action, combo})


}


/**
 * TODO implementation, check doc for how to add static description
 * @param {string} type - the name of the type you want it to be associated with. the default already registered one would be keyboard-
 * @param {function} factory - the factory that generated the type handling object. {@see getMousetrapInstance}
 * @static
 * @function

 * @memberOf Hotkeys
 */
Hotkeys.registerInputType = function (type, factory) {

    throw new Error("not yet supported in this version")

    //would be something like
    // if (!_types[type]
    // _types[type]=factory

    /*
    //check interface for correctness
    var test=factory()
    var hasAllKeys = "bind,unbind,pause,unpause".split(",").every(function(item){
        return test.hasOwnProperty(item);
    });
*/
    // example: Hotkeys.registerInputType("keyboard",getMousetrapInstance)

};


Hotkeys.onChange = function (handler) {
    _events.on("change", handler)


};


Hotkeys.onAction = function (handler) {
    _events.on("action", handler)
};

Hotkeys.getRegistered = getRegistered;


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

        bindSingleCombo(options, comboParam)

    })
}


/**
 *
 *
 * @param opt
 * @param target - FIXME this value changes for "live" bound objects .. this interferes with unbinding as it is of now, which unbinds the options.target only
 */
function bindSingleCombo(opt, comboParam) {

    if (comboParam.combo == null) {

        console.warn("action " + opt.action + " invalid combo:", comboParam)
        return
    }

    /**
     *
     * @param e
     * @param isFirstHandler - weather it is the trigger for the first or second handler in case the option contains the extra attribute which is said handler
     */
    function createCustomActionEvent(e, isFirstHandler) {
        //convert all relevant elements into one array

        var el = opt.target
        if (opt.selector)
            el = el.querySelectorAll(opt.selector)
        else el = [el]

        forEach(el, function (val) {

            var event = new CustomEvent(opt.action, {
                bubbles: true,
                target: val,
                path: e.path,
                currentTarget: e.path[0],
                detail: {
                    isActionEvent: true,
                    first: isFirstHandler,
                    second: !isFirstHandler,
                    combo:comboParam
                }
            });
            //if (debug) console.log("createCustomActionEvent", e.target, event)
            // val.dispatchEvent(event)
            e.target.dispatchEvent(event);

        })
    }


    //handler 1 and 2 are distinguished by being opposites of the same combo
    //say keydown and up again
    //or mousedown and up
    //or any event which can have an opposite
    function handlerWrapper(e) {

        if (opt.stopPropagation)
            e.stopPropagation();

        if (opt.preventDefault)
            e.preventDefault();


        var ee = createCustomActionEvent(e, true);

        // var res = opt.handler.apply(this, [ee])
        // return res
    }

    function handlerWrapper2(e) {

        if (opt.stopPropagation)
            e.stopPropagation();

        if (opt.preventDefault)
            e.preventDefault();


        var ee = createCustomActionEvent(e, false);
        //var res = opt.extra.apply(this, arguments)

        // return res

    }

    //------------------------------------------------------
    /**
     * Add action listener
     * TODO work in progress, only partially using target and ignoring selector
     * TODO also make the result work without knowing if first or second exists
     * (up/down does not exist for every device and generates some problems this way when actions are registered based on the assumption
     * that first and second get passed)
     */

    var actionHandler = function actionHandler(e) {


        if (!hasSecondHandler(opt)) {

            // if (e.detail.second)
            opt.handler.apply(this, arguments)
        }
        else {

            if (e.detail.first)
                opt.handler.apply(this, arguments)
            if (e.detail.second)
                opt.extra.apply(this, arguments)
        }


        _events.emit("action", e)

    }

    //fixing multiple bindings by keeping a map attached
    if (!opt.target.__actions__) opt.target.__actions__ = {}
    //opt.target.removeEventListener(opt.action,actionHandler) //removing doesn't work ..
    if (!opt.target.__actions__[opt.action]) {

        opt.target.addEventListener(opt.action, actionHandler)
        opt.target.__actions__[opt.action] = true
    }

    //------------------------------------------------------


//creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256
    var instance = opt.el;

//if (debug) console.log(comboParam.combo.toLowerCase(),opt.handler)
//NOTE: make sure that the ctrl sequence is lowercase, otherwise mousetrap will ignore it completely
    instance.bind(comboParam.combo.toLowerCase(), handlerWrapper, handlerWrapper2)


}


export function isBound(combo) {
    return _already_set_combos[combo] != null
}

export function isBoundTo(combo) {
    return _already_set_combos[combo]
}

export function getActionByName(action) {
    return _keys[action]

}


/**
 * Note: mousetrap needs its sequences to be lower case otherwise it will fail silently
 *
 * @param opt - the config object
 * @param prevCombo - a single entry for a single combo of a config object
 */
function unbind(opt, prevCombo) {


    var instance = opt.el;


    opt.elements.forEach(opt0 => {
        if (debug) console.log("unbind", opt0, prevCombo, opt0.el._instance.target)
        opt0.el.unbind(prevCombo.combo.toLowerCase())
    })


    //instance.unbind(prevCombo.combo.toLowerCase())

}


/**
 * TODO rebind should only work if an action was previously bound
 * TODO newCombo should be the object containing type and actual combo
 *
 *
 *
 * @param action
 * @param {number} entryID - the id of the entry to select within the combo array
 * @param newCombo
 */
export function rebind(action, entryID, newCombo) {


    if (typeof action != "string") console.error("must be a valid action")
    if (typeof entryID != "number") console.error("must be a number")
    if (typeof newCombo == "undefined") console.error("there must be a new combo specified to override old one")

    _already_set_combos[newCombo] = action;
    var opt = getActionByName(action);


    var prevCombo = opt.combo[entryID]

    if (typeof prevCombo != "object") console.error("no combo found for params", action, entryID)

//unbind previous instances
    unbind(opt, prevCombo)


    opt.combo[entryID] = convertComboParams(newCombo)[0]

    if (debug) console.log("action to rebind", action, opt.combo[entryID]);

    //the timeout seems to be necessary due to racing conditions, so that events that register too early still get a change
    setTimeout(function(){
    //iterate over all registered elements and bind the input combination to it
        opt.elements.forEach(function (opt0) {
        bindSingleCombo(opt0, opt.combo[entryID])
        })

        _events.emit("change", {type: "rebind", action, combo: newCombo, previous: prevCombo})

    },500)


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


        if (options.defaults[key]) {
            rebind(action, key, options.defaults[key].combo);
            options.combo[key] = cloneObject(options.defaults[key])

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
    options.combo = _.compact(options.combo);


    _events.emit("change", {type: "reset-to-defaults"})


}

/**
 * creates a placeholder element which has an error state by default
 * @param action
 */

export function addComboForAction(action) {
    var options = getActionByName(action)


    var param = convertComboParams("")[0]

    param.error = "create a valid combo"

    options.combo.push(param)
    // options.defaults.push(cloneObject(param))


    _events.emit("change", {type: "create-placeholder"})

    return param

}

function cloneObject(options) {

    return extend({}, options)

}


export function getRegistered() {
    return _keys

}

