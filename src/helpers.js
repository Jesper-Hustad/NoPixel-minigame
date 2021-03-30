const $ = name => document.querySelector(name)
const delay = s => new Promise(res => setTimeout(res, s * 1000));
const randomInt = (max) => Math.floor(Math.random() * Math.floor(max))
const sample = (arr) => arr[randomInt(arr.length)]
const shuffleArray = (arr) => arr.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value)

function playSound(name, volume){
    const sound = new Audio(name)
    sound.volume = volume || 0.15;
    sound.play();     
    return sound
}


export { $, delay, randomInt, sample, shuffleArray, playSound }