//on load of settings.html

//get known preferences
let userSettings = JSON.parse(localStorage.getItem('userPreferences'));
let preferences = userSettings ? userSettings : { 
    'Capitals' : 0, 'Numbers' : 0, 'Punctuation' : 0, 'Specials' : 0, 'Words' : 10,
    adapt: false, key: null, 'endless': false, 'mySpecials' : []
}

// STARTUP SECTION
// getting ids mapped to the character for the below if statement.
let mySwitches = document.querySelectorAll('.list div');
let switchMap = new Map();
mySwitches.forEach((sw) => {
    switchMap.set(sw.innerHTML, sw.id);
});

// if we had settings, here is where we will set up the page correctly.
if(userSettings){
    for(const spec of userSettings.mySpecials){
        switchListener(document.querySelector(`#${switchMap.get(spec)}`), true);
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
    let myChar = sw.textContent; //improve to catch all
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
        preferences.mySpecials.splice(preferences.mySpecials.indexOf(myChar, 1));
    }
    else{
        preferences.mySpecials.push(myChar);
    }
    pushNewPref();
}

// SLIDER SECTION

let slider = `<input type="range" min="0" max="100" value="50" step="1">`;
let buttons = document.querySelectorAll('.button');
for(let button of buttons){
    let type = button.previousElementSibling.innerHTML;
    button.addEventListener('click', (e) => {
        generateSlider(type, button);
    });
}

function generateSlider(type, button){
    let trySlider = document.querySelector(`#slider${type.substring(0, type.length-1)}`);
    if(trySlider){
        const handler = createHandler(trySlider);
        trySlider.removeEventListener('input', handler);
        readSlider(trySlider, -1);
        trySlider.remove();
        updateSliderPrefs(true, type, 0);
    }
    else{
        button.insertAdjacentHTML("afterend", slider);
        let mySlider = button.nextElementSibling;
        mySlider.id = `slider${type.substring(0, type.length-1)}`;
        const handler = createHandler(mySlider);
        mySlider.addEventListener('input', handler);
        updateSliderPrefs(false, type, 0.5);
    }
}

function createHandler(mySlider){   
    return function() {
        readSlider(mySlider, 0);
    }
}

function readSlider(mySlider, value){
    let inner = value == -1 ? '' : (mySlider.value) + '%';
    mySlider.nextElementSibling.innerHTML = inner;
    updateSliderPrefs(false, mySlider.id.substring(6), value)
}

function updateSliderPrefs(closing, type, value){
    let newValue = closing ? 0 : value;
    newValue/100;
    if(type == 'capitals'){
        preferences.Capitals = newValue;
    }
    else{
        preferences.Numbers = newValue;
    }
    pushNewPref();
}

// TARGETED KEY


import {getWords, getNewLine} from "/blitzType/functions.js";
async function updatePreview(){
    let hold = await getWords();
    const words = hold.split(/\r?\n/);
    document.querySelector('#previewBox').innerHTML = getNewLine(words);
}

function pushNewPref(){
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}