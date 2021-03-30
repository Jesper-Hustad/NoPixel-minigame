import { $, shuffleArray, delay, playSound } from './helpers.js'
import { generateRandomPuzzle, generateQuestionAndAnswer } from './puzzle-factory.js'
import { getPuzzleSvg } from './svg-factory.js'

const squares = [...Array(4).keys()].map(i => $('#square-' + (i+1)))
const progressBar = $('.answer-progress-bar')
const inputElement = $('.answer-input')

let puzzleTime = 7

// handles generating puzzle and returning result
export async function doPuzzle(){

    // reset from previous run
    $('.answer-section').classList.add('hidden')
    squares.forEach(square => square.style.backgroundColor = '#2E4561')
      
    // generate numbers and display
    const nums = shuffleArray([1, 2, 3, 4])
    console.log(nums)
    await displayNumbers(nums)

    const metronome = (puzzleTime == 7) ? playSound('assets/metronome.mp3') : playSound('assets/long-metronome.mp3')
    const puzzles = [...Array(4)].map(_ => generateRandomPuzzle())

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
    
    // for learning purposes
    console.log(answer)

    return new Promise(async (resolve) => {

        // return written input and answer
        inputElement.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                metronome.pause()
                resolve([inputElement.value, answer])
            }
        });

        // return nothing by default if puzzleTime seconds go by
        await delay(puzzleTime)
        metronome.pause()
        resolve([null, answer])
    });
}


async function displayNumbers(numbers){
    
    numbers.forEach((n, i) => $('#square-' + (i+1)).innerHTML = `<div class="big-numbers can-shrink" id="num-${i+1}">${n}</div>`)

    await delay(1.5)
    numbers.forEach(n => $('#num-' + n).classList.add('number-shrink'))
    await delay(1.5)
}

// puzzle time settins
const timeRange = $('#speed-controll')
timeRange.addEventListener('input', () => puzzleTime = $('.time-display').textContent = timeRange.value)