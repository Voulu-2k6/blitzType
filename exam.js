/*Exam
    Need: 
        Implement backspace function ***
    Tweaks:
        Timer starts on exam load, not on first character clicked. 
        double letters mess up keystrokes
        getNewLine and preferences.words aren't aligned
        additional space before enter on endless
    
*/

import {keyMap, shiftMap, specialKeyCodes, letters, nonLetters} from '/blitzType/constants.js';

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
let preferences = JSON.parse(localStorage.getItem('userPreferences'));

//for recording stats
import {statsTemplate} from '/blitzType/stats.js';
let myStats = statsTemplate;

//exam button listener 
if(document.querySelector("#makeExamButton")){
    document.querySelector("#makeExamButton").addEventListener('click', () => {
        if(examOn){releaseNext(myExam[myProgress]);} 
        exam();
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
    getPreferences(); //pulls 
    clearExam();
    if(preferences.endless){createEndless();}
    else{myLines.push(createExam());}
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
    myStats.examTime = 0;
    myStats.hits = 0;
    myStats.misses = 0;
}

function createEndless(){
    for(let i = 0; i < 3; i++){myLines.push(getNewLine());}
}

export function createExam(){
    let myRow = [];
    let characters = 0;
    for(let i = 0; i < preferences.Words; i++){
        let addMe = getNewWord();
        addMe = ['/', '\\', "|", '-', '=', '+', '*', '^'].includes(addMe.substring(addMe.length-1)) ? addMe : addMe + ' ';
        characters += addMe.length;
        if(characters > 50){
            myLines.push(myRow.splice(0,myRow.length));
            myRow = [];
            characters = 0;
        }
        for(let char of addMe.split('')){myRow.push(char);}
    }
    return myRow.splice(0,myRow.length);
}

function uploadExam(){
    for(let line in myLines){
        console.log(myLines[line]);
        for(let char in myLines[line]){
            let pageChar = document.createElement('p');
            if(char != myLines[line].length-1){
                pageChar.innerHTML = myLines[line][char] === ' ' ? '&nbsp;' : myLines[line][char];
                myExam.push(myLines[line][char]);
            }
            else if(preferences.endless){
                pageChar.innerHTML = '\\n';
                myExam.push('\n');
            }
            else{
                pageChar.innerHTML = '&nbsp;';
                myExam.push(' ');
            }
            examBoxDiv[line].insertAdjacentElement('beforeend', pageChar);
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
    if(nextChar == "\n"){keyPress('Enter');}
    else{
        if(nextChar in shiftMap){keyPress('ShiftLeft');}
        keyPress(keyMap[nextChar]);
    }
}

function releaseNext(nextChar){
    if(nextChar in shiftMap){keyRelease('ShiftLeft');}
    keyRelease(keyMap[nextChar]);
}

function advanceEndless(){
    getPreferences();
    myLines.splice(0,1);
    myLines.push(getNewLine());
    softClear();
    uploadExam();

    myProgress = 0;
    myChars = document.querySelectorAll("#examText p");
    showNext(myExam[0]);

    //stats
    // preferences.key = problemKeys.length > 0 ? reverseKeyMap[problemKeys[Math.floor(Math.random()*problemKeys.length)]] : targetKey;
    startTimer();
    myStats.examTime = 0;
    myStats.hits = 0;
    myStats.misses = 0;
    // myStats.wordCount = preferences.Words;
}

function hitCheck(e){
    let myLength = preferences.endless ? myLines[0].length : myExam.length;
    if(myProgress < myLength){ 
        if(myExam[myProgress] === e.key || (myExam[myProgress] == "\n" && e.key == 'Enter')){
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

function onHit(e){
    myChars[myProgress].setAttribute('style', 'background-color: rgb(255, 102, 0);');
    myProgress++;
    updateStats(true, e);
    miss = false;
    firstMiss = true;
}

function onMiss(){
    myChars[myProgress].setAttribute('style', 'background-color: aqua;');
    updateStats(false);
    firstMiss = false;
    miss = true;
}

async function getWords(){
    const response = await fetch('words.txt');
    const text = response.text();
    return text;
}

function getNewWord(){
    let myWord = '';

    //word or letter?
    if(Math.random() >= preferences.Numbers){
        myWord = letters.includes(preferences.key) ? getWordWith(preferences.key) : words[Math.floor((Math.random()*2993))]; //required key?
        if(Math.random() < preferences.Capitals || preferences.key == 'LeftShift'){myWord = toTitleCase(myWord);} //uppercase?
    }
    else{myWord = String(Number(Math.floor(Math.random()*1000)));}

    //specialize
    if(nonLetters.includes(preferences.key) && Math.random() > 0.7){myWord = specialize(myWord, preferences.key);}//required key?
    else if(preferences.mySpecials.length > 0 && Math.random() > 0.7){myWord = specialize(myWord, getASpecial().substring(0,1));}
    return myWord;
}

function getPreferences(){preferences = JSON.parse(localStorage.getItem('userPreferences'));}

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

function getWordWith(myChar){
    let myWord = '';
    do{myWord = words[Math.floor((Math.random()*2993))];}
    while(myWord.indexOf(myChar) < 0)
    return myWord;
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
        if(characters >= 50){myRow = myRow.join('').split(''); return myRow;}
        addMe = ['/', '\\', "|", '-', '=', '+', '*', '^'].includes(addMe.substring(addMe.length-1)) ? addMe : addMe + ' ';
        myRow.push(addMe);
    }
}

let timerInterval = null; 
let startTimestamp = 0;   
function startTimer() { //virtual stopwatch integration possible 
  startTimestamp = Date.now();
  timerInterval = setInterval(() => {
    myStats.examTime = Date.now() - startTimestamp;
  }, 50); // update every however many ms
}

function endTimer() { 
  clearInterval(timerInterval);
  myStats.examTime = Date.now() - startTimestamp;
}

function updateStats(hit, e = null){
    if(hit){
        myStats.hits++;
        myStats.keyStats[e.code].hits++;
        if(e.key in shiftMap){myStats.keyStats['ShiftLeft'].hits++;}
        myStats.totalHits++;
        if(!miss){
            myStats.trueHits++;
            myStats.keyStats[e.code].trueHits++;
            if(e.key in shiftMap){myStats.keyStats['ShiftLeft'].trueHits++;}
        }
    }
    else{
        myStats.trueMisses++;
            myStats.keyStats[keyMap[myChars[myProgress].innerHTML]].trueMisses++;
            if(myChars[myProgress].innerHTML in shiftMap){myStats.keyStats['ShiftLeft'].trueMisses++;}
            if(firstMiss){
                myStats.misses++;
                myStats.totalMisses++;
                myStats.keyStats[keyMap[myChars[myProgress].innerHTML]].misses++;
                if(myChars[myProgress].innerHTML in shiftMap){myStats.keyStats['ShiftLeft'].misses++;}
            }
    }
}

import {showStats} from '/blitzType/stats.js';
// presents and updates stats, handles key adaptation
function doStats(){
    sessionStorage.setItem('sessionStats', JSON.stringify(myStats));
    showStats();
    myStats = JSON.parse(sessionStorage.getItem('sessionStats'));
    if(preferences.adapt){adaptKey();}
}

function adaptKey(){} //TBI