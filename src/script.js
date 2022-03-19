"use strict"

// langue française = 'FR'
// lengua española = 'ES'
// lingua italiana = 'IT'
// english language = 'EN'

let tryAgainAvailable = false
let LANGUAGE_OPTION = 'FR'

import TRANSLATIONS from './language.js'
import { $, delay, playSound } from './helpers.js'
import { doPuzzle } from './puzzle-handler.js'
import {trMisc as tr} from './translator.js'


// runs on site load and handles entire  flow
async function start(){

    // reset from previous
    $('.try-again').classList.add('hidden')
    $('.spy-icon').src = 'assets/spy-icon.png'
    tryAgainAvailable = false

    playSound('assets/dialing.mp3', 0.1)

    // mock loading screen
    setInformationText(tr('ESTABLISHING CONNECTION'))
    await delay(0.8)
    setInformationText(tr('DOING SOME HACKERMANS STUFF...'))
    await delay(1)
    setInformationText(tr('ACCESS CODE FLAGGED; REQUIRES HUMAN CAPTCHA INPUT..'))
    await delay(0.8)

    // hide text and show squares
    $('#text-container').classList.toggle('hidden')
    $('#number-container').classList.toggle('hidden')


    // activate puzzle 4 times, break on fail
    let submitted
    let answer
    let result = true

    for (let i = 0; i < 4 && result; i++) {
        [submitted, answer] = await doPuzzle()
        result = (submitted?.toLowerCase() == answer)
    }

    // hide squares and show text
    $('.answer-section').classList.add('hidden')
    $('.number-container').classList.add('hidden')
    $('#text-container').classList.remove('hidden')
    tryAgainAvailable = true
    
    // display result
    setInformationText((result) ? tr('the system has been bypassed.') : tr("The system didn't accept your answers"))
    if(!result) $('.spy-icon').src = 'assets/failed.png'

    $('#answer-reveal').textContent = answer

    $('#submitted-reveal').textContent = (result) ?             tr('Good job, ') :
                                        ((submitted == null) ?  tr("The time ran out,") : 
                                                                `${tr('You wrote')} "${submitted || ' '}" `)

    $('.try-again').classList.remove('hidden')
}

function resetPuzzle(){
    $('.answer-section').classList.add('hidden')
    $('.number-container').classList.add('hidden')
    $('#text-container').classList.remove('hidden')
    $('.answer-section').classList.add('hidden')
    $(".number-container").innerHTML = ''
    start()
}


function setInformationText(text){
    
    const capitalized = text.toUpperCase()
    const infoText = `<span class="capital">${capitalized.charAt(0)}</span>${capitalized.substring(1)}`
    
    $("#loading-text").innerHTML = infoText
}


// count visitors
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-7E64QM2WXT');

// help menu
const overlay = $('#overlay')
$('#help-on').addEventListener('click', () => overlay.style.display = "block")
$('#overlay').addEventListener('click', () => overlay.style.display = "none")

window.addEventListener("keydown", function (e) {
    if($('#answer-placeholder') == document.activeElement) return

    if(e.code != 'Space') return

    if(!tryAgainAvailable) return

    console.log('clicking TRY AGAIN')
    $('#try-again-button').click() 
    
    // if (event.defaultPrevented) {
    //   return; // Do nothing if the event was already processed
    // }
})



$('#try-again-button').addEventListener('click', start)

start()
