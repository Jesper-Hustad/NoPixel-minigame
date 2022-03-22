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


const COLOR_CODES = ['#000000', '#FFFFFF','#2195ee','#7b0100','#fceb3d','#fd9802','#4cae4f','#9926ac0']

const LANG_COLORS = LANG.COLORS.reduce((obj, key, i) => {obj[key] = COLOR_CODES[i]; return obj}, {})

export const COLORS = {
    'black' : '#000000',
    'white' : '#FFFFFF', 
    'blue' : '#2195ee',
    'red' : '#7b0100',
    'yellow' : '#fceb3d',
    'orange' : '#fd9802',
    'green' : '#4cae4f',
    'purple' : '#9926ac',
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

    // convert to hex color values
    Object.keys(colors).forEach(k => colors[k] = COLORS[colors[k]])

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

    // convert from hex codes to color names, skip if shape
    const nameA1 = Object.keys(COLORS).find(k=>COLORS[k]===a1) || a1
    const nameA2 = Object.keys(COLORS).find(k=>COLORS[k]===a2) || a2

    const answer = trPuzzle(nameA1) + ' ' + trPuzzle(nameA2)

    return [question, answer]
}





