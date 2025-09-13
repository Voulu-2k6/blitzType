//gathers stats and puts them on this static page.
//fix wordcounts for endless mode
//revamp showing the keys that need work
//update problemkeys alg

import { storedStatsTemplate, getAccuracy, getWPM } from "./stats.js";
import { keyMap, reverseKeyMap } from "./constants.js";

let pageStats = storedStatsTemplate;

// first 6:
let statsBoxes = document.querySelectorAll("#statsTop p");

for(let statBox of statsBoxes){
    if(statBox.id == 'joinDate'){
        statBox.innerHTML += formatStartDay(pageStats.startDate);
    }
    else if(statBox.id == 'minutes'){
        statBox.innerHTML += getMinutes(pageStats.totalTime);
    }
    else if(statBox.id == 'avgWPM'){
        statBox.innerHTML += getWPM(pageStats.totalWords, pageStats.totalTime) + ' words per minute';
    }
    else if(statBox.id == 'bestWPM'){
        statBox.innerHTML += pageStats.bestWpm[0] + ` words per minute (${pageStats.bestWpm[1]} words)`;
    }
    else if(statBox.id == 'avgAcc'){
        statBox.innerHTML += getAccuracy(pageStats.totalHits, pageStats.totalMisses) + '%';
    }
    else if(statBox.id == 'bestAcc'){
        statBox.innerHTML += pageStats.bestAccuracy[0] + '%';
        if(pageStats.bestAccuracy.length > 1){statBox.innerHTML += ` (${pageStats.bestAccuracy} times)`;}
    }
    else{
        console.log('no statBox found for id = ' + statBox.id);
    }
}

let leftKeyDisplay = document.querySelectorAll('#keyDisplay1 .none');
showKeyAcc(leftKeyDisplay);

let rightKeyDisplay = document.querySelectorAll('#keyDisplay2 .none');
getAdvancements(rightKeyDisplay);

let bottomKeyDisplay = document.querySelectorAll('#keyDisplay3 .none');
showKeyWPM(bottomKeyDisplay);

function formatStartDay(ms){
    return new Date(ms);
}
function getMinutes(ms){
    return Math.ceil(ms/60000);
}

function getRelativeAccuracy(code){
    let acc = pageStats.keyStats[keyMap[reverseKeyMap[code]]].accuracy;
    if(!acc){return -1;}
    return Math.max((acc - 0.6)*2.5, 0);
}

function getKeyWPM(code){
    let wpm = pageStats.keyStats[keyMap[reverseKeyMap[code]]].wpm;
    if(!wpm){return -1;}
    return wpm;
}

export function showKeyAcc(keyDisplay){
    for(let key of keyDisplay){
        let mult = getRelativeAccuracy(key.id);
        if(mult != -1){
            let r = mult*255;
            let g = mult*69;
            key.setAttribute('style', `background-color: rgb(${r}, ${g}, 0)`);
        }
    }
}

export function getAdvancements(keys){
    //implement key frequency in words.txt for constants.js
    //implement miss reduction in exam.js
    let localStats = JSON.parse(localStorage.getItem('localStats'));
    for(let key of keys){
        let keyStat = localStats.keyStats[keyMap[reverseKeyMap[key.id]]];
        let diamondStandard = (keyStat.accuracy > 0.97 && keyStat.hits >= 1200);
        let goldStandard = (keyStat.accuracy > 0.95 && keyStat.hits >= 500);
        let silverStandard = (keyStat.accuracy > 0.92 && keyStat.hits >= 250);
        if(diamondStandard){
            key.setAttribute('class','diamond');
        }
        else if(goldStandard)
        {
            key.setAttribute('class','gold');
        }
        else if(silverStandard){
            key.setAttribute('class','silver');
        }
        else{
            key.setAttribute('class','none');
        }
    }
}

function showKeyWPM(keyDisplay){
    for(let key of keyDisplay){
        let WPM = Math.max(getKeyWPM(key.id), 150);
        let mult = WPM/150;
        if(WPM != -1){
            let g = mult*255;
            let b = mult*255;
            key.setAttribute('style', `background-color: rgb(0, ${g}, ${b})`);
        }
    }
}