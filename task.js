const jsPsych = initJsPsych();

// //////////////////////////////////////
// Changable variables
// -----------------------------------
// stimulus: How many seconds the result will be staying on the page (in seconds)
var stimulus = 3; 



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

// Calculate color similarity, use euclidean distance on rgb values
function colorSimilarity(corAnswer, guess) {
    const [r1, g1, b1] = corAnswer.match(/\d+/g).map(Number);
    const [r2, g2, b2] = guess.match(/\d+/g).map(Number);

    const maxD = Math.sqrt(Math.pow(Math.max(Math.abs(0 - r1), Math.abs(255 - r1)), 2) + Math.pow(Math.max(Math.abs(0 - g1), Math.abs(255 - g1)), 2) + Math.pow(Math.max(Math.abs(0 - b1), Math.abs(255 - b1)), 2))

    const euDistance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))

    const percentageSim = (1 - (euDistance / maxD)) * 100

    return percentageSim
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
                <img src="img/red.png" style="width: 40px; margin-right: 2vw">
                <input type="text" placeholder="Enter R value here (0~255)" name="r" class="jspsych-display-element"/>
            </div>
            <div style="display: flex;">
                <img src="img/green.png" style="width: 40px; margin-right: 2vw">
                <input type="text" placeholder="Enter G value here (0~255)" name="g" class="jspsych-display-element"/>
            </div>
            <div style="display: flex;">
                <img src="img/blue1.png" style="width: 40px; margin-right: 2vw">
                <input type="text" placeholder="Enter B value here (0~255)" name="b" class="jspsych-display-element"/>
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
        return `
        <p style="font-size:48px;">YOUR GUESS</p>
        <p style="font-size:20px;">Your guessed color is ${colorSim.toFixed(2)}% similar to the given color</p>
        <div style="display: flex; justify-content: center; align-items: center; margin: 6vh 5vh 8vh 5vh">
            <div style="width: 20vw; height: 20vw; border-radius: 50%; background-color: ${guessedRgb};"></div>
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
