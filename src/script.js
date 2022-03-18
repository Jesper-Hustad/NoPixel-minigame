"use strict"

// langue française = 'FR'
// lengua española = 'ES'
// lingua italiana = 'IT'
// english language = 'EN'
let LANGUAGE_OPTION = 'FR'
var selectedLang = 'FR'
export default LANGUAGE_OPTION


import { $, delay, playSound } from './helpers.js'
import { doPuzzle } from './puzzle-handler.js'

// runs on site load and handles entire  flow
async function start(){

    // reset from previous
    $('.try-again').classList.add('hidden')
    $('.spy-icon').src = 'assets/spy-icon.png'

    playSound('assets/dialing.mp3', 0.1)

    // mock loading screen
    setInformationText('ESTABLISHING CONNECTION')
    await delay(0.8)
    setInformationText('DOING SOME HACKERMANS STUFF...')
    await delay(1)
    setInformationText('ACCESS CODE FLAGGED; REQUIRES HUMAN CAPTCHA INPUT..')
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
    
    // display result
    setInformationText((result) ? 'the system has been bypassed.' : "The system didn't accept your answers")
    if(!result) $('.spy-icon').src = 'assets/failed.png'

    $('#answer-reveal').textContent = answer

    $('#submitted-reveal').textContent = (result) ?             'Good job, indeed the' :
                                        ((submitted == null) ?  "The time ran out," : 
                                                                `You wrote "${submitted || ' '}", the`)

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

// language dropdown
$('#language-toggle').addEventListener('click', () => toggleLanguageDropdown())

function toggleLanguageDropdown(){
    $("#language-list").classList.toggle("show");
}
  
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = $(".dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            } 
        }
    }
}

const languages = ['gb','no','fr','de','es']

languages
    .map(lang => {
        let b = document.createElement('button');
        let s = document.createElement('span')
        s.classList.add('flag-option')
        s.classList.add('flag-icon-' + lang)
        b.append(s)
        b.setAttribute('lang',lang)
        b.classList.add('language-option') 
        b.append(lang.toUpperCase()); 
        
        return b 
    })
    .forEach(b => $('#language-list').append(b))

document.querySelectorAll('.language-option').forEach(o =>o.addEventListener('click', selectedLanguage))

function selectedLanguage(e){
    const lang = e.target.getAttribute('lang')
    localStorage.setItem('lang', lang.toUpperCase())
    document.dispatchEvent(new Event('lang'));
    console.log(localStorage.getItem('lang'))
    $("#language-list").classList.toggle("show");

    setFlag()

    window.location.reload()
}

function setFlag(){
    const lang = localStorage.getItem('lang') || 'GB'
    console.log('set flag', lang)
    $(".flag-selected-display").classList = 'flag-selected-display flag-icon-' + lang.toLowerCase()
}

$('#try-again-button').addEventListener('click', start)


setFlag()
start()
