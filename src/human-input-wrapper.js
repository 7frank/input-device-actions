import  HumanInput from 'humaninput/dist/humaninput-1.1.15-full';

import {hasSecondHandler} from "./utils";

/**
 * A simple wrapper for different keyboard libs. In this case HumanInput.
 * see https://github.com/liftoff/HumanInput
 *
 * @param options
 * @returns {{bind: (function(*=, *=)), unbind: (function(*=)), pause: pause, unpause: unpause}}
 */




var HIDocumentInstance

export function getHumanInputInstance(options) {

    //TODO for performance it might be better to stash a map of targets in case a lot of them are the same object
    //creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256



//#hi_feedback
    var instance ;
    if (options.target==window.document)
    {

        var settings = {
             visualFeedback: false
        };

        if (!HIDocumentInstance)
           window.HI=  //expose global ... as long as feedback plugin relies on it
               HIDocumentInstance=instance= new HumanInput(window, settings);
        else
            instance=HIDocumentInstance;

    }
    else
    instance= new HumanInput(options.target, settings);


    return {
        _instance:instance,//we'll expose the instance for customization //TODO find a better way to provide access
        bind(comboParam, handlerWrapper) {

            //HI uses - for combos
            comboParam = _.replace(comboParam, new RegExp("\\+", "g"), "-")


            if (!hasSecondHandler(options)) {
                instance.on(comboParam, handlerWrapper);
            } else {
                instance.on(comboParam, handlerWrapper);
                //TODO this might be useful to implement  probably by detecting what device the combo is for or providing it
                console.warn("the human input wrapper does not handle 'undo'-events like key/mouse- duwn/up ")
            }

        }, unbind(prevCombo) {

            //HI uses - for combos
            prevCombo = _.replace(prevCombo, new RegExp("\\+", "g"), "-")

            if (!hasSecondHandler(options)) {
                instance.off(prevCombo);
            } else {
                instance.off(prevCombo);
                //TODO this might be useful to implement  probably by detecting what device the combo is for or providing it
                console.warn("the human input wrapper does not handle 'undo'-events like key/mouse- duwn/up ")
            }

        }, pause: function () {

            instance.pause()

        },
        unpause: function () {

            instance.resume()

        }
    }


}

