import fs from 'fs';

const lHandLetters = 'qwertasdfgzxcvb'.split('');
const rHandLetters = 'yuiopjklnm'.split('');

let hold = await getWords();

async function getWords(){
    const readStream = fs.createReadStream(`C:/xampp/htdocs/blitzType/words/words.txt`, 'utf8');

    let lines = [];
    readStream.on('data', (chunk) => {
        lines = lines.concat(chunk.split(/\r?\n/));
    });

    readStream.on('end', () => {
        console.log('Finished reading.');
        console.log(lines);
        console.log('real?');
        getCap(lines);
    });

    readStream.on('error', (err) => {
        console.error('Read error:', err);
        return -1;
    });
}

function parse(words){
    for(let word of words){
        if(word.split('')[0].toUpperCase() == word.split('')[0]){
            console.log(word + ' starts with a capital.');
        }
        else{
            let lCount = 0;
            let rCount = 0;
            for(let char of word.split('')){
                if(lHandLetters.includes(char)){lCount++;}
                if(rHandLetters.includes(char)){rCount++;}
                if(char == '-'){
                    console.log(word + ' contains a hyphen');
                    lCount = 0;
                    rCount = 0;
                    fs.appendFile(`C:/xampp/htdocs/blitzType/hyphenWords.txt`, `${word}\n`, 'utf8', (err) => {
                        if (err) console.error('Write error:', err);
                    });
                    break;
                }
                if(char == '\''){
                    console.log(word + ' contains an apostrophe');
                    lCount = 0;
                    rCount = 0;
                    fs.appendFile(`C:/xampp/htdocs/blitzType/contractionWords.txt`, `${word}\n`, 'utf8', (err) => {
                        if (err) console.error('Write error:', err);
                    });
                    break;
                }
            }
            if(lCount > (word.length/2)){
                console.log(word + " is left dominant.");
                fs.appendFile(`C:/xampp/htdocs/blitzType/leftHandWords.txt`, `${word}\n`, 'utf8', (err) => {
                    if (err) console.error('Write error:', err);
                });
            }
            if(rCount > (word.length/2)){
                console.log(word + " is right dominant.");
                fs.appendFile(`C:/xampp/htdocs/blitzType/rightHandWords.txt`, `${word}\n`, 'utf8', (err) => {
                    if (err) console.error('Write error:', err);
                });
            }
        }
        
    }
}

function getCap(words){
    console.log('enter');

    fs.appendFile(`C:/xampp/htdocs/blitzType/words/words.txt`, `\n\n\n`, 'utf8', (err) => {
        if (err) console.error('Write error:', err);
    });

    for(let word of words){
        if(!(word.split('')[0].toUpperCase() == word.split('')[0])){
            fs.appendFile(`C:/xampp/htdocs/blitzType/words/words.txt`, `${word}\n`, 'utf8', (err) => {
                if (err) console.error('Write error:', err);
            });
        }
    }

}
