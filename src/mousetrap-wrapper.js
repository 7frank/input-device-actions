
import Mousetrap from 'mousetrap';
import {hasSecondHandler} from "./utils";

/**
 * A simple wrapper for different keyboard libs. In this case Mousetrap.js
 *
 * @param options
 * @returns {{bind: (function(*=, *=)), unbind: (function(*=)), pause: pause, unpause: unpause}}
 */
export
function getMousetrapInstance(options)
{

    //TODO for performance it might be better to stash a map of targets in case a lot of them are the same object
    //creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256
    var instance = new Mousetrap(options.target);



    return {
        _instance:instance,//we'll expose the instance for customization
        bind(comboParam,handlerWrapper,handlerWrapper2){


            console.log("binding to",options.target,comboParam)

            if (!hasSecondHandler(options)) {
                instance.bind(comboParam, handlerWrapper);
            } else {
                instance.bind(comboParam, handlerWrapper, 'keydown');
                instance.bind(comboParam, handlerWrapper2, 'keyup');
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

