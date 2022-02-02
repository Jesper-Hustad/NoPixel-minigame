import { $, shuffleArray, delay, playSound } from './helpers.js'
import { generateRandomPuzzle, generateQuestionAndAnswer } from './puzzle-factory.js'
import { getPuzzleSvg } from './svg-factory.js'

const progressBar = $('.answer-progress-bar')
const inputElement = $('.answer-input')

let puzzleTime = 7
let puzzleAmount = 4

// handles generating puzzle and returning result
export async function doPuzzle(){
    // reset from previous run
    $('.answer-section').classList.add('hidden')
    $(".number-container").innerHTML = ''

    //Generate squares and puzzles
    const squares = [...Array(puzzleAmount).keys()].map(i => {
        let square = document.createElement('div')
        square.id = `square-${i+1}`
        square.className = 'square'
        $('#number-container').appendChild(square)
        return square
    })
    const puzzles = [...Array(puzzleAmount)].map(() => generateRandomPuzzle())
      
    // generate numbers and display
    const nums = shuffleArray([...Array(puzzleAmount)].map((v, i) => i+1))
    await displayNumbers(nums)

    const metronome = playSound('assets/metronome.mp3')

    // clear and focus input window
    $('.answer-section').classList.remove('hidden')
    inputElement.value = ''
    inputElement.focus()

    // activate time remaining countdown bar 
    
    progressBar.style.transition = ``
    progressBar.classList.remove('answer-progress-bar-shrink')
    await delay(0.1)
    progressBar.style.transition = `width ${puzzleTime*1000}ms linear`
    progressBar.classList.add('answer-progress-bar-shrink')
    

    // display puzzle in squares
    squares.forEach((square, i) => square.style.backgroundColor = puzzles[i].colors['background'])
    squares.forEach((square, i)  => square.innerHTML =  getPuzzleSvg(puzzles[i]))

    // generate and display question
    const [question, answer] = generateQuestionAndAnswer(nums, puzzles) 
    $('.answer-question').textContent = question.toUpperCase()

    return new Promise((resolve) => {

        // return written input and answer
        inputElement.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                metronome.pause()
                resolve([inputElement.value, answer])
            }
        });

        // return nothing by default if puzzleTime seconds go by
        delay(puzzleTime).then(() => {
            metronome.pause()
            resolve([null, answer])
        })
    });
}


async function displayNumbers(numbers){
    
    numbers.forEach((n, i) => $('#square-' + (i+1)).innerHTML = `<div class="big-numbers can-shrink" id="num-${i+1}">${n}</div>`)

    await delay(1.5)
    numbers.forEach(n => $('#num-' + (n)).classList.add('number-shrink'))
    await delay(1.5)
}

// puzzle time settins
const timeRange = 7
const puzzleRange = 4
