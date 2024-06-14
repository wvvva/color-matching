const jsPsych = initJsPsych();
var timeline = [];

const heading = {
    type: jsPsychSurveyHtmlForm,
    html: `
    <div style='display: flex; justify-content: space-between; margin: 0 10vw 6vh 10vw'>
        <div style='text-align: center;'>
            <img src='../img/trail_1.png', alt='Blue Circle', style="width: 35vw; max-width: 400px">
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; margin: 2vw; width: 40%">
            <div style="display: flex; " >
                <img src="../img/red.png" style="width: 40px; margin-right: 2vw">
                <input type="text" placeholder="Enter R value here" class="jspsych-display-element"/>
            </div>
            <div style="display: flex;">
                <img src="../img/green.png" style="width: 40px; margin-right: 2vw">
                <input type="text" placeholder="Enter G value here" class="jspsych-display-element"/>
            </div>
            <div style="display: flex;">
                <img src="../img/blue1.png" style="width: 40px; margin-right: 2vw">
                <input type="text" placeholder="Enter B value here" class="jspsych-display-element"/>
            </div>
        </div>
    </div>
    `,
    button_label: "SUBMIT", 

};

timeline.push(heading)

// var blue_trial = {
//     type: jsPsychHtmlKeyboardResponse,
//     stimulus: 'Color Matching Task',
// };

// // var blue_trial = {
// //     type: jsPsychImageKeyboardResponse,
// //     stimulus: '../img/blue.png',
// // };

// timeline.push(blue_trial)


jsPsych.run(timeline);