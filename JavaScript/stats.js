/*Stats
    Need: 
        Wipe stats button
    Tweaks:
        Spacebar on problemkeys is invisible
        Spacebar doesn't highlight on problem, nor does Enter
    In settings:
        */

let userStats = JSON.parse(localStorage.getItem('localStats')); // locally stored user stats
import {keyMap, avgWordLength} from '/blitzType/JavaScript/constants.js'; // maps between keys and codes, see constants.js

let runStatsTemplate = {
    // basic stats
    wordCount: 0,
    charCount: 0,
    examTime: 0,
    hits: 0,
    misses: 0,

    // for each key...
    keyStats: Object.fromEntries(
        Object.keys(keyMap).map(key => [
            keyMap[key], 
            {
                hits: 0,
                misses: 0,
                accuracy: 0,
                time: 0}])), 
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
                accuracy: 0,
                time: 0,
                wpm: 0}]))
}

function formatMS(ms){
    let minutes = Math.floor(ms/(60*1000));
    let seconds = (ms%(60*1000))/1000;
    let output = minutes ? Number(minutes) + " Minute(s), " : "";
    return output + Number(seconds.toFixed(3)) + " Seconds";
}

function updateDisplay(sessionStats){
    document.querySelector("#statsAccuracy").innerHTML = "accuracy: " + getAccuracy(sessionStats.hits, sessionStats.misses);
    document.querySelector("#statsWPM").innerHTML = "words per minute: " + getWPM(sessionStats.charCount, sessionStats.examTime);
}

export function getAccuracy(hits, misses){
    return Number(((hits/(hits+misses))*100).toFixed(2));
}

export function getWPM(chars, ms){
    return Number((chars/(ms/(1000*60))/(avgWordLength+1)).toFixed(2));
}

export {runStatsTemplate, storedStatsTemplate, newStats, formatMS};

function newStats(){

    let runStats = JSON.parse(sessionStorage.getItem('runStats'));
    let localStats = localStorage.getItem('localStats') ? JSON.parse(localStorage.getItem('localStats')) : storedStatsTemplate;

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
        localStats.keyStats[key].time += runStats.keyStats[key].time;
        localStats.keyStats[key].wpm = (localStats.keyStats[key].hits / avgWordLength)/(localStats.keyStats[key].time/60000);
    }

    //compare bests
    if(getAccuracy(runStats.hits, runStats.misses) == 1){
        if(localStats.bestAccuracy.length == 1){
            localStats.bestAccuracy.push(1);
        }
        else{localStats.bestAccuracy[1]++;}
    }
    else if(getAccuracy(runStats.hits, runStats.misses) > localStats.bestAccuracy[0]){localStats.bestAccuracy[0] = getAccuracy(runStats.hits, runStats.misses);}
    if(localStats.bestWpm[0] < getWPM(runStats.charCount, runStats.examTime)){
        localStats.bestWpm[0] = getWPM(runStats.charCount, runStats.examTime);
        localStats.bestWpm[1] = runStats.wordCount;
    }  

    localStorage.setItem('localStats', JSON.stringify(localStats));
}

