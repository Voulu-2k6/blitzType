//on load, seperate page from the rest

import {keyMap} from '/blitzType/constants.js';

let userSettings = JSON.parse(localStorage.getItem('userPreferences'));
let preferences = userSettings ? userSettings : { 
    'Capitals' : 0, 'Numbers' : 0, 'Punctuation' : 0, 'Specials' : 0, 'Words' : 10,
    adapt: false, key: null, 'endless': false, 'mySpecials' : [], 'doSpecials' : false
}

if(userSettings){
    for(const spec of userSettings.mySpecials){
        console.log(spec);
    }
}
else{

}

let mySwitches = document.querySelectorAll('.list div');
console.log(mySwitches);
for(let sw of mySwitches){
    sw.addEventListener('click', () => {
        let pId = sw.parentElement.id;
        let myChar = sw.textContent; //improve to catch all
        let on = 'On' == pId.substring(pId.length -2);
        let rest = pId.substring(0, pId.length -2);
        let clone = sw.cloneNode(true);
        if(on){
            let newSpot = document.querySelector(`#${rest}ff`);
            console.log(`#${rest}ff`);
            newSpot.appendChild(clone);
            preferences.mySpecials.splice(mySpecials.indexOf(myChar));
        }
        else{
            let newSpot = document.querySelector(`#${rest}On`);
            console.log(`#${rest}On`);
            newSpot.appendChild(clone);
            preferences.mySpecials.push(myChar);
        }
        sw.remove();
        updatePreview(); //TBI
    });
}


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

function updatePreview(){}