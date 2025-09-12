//on load of settings.html

//get known preferences
import { showKeyAcc } from "./statshtml.js";
let userSettings = JSON.parse(localStorage.getItem('userPreferences'));
let slider = `<input type="range" min="0" max="100" value="50" step="1">`;
let preferences = userSettings ? userSettings : { 
    'Capitals' : 0, 'Numbers' : 0, 'Words' : 10,
    target: false, key: null, 'endless': false, 'mySpecials' : []
}

// STARTUP SECTION
// getting ids mapped to the character for the below if statement.
let mySwitches = document.querySelectorAll('.list div');
let mySliderButtons = document.querySelectorAll('.sliderButton');
let switchMap = new Map();
mySwitches.forEach((sw) => {
    switchMap.set(sw.innerHTML, sw.id);
});
switchMap.set("<>", "anglebracketSwitch");
switchMap.set("&", "andSwitch");

// if we had settings, here is where we will set up the page correctly.
let keyStrokes = document.querySelectorAll(".keyDisplay .none");

if(userSettings){
    for(const spec of userSettings.mySpecials){
        switchListener(document.querySelector(`#${switchMap.get(spec)}`), true);
    }

    for(const setting of ['Capitals', 'Numbers']){
        document.querySelector(`#${setting}Holder`).innerHTML = (Number(preferences[setting])*100) + '%';
        if(preferences[setting] > 0){
            let button = setting == 'Capitals' ? mySliderButtons[0] : mySliderButtons[1];
            let type = setting == 'Capitals' ? 'capital' : 'digit';
            let value = preferences[setting];
            generateSlider(type, button);
            let updateMe = document.querySelector(`#slider${type}`);
            updateMe.value = value*100;
            updateSliderPrefs(false, updateMe);
        }
    }

    let targetedKey = userSettings.key && userSettings.key.length == 1 ? userSettings.key[0] : 'Space';
    setTargetKey(targetedKey);
}

//show relative accuracies for better indication of what to target on stats page
showKeyAcc(document.querySelectorAll(".keyDisplay .none"));

//add buttons

// SPECIALS SECTION 
// allow interaction of special switches
for(let sw of mySwitches){
    sw.addEventListener('click', () => {
        switchListener(sw, false);
    });
}

// flipping mechanic
function switchListener(sw, pageLoad){
    let pId = sw.parentElement.id;
    let myChar = sw.textContent; 
    let on = 'On' == pId.substring(pId.length -2);
    let rest = pId.substring(0, pId.length -2);
    let clone = sw.cloneNode(true);
    if(on){
        let newSpot = document.querySelector(`#${rest}Off`);
        newSpot.appendChild(clone);
        if(!pageLoad){updateSpecial(myChar, true); updatePreview();}
    }
    else{
        let newSpot = document.querySelector(`#${rest}n`);
        newSpot.appendChild(clone);
        if(!pageLoad){updateSpecial(myChar, false); updatePreview();}
    }
    sw.remove();
    clone.addEventListener('click', () => {switchListener(clone, false);})
    
}

//called only if flipping on a non-pageload instance
function updateSpecial(myChar, remove){
    if(remove){
        preferences.mySpecials.splice(preferences.mySpecials.indexOf(myChar), 1);
    }
    else{
        preferences.mySpecials.push(myChar);
    }
    pushNewPref();
}

// SLIDER SECTION

//handles buttons that open the sliders
for(let button of mySliderButtons){
    let type = button.previousElementSibling.innerHTML;
    type = type.substring(0, type.length-2);
    button.addEventListener('click', (e) => {
        generateSlider(type, button);
    });
}

//tests if slider is active, then closes/opens the slider 
function generateSlider(type, button){
    let trySlider = document.querySelector(`#slider${type}`);
    if(trySlider){
        const handler = createHandler(trySlider);
        trySlider.removeEventListener('input', handler);
        updateSliderPrefs(true, trySlider);
        trySlider.remove();
    }
    else{
        button.insertAdjacentHTML("afterend", slider);
        let mySlider = button.nextElementSibling;
        mySlider.id = `slider${type}`;
        const handler = createHandler(mySlider);
        mySlider.addEventListener('input', handler);
        updateSliderPrefs(false, mySlider);
    }
}

//circumvent JS inability to delete event listeners if we used a function that takes parameters
function createHandler(mySlider){   
    return function() {
        updateSliderPrefs(false, mySlider);
    }
}

//update preferences and page visual.
function updateSliderPrefs(closing, mySlider){
    let newValue = closing ? 0 : mySlider.value;
    mySlider.nextElementSibling.innerHTML = (newValue) + '%';
    newValue = Number(newValue)/100;
    if(mySlider.id.substring(6) == 'capital'){
        preferences.Capitals = newValue;
    }
    else{
        preferences.Numbers = newValue;
    }
    pushNewPref();
}

// TARGET SECTION

let myButtons = document.querySelectorAll(".button");
for(let button of myButtons){
    button.addEventListener('click', (e) => {updateTargetPreference(button);});
}

function updateTargetPreference(button){
    let value = button.getAttribute('style') == null || button.getAttribute('style') == '';
    if(value){
        setTargetKey('Space');
        let curr = button.id;
        let types = ['left', 'right', 'adapt'];
        types.splice(types.indexOf(curr), 1);
        for(let other of types){swapButtonVisual(document.querySelector(`#${other}`), false);}
        preferences.target = curr;
    }
    else{
        preferences.target = null;
    }
    swapButtonVisual(button, value);
    pushNewPref();
}

function swapButtonVisual(button, value){
    let newBg = value ? 'background-color: rgb(255, 102, 0);' : '';
    button.setAttribute('style', newBg);
}

// KEYSTROKES TARGET FEATURE
for(let key of keyStrokes){
    key.addEventListener('click', (e) => {setTargetKey(key.id);});
}

function setTargetKey(key){
    let oldKey = document.querySelector(".target");
    if(oldKey){oldKey.setAttribute('class', 'none');}
    if(key != 'Space'){
        let newKey = document.querySelector(`#${key}`);
        key = key === 'shiftRight' ? 'shiftLeft' : key;

        newKey.setAttribute('class', 'target');
        newKey.setAttribute('style', '');
        preferences.key = []; 
        preferences.key.push(key);
        if(preferences.target){
            document.querySelector(`#${preferences.target}`).setAttribute('style', '');
            preferences.target = null;
        }
    }
    else{
        preferences.key = null;
    }
    pushNewPref();
    showKeyAcc(document.querySelectorAll(".keyDisplay .none"));
}

// PREVIEW TEST FEATURE

// edited functions from exam.js 
import {getWords, getNewLine} from "/blitzType/JavaScript/functions.js";
async function updatePreview(){
    let hold = await getWords(preferences);
    const words = hold.split(/\r?\n/);
    document.querySelector('#previewBox').innerHTML = getNewLine(words);
}

//cycle preview
let timerInterval = setInterval(() => {
        updatePreview();
}, 10000);
// preference updater

function pushNewPref(){
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}