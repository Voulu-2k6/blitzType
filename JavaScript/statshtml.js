//gathers stats and puts them on this static page.
//fix wordcounts for endless mode
//revamp showing the keys that need work
//update problemkeys algo

import { storedStatsTemplate, getAccuracy, getWPM } from "./stats";

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

for(let stat in statsTBI){
    if(stat < 2){
        statsBoxes[stat].innerHTML += statsTBI[stat];
    }
    else if(stat == 3){
        statsBoxes[stat].innerHTML += statsTBI[stat] + ' words per minute';
    }
    else if(stat == 4){
        statsBoxes[stat].innerHTML += statsTBI[stat][0] + `words per minute (${statsTBI[stat][1]} words)`;
    }
    else if(stat == 5){
        statsBoxes[stat].innerHTML += statsTBI[stat] + '%';
    }
    else{
        statsBoxes[stat].innerHTML += statsTBI[stat][0] + `% (${statsTBI[stat][1]} times)`;
    }
}
function formatStartDay(ms){
    return new Date(ms);
}
function getMinutes(ms){
    return Math.ceil(ms/60000);
}