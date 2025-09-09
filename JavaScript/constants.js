export const keyMap = {'\`': 'Backquote', '~': 'Backquote', '1': 'Digit1', '!': 'Digit1','2': 'Digit2', '@': 'Digit2','3': 'Digit3', '#': 'Digit3','4': 'Digit4', '$': 'Digit4',
    '5': 'Digit5', '%': 'Digit5','6': 'Digit6', '^': 'Digit6','7': 'Digit7', '&': 'Digit7','8': 'Digit8', '*': 'Digit8','9': 'Digit9', '(': 'Digit9','0': 'Digit0', ')': 'Digit0',
    '-': 'Minus', '_': 'Minus','=': 'Equal', '+': 'Equal','[': 'BracketLeft', '{': 'BracketLeft',']': 'BracketRight', '}': 'BracketRight','\\': 'Backslash', '|': 'Backslash',
    ';': 'Semicolon', ':': 'Semicolon',"'": "Quote", '"': "Quote",',': 'Comma', '<': 'Comma','.': 'Period', '>': 'Period','/': 'Slash', '?': 'Slash','a': 'KeyA', 'A': 'KeyA',
    'b': 'KeyB', 'B': 'KeyB','c': 'KeyC', 'C': 'KeyC','d': 'KeyD', 'D': 'KeyD','e': 'KeyE', 'E': 'KeyE','f': 'KeyF', 'F': 'KeyF','g': 'KeyG', 'G': 'KeyG','h': 'KeyH', 'H': 'KeyH',
    'i': 'KeyI', 'I': 'KeyI','j': 'KeyJ', 'J': 'KeyJ','k': 'KeyK', 'K': 'KeyK','l': 'KeyL', 'L': 'KeyL','m': 'KeyM', 'M': 'KeyM','n': 'KeyN', 'N': 'KeyN','o': 'KeyO', 'O': 'KeyO',
    'p': 'KeyP', 'P': 'KeyP','q': 'KeyQ', 'Q': 'KeyQ','r': 'KeyR', 'R': 'KeyR','s': 'KeyS', 'S': 'KeyS','t': 'KeyT', 'T': 'KeyT','u': 'KeyU', 'U': 'KeyU','v': 'KeyV', 'V': 'KeyV',
    'w': 'KeyW', 'W': 'KeyW','x': 'KeyX', 'X': 'KeyX','y': 'KeyY', 'Y': 'KeyY','z': 'KeyZ', 'Z': 'KeyZ',' ': 'Space', '&nbsp;': 'Space', 'Shift': 'ShiftLeft', 'shift':'ShiftLeft', '\\n': 'Enter', '&NewLine;': 'Enter'};
export const reverseKeyMap = {"Backquote": "`", "Backslash": "\\", "BracketLeft": "[", "BracketRight": "]", "Comma": ",", 
    "Digit0": "0", "Digit1": "1", "Digit2": "2", "Digit3": "3", "Digit4": "4", "Digit5": "5", 
    "Digit6": "6", "Digit7": "7", "Digit8": "8", "Digit9": "9", "Equal": "=", "KeyA": "a", "KeyB": "b", 
    "KeyC": "c", "KeyD": "d", "KeyE": "e", "KeyF": "f", "KeyG": "g", "KeyH": "h", "KeyI": "i", "KeyJ": "j", 
    "KeyK": "k", "KeyL": "l", "KeyM": "m", "KeyN": "n", "KeyO": "o", "KeyP": "p", "KeyQ": "q", "KeyR": "r", 
    "KeyS": "s", "KeyT": "t", "KeyU": "u", "KeyV": "v", "KeyW": "w", "KeyX": "x", "KeyY": "y", "KeyZ": "z", 
    "Minus": "-", "Period": ".", "Quote": "'", "Semicolon": ";", "Slash": "/", "Space": "Space", "ShiftLeft": "Shift", 'Enter': 'Enter', '\n': 'Enter'}
export const shiftMap = { '~': 'Backquote', '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5', '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0', 
    '_': 'Minus', '+': 'Equal', '{': 'BracketLeft', '}': 'BracketRight', '|': 'Backslash', ':': 'Semicolon', '"': 'Quote', '<': 'Comma', '>': 'Period', '?': 'Slash', 'A': 'KeyA', 'B': 'KeyB', 
    'C': 'KeyC', 'D': 'KeyD', 'E': 'KeyE', 'F': 'KeyF', 'G': 'KeyG', 'H': 'KeyH', 'I': 'KeyI', 'J': 'KeyJ', 'K': 'KeyK', 'L': 'KeyL', 'M': 'KeyM', 'N': 'KeyN', 'O': 'KeyO', 'P': 'KeyP', 'Q': 'KeyQ', 
    'R': 'KeyR', 'S': 'KeyS', 'T': 'KeyT', 'U': 'KeyU', 'V': 'KeyV', 'W': 'KeyW', 'X': 'KeyX', 'Y': 'KeyY', 'Z': 'KeyZ'};
export const specialKeyCodes = ['Tab', 'CapsLock', 'Backspace', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'];
export const letters = 'abcdefghijklmnopqrstuvwyxz'.split('');
export const nonLetters = "~`@#$%^&*()_+={}[]\\|<>.,!?;:-'\"\n".split('');