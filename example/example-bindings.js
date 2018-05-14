import {getRegistered, Hotkeys} from "../src/index";
import {createHTML, createRect, log, logHotkeyList} from "./example-utils";
import * as _ from "lodash";


document.addEventListener("DOMContentLoaded", function(event) {

    logHotkeyList()


//TODO create sample page with vue.js



//bind the action to ctrl+space as default trigger
//deprecated work flow
//Hotkeys("hello-action", "ctrl+space", hello)


    Hotkeys.register("hello-action", "ctrl+space")


    Hotkeys(window).on("hello-action",   function(e) {
        e.stopPropagation()

        console.log(">>>",arguments)
        log("hello window")
    })

    var target1= createRect("target1",100,300)
    document.body.appendChild(target1)



    Hotkeys(target1).on("hello-action", function(e) {
        e.stopPropagation()
        console.log(">>>",arguments)
        log("hello target1")
    })


    var targetWithinTarget= createRect("targetWithinTarget",50,50)
    target1.appendChild(targetWithinTarget)


    Hotkeys(targetWithinTarget).on("hello-action", function(e) {
        e.stopPropagation()
        console.log(">>>",arguments)
        log("hello targetWithinTarget")
    })



    var targetWithinTargetT= createRect("targetWithinTargetT",50,50)
    targetWithinTarget.appendChild(targetWithinTargetT)


    Hotkeys(targetWithinTargetT).on("hello-action", function(e) {
        e.stopPropagation()
        console.log(">>>down",arguments)
        log("hello targetWithinTargetT")
    },function(e) {
        e.stopPropagation()
        console.log(">>>up",arguments)
        log("hello targetWithinTargetT")
    })




});









/*

//stub functions below...

//grab and hold an icon
 function grabItem(){}

//take an item and put it into inventory
 function takeItem(){}

//
 function enterCar(){}
 function exitCar(){}

 function HUDMenuListViewUp(){}
 function HUDMenuListViewDown(){}


Hotkeys.register("user-interact",,{default:["e"],description:"an event that is triggered whenever a user is looking at and wants to start a default interaction with an object.")
Hotkeys.register("user-move-left","a")
Hotkeys.register("user-move-right","d")



 */
