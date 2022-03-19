import { $ } from './helpers.js'
import TRANSLATIONS from './language.js'

let selectedLang = localStorage.getItem('lang') || 'GB'
let lang = TRANSLATIONS[selectedLang]

document.addEventListener("lang", () => lang = TRANSLATIONS[localStorage.getItem('lang')])


function translatePuzzle(puzzle){
    console.log('puzzle', puzzle)
    return puzzle
}

function translateQA(QA){
    return QA
}

// by adding || t  to the end 
// we allow some results to be translated twice or ignored if no translation exists 

const translateQ = (t) => lang.QUESTIONS[TRANSLATIONS.GB.QUESTIONS.indexOf(t)] || t

const trMisc = (t) => lang.MISC[TRANSLATIONS.GB.MISC.indexOf(t)] || t

const trColors = (t) => lang.COLORS[TRANSLATIONS.GB.COLORS.indexOf(t)] || t

const trShapes = (t) => lang.SHAPES[TRANSLATIONS.GB.SHAPES.indexOf(t)] || t

const trPuzzle = (t) => {
    const langPuzzles = [...lang.COLORS, ...lang.SHAPES]
    const englishPuzzles = [...TRANSLATIONS.GB.COLORS, ...TRANSLATIONS.GB.SHAPES]
    return langPuzzles[englishPuzzles.indexOf(t)] || t
}


$('#to-fast').innerText = trMisc('Too fast? Practice by changing the puzzle time!')
$('#answer-was').innerText = trMisc('the answer was')
$('#try-again-button').innerText = trMisc('Try again')

$('#puzzle-amount').innerText = trMisc('Puzzle amount')
$('#puzzle-time').innerText = trMisc('Puzzle time')
$('#answer-placeholder').setAttribute('placeholder', trPuzzle('blue') + ' ' + trPuzzle('square'))


export { translatePuzzle, translateQA, translateQ, trMisc, trColors, trShapes, trPuzzle }

  
// the button with corresponding flag
function createLangOptionElement(lang){
    let b = document.createElement('button');
    let s = document.createElement('span')
    s.classList.add('flag-option')
    s.classList.add('flag-icon-' + lang.toLowerCase())
    b.append(s)
    b.setAttribute('lang',lang.toLowerCase())
    b.classList.add('language-option') 
    b.append(lang); 
    b.addEventListener('click', selectedLanguage)
    
    return b 
}


// user clicked a new language
function selectedLanguage(e){

    // two letter alpha 2 country code
    const lang = e.target.getAttribute('lang')

    // store user preference in browser
    localStorage.setItem('lang', lang.toUpperCase())

    // tells translator.js to update
    document.dispatchEvent(new Event('lang'));
    
    $("#language-list").classList.toggle("show");
    updateFlag()
    window.location.reload()
}



function updateFlag(){
    const lang = localStorage.getItem('lang') || 'GB'
    $(".flag-selected-display").classList = 'flag-selected-display flag-icon-' + lang.toLowerCase()
}


// initialize language selector
Object.keys(TRANSLATIONS)
        .sort((a, b) => a.localeCompare(b))
        .map(createLangOptionElement)
        .forEach(b => $('#language-list').append(b))


// display language dropdown
$('#language-toggle').addEventListener('click', () => $("#language-list").classList.toggle("show"))

updateFlag()


// for readme screenshot purposes
// function displayFlags(){
//     const langs = Object.keys(TRANSLATIONS).sort((a, b) => a.localeCompare(b))
//     langs.forEach(lang => {
//         let b = document.createElement('button');
//         let s = document.createElement('span')
//         s.classList.add('readme-flag')
//         s.classList.add('flag-icon-' + lang.toLowerCase())
//         b.append(s)
//         b.setAttribute('lang',lang.toLowerCase())
//         b.classList.add('readme-display') 
//         $('.center').append(b)
//     })
// }
// displayFlags()