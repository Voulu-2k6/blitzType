/*Stats
    Need: 
        need backspace function for true accuracy integration
        display key stats when hovering on keystrokes
        display keys to work on on the keystrokes between tests.
        add key counts to saved stats
        Wipe stats button
    Tweaks:
        change hits from code to keys
        Spacebar on problemkeys is invisible
        Spacebar doesn't highlight on problem, nor does Enter
    In settings:
        Determine one's own threshold for a problem key
        */

let userStats = JSON.parse(localStorage.getItem('userStats')); // locally stored user stats
import {keyMap, reverseKeyMap} from '/blitzType/constants.js'; // maps between keys and codes, see constants.js

let statsTemplate = { // fresh load stats + saved historical stats
        wordCount: 10,
        examTime: 0,
        hits: 0,
        trueHits: 0,
        misses: 0,
        trueMisses: 0,
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
                    accuracy: 0,
                    trueHits: 0,
                    trueMisses: 0,
                    trueAccuracy: 0
                }
            ])
        ), 
        problemKeys: []
};

// For showing stats after a test is completed. 
function showStats(){

    // get updated stats from most recent test
    let sessionStats = JSON.parse(sessionStorage.getItem('sessionStats')); 

    // recalculate problem keys
    sessionStats.problemKeys = [];
    for(let key in sessionStats.keyStats){
        if(sessionStats.keyStats[key].hits != 0 || sessionStats.keyStats[key].misses != 0){
            sessionStats.keyStats[key].accuracy = sessionStats.keyStats[key].hits / (sessionStats.keyStats[key].hits+sessionStats.keyStats[key].misses);
            if(sessionStats.keyStats[key].accuracy < 0.92 && (sessionStats.keyStats[key].hits + sessionStats.keyStats[key].misses) > 15){sessionStats.problemKeys.push(key);}
        }
        if(sessionStats.keyStats[key].trueHits != 0){
            sessionStats.keyStats[key].trueAccuracy = sessionStats.keyStats[key].trueHits / (sessionStats.keyStats[key].trueHits+sessionStats.keyStats[key].trueMisses);
            if(sessionStats.keyStats[key].trueAccuracy < 0.88 && (sessionStats.keyStats[key].hits + sessionStats.keyStats[key].misses) > 15 && !sessionStats.problemKeys.includes(key)){sessionStats.problemKeys.push(key);}
        }
    }
    console.log(sessionStats.keyStats);

    // add time and number of words used
    sessionStats.totalWords += sessionStats.wordCount;
    sessionStats.totalTime += sessionStats.examTime;

    // push updated sums to localStorage
    let localStats = {
        totalHits: sessionStats.totalHits,
        totalMisses: sessionStats.totalMisses,
        totalWords: sessionStats.totalWords,
        totalTime: sessionStats.totalTime
    };
    localStorage.setItem('userStats', JSON.stringify(localStats));

    //update display
    let needWork = document.querySelector("#needWork");
    needWork.innerHTML = "Keys that need work:"; 
    for(let key of sessionStats.problemKeys){needWork.innerHTML += " " + reverseKeyMap[key];} 
    highlightKeys(sessionStats.problemKeys);
    document.querySelector("#statsHits").innerHTML = "Keys hit: " + sessionStats.hits;
    document.querySelector("#statsMisses").innerHTML = "Keys missed: " + sessionStats.misses;
    document.querySelector("#statsAccuracy").innerHTML = "Accuracy: " + Number(((sessionStats.hits/(sessionStats.hits+sessionStats.misses))*100).toFixed(2));
    document.querySelector("#statsTime").innerHTML = "Time: " + formatMS(sessionStats.examTime);
    document.querySelector("#statsWPM").innerHTML = "Words per minute: " + Number((sessionStats.wordCount/(sessionStats.examTime/(1000*60))).toFixed(2));
    document.querySelector("#trueHits").innerHTML = "True hits: " + sessionStats.trueHits;
    document.querySelector("#trueMisses").innerHTML = "True misses: " + sessionStats.trueMisses;
    document.querySelector("#trueAcc").innerHTML = "True Accuracy: " + Number(((sessionStats.trueHits/(sessionStats.trueHits+sessionStats.trueMisses))*100).toFixed(2));
    document.querySelector("#averageAccuracy").innerHTML = "Average accuracy: " + Number(((sessionStats.totalHits/(sessionStats.totalHits+sessionStats.totalMisses))*100).toFixed(2));
    document.querySelector("#averageWPM").innerHTML = "Average words per minute: " + Number(((sessionStats.totalWords/(sessionStats.totalTime/(1000*60)))).toFixed(2));
    document.querySelector("#statsWords").innerHTML = 'Words: ' + sessionStats.wordCount;
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
    let output = minutes ? Number(minutes) + " Minutes, " : "";
    return output + Number(seconds.toFixed(3)) + " Seconds";
}

export {statsTemplate, showStats, highlightKeys, formatMS};