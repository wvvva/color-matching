const jsPsych = initJsPsych();

// //////////////////////////////////////
// Changable variables
// -----------------------------------
// stimulus: How long the result will be staying on the page (in seconds)
var stimulus = 5; 



var timeline = [];
var guessedRgb;
var colorSim;
var test_stimuli = [
    { stimulus: "img/trail_1.png", rgb: 'rgb(153, 66, 66)'},
    { stimulus: "img/trail_2.png", rgb: 'rgb(185, 231, 185)'},
    { stimulus: "img/trail_3.png", rgb: 'rgb(68, 68, 106)'},
    { stimulus: "img/trail_4.png", rgb: 'rgb(187, 191, 24)'},
    { stimulus: "img/trail_5.png", rgb: 'rgb(216, 125, 231)'},
    { stimulus: "img/trail_6.png", rgb: 'rgb(67, 145, 162)'},
];

// Changed from https://github.com/antimatter15/rgb-lab/blob/master/color.js
function rgb2lab(rgb){
    const [r1, g1, b1] = rgb.match(/\d+/g).map(Number)

    var r = r1 / 255,
        g = g1 / 255,
        b = b1 / 255,
        x, y, z;
  
    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  
    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  
    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
  }
  
  // calculate the perceptual distance between colors in CIELAB
  // https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/Cie94Comparison.cs
  // Changed from https://github.com/antimatter15/rgb-lab/blob/master/color.js
  function colorSimilarity(rgbA, rgbB){
    labA = rgb2lab(rgbA)
    labB = rgb2lab(rgbB)

    var deltaL = labA[0] - labB[0];
    var deltaA = labA[1] - labB[1];
    var deltaB = labA[2] - labB[2];
    var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    var deltaC = c1 - c2;
    var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    var sc = 1.0 + 0.045 * c1;
    var sh = 1.0 + 0.015 * c1;
    var deltaLKlsl = deltaL / (1.0);
    var deltaCkcsc = deltaC / (sc);
    var deltaHkhsh = deltaH / (sh);
    var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;

    return i < 0 ? 0 : 100 - Math.sqrt(i);
  }

// rgb task: guess rgb values
var rgbTask = {
    type: jsPsychSurveyHtmlForm,
    html: function(){
    var img = jsPsych.timelineVariable('stimulus');
    return `
    <div style='display: flex; justify-content: space-around; margin: 0 3vw 0 3vw'>
        <div style='text-align: center;'>
            <img src="${img}", style="width: 35vw; max-width: 400px">
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; margin: 2vw 2vw 2vw 2vw; width: 40%">
            <div style="display: flex; " >
                <img src="img/red.png" style="width: 40px; height: 40px; margin-right: 2vw">
                <div style="width: 15vw; display: flex; flex-direction: column;" >
                    <input type="range" min="0" max="255" value="0" name="r" class="slider"/>
                    <div style="display: flex; justify-content: space-between;" >
                        <span style="font-size: 15px;">0</span>
                        <span style="font-size: 15px;">255</span>
                    </div>
                </div>
            </div>
            <div style="display: flex;">
                <img src="img/green.png" style="width: 40px; height: 40px; margin-right: 2vw">
                <div style="width: 15vw; display: flex; flex-direction: column;" >
                    <input type="range" min="0" max="255" value="0" class="slider" name="g"/>
                    <div style="display: flex; justify-content: space-between;" >
                        <span style="font-size: 15px;">0</span>
                        <span style="font-size: 15px;">255</span>
                    </div>
                </div>
            </div>
            <div style="display: flex;">
                <img src="img/blue1.png" style="width: 40px; height: 40px; margin-right: 2vw">
                <div style="width: 15vw; display: flex; flex-direction: column;" >
                    <input type="range" min="0" max="255" value="0" class="slider" name="b"/>
                    <div style="display: flex; justify-content: space-between;" >
                        <span style="font-size: 15px;">0</span>
                        <span style="font-size: 15px;">255</span>
                    </div>
                </div>
            </div>
            <input type="submit" id="jspsych-survey-html-form-next" class="jspsych-btn jspsych-survey-html-form" value="SUBMIT"></input>
        </div>
    </div>
    `},
    // button_label: "SUBMIT", 
    data: {
        task: 'response',
        similarity: 'similarity'
    },
    on_finish: function(data){
        guessedRgb = data.response;
        guessedRgb = `rgb(${guessedRgb.r}, ${guessedRgb.g}, ${guessedRgb.b})`;
        colorSim = colorSimilarity(jsPsych.timelineVariable('rgb'), guessedRgb);
    }
};

// Present the color of participant's guess
var result = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        var img = jsPsych.timelineVariable('stimulus');
        return `
        <p style="font-size:48px; ">RESULT</p>
        <p style="font-size:20px;">Your guessed color is ${colorSim.toFixed(2)}% similar to the given color</p>
        <div style="display: flex; justify-content: space-evenly; align-items: center; margin: 6vh 5vh 8vh 5vh">
            <div> 
                <p style="font-size:20px; margin-left: 5vw;">Correct Answer</p>
                <img src="${img}", style="margin-left: 5vw; margin-top: 5px; width: 20vw; height: 20vw;">
            </div>
            <div>
                <p style="font-size:20px; margin-right: 5vw;">Your Guess</p>
                <div style="margin-right: 5vw; width: 20vw; height: 20vw; border-radius: 50%; background-color: ${guessedRgb};"></div>
            </div>
        </div>
        `;
    },
    stimulus_duration: 1000 * stimulus,
    trial_duration:1000 * stimulus,
    choices: "NO_KEYS"
};

var end = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        return `
        <p style="font-size:48px;">The End of This Experiment</p>
        `;
    },
    choices: "NO_KEYS"
};

var test_procedure = {
    timeline: [rgbTask, result],
    timeline_variables: test_stimuli
}

timeline.push(test_procedure);
timeline.push(end);

jsPsych.run(timeline);
