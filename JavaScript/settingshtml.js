//on load of settings.html

//get known preferences
let userSettings = localStorage.getItem('userPreferences');
let preferences = userSettings ? JSON.parse(userSettings) : { 
    'Capitals' : 0, 'Numbers' : 0, 'Specials' : 0, 'Words' : 10,
    adapt: false, key: null, 'endless': false, 'mySpecials' : []
}

// STARTUP SECTION
// getting ids mapped to the character for the below if statement.
let mySwitches = document.querySelectorAll('.list div');
let myButtons = document.querySelectorAll('.button');
let switchMap = new Map();
mySwitches.forEach((sw) => {
    switchMap.set(sw.innerHTML, sw.id);
});

// if we had settings, here is where we will set up the page correctly.
if(userSettings){
    for(const spec of userSettings.mySpecials){
        switchListener(document.querySelector(`#${switchMap.get(spec)}`), true);
    }

    for(const setting of ['Capitals', 'Numbers']){
        document.querySelector(`#${setting}Holder`).innerHTML = (Number(preferences[setting])*100) + '%';
        if(preferences[setting] > 0){
            let button = setting == 'Capitals' ? myButtons[0] : myButtons[1];
            let type = setting == 'Capitals' ? 'capital' : 'digit';
            generateSlider(type, button);
        }
    }
}

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
    preferences = JSON.parse(localStorage.getItem('userPreferences'));
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
let slider = `<input type="range" min="0" max="100" value="50" step="1">`;
for(let button of myButtons){
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

// TARGETED KEY

// PREVIEW TEST FEATURE

// edited functions from exam.js 
import {getWords, getNewLine} from "/blitzType/JavaScript/functions.js";
async function updatePreview(){
    let hold = await getWords();
    const words = hold.split(/\r?\n/);
    document.querySelector('#previewBox').innerHTML = getNewLine(words);
}

function pushNewPref(){
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}