import { randomInt, sample } from './helpers.js'
import TRANSLATIONS from './language.js'
import { translateQ, trMisc, trColors, trShapes, trPuzzle } from './translator.js'

// import selectedLang from './script.js'
let selectedLang = localStorage.getItem('lang') || 'GB'

// if(!Object.keys(TRANSLATIONS).includes(selectedLang)) console.log(`LANGUAGE NOT SUPPORTED\nSELECTED: ${selectedLang}\nAVAILABLE: ${TRANSLATIONS.LANGUAGES}`)
let LANG = TRANSLATIONS[selectedLang]


document.addEventListener("lang", () => console.log("LANG CHANGED" + localStorage.getItem('lang')))
document.addEventListener("lang", () => LANG = TRANSLATIONS[localStorage.getItem('lang')])

const SHAPES = ["square", "triangle", "rectangle", "circle"]
const COLORABLE = ['background', 'colortext', 'shapetext', 'number', 'shape']

// const COLOR_CODES = ['black', 'white','#1991F9','#8C0C00','#FFE335','#FF9900','#46A04F','#A43AB5']
const COLOR_CODES = ['#000000', '#FFFFFF','#2196f3','#800000','#FFEB3C','#FF9800','#4CB050','#9D27B0']

const LANG_COLORS = LANG.COLORS.reduce((obj, key, i) => {obj[key] = COLOR_CODES[i]; return obj}, {})


// COLORS becomes this:
// const COLORS = {
//     'black' : 'black',
//     'white' : 'white',
//     'blue' : '#1991F9',
//     'red' : '#8C0C00',
//     'yellow' : '#FFE335',
//     'orange' : '#FF9900',
//     'green' : '#46A04F',
//     'purple' : '#A43AB5',
// }

const COLORS = {
    'black' : '#000000',
    'white' : '#FFFFFF', 
    'blue' : '#2196f3',
    'red' : '#800000',
    'yellow' : '#FFEB3C', //done
    'orange' : '#FF9800',
    'green' : '#4CB050', //done
    'purple' : '#9D27B0', //done
}


// functions that return answers from PuzzleData class
const QUESTIONS = {
    'background color' : (d) => d.colors['background'],
    'color text background color' : (d) => d.colors['colortext'],
    'shape text background color' : (d) => d.colors['shapetext'],
    'number color' : (d) => d.colors['number'],
    'shape color' : (d) => d.colors['shape'],
    'color text' : (d) => d.text[0],
    'shape text' : (d) => d.text[1],
    'shape' : (d) => d.shape
}

class PuzzleData {
    constructor(shape, number, text, colors) {
      this.shape = shape
      this.number = number
      this.text = text
      this.colors = colors
    }
}

// generates a random puzzle
export function generateRandomPuzzle(){

    const shape = sample(SHAPES)
    const number = randomInt(9) + 1

    let topText = sample(Object.keys(COLORS))
    let bottomText = sample(SHAPES)

    const colors = COLORABLE.reduce((obj, color) => {obj[color] = sample(Object.keys(COLORS)); return obj}, {})

    // ensure color and shape text don't blend with background
    while(['colortext', 'shapetext'].map(i => colors[i]).includes(colors['background']))
        colors['background'] = sample(Object.keys(COLORS))

    // ensure nothing blends with shape
    while(['background', 'colortext', 'shapetext', 'number'].map(i => colors[i]).includes(colors['shape'])){
        colors['shape'] = sample(Object.keys(COLORS))
    }

    topText = trColors(topText)
    bottomText = trShapes(bottomText)

    return new PuzzleData(shape, number, [topText, bottomText], colors)
}


export function generateQuestionAndAnswer(nums, puzzles){

    const positionOne = randomInt(nums.length)
    let tempPosTwo
    do {tempPosTwo = randomInt(nums.length)} while(positionOne == tempPosTwo)
    const positionTwo = tempPosTwo

    let firstQuestion = sample(Object.keys(QUESTIONS))
    let tempSecondQuestion
    do {tempSecondQuestion = sample(Object.keys(QUESTIONS))} while(tempSecondQuestion == firstQuestion)
    let secondQuestion = tempSecondQuestion

    const andWord = trMisc('AND')

    const question =  translateQ(firstQuestion) +' ('+nums[positionOne]+') '+andWord+' '+translateQ(secondQuestion)+' ('+nums[positionTwo]+')'

    const a1 = QUESTIONS[firstQuestion](puzzles[positionOne])
    const a2 = QUESTIONS[secondQuestion](puzzles[positionTwo])
    const answer = trPuzzle(a1) + ' ' + trPuzzle(a2)

    return [question, answer]
}





