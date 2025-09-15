// built specifically to export a function built for the main exam

import {letters, numbers, keyMap, reverseKeyMap, reverseShiftMap} from '/blitzType/JavaScript/constants.js';

export function getNewLine(words){
    let preferences = JSON.parse(localStorage.getItem('userPreferences'));
    // MY FUNCTIONS
    function toTitleCase(word){
        return (word.substring(0,1).toUpperCase()) + word.substring(1);}

    function specialize(myWord, myChar){
        switch(myChar){
            case "[":
            case "]": 
            case "[]": myWord = "[" + myWord + "]"; break;
            case "<":
            case ">": 
            case "<>": myWord = "&lt;" + myWord + "&gt;"; break;
            case "(":
            case ")": 
            case "()": myWord = "(" + myWord + ")"; break;
            case "{":
            case "}": 
            case "{}": myWord = "{" + myWord + "}"; break;
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
        let word;
        if(myChar == null){
            word = words[Math.floor((Math.random()*words.length))];
        }
        else{
            do{word = words[Math.floor((Math.random()*words.length))];}
            while(word.indexOf(myChar) < 0)
        }
        return (Math.random() < preferences.Capitals) ? toTitleCase(word) : word;
    }

    function getNumberWith(myDigit){ 
        let myNum = String(myDigit);
        for(let i = 0; i < 2; i++) //adjust i for longer number strings
        {
            myNum += String(Math.floor(Math.random()*10));
        }
        return String(myNum);
    }

    function toTitleCase(word){
        return (word.substring(0,1).toUpperCase()) + word.substring(1);
    }

    function getASpecial(){
        return preferences.mySpecials[Math.floor(Math.random()*preferences.mySpecials.length)];}

    function getNewWord(){
        let myChar = preferences.key ? preferences.key[Math.floor(Math.random()*preferences.key.length)] : null;
    
        let myWord = '';
        let doSpecialize = preferences.mySpecials.length > 0 ? true : false;
    
        //assume getWordWith only works with letters.
        //If myChar was a letter, get a normal word with it.
        if(myChar == null){
            myWord = getWordWith(null);
        }
        else if(letters.includes(reverseKeyMap[myChar])){
            myWord = getWordWith(reverseKeyMap[myChar]);
        }
        //now myChar can be any number code, any special code.
        //if we have a number code, either numbers or that special are on or both. so, 
        else if(numbers.includes(reverseKeyMap[myChar])){
            if(preferences.mySpecials.includes(reverseShiftMap[myChar]) && Math.random() > preferences.Numbers){
                myWord = specialize(getWordWith(null), reverseShiftMap[myChar]);
                doSpecialize = false;
            }
            else if(preferences.mySpecials.includes(reverseShiftMap[myChar])){
                myWord = specialize(getNumberWith(reverseKeyMap[myChar]), reverseShiftMap[myChar]);
                doSpecialize = false;
            }
            else if(Math.random() < preferences.Numbers){
                myWord = getNumberWith(reverseKeyMap[myChar]);
            }
            else{
                myWord = getWordWith(null);
                doSpecialize = false;
                console.log('we selected a digit: ' + myChar + ', but we couldn\'nt find ' + reverseShiftMap[myChar]);
            }
        }
        //now myChar can be any special code.
        else{
            let choices = [];

            for(let tryMe of [reverseKeyMap[myChar], reverseShiftMap[myChar]]){
                switch(tryMe){
                    case "[":
                    case "]": if (preferences.mySpecials.includes('[]')){choices.push('[]')} break;
                    case "<":
                    case ">": if (preferences.mySpecials.includes('<>')){choices.push('<>')} break;
                    case "(":
                    case ")": if (preferences.mySpecials.includes('()')){choices.push('()')} break;
                    case "{":
                    case "}": if (preferences.mySpecials.includes('{}')){choices.push('{}')} break;
                    default: if(preferences.mySpecials.includes(tryMe)){choices.push(tryMe);}
                }
            }
            if(choices.length > 0){
                myWord = specialize(getWordWith(null), choices[Math.floor(Math.random()*choices.length)]);
                doSpecialize = false;
            }
            else{
                myWord = getWordWith(null);
                console.log('we selected a key but haven\'t allowed it\'s characters.');
                console.log(myChar + ' ' + reverseKeyMap[myChar] + ' ' + reverseShiftMap[myChar]);
            }
        }
    
        let rand = Math.random() > 0.7;
        myWord = (doSpecialize && rand) ? specialize(myWord, getASpecial()) : myWord;
        return myWord;
    }

    //real code
    let myRow = [];

    let characters = 0;
    while(characters < 50){
        let addMe = getNewWord();
        characters += addMe.length;
        addMe = ['/', '\\', "|", '-', '=', '+', '*', '^', '_', '&'].includes(addMe.substring(addMe.length-1)) ? addMe : addMe + ' ';
        myRow.push(addMe);
    }
    myRow = myRow.join(''); 
    return myRow;
}

export async function getWords(scopePreferences){
    let link = scopePreferences.target == 'left' || scopePreferences.target == 'right' ? `${scopePreferences.target}HandWords.txt` : 'words.txt';
    const response = await fetch(`/blitzType/words/${link}`);
    const text = response.text();
    return text;
}
