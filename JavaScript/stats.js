/*Stats
    Need: 
        need backspace function for true accuracy integration
        display key stats when hovering on keystrokes
        display keys to work on on the keystrokes between tests.
        add key counts to saved stats
        Wipe stats button
        adjust doStats for new stats
    Tweaks:
        change hits from code to keys
        Spacebar on problemkeys is invisible
        Spacebar doesn't highlight on problem, nor does Enter
    In settings:
        Determine one's own threshold for a problem key
        */

let userStats = JSON.parse(localStorage.getItem('userStats')); // locally stored user stats
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
    bestWpm: userStats ? bestWpm : 0,
    bestAccuracy: userStats ? bestAccuracy : 0,
    startDate: userStats ? userStats.startDate : Date.now(),
    totalHits: userStats ? userStats.totalHits : 0,
    totalMisses: userStats ? userStats.totalMisses : 0,
    totalTime: userStats ? userStats.totalTime : 0,
    totalWords: userStats ? userStats.totalWords : 0,

    keyStats: Object.fromEntries(
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
            if(sessionStats.keyStats[key].accuracy < 0.92 && (sessionStats.keyStats[key].hits + sessionStats.keyStats[key].misses) > 15){sessionStats.problemKeys.push(key);}
        }
    }
}

function updateDisplay(sessionStats){
    let needWork = document.querySelector("#needWork");
    needWork.innerHTML = "Keys that need work:"; 
    for(let key of sessionStats.problemKeys){needWork.innerHTML += " " + reverseKeyMap[key];} 
    highlightKeys(sessionStats.problemKeys);
    document.querySelector("#statsAccuracy").innerHTML = "Accuracy: " + Number(((sessionStats.hits/(sessionStats.hits+sessionStats.misses))*100).toFixed(2));
    document.querySelector("#statsWPM").innerHTML = "Words per minute: " + Number((sessionStats.wordCount/(sessionStats.examTime/(1000*60))).toFixed(2));
}

export {runStatsTemplate, storedStatsTemplate, newStats, highlightKeys, formatMS};

function newStats(){

    let runStats = JSON.parse(sessionStorage.get('runStats'));
    let localStats = JSON.parse(localStorage.getItem('localStats'));

    //calculate what to show
    getProblems(runStats);

    //show current run stats
    updateDisplay(runStats);

    //update locally stored stats
    localStats.totalWords += runStats.wordCount;
    localStats.totalTime += runStats.examTime;
    localStats.totalHits += runStats.hits;
    localStats.totalMisses += runStats.misses;
    for(let key of runStats.keyStats){

    }
    
    //if new high score, tell the user!

    localStorage.setItem('localStats', JSON.stringify(localStats));
}

