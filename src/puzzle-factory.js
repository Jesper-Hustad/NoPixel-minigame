import { randomInt, sample } from './helpers.js'

const SHAPES = ["square", "triangle", "rectangle", "circle"]
const COLORABLE = ['background', 'text', 'number', 'shape']

const COLORS = {
    'black' : 'black',
    'white' : 'white', 
    'blue' : '#1991F9',
    'red' : '#8C0C00',
    'yellow' : '#FFE335',
    'orange' : '#FF9900',
    'green' : '#46A04F',
    'purple' : '#A43AB5',
}
const QUESTIONS = {
    'background color' : (d) => d.colors['background'],
    'text background color' : (d) => d.colors['text'],
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

    const topText = sample(Object.keys(COLORS))
    const bottomText = sample(SHAPES)

    const colors = COLORABLE.reduce((obj, color) => {obj[color] = sample(Object.keys(COLORS)); return obj}, {})

    // ensure shape and background don't blend
    while(colors['text'] == colors['background'])
        colors['text'] = sample(Object.keys(COLORS))

    // ensure nothing blends with shape
    while(['background', 'text', 'number'].map(i => colors[i]).includes(colors['shape']))
        colors['shape'] = sample(Object.keys(COLORS))
    
    return new PuzzleData(shape, number, [topText, bottomText], colors)
}


export function generateQuestionAndAnswer(nums, puzzles){

    const positionOne = randomInt(nums.length)
    let tempPosTwo
    do {tempPosTwo = randomInt(nums.length)} while(positionOne == tempPosTwo) 
    const positionTwo = tempPosTwo
    

    const firstQuestion = sample(Object.keys(QUESTIONS))
    let tempSecondQuestion
    do {tempSecondQuestion = sample(Object.keys(QUESTIONS))} while(tempSecondQuestion == firstQuestion) 
    const secondQuestion = tempSecondQuestion

    

    // this is confusing as hell, but works somehow
    const question =  `${firstQuestion} (${nums[positionOne]}) AND ${secondQuestion} (${nums[positionTwo]})`
    const answer = QUESTIONS[firstQuestion](puzzles[positionOne]) + ' ' + QUESTIONS[secondQuestion](puzzles[positionTwo])

    return [question, answer]
}