/* Need: onclick and onrelease functions, use for user typing and showing next needed key
 Need: Read stats as the text is completed
 Need: Generate text button. 
 Maybe: Implement backspace function
 Need: implement capitals, punctuation, special characters
 Need: find a better font*/

//TBI: replace with event.code markers to fix rshift, alt, ctrl
const keyMap = {'\`': 'backtick', '~': 'backtick', '1': 'one', '!': 'one','2': 'two', '@': 'two','3': 'three', '#': 'three','4': 'four', '$': 'four',
    '5': 'five', '%': 'five','6': 'six', '^': 'six','7': 'seven', '&': 'seven','8': 'eight', '*': 'eight','9': 'nine', '(': 'nine','0': 'zero', ')': 'zero',
    '-': 'min', '_': 'min','=': 'eq', '+': 'eq','[': 'lbracket', '{': 'lbracket',']': 'rbracket', '}': 'rbracket','\\': 'backslash', '|': 'backslash',
    ';': 'semi', ':': 'semi',"'": "quote", '"': "quote",',': 'com', '<': 'com','.': 'per', '>': 'per','/': 'fslash', '?': 'fslash','a': 'a', 'A': 'a',
    'b': 'b', 'B': 'b','c': 'c', 'C': 'c','d': 'd', 'D': 'd','e': 'e', 'E': 'e','f': 'f', 'F': 'f','g': 'g', 'G': 'g','h': 'h', 'H': 'h',
    'i': 'i', 'I': 'i','j': 'j', 'J': 'j','k': 'k', 'K': 'k','l': 'l', 'L': 'l','m': 'm', 'M': 'm','n': 'n', 'N': 'n','o': 'o', 'O': 'o',
    'p': 'p', 'P': 'p','q': 'q', 'Q': 'q','r': 'r', 'R': 'r','s': 's', 'S': 's','t': 't', 'T': 't','u': 'u', 'U': 'u','v': 'v', 'V': 'v',
    'w': 'w', 'W': 'w','x': 'x', 'X': 'x','y': 'y', 'Y': 'y','z': 'z', 'Z': 'z',' ': 'space',};
const metaMap = {'Alt': 'alt', 'Control': 'control', 'Enter': 'enter', 'Shift': 'shift', 'CapsLock': 'capslock', 'Meta': 'meta', 'Fn': 'function', 'Backspace': 'backspace', 'Tab' : 'tab'}

//pull words for test
async function getWords(){
    const response = await fetch('words.text');
    const text = response.text();
    return text;
}
let words = await getWords();
words = words.split(/\r?\n/);

document.querySelector("#makeExamButton").addEventListener('onclick', takeExam());

function takeExam(){
    //clear previous test
    const examBoxDiv = document.querySelectorAll("#examText div");
    for(let i = 0; i < 5; i++){
        examBoxDiv[i].innerHTML = '';
    }

    //generate test
    let myExam = [];
    let myRow = [];
    let characters = 0;
    for(let i = 0; i < 30; i++){

        let addMe = words[Math.floor((Math.random()*2993))];
        characters += addMe.length;
        if(characters > 50){
            myExam.push(myRow.join(" ").split(''));
            myRow = [];
            characters = addMe.length;
        }
        myRow.push(addMe);

    }

    //upload test
    let myCarry = [];
    for(let line in myExam){
        for(let char of myExam[line]){
            let pageChar = document.createElement('p');
            pageChar.innerHTML = (char === " ") ? '&nbsp;' : char;
            examBoxDiv[line].insertAdjacentElement('beforeend', pageChar);
            myCarry.push(char);
        }
    }

    //Listen for good input and progress the test
    let myProgress = 0;
    myExam = myCarry;
    let myChars = document.querySelectorAll("#examText p");
    document.addEventListener('keydown', (e) => {
        if(myProgress < myExam.length && !(e.key in metaMap)){
            if(myExam[myProgress] === e.key){
                myChars[myProgress].setAttribute('style', 'background-color: rgb(255, 102, 0);');
                myProgress++;
                if(myProgress === myExam.length){console.log("Test complete!");}}
            else{myChars[myProgress].setAttribute('style', 'background-color: red;');}
        }
        keyPress(e.key);
    });
    document.addEventListener('keyup', (e) => {
        keyRelease(e.key);
    });
}

function keyPress(key){
    let pressed = (key in metaMap) ? metaMap[key] : keyMap[key];
    document.querySelector(`#${pressed}`).setAttribute('style','border: 1px solid orangered; background-color:rgb(0,0,0); box-shadow: 0 0 3px orangered');
    if(pressed === 'meta' || pressed === 'tab'){setTimeout(() => {document.querySelector(`#${pressed}`).setAttribute('style','');}, 1000);}
}

function keyRelease(key){
    let released = (key in metaMap) ? metaMap[key] : keyMap[key];
    document.querySelector(`#${released}`).setAttribute('style','border: 1px solid white; background-color:rgb(95,95,95);');
}

takeExam();
