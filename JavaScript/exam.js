/*Exam
    Tweaks:
        double letters mess up keystrokes
*/

import {keyMap, shiftMap, reverseKeyMap, specialKeyCodes, letters, nonLetters, numbers, shiftTopRow} from '/blitzType/JavaScript/constants.js';
import { getAdvancements } from './statshtml.js';
import { settingsTemplate } from './settings.js';

//for creating and running the exam
let hold = await getWords();
const words = hold.split(/\r?\n/);
const examBoxDiv = document.querySelectorAll("#examText div");
let myExam = [];
let myLines = [];
let myChars = [];
let myProgress = 0;
let examOn = false;
let preferences = localStorage.getItem('userPreferences') ? JSON.parse(localStorage.getItem('userPreferences')) : settingsTemplate;

//for recording stats
import {runStatsTemplate} from '/blitzType/JavaScript/stats.js';
let myStats = runStatsTemplate;

let myKeystrokes = document.querySelectorAll(".keyDisplay p:not(.fade)");
if(localStorage.getItem('localStats')){getAdvancements(myKeystrokes);}

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
    if(preferences.adapt){doKey();}
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

function createEndless(){ //set I to num lines you want to queue, max 5 min 1;
    for(let i = 0; i < 1; i++){myLines.push(getNewLine());}
}

export function createExam(){
    let myRow = [];
    let characters = 0;
    for(let char of getNewWord().split('')){myRow.push(char); characters++;} //first word on create
    for(let i = 1; i < preferences.Words; i++){
        if(!['/', '\\', "|", '-', '=', '+', '*', '^'].includes(myRow[myRow.length-1])){myRow.push(' '); characters++;}
        let addMe = getNewWord();
        characters += addMe.length;
        if(characters > 50){
            myLines.push(myRow);
            myRow = [];
            characters = addMe.length;
        }
        for(let char of addMe.split('')){myRow.push(char);}
    }
    return myRow;
}

function uploadExam(){
    for(let line in myLines){
        for(let char in myLines[line]){
            let pageChar = document.createElement('p');
            switch (myLines[line][char]){
                case (' '): pageChar.innerHTML = '&nbsp;'; break;
                case ('\n'): pageChar.innerHTML = '\\n'; break;
                default: pageChar.innerHTML = myLines[line][char];
            }
            myExam.push(myLines[line][char]);
            examBoxDiv[line].insertAdjacentElement('beforeend', pageChar);
        }
    }
}

function startExam(){
    myProgress = 0;
    myChars = document.querySelectorAll("#examText p");
    showNext(myExam[0]);
    examOn = true;
    document.removeEventListener('keydown', startTimer);
    document.addEventListener('keydown', startTimer);
}

function keyPress(key){
    let myBox = document.querySelector(`#${key}`);
    if(myBox.getAttribute('class') === '' || myBox.getAttribute('class') === null){
        myBox.setAttribute('style','border: 1px solid orangered; background-color:rgb(0,0,0); box-shadow: 0 0 3px orangered');
    }
    if(key === 'meta' || key === 'tab'){setTimeout(() => {keyRelease(key);}, 1000);}//supposed to fix keystrokes sticking on these keys 
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

    startTimer();
    myStats.examTime = 0;
    myStats.hits = 0;
    myStats.misses = 0;
}

function hitCheck(e){
    let myLength = preferences.endless ? myLines[0].length : myExam.length;
    if(myProgress < myLength){ 
        if(myExam[myProgress] === e.key || (myExam[myProgress] == "\n" && e.key == 'Enter')){
            onHit(e);
            if(myProgress === myLength){
                endExam();
            }
            else{
                showNext(myExam[myProgress]);
            }
        }
        else{
            onMiss(e);
        }
    }
}

function endExam(){
    endTimer();
    doStats(preferences.endless);
    getAdvancements(myKeystrokes);
    if(preferences.adapt){doKey();}
    if(preferences.endless){advanceEndless();}
    else{examOn = false;}
}

function onHit(e){
    myChars[myProgress].setAttribute('style', 'background-color: rgb(255, 102, 0);');
    myProgress++;
    updateStats(true, e);
}

function onMiss(e){
    myChars[myProgress].setAttribute('style', 'background-color: aqua;');
    updateStats(false, e);
}

async function getWords(){
    const response = await fetch('words.txt');
    const text = response.text();
    return text;
}

function getNewWord(){
    let myChar = preferences.key ? preferences.key[Math.floor(Math.random()*preferences.key.length)] : null;

    let myWord = '';
    if(letters.includes(reverseKeyMap[myChar])){myWord = getWordWith(reverseKeyMap[myChar]);}
    else if(numbers.includes(reverseKeyMap[myChar])){myWord = getNumberWith(reverseKeyMap[myChar]);}
    else if(nonLetters.includes(reverseKeyMap[myChar])){myWord = getWordWith(null);}
    else{console.log('no place found for ' + myChar); myWord = getWordWith(null);}

    if(Math.random() >= preferences.Numbers && !numbers.includes(myChar)){ //word or number?
        if(Math.random() < preferences.Capitals){myWord = toTitleCase(myWord);} //uppercase?
    }
    else if(!numbers.includes(myChar)){myWord = String(Number(Math.floor(Math.random()*1000)));}

    if(preferences.mySpecials.length > 0 && Math.random() > 0.7 && !nonLetters.includes(myChar)){myWord = specialize(myWord, getASpecial().substring(0,1));} //specialize

    return myWord;
}

function getPreferences(){
    preferences = JSON.parse(localStorage.getItem('userPreferences'));
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

function getWordWith(myChar){
    if(myChar == null){return words[Math.floor((Math.random()*2993))];}
    //handle shift and digit exceptions later
    let myWord = '';
    do{myWord = words[Math.floor((Math.random()*2993))];}
    while(myWord.indexOf(myChar) < 0)
    return myWord;
}

function getNumberWith(myDigit){
    return 0;
}

function getASpecial(){
    return preferences.mySpecials[Math.floor(Math.random()*preferences.mySpecials.length)];
}

function getNewLine(){
    let addMe = getNewWord();
    let myRow = [addMe];
    let characters = addMe.length;
    while(characters < 50){
        if(!['/', '\\', "|", '-', '=', '+', '*', '^'].includes(addMe.substring(addMe.length-1))){myRow.push(' ');}//did prev word end in the following which take the place of space? 
        addMe = getNewWord();
        characters += addMe.length;
        if(characters >= 50){myRow = myRow.join('').split(''); myRow.pop(); myRow.push('\n'); return myRow;}
        myRow.push(addMe);
    }
}

let timerInterval = null; 
let startTimestamp = 0;   
function startTimer() { //virtual stopwatch integration possible 
    document.removeEventListener('keydown', startTimer);
    startTimestamp = Date.now();
    timerInterval = setInterval(() => {
    myStats.examTime = Date.now() - startTimestamp;
    }, 50); // update every however many ms
}

function endTimer() { 
  clearInterval(timerInterval);
  myStats.examTime = Date.now() - startTimestamp;
}

function updateStats(hit, e){
    if(hit){
        myStats.hits++;
        myStats.keyStats[e.code].hits++;
        if(e.key in shiftMap){myStats.keyStats['ShiftLeft'].hits++;}
    }
    else{
        myStats.misses++;
        myStats.keyStats[keyMap[myChars[myProgress].innerHTML]].misses++;
        if(myChars[myProgress].innerHTML in shiftMap){
            if(reverseKeyMap[shiftMap[myChars[myProgress].innerHTML]] != e.key)
                myStats.keyStats['ShiftLeft'].misses++;}
    }
}

function getNumWords(){
    console.log(myLines[0]);
    return (myLines[0].join('').split(/[\/\\|\-=+\*^ ]/)).length;
}

import {newStats} from '/blitzType/JavaScript/stats.js';
// presents and updates stats
function doStats(endless){
    myStats.wordCount = endless ? getNumWords() : preferences.Words;
    sessionStorage.setItem('runStats', JSON.stringify(myStats));
    newStats();
    myStats = runStatsTemplate;
}

function doKey(){
    let scopeStats = JSON.parse(localStorage.getItem('localStats'));
    if(scopeStats.totalHits < 100){preferences.key = null; return;} //error protection
    let keyStats = scopeStats.keyStats;
    let theseKeys = Object.keys(keyStats);
    theseKeys.splice(theseKeys.indexOf('Enter'), 1);

    let keepShift = preferences.Capitals > 0 ? true : false;
    let keepDigits = preferences.Numbers > 0 ? true : false;
    let keepSpecials = preferences.Specials > 0 ? preferences.mySpecials : [];

    if(!keepShift){theseKeys.splice(theseKeys.indexOf('ShiftLeft'), 1);}

    if(!keepDigits){
        for(let num of numbers){
            theseKeys.splice(theseKeys.indexOf(keyMap[num]), 1);
        }
    }

    for(let special of nonLetters){
        if(!keepSpecials.includes(special) && theseKeys.indexOf(keyMap[special]) != -1){theseKeys.splice(theseKeys.indexOf(keyMap[special]), 1);}
    }

    let worstKeys = [];
    for(let i = 0; i < 3; i++){ //adjust i for more depth to the adaptation
        let worstStats = keyStats['KeyE'];
        let worstKey = 'KeyE';
        console.log(`we\'ve set worstKey to ${KeyE} and it\'s stats are ${worstStats}`);
        for(let thisKey of theseKeys){
            let curr = keyStats[keyMap[reverseKeyMap[thisKey]]];
            console.log(thisKey + ' maps to ' + curr);
            if(curr.accuracy != null && curr.accuracy != 0 && curr.accuracy < worstStats.accuracy){
                worstStats = curr;
                worstKey = thisKey;
            }
        }
        theseKeys.splice(theseKeys.indexOf(worstKey), 1);
        worstKeys.push(worstKey);
    }
    preferences.key = worstKeys;
}

//combination of doKey, getWordWith, getNewWord to implement all possibilities for targeted thing. 

//still no implementation for regular key select