/*  Need: Read stats as the text is completed
        need backspace function for true accuracy integration
        need a way to check if this is the first miss // integrate into accuracy check
        need global hit/miss for total accuracy
        need global words and time for total WPM
    Need: storing stats in local storage
    Need: Implement backspace function
    Need: implement capitals, punctuation, numbers, special characters in test
        make buttons that correspond to hardcoded booleans which the takeExam function should get as parameters
            punctuation and special characters can be an array of bools, each having a button onscreen
            , . ? ! ; : ' " - (em dashes and en dashes?)
            <> /\ {} [] + ` ~ _ = | @ # $ % ^ & * ()
            1 2 3 4 5 6 7 8 9 0
    make these doubles, representing frequency which we can implement with the buttons and maybe a slider? 0-1
    Need: implement target accuracy, current hardcoded at 0.7
    Need: implement a targeted key
        buttons to choose from, another value to be passed
    Need: find a better font
    Future: error skipping
 
 Bugs: 
    Timer starts on exam load, not on first character clicked. 
    Spacebar on problemkeys is invisible
    nothing to show how far the slider is before setting value
 */

//TBI: replace with event.code markers to fix rshift, alt, ctrl
const keyMap = {'\`': 'Backquote', '~': 'Backquote', '1': 'Digit1', '!': 'Digit1','2': 'Digit2', '@': 'Digit2','3': 'Digit3', '#': 'Digit3','4': 'Digit4', '$': 'Digit4',
    '5': 'Digit5', '%': 'Digit5','6': 'Digit6', '^': 'Digit6','7': 'Digit7', '&': 'Digit7','8': 'Digit8', '*': 'Digit8','9': 'Digit9', '(': 'Digit9','0': 'Digit0', ')': 'Digit0',
    '-': 'Minus', '_': 'Minus','=': 'Equal', '+': 'Equal','[': 'BracketLeft', '{': 'BracketLeft',']': 'BracketRight', '}': 'BracketRight','\\': 'Backslash', '|': 'Backslash',
    ';': 'Semicolon', ':': 'Semicolon',"'": "Quote", '"': "Quote",',': 'Comma', '<': 'Comma','.': 'Period', '>': 'Period','/': 'Slash', '?': 'Slash','a': 'KeyA', 'A': 'KeyA',
    'b': 'KeyB', 'B': 'KeyB','c': 'KeyC', 'C': 'KeyC','d': 'KeyD', 'D': 'KeyD','e': 'KeyE', 'E': 'KeyE','f': 'KeyF', 'F': 'KeyF','g': 'KeyG', 'G': 'KeyG','h': 'KeyH', 'H': 'KeyH',
    'i': 'KeyI', 'I': 'KeyI','j': 'KeyJ', 'J': 'KeyJ','k': 'KeyK', 'K': 'KeyK','l': 'KeyL', 'L': 'KeyL','m': 'KeyM', 'M': 'KeyM','n': 'KeyN', 'N': 'KeyN','o': 'KeyO', 'O': 'KeyO',
    'p': 'KeyP', 'P': 'KeyP','q': 'KeyQ', 'Q': 'KeyQ','r': 'KeyR', 'R': 'KeyR','s': 'KeyS', 'S': 'KeyS','t': 'KeyT', 'T': 'KeyT','u': 'KeyU', 'U': 'KeyU','v': 'KeyV', 'V': 'KeyV',
    'w': 'KeyW', 'W': 'KeyW','x': 'KeyX', 'X': 'KeyX','y': 'KeyY', 'Y': 'KeyY','z': 'KeyZ', 'Z': 'KeyZ',' ': 'Space',};
const ShiftMap = { '~': 'Backquote', '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5', '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0', 
    '_': 'Minus', '+': 'Equal', '{': 'BracketLeft', '}': 'BracketRight', '|': 'Backslash', ':': 'Semicolon', '"': 'Quote', '<': 'Comma', '>': 'Period', '?': 'Slash', 'A': 'KeyA', 'B': 'KeyB', 
    'C': 'KeyC', 'D': 'KeyD', 'E': 'KeyE', 'F': 'KeyF', 'G': 'KeyG', 'H': 'KeyH', 'I': 'KeyI', 'J': 'KeyJ', 'K': 'KeyK', 'L': 'KeyL', 'M': 'KeyM', 'N': 'KeyN', 'O': 'KeyO', 'P': 'KeyP', 'Q': 'KeyQ', 
    'R': 'KeyR', 'S': 'KeyS', 'T': 'KeyT', 'U': 'KeyU', 'V': 'KeyV', 'W': 'KeyW', 'X': 'KeyX', 'Y': 'KeyY', 'Z': 'KeyZ' };
const specialKeyCodes = ['Tab', 'CapsLock', 'Backspace', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'];

//for creating and running the exam
let hold = await getWords();
const words = hold.split(/\r?\n/);
const examBoxDiv = document.querySelectorAll("#examText div");
let myExam = [];
let myChars = [];
let myProgress = 0;
let examOn = false;
let wordCount = 10;

//for recording stats
let examTime = 0; 
let hits = 0;
let misses = 0;

//for key-specific stats
let keyStats = {}; //get from localStorage eventually
for(let key in keyMap){
    keyStats[key] = {
        hits: 0,
        misses: 0,
        accuracy: 0
    }
}

//for preferences
let preferences = { // add all punctuations and special characters
    'Capitals' : 0, 'Numbers' : 0
}

//exam button listener 
document.querySelector("#makeExamButton").addEventListener('click', () => {if(examOn){releaseNext(myExam[myProgress]);} takeExam();});

//rate button listeners
let sliderSwitches = {'Capitals' : false, 'Numbers' : false}
const sliders = document.querySelectorAll(".slider");
for (let slider of sliders){
    slider.addEventListener('click', () => {
        if(!(sliderSwitches[slider.getAttribute('id').substring(7)])){
            sliderSwitches[slider.getAttribute('id').substring(7)] = true;
            getSliderValue(slider);
        }
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

//keystrokes listeners
document.addEventListener('keydown', (e) => {
    keyPress(e.code);
    if(examOn){
        if(myProgress < myExam.length && !(specialKeyCodes.includes(e.code))){ // alter for enter/tab keys later?
            if(myExam[myProgress] === e.key){
                myChars[myProgress].setAttribute('style', 'background-color: rgb(255, 102, 0);');
                myProgress++;
                hits++;
                keyStats[e.key].hits++;
                if(myProgress === myExam.length){
                    console.log("Test complete!"); examOn = false;
                    endTimer();
                    doStats();
                }
                else{
                    showNext(myExam[myProgress]);
                }
            }
            else{
                myChars[myProgress].setAttribute('style', 'background-color: red;');
                misses++;
                keyStats[e.key].misses++;
            }
        }   
    }
});

document.addEventListener('keyup', (e) => {
    keyRelease(e.code);
});

function takeExam(){
    //clear previous test
    for(let i = 0; i < 5; i++){
        examBoxDiv[i].innerHTML = '';
    }
    myExam = [];

    //clear stats
    examTime = 0;
    hits = 0;
    misses = 0;

    document.querySelector("#statsWords").innerHTML = 'Words: ' + wordCount;

    //generate test
    let myRow = [];
    let characters = 0;
    for(let i = 0; i < wordCount; i++){
        let addMe;
        if(Math.random() >= preferences.Numbers){ // number or word according to rate
            addMe = words[Math.floor((Math.random()*2993))]; // get word
            if(Math.random() < preferences.Capitals){addMe = toTitleCase(addMe);} //uppercase according to rate
        }
        else{
            addMe = Number(Math.floor(Math.random()*1000));
        }
        characters += addMe.length;
        if(characters > 50){
            myExam.push(myRow.join(" ").split(''));
            myRow = [];
            characters = addMe.length;
        }
        myRow.push(addMe);
    }
    myExam.push(myRow.join(" ").split(''));

    //upload test
    let myCarry = [];
    for(let line in myExam){
        for(let char of myExam[line]){
            let pageChar = document.createElement('p');
            pageChar.innerHTML = (char === " ") ? '&nbsp;' : char;
            examBoxDiv[line].insertAdjacentElement('beforeend', pageChar);
            myCarry.push(char);
        }
        if(line != myExam.length-1){
            let pageChar = document.createElement('p');
            pageChar.innerHTML = '&nbsp;';
            examBoxDiv[line].insertAdjacentElement('beforeend', pageChar);
            myCarry.push(' ');
        }
    }

    //Listen for good input and progress the test
    myProgress = 0;
    myExam = myCarry;
    myChars = document.querySelectorAll("#examText p");
    showNext(myExam[0]);
    examOn = true;
    startTimer();
}

function doStats(){
    document.querySelector("#statsHits").innerHTML = "Keys hit: " + hits;
    document.querySelector("#statsMisses").innerHTML = "Keys missed: " + misses;
    document.querySelector("#statsAccuracy").innerHTML = "Accuracy: " + Number(((hits/(hits+misses))*100).toFixed(2));
    document.querySelector("#statsTime").innerHTML = "Time: " + formatMS(examTime);
    document.querySelector("#statsWPM").innerHTML = "Words per minute: " + Number((wordCount/(examTime/(1000*60))).toFixed(2));
    let problemKeys = [];
    for(let key in keyStats){
        if(keyStats[key].hits != 0){
            keyStats[key].accuracy = keyStats[key].hits / (keyStats[key].hits+keyStats[key].misses);
            if(keyStats[key].accuracy < 0.7){problemKeys.push(key);}
        }
    }
    console.log(problemKeys);
    let needWork = document.querySelector("#needWork");
    needWork.innerHTML = "Keys that need work:"; 
    for(let key of problemKeys){
        needWork.innerHTML += " " + key;
    }
}

function keyPress(key){
    document.querySelector(`#${key}`).setAttribute('style','border: 1px solid orangered; background-color:rgb(0,0,0); box-shadow: 0 0 3px orangered');
    if(key === 'meta' || key === 'tab'){setTimeout(() => {document.querySelector(`#${key}`).setAttribute('style','');}, 1000);}
}

function keyRelease(key){
    document.querySelector(`#${key}`).setAttribute('style','border: 1px solid white; background-color:rgb(95,95,95);');
}

function showNext(nextChar){
    if(nextChar in ShiftMap){keyPress('ShiftLeft');}
    keyPress(keyMap[nextChar]);
}

function releaseNext(nextChar){
    if(nextChar in ShiftMap){keyRelease('ShiftLeft');}
    keyRelease(keyMap[nextChar]);
}

let timerInterval = null; 
let startTimestamp = 0;   

function startTimer() { //virtual stopwatch integration possible 
  startTimestamp = Date.now();
  timerInterval = setInterval(() => {
    examTime = Date.now() - startTimestamp;
  }, 50); // update every however many ms
}

function endTimer() { 
  clearInterval(timerInterval);
  examTime = Date.now() - startTimestamp;
  console.log(`Final time: ${examTime}`);
}

function formatMS(ms){
    let minutes = Math.floor(ms/(60*1000));
    let seconds = (ms%(60*1000))/1000;
    let output = minutes ? Number(minutes) + " Minutes, " : "";
    return output + Number(seconds.toFixed(3)) + " Seconds";
}

function updatePreferences(preference, value){
    switch(preference){
        case "Capitals": preferences.Capitals = value; break;
        case "Numbers": preferences.Numbers = value; break;
        default: console.log('failed to update preferences');
    }
}

async function getWords(){
    const response = await fetch('words.text');
    const text = response.text();
    return text;
}

function toTitleCase(word){
    return (word.substring(0,1).toUpperCase()) + word.substring(1);
}

function getSliderValue(button){
    let which = button.getAttribute('id').substring(7);
    let value = 0.5;

    button.innerHTML += `<input type="range" id="mySlider" min="0" max="100" value="50" step="1">
    <div id="finish${which}">done</div>`;

    const mySlider = document.querySelector('#mySlider');
    mySlider.addEventListener('input', () => {
        value = mySlider.value/100;
    });

    document.querySelector(`#finish${which}`).addEventListener('click', () => {
        if(which == "Capitals"){preferences.Capitals = value;}
        else if(which == "Numbers"){preferences.Numbers = value;}
        else{console.log("error: unknown slider");}
        button.innerHTML = `${which}: ` + value;
    });
}