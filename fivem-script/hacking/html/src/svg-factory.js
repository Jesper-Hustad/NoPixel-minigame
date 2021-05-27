/**
 * Generates a complete svg image from a PuzzleData object
 * 
 * @param {PuzzleData} puzzleData 
 */
export function getPuzzleSvg(puzzleData){
    
    const textSize = 21
    const textWeigth = 'normal'
    const textColor = puzzleData.colors['text']

    const shapeSVG = createShape(puzzleData.shape, puzzleData.colors['shape'])
    const topText = createText(puzzleData.text[0].toUpperCase(), textColor, textSize, textWeigth, 31)
    const bottomText = createText(puzzleData.text[1].toUpperCase(), textColor, textSize, textWeigth, 67)
    const numberText = createText(puzzleData.number, puzzleData.colors['number'], 60, 100, 50, 'Arial, Helvetica')

    return createSVG([shapeSVG, topText, bottomText, numberText])
}

// Takes multiple SVG strings and combines them to a svg
const createSVG = (elements) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"> ${elements.join("\n")} </svg>`

const createShape = (shape, color) => SHAPE_SVG[shape](color)

const SHAPE_SVG = {
    "square" : (c) => `<rect fill=${c} stroke="#000" stroke-width="1" width="150" height="150"/>`, 
    "triangle": (c) => `<polygon  fill=${c}  stroke="#000" stroke-width="1" points="0 150 75 0 150 150 0 150"/>`, 
    "rectangle" : (c) =>`<rect y="30" fill=${c}  stroke="#000" stroke-width="1" class="shape" width="150" height="90"/>`, 
    "circle" : (c) => `<circle fill=${c}  stroke="#000" stroke-width="1" cx="75" cy="75" r="75"/>`,
}



const createText = (text, color, size, weight, y, font) => `
    <text 
        stroke="black" 
        fill="${color}" 
        stroke-width="1" 
        style="font-size:${size}px;" 
        font-weight="${weight}" 
        font-family="${font || 'Archivo Black'}, sans-serif";
        x="50%" 
        y="${y}%" 
        dominant-baseline="middle" 
        text-anchor="middle"
    >
        ${text}
    </text> `
