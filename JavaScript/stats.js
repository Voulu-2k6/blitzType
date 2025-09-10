/*Stats
    Need: 
        Wipe stats button
    Tweaks:
        Spacebar on problemkeys is invisible
        Spacebar doesn't highlight on problem, nor does Enter
    In settings:
        */

let userStats = JSON.parse(localStorage.getItem('localStats')); // locally stored user stats
import {keyMap, reverseKeyMap} from '/blitzType/JavaScript/constants.js'; // maps between keys and codes, see constants.js

let runStatsTemplate = {
    // basic stats
    wordCount: 0,
    examTime: 0,
    hits: 0,
    trueHits: 0,
    misses: 0,
    trueMisses: 0,

    // for each key...
    keyStats: Object.fromEntries(
        Object.keys(keyMap).map(key => [
            keyMap[key], 
            {
                hits: 0,
                misses: 0,
                accuracy: 0}])), 
    problemKeys: []
}

let storedStatsTemplate = {
    bestWpm: userStats ? userStats.bestWpm : [0],
    bestAccuracy: userStats ? userStats.bestAccuracy : [0],
    startDate: userStats ? userStats.startDate : Date.now(),
    totalHits: userStats ? userStats.totalHits : 0,
    totalMisses: userStats ? userStats.totalMisses : 0,
    totalTime: userStats ? userStats.totalTime : 0,
    totalWords: userStats ? userStats.totalWords : 0,

    keyStats: userStats ? userStats.keyStats : Object.fromEntries(
        Object.keys(keyMap).map(key => [
            keyMap[key], 
            {
                hits: 0,
                misses: 0,
                accuracy: 0}]))
}

// visual indicator for the user on what they should pay attention to
function highlightKeys(problemKeys){
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

function formatMS(ms){
    let minutes = Math.floor(ms/(60*1000));
    let seconds = (ms%(60*1000))/1000;
    let output = minutes ? Number(minutes) + " Minute(s), " : "";
    return output + Number(seconds.toFixed(3)) + " Seconds";
}

//algorithm for determining which keys need work
function getProblems(sessionStats){
    sessionStats.problemKeys = [];
    for(let key in sessionStats.keyStats){
        if(sessionStats.keyStats[key].hits != 0 || sessionStats.keyStats[key].misses != 0){
            sessionStats.keyStats[key].accuracy = sessionStats.keyStats[key].hits / (sessionStats.keyStats[key].hits+sessionStats.keyStats[key].misses);
            if(sessionStats.keyStats[key].accuracy < 0.85 && (sessionStats.keyStats[key].hits + sessionStats.keyStats[key].misses) > 20){sessionStats.problemKeys.push(key);}
        }
    }
}

function updateDisplay(sessionStats){
    let needWork = document.querySelector("#needWork");
    needWork.innerHTML = "keys that need work:"; 
    for(let key of sessionStats.problemKeys){needWork.innerHTML += " " + reverseKeyMap[key];} 
    //highlightKeys(sessionStats.problemKeys);
    document.querySelector("#statsAccuracy").innerHTML = "accuracy: " + getAccuracy(sessionStats.hits, sessionStats.misses);
    document.querySelector("#statsWPM").innerHTML = "words per minute: " + getWPM(sessionStats.wordCount, sessionStats.examTime);
}

export function getAccuracy(hits, misses){
    return Number(((hits/(hits+misses))*100).toFixed(2));
}

export function getWPM(words, ms){
    return Number((words/(ms/(1000*60))).toFixed(2));
}

export {runStatsTemplate, storedStatsTemplate, newStats, highlightKeys, formatMS};

function newStats(){

    let runStats = JSON.parse(sessionStorage.getItem('runStats'));
    let localStats = localStorage.getItem('localStats') ? JSON.parse(localStorage.getItem('localStats')) : storedStatsTemplate;

    //calculate what to show
    //getProblems(runStats);

    //show current run stats
    updateDisplay(runStats);

    //update locally stored stats
    localStats.totalWords += runStats.wordCount;
    localStats.totalTime += runStats.examTime;
    localStats.totalHits += runStats.hits;
    localStats.totalMisses += runStats.misses;
    for(let key of Object.keys(runStats.keyStats)){
        localStats.keyStats[key].hits += runStats.keyStats[key].hits;
        localStats.keyStats[key].misses += runStats.keyStats[key].misses;
        localStats.keyStats[key].accuracy = localStats.keyStats[key].hits/(localStats.keyStats[key].hits + localStats.keyStats[key].misses);
    }

    //compare bests
    if(getAccuracy(runStats.hits, runStats.misses) == 1){
        if(localStats.bestAccuracy.length == 1){
            localStats.bestAccuracy.push(1);
        }
        else{localStats.bestAccuracy[1]++;}
    }
    else if(getAccuracy(runStats.hits, runStats.misses) > localStats.bestAccuracy[0]){localStats.bestAccuracy[0] = getAccuracy(runStats.hits, runStats.misses);}
    if(localStats.bestWpm[0] < getWPM(runStats.wordCount, runStats.examTime)){
        localStats.bestWpm[0] = getWPM(runStats.wordCount, runStats.examTime);
        localStats.bestWpm[1] = runStats.wordCount;
    }  

    localStorage.setItem('localStats', JSON.stringify(localStats));
}

