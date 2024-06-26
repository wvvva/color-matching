// //////////////////////////////////////
// Changable variables
// -----------------------------------
// stimulus: How long the result will be staying on the page (in seconds) (inhibited)
// criterion_change: How many trails before the participant reselecting their criterion
// criterion: Start with how many number of stars
var stimulus = 5; 
var criterion_change = 5;
var criterion = 2;



var timeline = [];
var trail = 0;
var guessedRgb;
var colorSim;
var prediction;
var evaluation;
var start_stimuli = [
    'rgb(227, 66, 52)',
    'rgb(255, 192, 0)',
    'rgb(192, 255, 0)',
    'rgb(63, 255, 0)',
    'rgb(0, 255, 64)',
    'rgb(127, 255, 212)',
    'rgb(0, 192, 255)',
    'rgb(0, 64, 255)',
    'rgb(106, 93, 255)',
    'rgb(128, 0, 128)',
    'rgb(222, 49, 99)',
    'rgb(220, 20, 60)',
];

var test_stimuli = [
    // { rgb: 'rgb(220, 20, 60)'}
]

for(let i = 0; i < start_stimuli.length; i++){
    var colorlist = colorGeneration(start_stimuli[i])
    for (let j = 0; j < colorlist.length; j++){
        var dic = {}
        dic['rgb'] = colorlist[j]
        test_stimuli.push(dic)
    }
}

const jsPsych = initJsPsych();

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

  function lighter(rgbA, t){
    const [r1, g1, b1] = rgbA.match(/\d+/g).map(Number)
    result = []

    result[0] = parseInt(r1 + (255 - r1) * t)
    result[1] = parseInt(g1 + (255 - g1) * t)
    result[2] = parseInt(b1 + (255 - b1) * t)

    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`
  }

  function darker(rgbA, t){
    const [r1, g1, b1] = rgbA.match(/\d+/g).map(Number)
    result = []

    result[0] = parseInt(r1 * t)
    result[1] = parseInt(g1 * t)
    result[2] = parseInt(b1 * t)

    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`
  }

  function colorGeneration(rgb){
    color = []
    for (let t = 0; t < 5; t++){
        color[t] = darker(rgb, (t + 1)/6) 
    }

    for (let t = 0; t < 5; t++){
        color[t + 5] = lighter(rgb, t/6) 
    }
    return color
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

  function showStars(criterion) {
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach(star => {
        const value = parseInt(star.getAttribute('data-value'));
        if (value <= criterion) {
            if (star.classList.contains('hidden')) {
                star.classList.remove('hidden');
            }
        } else {
            console.log("here");
            star.classList.add('hidden');
        }
    });
}

// rgb task: guess rgb values
var rgbTask = {
    type: jsPsychSurveyHtmlForm,
    html: function(){
        var img = jsPsych.timelineVariable('rgb');
        var margin_star = (10 - criterion) * 29
        return `
        <div style='display: flex; justify-content: space-around; margin: 0 3vw 0 3vw'>
            <div style='text-align: center;'>
                <div style="margin-right: 5vw; width: 35vw; max-width: 400px; height: 35vw; max-height: 400px; border-radius: 50%; background-color: ${img};"></div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; margin: 0vw 2vw 0vw 2vw; width: 40%">
                <div style="display: flex;">
                    <img src="img/red.png" style="width: 40px; height: 40px; margin-right: 2vw">
                    <div style="width: 15vw; display: flex; flex-direction: column;">
                        <input type="range" min="0" max="255" value="0" name="r" class="slider"/>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 15px;">0</span>
                            <span style="font-size: 15px;">MAX</span>
                        </div>
                    </div>
                </div>
                <div style="display: flex;">
                    <img src="img/green.png" style="width: 40px; height: 40px; margin-right: 2vw">
                    <div style="width: 15vw; display: flex; flex-direction: column;">
                        <input type="range" min="0" max="255" value="0" class="slider" name="g"/>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 15px;">0</span>
                            <span style="font-size: 15px;">MAX</span>
                        </div>
                    </div>
                </div>
                <div style="display: flex;">
                    <img src="img/blue1.png" style="width: 40px; height: 40px; margin-right: 2vw">
                    <div style="width: 15vw; display: flex; flex-direction: column;">
                        <input type="range" min="0" max="255" value="0" class="slider" name="b"/>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 15px;">0</span>
                            <span style="font-size: 15px;">MAX</span>
                        </div>
                    </div>
                </div>
                <div>
                    <p style="margin-bottom: 10px; font-size: 18px">Your Confidence Level</p>
                    <div class="star-rating" style="margin-left: 1vw; margin-left: ${margin_star}px;">
                        <span data-value="10" class="star">★</span>
                        <span data-value="9" class="star">★</span>
                        <span data-value="8" class="star">★</span>
                        <span data-value="7" class="star">★</span>
                        <span data-value="6" class="star">★</span>
                        <span data-value="5" class="star">★</span>
                        <span data-value="4" class="star">★</span>
                        <span data-value="3" class="star">★</span>
                        <span data-value="2" class="star">★</span>
                        <span data-value="1" class="star">★</span>
                    </div>
                    <input type="hidden" name="rating" id="rating" value="">
                </div>
                <input type="submit" id="jspsych-survey-html-form-next" class="jspsych-btn jspsych-survey-html-form" value="SUBMIT" style="margin-right: 1vw"></input>
            </div>
        </div>
        `;
    },
    data: {
        task: 'response',
        similarity: 'similarity',
        prediction: 'prediction'
    },
    on_load: function() {
        showStars(criterion)
        const stars = document.querySelectorAll('.star-rating .star');
        const ratingInput = document.getElementById('rating');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                ratingInput.value = value;
                
                stars.forEach(s => s.classList.remove('selected'));
                
                star.classList.add('selected');
                prediction = ratingInput.value;
            });
        });
    },
    on_finish: function(data){
        guessedRgb = data.response;
        guessedRgb = `rgb(${guessedRgb.r}, ${guessedRgb.g}, ${guessedRgb.b})`;
        colorSim = colorSimilarity(jsPsych.timelineVariable('rgb'), guessedRgb);
        data.similarity = colorSim;
        data.prediction = prediction;
        console.log(data);
        trail = trail + 1;
    }
};


// Present the color of participant's guess
var result = {
    type: jsPsychSurveyHtmlForm,
    html: function(){
        var img = jsPsych.timelineVariable('rgb');
        var margin_star = (10 - criterion) * 29
        console.log(colorSim.toFixed(2));
        // <p style="font-size:10px;">Your guessed color is ${colorSim.toFixed(2)}% similar to the given color</p>
        return `
        <div style='display: flex; justify-content: space-around; margin: 0 3vw 0 3vw'>
            <div style='text-align: center;'>
                <div style="margin-right: 5vw; width: 35vw; max-width: 400px; height: 35vw; max-height: 400px; border-radius: 50%; background-color: ${img};"></div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; margin: 0vw 2vw 0vw 2vw; width: 40%">
                        <div style = "height: 57%">
                            <p style="font-size:20px; margin-top: 0; margin-bottom: 2vh;">Your Guess</p>
                            <div style="width: 13vw; height: 13vw; border-radius: 50%; background-color: ${guessedRgb};"></div>
                        </div>
                        <div style="margin-bottom: 10px">
                            <p style="margin-bottom: 10px; font-size: 18px">Your Confidence Level</p>
                            <div class="star-rating" style="margin-left: 1vw; margin-left: ${margin_star}px;">
                                <span data-value="10" class="star">★</span>
                                <span data-value="9" class="star">★</span>
                                <span data-value="8" class="star">★</span>
                                <span data-value="7" class="star">★</span>
                                <span data-value="6" class="star">★</span>
                                <span data-value="5" class="star">★</span>
                                <span data-value="4" class="star">★</span>
                                <span data-value="3" class="star">★</span>
                                <span data-value="2" class="star">★</span>
                                <span data-value="1" class="star">★</span>
                            </div>
                            <input type="hidden" name="rating" id="rating" value="">
                        </div>
                        <input type="submit" id="jspsych-survey-html-form-next" class="jspsych-btn jspsych-survey-html-form" value="SUBMIT" style="margin-right: 1vw"></input>
            </div>
        </div>

        `;
    },
    data: {
        evaluation: 'evaluation'
    },
    on_load: function() {
        showStars(criterion)
        const stars = document.querySelectorAll('.star-rating .star');
        const ratingInput = document.getElementById('rating');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                ratingInput.value = value;
                
                stars.forEach(s => s.classList.remove('selected'));
                
                star.classList.add('selected');
                evaluation = ratingInput.value;
            });
        });
    },
    on_finish: function(data){
        data.evaluation = evaluation;
        console.log(data);
    }
};

var criterion_trial = {
    type: jsPsychHtmlSliderResponse,
    stimulus: `<div style="width:100%; align-items: center">
        <p>Instruction</p>
        </div>`,
    labels: ["2", "4", "6", "8", "10"],
    min: 2,
    max: 10,
    slider_start: 2,
    slider_width: 500,
    on_finish: function(data){
        criterion = data.response
    }
}

var criterion_node = {
    timeline: [criterion_trial],
    conditional_function: function(){
        if(trail % criterion_change == 0){
            return true;
        } else {
            return false;
        }
    }
}

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
    timeline: [rgbTask, result, criterion_node],
    timeline_variables: test_stimuli
}

timeline.push(test_procedure);
timeline.push(end);

jsPsych.run(timeline);
