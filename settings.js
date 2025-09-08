/*Settings
    Need:
        storing settings in local storage
        implement target accuracy, current hardcoded at 0.7
        implement specials frequency, current hardcoded at 0.3
        */
        
import {nonLetters} from '/blitzType/constants.js';

//pull preferences and/or create them
let userSettings = JSON.parse(localStorage.getItem('userPreferences'));
let preferences = userSettings ? userSettings : { 
    'Capitals' : 0, 'Numbers' : 0, 'Punctuation' : 0, 'Specials' : 0, 'Words' : 10,
    adapt: false, key: null, 'endless': false, 'mySpecials' : [], 'doSpecials' : false
}

//rate button listeners
let sliderSwitches = {'Capitals' : false, 'Numbers' : false, 'Words' : false}
const sliders = document.querySelectorAll(".slider");
for (let slider of sliders){
    slider.firstElementChild.addEventListener('click', () => {
        if(!(sliderSwitches[slider.getAttribute('id').substring(7)])){
            sliderSwitches[slider.getAttribute('id').substring(7)] = true;
            getSliderValue(slider);
        }
    });
}

//targetedKeyListener
let targetKey = null;
let targetKeyBox = document.querySelector("#keyFocus");
let targetSwitch = false;
targetKeyBox.addEventListener('click', () => {
    if(!targetSwitch){
        targetSwitch = true;
        targetKeyBox.innerHTML = `<p>Targeted Key: </p><input type="text" id="targetedKeyButton">`;
        let userTarget = document.querySelector("#targetedKeyButton");
        userTarget.addEventListener('keydown', (e) => {
            if(!specialKeyCodes.includes(e.code)){
                targetKeyBox.innerHTML = `<p>Targeted Key: </p><div id="targetedKeyButton">${e.key}</div>`
                targetKey = e.key;
                preferences.key = e.key;
                targetSwitch = false;
                pushPreferences();
            }
        });
    }
});

//dropDown button listeners
const dropDowns = document.querySelectorAll(".dropDownButton");
for(let d of dropDowns){
    d.addEventListener('click', () => {
        let myID = d.getAttribute('id');
        myID = myID.substring(0, myID.length-6);
        let myMenu = document.querySelector(`#${myID}Menu`);
        let myStyle = myMenu.getAttribute('style');
        let isOpen = !(myStyle == null || myStyle == '');
        let newStyle = isOpen ? '' : 'display:flex';
        myMenu.setAttribute('style', newStyle);
    });
}

//other button listeners
const buttons = document.querySelectorAll(".button");
for(let button of buttons){
    button.addEventListener('click', () => {
        let value;
        if(button.getAttribute('style') == null || button.getAttribute('style') == ''){
            button.setAttribute('style', 'background-color: rgb(255, 102, 0);');
            value = true;
        }
        else{
            button.setAttribute('style', '');
            value = false;
        }
        updatePreferences(button.innerHTML, value);
    });
}

function getSliderValue(button){
    let which = button.getAttribute('id').substring(7);
    let value = 0.5;

    button.innerHTML = `<p>${which}</p><div id="finish${which}" class="button">done</div>
    <input type="range" id="mySlider${which}" min="0" max="100" value="50" step="1">`;

    const mySlider = document.querySelector(`#mySlider${which}`);
    mySlider.addEventListener('input', () => {
        value = mySlider.value/100;
    });

    document.querySelector(`#finish${which}`).addEventListener('click', () => {
        if(which == "Capitals"){preferences.Capitals = value;}
        else if(which == "Numbers"){preferences.Numbers = value;}
        else if(which == "Words"){preferences.Words = 5+Math.floor(value*25);}
        else{console.log("error: unknown slider");}

        if(which == "Words"){button.innerHTML = `<p>${which}: ` + (5+Math.floor(value*25)) + `</>`;}
        else{button.innerHTML = `<p>${which}: ` + value + `</>`;}
        sliderSwitches[which] = false;
        button.firstElementChild.addEventListener('click', () => {
            if(!(sliderSwitches[which])){
            sliderSwitches[which] = true;
            getSliderValue(button);
        }
    });
    });
    pushPreferences();
}

function updatePreferences(preference, value){
    switch(preference) {
        case "Capitals": preferences.Capitals = value; break;
        case "Numbers": preferences.Numbers = value; break;
        case "key": preferences.key = value; break;
        case "endless mode": preferences["endless"] = value; break;
        default: if(nonLetters.includes(preference.substring(0,1)))
        {
            if(value){
                preferences.mySpecials.push(preference);
            }
            else{
                preferences.mySpecials.splice(preferences.mySpecials.indexOf(preference), 1);
            }
            preferences.doSpecials = preferences.mySpecials.length > 0 ? true : false;
        }
        else{
            console.log("failed to update preferences.")
        }
    }
    pushPreferences();
}

function pushPreferences(){
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}