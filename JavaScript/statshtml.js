//gathers stats and puts them on this static page.
//fix wordcounts for endless mode
//revamp showing the keys that need work
//update problemkeys alg

import { storedStatsTemplate, getAccuracy, getWPM } from "./stats.js";
import { keyMap } from "./constants.js";

let pageStats = storedStatsTemplate;

// first 6:
let statsBoxes = document.querySelectorAll("#statsTop p");
let statsTBI = [];
statsTBI.push(formatStartDay(pageStats.startDate));
statsTBI.push(getMinutes(pageStats.totalTime));
statsTBI.push(getWPM(pageStats.totalWords, pageStats.totalTime));
statsTBI.push(pageStats.bestWpm);
statsTBI.push(getAccuracy(pageStats.totalHits, pageStats.totalMisses));
statsTBI.push(pageStats.bestAccuracy);

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
function formatStartDay(ms){
    return new Date(ms);
}
function getMinutes(ms){
    return Math.ceil(ms/60000);
}

let leftKeyDisplay = document.querySelectorAll('#keyDisplay1 .none');
console.log(leftKeyDisplay);
for(let key of leftKeyDisplay){
    let mult = getRelativeAccuracy(key.innerHTML);
    key.setAttribute('style', 'background-color: rgb(255, 69, 0)');
}

function getRelativeAccuracy(key){
    let newAcc = pageStats.keyStats[keyMap[key]].accuracy - 0.6;
    console.log(newAcc);
}