
import * as keypress from 'keypress.js/keypress-2.1.4.min';

/**
 * Another wrapper like {@see getMousetrapInstance}
 *
 * NOTE: keypress might be replaced bi human interface as it is more versatile and seems to have similar weaknesses with I18n
 *
 * @param options
 * @returns {{bind: (function())}}
 */
export
function getKJSInstance(options)
{

    //creating an instance to track unbinds and stuff @see https://github.com/ccampbell/mousetrap/issues/256

    var instance =new keypress.Listener(options.target);



    return {
        _instance:instance,//we'll expose the instance for customization
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