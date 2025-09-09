// built specifically to export a function built for the main exam

import {letters, nonLetters} from '/blitzType/constants.js';

export function getNewLine(words){
    let preferences = JSON.parse(localStorage.getItem('userPreferences'));
    // MY FUNCTIONS
    function toTitleCase(word){
        return (word.substring(0,1).toUpperCase()) + word.substring(1);}

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
        return myWord;}

    function getWordWith(myChar){
        let myWord = '';
        do{myWord = words[Math.floor((Math.random()*2993))];}
        while(myWord.indexOf(myChar) < 0)
        return myWord;}

    function getASpecial(){
        return preferences.mySpecials[Math.floor(Math.random()*preferences.mySpecials.length)];}

    function getNewWord(){
        let myWord = '';

        //word or letter?
        if(Math.random() >= preferences.Numbers){
            myWord = letters.includes(preferences.key) ? getWordWith(preferences.key) : words[Math.floor((Math.random()*2993))]; //required key?
            if(Math.random() < preferences.Capitals || preferences.key == 'LeftShift'){myWord = toTitleCase(myWord);} //uppercase?
        }
        else{myWord = Number(Math.floor(Math.random()*1000));}

        //specialize
        if(nonLetters.includes(preferences.key) && Math.random() > 0.7){myWord = specialize(myWord, preferences.key);}//required key?
        else if((preferences.mySpecials.length > 0) && Math.random() > 0.7){myWord = specialize(myWord, getASpecial().substring(0,1));}
        return myWord;}

    //real code
    let myRow = [];

    let characters = 0;
    while(characters < 50){
        let addMe = getNewWord();
        characters += addMe.length;
        addMe = ['/', '\\', "|", '-', '=', '+', '*', '^'].includes(addMe.substring(addMe.length-1)) ? addMe : addMe + ' ';
        myRow.push(addMe);
    }
    myRow = myRow.join(''); 
    return myRow;
}

export async function getWords(){
    const response = await fetch('words.txt');
    const text = response.text();
    return text;
}
