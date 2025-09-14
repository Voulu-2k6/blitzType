Tate Sorensen, Summer 2025

This project aims to build a fun and dynamic way to improve your typing skills.

Link to the project: https://voulu-2k6.github.io/blitzType/

Tools used in this project:
    HTML/CSS/JavaScript
*This project relies on browser cookies to store user data. 

Features:
    -Working typing test that records stats like wpm, accuracy
    -Endless mode: generates a new line of test each time the final 'enter' key is hit
    -Settings to choose which punctuation/special characters to use
    -Adaption setting: determines your worst keys and gives you a set of words to practice them as you continue to test
    -Target Key setting: pick from any (for the most part) key on the keyboard to target in your test
    -Stats page to show visually which keys need work, best scores

Known bugs/tweaks, by file: 

    exam.js: 
        double letters mess up keystrokes
        endless timer starts when line loads, not on first press

    settingshtml.js
        targets do not show on load
        everything is broken internally

    statshtml.js
        need to format our date object
        need to fix css display
        wpm is wrong

Iplementing features: 
    Settings.html: implement a key for the display at bottom
    Settings.html: clicking shift puts capitals at 100, enter a popup suggesting endless
    Settings.html: implement warning for selecting key with no permitted keys

    Stats.html: implement hovering over keymap for stats/stats needed for level up

    index.html: implement animations for line movement
    index.html: implement animations for new high scores
    index.html: implement animations for levelling up a key
    index.html: implement animations for which adjustment keys are being run
    index.html: warning that small settings override big 

    exam.js:
        protection against multiple misses for one key. 
        miss subtraction as a way to combat acc fatigue.







