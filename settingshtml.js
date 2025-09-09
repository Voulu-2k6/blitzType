//on load of settings.html

//get known preferences
let userSettings = JSON.parse(localStorage.getItem('userPreferences'));
let preferences = userSettings ? userSettings : { 
    'Capitals' : 0, 'Numbers' : 0, 'Punctuation' : 0, 'Specials' : 0, 'Words' : 10,
    adapt: false, key: null, 'endless': false, 'mySpecials' : [], 'doSpecials' : false
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
        if(!pageLoad){updateSpecial(myChar, true);}
    }
    else{
        let newSpot = document.querySelector(`#${rest}n`);
        newSpot.appendChild(clone);
        if(!pageLoad){updateSpecial(myChar, false);}
    }
    sw.remove();
    clone.addEventListener('click', () => {switchListener(clone, false);})
    updatePreview(); //TBI
}

//called only if flipping on a non-pageload instance
function updateSpecial(myChar, remove){
    if(remove){
        preferences.mySpecials.splice(preferences.mySpecials.indexOf(myChar));
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
    let trySlider = document.querySelector(`#slider${type.substring(0, type.length)}`);
    if(trySlider){
        // turn off Slider
    }
    else{
        button.insertAdjacentHTML("afterend", slider);
        let mySlider = button.nextElementSibling;
        mySlider.id = `slider${type.substring(0, type.length)}`;
    }
}

// TARGETED KEY

// function getSliderValue(button){
//     let which = button.getAttribute('id').substring(7);
//     let value = 0.5;

//     button.innerHTML = `<p>${which}</p><div id="finish${which}" class="button">done</div>
//     <input type="range" id="mySlider${which}" min="0" max="100" value="50" step="1">`;

//     const mySlider = document.querySelector(`#mySlider${which}`);
//     mySlider.addEventListener('input', () => {
//         value = mySlider.value/100;
//     });

//     document.querySelector(`#finish${which}`).addEventListener('click', () => {
//         if(which == "Capitals"){preferences.Capitals = value;}
//         else if(which == "Numbers"){preferences.Numbers = value;}
//         else if(which == "Words"){preferences.Words = 5+Math.floor(value*25);}
//         else{console.log("error: unknown slider");}

//         if(which == "Words"){button.innerHTML = `<p>${which}: ` + (5+Math.floor(value*25)) + `</>`;}
//         else{button.innerHTML = `<p>${which}: ` + value + `</>`;}
//         sliderSwitches[which] = false;
//         button.firstElementChild.addEventListener('click', () => {
//             if(!(sliderSwitches[which])){
//             sliderSwitches[which] = true;
//             getSliderValue(button);
//         }
//     });
//     });
//     pushPreferences();
// }

import {getWords, getNewLine} from "/blitzType/functions.js";
let words = await getWords();
function updatePreview(){
    document.querySelector('#previewBox').innerHTML = getNewLine(words);
}

function pushNewPref(){
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}