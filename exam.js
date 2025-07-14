/*Settings
    Need:
        storing settings in local storage
        implement target accuracy, current hardcoded at 0.7
        implement specials frequency, current hardcoded at 0.3
    Tweaks:
        targeted key selection sucks
        punctuation lacks em dashes and en dashes
        nothing to show how far the slider is before setting value
Exam
    Need: 
        Implement backspace function ***
        error skipping ***
        enter key on endless mode
    Tweaks:
        Timer starts on exam load, not on first character clicked. 
Stats
    Need: 
        need backspace function for true accuracy integration
        display key stats when hovering on keystrokes
        display keys to work on on the keystrokes between tests.
    Tweaks:
        change hits from code to keys
        Spacebar on problemkeys is invisible
Style
    Need: find a better font
    settings looks ugly rn
    endless mode line animation*/


const keyMap = {'\`': 'Backquote', '~': 'Backquote', '1': 'Digit1', '!': 'Digit1','2': 'Digit2', '@': 'Digit2','3': 'Digit3', '#': 'Digit3','4': 'Digit4', '$': 'Digit4',
    '5': 'Digit5', '%': 'Digit5','6': 'Digit6', '^': 'Digit6','7': 'Digit7', '&': 'Digit7','8': 'Digit8', '*': 'Digit8','9': 'Digit9', '(': 'Digit9','0': 'Digit0', ')': 'Digit0',
    '-': 'Minus', '_': 'Minus','=': 'Equal', '+': 'Equal','[': 'BracketLeft', '{': 'BracketLeft',']': 'BracketRight', '}': 'BracketRight','\\': 'Backslash', '|': 'Backslash',
    ';': 'Semicolon', ':': 'Semicolon',"'": "Quote", '"': "Quote",',': 'Comma', '<': 'Comma','.': 'Period', '>': 'Period','/': 'Slash', '?': 'Slash','a': 'KeyA', 'A': 'KeyA',
    'b': 'KeyB', 'B': 'KeyB','c': 'KeyC', 'C': 'KeyC','d': 'KeyD', 'D': 'KeyD','e': 'KeyE', 'E': 'KeyE','f': 'KeyF', 'F': 'KeyF','g': 'KeyG', 'G': 'KeyG','h': 'KeyH', 'H': 'KeyH',
    'i': 'KeyI', 'I': 'KeyI','j': 'KeyJ', 'J': 'KeyJ','k': 'KeyK', 'K': 'KeyK','l': 'KeyL', 'L': 'KeyL','m': 'KeyM', 'M': 'KeyM','n': 'KeyN', 'N': 'KeyN','o': 'KeyO', 'O': 'KeyO',
    'p': 'KeyP', 'P': 'KeyP','q': 'KeyQ', 'Q': 'KeyQ','r': 'KeyR', 'R': 'KeyR','s': 'KeyS', 'S': 'KeyS','t': 'KeyT', 'T': 'KeyT','u': 'KeyU', 'U': 'KeyU','v': 'KeyV', 'V': 'KeyV',
    'w': 'KeyW', 'W': 'KeyW','x': 'KeyX', 'X': 'KeyX','y': 'KeyY', 'Y': 'KeyY','z': 'KeyZ', 'Z': 'KeyZ',' ': 'Space', '&nbsp;': 'Space', 'Shift': 'ShiftLeft'};
const reverseKeyMap = {"Backquote": "`", "Backslash": "\\", "BracketLeft": "[", "BracketRight": "]", "Comma": ",", 
    "Digit0": "0", "Digit1": "1", "Digit2": "2", "Digit3": "3", "Digit4": "4", "Digit5": "5", 
    "Digit6": "6", "Digit7": "7", "Digit8": "8", "Digit9": "9", "Equal": "=", "KeyA": "a", "KeyB": "b", 
    "KeyC": "c", "KeyD": "d", "KeyE": "e", "KeyF": "f", "KeyG": "g", "KeyH": "h", "KeyI": "i", "KeyJ": "j", 
    "KeyK": "k", "KeyL": "l", "KeyM": "m", "KeyN": "n", "KeyO": "o", "KeyP": "p", "KeyQ": "q", "KeyR": "r", 
    "KeyS": "s", "KeyT": "t", "KeyU": "u", "KeyV": "v", "KeyW": "w", "KeyX": "x", "KeyY": "y", "KeyZ": "z", 
    "Minus": "-", "Period": ".", "Quote": "'", "Semicolon": ";", "Slash": "/", "Space": "Space", "ShiftLeft": "Shift"}
const shiftMap = { '~': 'Backquote', '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5', '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0', 
    '_': 'Minus', '+': 'Equal', '{': 'BracketLeft', '}': 'BracketRight', '|': 'Backslash', ':': 'Semicolon', '"': 'Quote', '<': 'Comma', '>': 'Period', '?': 'Slash', 'A': 'KeyA', 'B': 'KeyB', 
    'C': 'KeyC', 'D': 'KeyD', 'E': 'KeyE', 'F': 'KeyF', 'G': 'KeyG', 'H': 'KeyH', 'I': 'KeyI', 'J': 'KeyJ', 'K': 'KeyK', 'L': 'KeyL', 'M': 'KeyM', 'N': 'KeyN', 'O': 'KeyO', 'P': 'KeyP', 'Q': 'KeyQ', 
    'R': 'KeyR', 'S': 'KeyS', 'T': 'KeyT', 'U': 'KeyU', 'V': 'KeyV', 'W': 'KeyW', 'X': 'KeyX', 'Y': 'KeyY', 'Z': 'KeyZ'};
const specialKeyCodes = ['Tab', 'CapsLock', 'Backspace', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'];
const letters = 'abcdefghijklmnopqrstuvwyxz'.split('');
const nonLetters = ["~", "`", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "=", "{", "}", "[", "]", "\\", "/", "|", "<", ">", ".", ",", "!", "?", ";", ":", "-", "'", "\""];

//for creating and running the exam
let hold = await getWords();
const words = hold.split(/\r?\n/);
const examBoxDiv = document.querySelectorAll("#examText div");
let myExam = [];
let myLines = [];
let myChars = [];
let myProgress = 0;
let miss = false;
let firstMiss = true;
let examOn = false;

//for recording stats
let wordCount = 10;
let examTime = 0; 
let hits = 0;
let trueHits = 0;
let misses = 0;
let trueMisses = 0;

let userStats = JSON.parse(localStorage.getItem('userStats'));
let totalHits = userStats == null || userStats.totalHits == null ? 0 : userStats.totalHits;
let totalMisses = userStats == null || userStats.totalMisses == null ? 0 :  userStats.totalMisses;
let totalTime = userStats == null || userStats.totalTime == null ? 0 : userStats.totalTime;
let totalWords = userStats == null || userStats.totalWords == null ? 0 : userStats.totalWords;

//for key-specific stats
let keyStats = {}; //get from localStorage eventually
for(let key in keyMap){
    keyStats[keyMap[key]] = {
        hits: 0,
        misses: 0,
        accuracy: 0,

        trueHits: 0,
        trueMisses: 0, 
        trueAccuracy: 0
    }
}
let problemKeys = [];

//for preferences
let preferences = { // add all punctuations and special characters
    'Capitals' : 0, 'Numbers' : 0, 'Punctuation' : 0, 'Specials' : 0, 'Words' : 10,
    key: null, 'endless': false, 'mySpecials' : [], 'doSpecials' : false
}

//exam button listener 
document.querySelector("#makeExamButton").addEventListener('click', () => {
    if(examOn){releaseNext(myExam[myProgress]);} 
    exam();
});

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

//keystrokes listeners
document.addEventListener('keydown', (e) => {
    keyPress(e.code);
    if(examOn && !(specialKeyCodes.includes(e.code))){hitCheck(e);}
});
document.addEventListener('keyup', (e) => {
    keyRelease(e.code);
});

function exam(){
    clearExam();
    if(preferences.endless){createEndless();}else{createExam();}
    uploadExam();
    startExam();
}

function clearExam(){
    softClear();
    myLines = [];
}

function softClear(){
    for(let i = 0; i < 5; i++){
        examBoxDiv[i].innerHTML = '';
    }
    myExam = [];
    examTime = 0;
    hits = 0;
    misses = 0;
    wordCount = preferences.Words;
}

function createEndless(){
    for(let i = 0; i < 3; i++){myLines.push(getNewLine());}
}

function createExam(){
    let myRow = [];
    let characters = 0;
    for(let i = 0; i < wordCount; i++){
        let addMe = getNewWord();
        addMe = ['/', '\\', "|", '-', '=', '+', '*', '^'].includes(addMe.substring(addMe.length-1)) ? addMe : addMe + ' ';
        characters += addMe.length;
        if(characters > 50){
            myLines.push(myRow.splice(0,myRow.length-1));
            myRow = [];
            characters = addMe.length;
        }
        for(let char of addMe.split('')){myRow.push(char);}
    }
    myLines.push(myRow.splice(0,myRow.length-1));
}

function uploadExam(){
    for(let line in myLines){
        for(let char of  myLines[line]){
            let pageChar = document.createElement('p');
            pageChar.innerHTML = (char === " ") ? '&nbsp;' : char;
            examBoxDiv[line].insertAdjacentElement('beforeend', pageChar);
            myExam.push(char);
        }
        if(line != myLines.length-1){
            let pageChar = document.createElement('p');
            pageChar.innerHTML = '&nbsp;';
            examBoxDiv[line].insertAdjacentElement('beforeend', pageChar);
            myExam.push(' ');
        }
    }
}

function startExam(){
    myProgress = 0;
    myChars = document.querySelectorAll("#examText p");
    showNext(myExam[0]);
    examOn = true;
    startTimer();
}

function doStats(){
    //update variables
    problemKeys = [];
    for(let key in keyStats){
        if(keyStats[key].hits != 0 || keyStats[key].misses != 0){
            keyStats[key].accuracy = keyStats[key].hits / (keyStats[key].hits+keyStats[key].misses);
            if(keyStats[key].accuracy < 0.92 && (keyStats[key].hits + keyStats[key].misses) > 15){problemKeys.push(key);}
        }
        if(keyStats[key].trueHits != 0){
            keyStats[key].trueAccuracy = keyStats[key].trueHits / (keyStats[key].trueHits+keyStats[key].trueMisses);
            if(keyStats[key].trueAccuracy < 0.88 && (keyStats[key].hits + keyStats[key].misses) > 15 && !problemKeys.includes(key)){problemKeys.push(key);}
        }
    }
    totalWords += wordCount;
    totalTime += examTime;

    //push to localStorage
    let localStats = {
        totalHits: totalHits,
        totalMisses: totalMisses,
        totalWords: totalWords,
        totalTime: totalTime
    };
    localStorage.setItem('userStats', JSON.stringify(localStats));

    //update display
    let needWork = document.querySelector("#needWork");
    needWork.innerHTML = "Keys that need work:"; 
    for(let key of problemKeys){needWork.innerHTML += " " + reverseKeyMap[key];} 
    highlightKeys();

    document.querySelector("#statsHits").innerHTML = "Keys hit: " + hits;
    document.querySelector("#statsMisses").innerHTML = "Keys missed: " + misses;
    document.querySelector("#statsAccuracy").innerHTML = "Accuracy: " + Number(((hits/(hits+misses))*100).toFixed(2));
    document.querySelector("#statsTime").innerHTML = "Time: " + formatMS(examTime);
    document.querySelector("#statsWPM").innerHTML = "Words per minute: " + Number((wordCount/(examTime/(1000*60))).toFixed(2));
    document.querySelector("#trueHits").innerHTML = "True hits: " + trueHits;
    document.querySelector("#trueMisses").innerHTML = "True misses: " + trueMisses;
    document.querySelector("#trueAcc").innerHTML = "True Accuracy: " + Number(((trueHits/(trueHits+trueMisses))*100).toFixed(2));
    document.querySelector("#averageAccuracy").innerHTML = "Average accuracy: " + Number(((totalHits/(totalHits+totalMisses))*100).toFixed(2));
    document.querySelector("#averageWPM").innerHTML = "Average words per minute: " + Number(((totalWords/(totalTime/(1000*60)))).toFixed(2));
    document.querySelector("#statsWords").innerHTML = 'Words: ' + wordCount;
}

function keyPress(key){
    let myBox = document.querySelector(`#${key}`);
    if(myBox.getAttribute('class') === '' || myBox.getAttribute('class') === null){
        myBox.setAttribute('style','border: 1px solid orangered; background-color:rgb(0,0,0); box-shadow: 0 0 3px orangered');
    }
    if(key === 'meta' || key === 'tab'){setTimeout(() => {keyRelease(key);}, 1000);}
}

function keyRelease(key){
    let myBox = document.querySelector(`#${key}`);
    if(myBox.getAttribute('class') === '' || myBox.getAttribute('class') === null){
        myBox.setAttribute('style','');
    }
}

function showNext(nextChar){
    if(nextChar in shiftMap){keyPress('ShiftLeft');}
    keyPress(keyMap[nextChar]);
}

function releaseNext(nextChar){
    if(nextChar in shiftMap){keyRelease('ShiftLeft');}
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
}

function formatMS(ms){
    let minutes = Math.floor(ms/(60*1000));
    let seconds = (ms%(60*1000))/1000;
    let output = minutes ? Number(minutes) + " Minutes, " : "";
    return output + Number(seconds.toFixed(3)) + " Seconds";
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
}

function advanceEndless(){
    myLines.splice(0,1);
    myLines.push(getNewLine());
    softClear();
    uploadExam();

    myProgress = 0;
    myChars = document.querySelectorAll("#examText p");
    showNext(myExam[0]);

    //stats
    preferences.key = problemKeys.length > 0 ? reverseKeyMap[problemKeys[0]] : targetKey;
    console.log(preferences.key);
    startTimer();
    examTime = 0;
    hits = 0;
    misses = 0;
    wordCount = preferences.Words;
}

function getASpecial(){
    return preferences.mySpecials[Math.floor(Math.random()*preferences.mySpecials.length)];
}

function getNewLine(){
    //generate test
    let myRow = [];

    let characters = 0;
    while(characters < 50){
        let addMe = getNewWord();
        characters += addMe.length;
        if(characters >= 50){return myRow.join('').split('');}
        addMe = ['/', '\\', "|", '-', '=', '+', '*', '^'].includes(addMe.substring(addMe.length-1)) ? addMe : addMe + ' ';
        myRow.push(addMe);
    }
}

function hitCheck(e){
    let myLength = preferences.endless ? myLines[0].length : myExam.length;
    if(myProgress < myLength){ // alter for enter/tab keys later?
        if(myExam[myProgress] === e.key){
            onHit(e);
            if(myProgress === myLength){
                endTimer();
                doStats();
                if(preferences.endless){advanceEndless();}
                else{examOn = false;}
            }
            else{
                showNext(myExam[myProgress]);
            }
        }
        else{
            onMiss();
        }
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

function specialize(myWord, myChar){
    switch(myChar){
        case "[":
        case "]": myWord = "[" + myWord + "]"; break;
        case "<":
        case ">": myWord = "<" + myWord + ">"; break;
        case "(":
        case ")": myWord = "(" + myWord + ")"; break;
        case "{":
        case "}": myWord = "{" + myWord + "}"; break;
        case "\"": myWord = "\"" + myWord + "\""; break;
        case "'": myWord = "'" + myWord + "'"; break;
        case "`": myWord = '`' + myWord + "`"; break;
        case "~":
        case "@":
        case "#":
        case "$": myWord = myChar + myWord; break;
        default: myWord += myChar;
    }
    return myWord;
}

function getNewWord(){
    let myWord = '';

    //word or letter?
    if(Math.random() >= preferences.Numbers){
        myWord = letters.includes(preferences.key) ? getWordWith(preferences.key) : words[Math.floor((Math.random()*2993))]; //required key?
        if(Math.random() < preferences.Capitals){myWord = toTitleCase(myWord);} //uppercase?
    }
    else{myWord = Number(Math.floor(Math.random()*1000));}

    //specialize
    if(nonLetters.includes(preferences.key) && Math.random() > 0.7){myWord = specialize(myWord, preferences.key);}//required key?
    else if(preferences.doSpecials && Math.random() > 0.7){myWord = specialize(myWord, getASpecial().substring(0,1));}
    return myWord;
}

function getWordWith(myChar){
    let myWord = '';
    do{myWord = words[Math.floor((Math.random()*2993))];}
    while(myWord.indexOf(myChar) < 0)
    return myWord;
}

function onHit(e){
    myChars[myProgress].setAttribute('style', 'background-color: rgb(255, 102, 0);');
    myProgress++;
    hits++;
    keyStats[e.code].hits++;
    if(e.key in shiftMap){keyStats['ShiftLeft'].hits++;}
    totalHits++;
    if(!miss){
        trueHits++;
        keyStats[e.code].trueHits++;
        if(e.key in shiftMap){keyStats['ShiftLeft'].trueHits++;}

    }
    miss = false;
    firstMiss = true;
}

function onMiss(){
    myChars[myProgress].setAttribute('style', 'background-color: aqua;');
    trueMisses++;
    keyStats[keyMap[myChars[myProgress].innerHTML]].trueMisses++;
    if(myChars[myProgress].innerHTML in shiftMap){keyStats['ShiftLeft'].trueMisses++;}
    if(firstMiss){
        misses++;
        totalMisses++;
        keyStats[keyMap[myChars[myProgress].innerHTML]].misses++;
        if(myChars[myProgress].innerHTML in shiftMap){keyStats['ShiftLeft'].misses++;}
    }
    firstMiss = false;
    miss = true;
}

function highlightKeys(){
    for(let code of problemKeys){
        document.querySelector(`#${code}`).setAttribute('class','problemKey');
    }
    let highlightedKeys = document.querySelectorAll(".problemKey");
    if(highlightedKeys.length > 0){
        for(let key of highlightedKeys){
            if(!problemKeys.includes(keyMap[key.innerHTML])){
                console.log(key.innerHTML + "not a problem.");
                key.setAttribute('class', '');
            }  
        }
        console.log("force reload: " + highlightedKeys[0].offsetHeight);
    }
}