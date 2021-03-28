
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
    'shape text' : (d) => d.text[1],
}

class PuzzleData {
    constructor(shape, number, text, colors) {
      this.shape = shape
      this.number = number
      this.text = text
      this.colors = colors
    }
}


// runs on site load and handles entire  flow
async function start(){

    // reset from previous
    $('.try-again').classList.add('hidden')
    $('.spy-icon').src = './assets/spy-icon.png'


    const dialing = playSound('./assets/dialing.mp3', 0.1)

    // mock loading screen
    setInformationText('ESTABLISHING CONNECTION')
    await delay(1.8)
    setInformationText('DOING SOME HACKERMANS STUFF...')
    await delay(1.5)
    setInformationText('ACCESS CODE FLAGGED; REQUIRES HUMAN CAPTCHA INPUT..')
    await delay(2)

    // hide text and show squares
    $('#text-container').classList.toggle('hidden')
    $('#number-container').classList.toggle('hidden')


    // activate puzzle 4 times, break on fail
    let result = true
    for (let i = 0; i < 4 && result; i++) {
        result = await doPuzzle()
    }

    // hide squares and show text
    $('.answer-section').classList.add('hidden')
    $('.number-container').classList.add('hidden')
    $('#text-container').classList.remove('hidden')
    
    // const result = false

    // display result
    setInformationText((result) ? 'the system has been bypassed.' : "The system didn't accept your answers")
    if(!result) $('.spy-icon').src = './assets/failed.png'

    $('.try-again').classList.remove('hidden')
}






// handles generating puzzle and returning result
async function doPuzzle(){

    // ------ Display numbers ------

    // get DOM squares
    const squares = [...Array(4).keys()].map(i => $('#square-' + (i+1)))

    // reset from previous run
    $('.answer-section').classList.add('hidden')
    squares.forEach((square, i) => square.style.backgroundColor = '#2E4561')
        
    // generate numbers and display
    const nums = shuffleArray([1, 2, 3, 4])
    await displayNumbers(nums)


    // ------ Activate puzzle ------
    const progressBar = $('.answer-progress-bar')
    const inputElement = $('.answer-input')
    const metronome = playSound('./assets/metronome.mp3')
    const puzzles = [...Array(4)].map(_ => generateRandomPuzzle())

    // clear and focus input window
    $('.answer-section').classList.remove('hidden')
    inputElement.value = ''
    inputElement.focus()

    // activate time remaining countdown bar 
    progressBar.classList.remove('answer-progress-bar-shrink')
    await delay(0.05)
    progressBar.classList.add('answer-progress-bar-shrink')

    // display puzzle in squares
    squares.forEach((square, i) => square.style.backgroundColor = puzzles[i].colors['background'])
    squares.forEach((square, i)  => square.innerHTML =  getPuzzleSvg(puzzles[i]))

    // generate and display question
    const [question, answer] = generateQuestionAndAnswer(nums, puzzles) 
    $('.answer-question').textContent = question.toUpperCase()
    
    // for learning purposes
    console.log(answer)

    return new Promise(async (resolve) => {

        // return result if user enters answer
        inputElement.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                metronome.pause()
                resolve(inputElement.value == answer)
            }
        });

        // return false by default if 6.8 seconds go by
        await delay(6.8)
        resolve(false)
    });
}

// generates a random puzzle
function generateRandomPuzzle(){

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


function generateQuestionAndAnswer(nums, puzzles){

    const positionOne = randomInt(3) + 1
    do {tempPosTwo = randomInt(3) + 1} while(positionOne == tempPosTwo) 
    const positionTwo = tempPosTwo
    

    const firstQuestion = sample(Object.keys(QUESTIONS))
    do {tempSecondQuestion = sample(Object.keys(QUESTIONS))} while(tempSecondQuestion == firstQuestion) 
    const secondQuestion = tempSecondQuestion

    // this is confusing as hell, but works somehow
    const question =  `${firstQuestion} (${nums[positionOne]}) AND ${secondQuestion} (${nums[positionTwo]})`
    const answer = QUESTIONS[firstQuestion](puzzles[positionOne]) + ' ' + QUESTIONS[secondQuestion](puzzles[positionTwo])

    return [question, answer]
}


async function displayNumbers(numbers){
    numbers.forEach((n, i) => $('#square-' + n).innerHTML = `<div class="big-numbers can-shrink" id="num-${n}">${(i+1)}</div>`)

    await delay(1.5)
    numbers.forEach(n => $('#num-' + n).classList.add('number-shrink'))
    await delay(1.5)
    return
}



// ----- SVG logic ----- 

const createSVG = (elements) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"> ${elements.join("\n")} </svg>`

SHAPE_SVG = {
    "square" : (c) => `<rect fill=${c} stroke="#000" stroke-width="1" width="150" height="150"/>`, 
    "triangle": (c) => `<polygon  fill=${c}  stroke="#000" stroke-width="1" points="0 150 75 0 150 150 0 150"/>`, 
    "rectangle" : (c) =>`<rect y="30" fill=${c}  stroke="#000" stroke-width="1" class="shape" width="150" height="90"/>`, 
    "circle" : (c) => `<circle fill=${c}  stroke="#000" stroke-width="1" cx="75" cy="75" r="75"/>`,
}

const createShape = (name, color) => SHAPE_SVG[name](color)

const createText = (text, color, size, weight, y) => `
    <text 
        stroke="black" 
        fill="${color}" 
        stroke-width="1" 
        style="font-size:${size}px;" 
        font-weight="${weight}" 
        x="50%" 
        y="${y}%" 
        dominant-baseline="middle" 
        text-anchor="middle"
    >
        ${text}
    </text> `

function getPuzzleSvg(puzzleData){
    
    const textSize = 21
    const textWeigth = 1000
    const textColor = puzzleData.colors['text']

    const shapeSVG = createShape(puzzleData.shape, puzzleData.colors['shape'])
    const topText = createText(puzzleData.text[0].toUpperCase(), textColor, textSize, textWeigth, 31)
    const bottomText = createText(puzzleData.text[1].toUpperCase(), textColor, textSize, textWeigth, 67)
    const numberText = createText(puzzleData.number, puzzleData.colors['number'], 60, 500, 50)

    return createSVG([shapeSVG, topText, bottomText, numberText])
}




// ------ Helper functions ------


const delay = s => new Promise(res => setTimeout(res, s * 1000));
const $ = name => document.querySelector(name)
const randomInt = (max) => Math.floor(Math.random() * Math.floor(max))
const sample = (arr) => arr[randomInt(arr.length)]
const shuffleArray = (arr) => arr.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value)
const setInformationText = (text) => $("#loading-text").innerHTML = `<span class="capital">${text.charAt(0).toUpperCase()}</span>${text.toUpperCase().substring(1)}`
function playSound(name, volume){
    const sound = new Audio(name)
    sound.volume = volume || 0.15;
    sound.play();     
    return sound
}