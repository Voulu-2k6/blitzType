Tate Sorensen, Summer 2025

This project aims to build a fun and dynamic way to improve your typing skills.

Tools used in this project:
    HTML/CSS/JavaScript
*This project relies on browser cookies to store user data. 

Features:
    -Working typing test that records stats like wpm, accuracy, and keys that 
    may pose a problem.
    -Endless mode: generates a new line of test each time the final 'enter' key is hit
    -Settings to choose which punctuation/digit characters to use, as well as their
    frequency.

Known bugs/tweaks, by file: 

    exam.js: 
        Timer starts on exam load, not on first character clicked. 
        double letters mess up keystrokes
        getNewLine and preferences.words aren't aligned
        additional space before enter on endless
        endless key selection is delayed one line.
        make endless one line
        space is invisible

    stats.js
        Spacebar on problemkeys is invisible
        Spacebar doesn't highlight on problem, nor does Enter

UI fixes:

    settings.js
        targeted key selection is not user-friendly
        nothing to show how far the slider is before setting value

    exam.js 
        enter key should read as such

    CSS
        Animating line movement in endless

Iplementing features: 

    Settings: punctuation lacks em dashes and en dashes
    Exam: reset/pause endless

TO DO:
    Finalize settings page. 
        Add sliders for punctuation and specials freq.
        implement adjusting selected key
        polish UI
    Finalize exam page.
        TBL
    Create stats page.




