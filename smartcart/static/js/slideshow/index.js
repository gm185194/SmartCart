// console.log("[slideshow/index.js] : File got included");

var timeoutId = null;
var isActive = true;

/* startTimer function - used setTimeout to fire goInactive after the time as passed in parameter - waitTimeBeforeInactive */
function startTimer(waitTimeBeforeInactive) {
  // console.log("[slideshow/index.js] : startTimer");

  timeoutId = window.setTimeout(goInactive, waitTimeBeforeInactive);
}
/* resetTimer function - used clearTimeout to clear old timer with given timeoutId and go to activeState */
function resetTimer(timeoutId) {
  // console.log("[slideshow/index.js] : resetTimer");

  if (timeoutId) {
    // console.log(
    //   "[slideshow/index.js] : resetTimer - timeoutId is true clearing it"
    // );
    window.clearTimeout(timeoutId);
    goActive();
  } else {
    // startTimer(waitTimeBeforeInactive);
  }
}

/* goActive function - insert code for things to do when user comes active  */
function goActive() {
  // console.log("[slideshow/index.js] : goActive");
  isActive = true;
  $(".slideshow-container").hide();
  $(".main-div").show();
  /* Call it or comment if you want to use it again */
  startTimer(waitTimeBeforeInactive);
}
/* goInactive function - insert code for things to do when user goes inactive  */
function goInactive() {
  // console.log("[slideshow/index.js] : goInactive");
  isActive = false;

  $(".slideshow-container").show();
  $(".main-div").hide();
}

/* inactiveStateSetup function is used to bind the resetTimer eventHandler with all type of operation required for idle
or inactive check on browser and then if any operation begin then just reset the timer and start new timer
*/
function inactiveStateSetup(waitTimeBeforeInactive) {
  // console.log("[slideshow/index.js] : inactiveStateSetup");

  // this.addEventListener("mousemove", resetTimer, false);
  this.addEventListener("mousedown", resetTimer, false);
  this.addEventListener("keypress", resetTimer, false);
  // this.addEventListener("DOMMouseScroll", resetTimer, false);
  // this.addEventListener("mousewheel", resetTimer, false);
  // this.addEventListener("touchmove", resetTimer, false);
  // this.addEventListener("MSPointerMove", resetTimer, false);

  startTimer(waitTimeBeforeInactive); // start new timer
}

var waitTimeBeforeInactive = 10 * 1000;
inactiveStateSetup(waitTimeBeforeInactive);
