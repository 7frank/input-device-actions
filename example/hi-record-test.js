/**
 * we want to be able to capture
 * ctrl+ (left)pointerdown
 * ctrl+ pointermove
 *
 *
 */




//TODO put recording of key combos into the xyzWrapper within the library instead of elevating it to dependent program
https://github.com/liftoff/HumanInput#recording-events-or-capturing-a-keystroke

HI.startRecording();
// Let's pretend we just want 'keyup:<key>' events...
var keyupEvents = HI.stopRecording('keyup:')
// You can safely call stopRecording() multiple times after startRecording():
var allEvents = HI.stopRecording(); // Returns all events (no filter)



//----------------------------
var whatKey = function(event, key, code) {
    HI.log.info(key, ' was pressed.  Here is the code:', code);
};
HI.on('keyup', whatKey);