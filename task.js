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
    { stimulus: "img/trail_1.png", rgb: 'rgb(146, 100, 144)'},
    { stimulus: "img/trail_2.png", rgb: 'rgb(146, 100, 144)'},
    { stimulus: "img/trail_3.png", rgb: 'rgb(146, 100, 144)'},
    { stimulus: "img/trail_4.png", rgb: 'rgb(146, 100, 144)'},
    { stimulus: "img/trail_5.png", rgb: 'rgb(146, 100, 144)'},
    { stimulus: "img/trail_6.png", rgb: 'rgb(146, 100, 144)'},
];

// Calculate color similarity, use euclidean distance on rgb values
function colorSimilarity(corAnswer, guess) {
    const [r1, g1, b1] = corAnswer.match(/\d+/g).map(Number);
    const [r2, g2, b2] = guess.match(/\d+/g).map(Number);

    const maxD = 255 * Math.sqrt(3)

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
    <div style='display: flex; justify-content: space-between; margin: 0 10vw 6vh 10vw'>
        <div style='text-align: center;'>
            <img src="${img}", style="width: 35vw; max-width: 400px">
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; margin: 2vw; width: 40%">
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
        </div>
    </div>
    `},
    button_label: "SUBMIT", 
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
        <div style="display: flex; justify-content: center; align-items: center; margin: 10vh">
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
