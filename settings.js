/*Settings
    Need:
        Words: small med large
        Capitals: T/F shortcut: 0.4 rate
        Punctuation: T/F shortcut: (. , ? !) 0.3 rate
        show selected settings on page load.
        */
        
//pull preferences and/or create them
let userSettings = JSON.parse(localStorage.getItem('userPreferences'));
let preferences = userSettings ? userSettings : { 
    'Capitals' : 0, 'Numbers' : 0, 'Specials' : 0, 'Words' : 10,
    adapt: false, key: null, 'endless': false, 'mySpecials' : []
}
if(userSettings){showMySettings();} // show which settings are on on page load, TBI

//other button listeners To be fixed...
const buttons = document.querySelectorAll(".button");
for(let button of buttons){
    button.addEventListener('click', () => {
        let value = button.getAttribute('style') == null || button.getAttribute('style') == '';
        if(button.id.substring(button.id.length-4) == 'Test'){
            if(value){
                let curr = button.id.substring(0, button.id.length-4);
                let sizes = ['small', 'medium', 'large'];
                sizes.splice(sizes.indexOf(curr), 1);
                swapButtonVisual(button, value);
                for(let other of sizes){swapButtonVisual(document.querySelector(`#${other}Test`), false);}
                switch (curr){
                    case 'small': preferences.Words = 6; break;
                    case 'medium': preferences.Words = 15; break;
                    case 'large': preferences.Words = 24; break;
                    default: break;
                }
                pushPreferences();
            }
        }
        else{
            updatePreferences(button, value);
        }
    });
}

function swapButtonVisual(button, value){
    let newBg = value ? 'background-color: rgb(255, 102, 0);' : '';
    button.setAttribute('style', newBg);
}

function updatePreferences(button, value){
    swapButtonVisual(button, value);
    switch(button.id) {
        case "capitalsButton": preferences.Capitals = value ? 0.4 : 0; break;
        case "punctuationButton": if(value){preferences.mySpecials = [',', '.', '!', '?']; preferences.Specials = 0.4} else {preferences.mySpecials = []; preferences.Specials = 0;} break;
        case "endlessModeButton": preferences["endless"] = value; break;
        default: console.log('failed to update preferences: found element with id ' + button.id); break;}
    pushPreferences();
}

function pushPreferences(){
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

function showMySettings(){
    if(preferences.Capitals > 0){swapButtonVisual(document.querySelector('#capitalsButton'),true);}
    if(preferences.Specials > 0 && preferences.mySpecials.length > 0){swapButtonVisual(document.querySelector('#punctuationButton'),true);}
    if(preferences.endless){swapButtonVisual(document.querySelector('#endlessModeButton'),true);}
    switch(preferences.Words){
        case 6: swapButtonVisual(document.querySelector('#smallTest'),true); break;
        case 15: swapButtonVisual(document.querySelector('#meduimTest'),true); break;
        case 24: swapButtonVisual(document.querySelector('#largeTest'),true); break;
        default: break;
    }
}