const jsPsych = initJsPsych();
var timeline = [];

const heading = {
    type: jsPsychSurveyHtmlForm,
    html: `
    <div style='display: flex; justify-content: space-between; margin: 6vh 10vw 0 10vw'>
        <div style='text-align: center;'>
            <img src='../img/blue.png', alt='Blue Circle', style="width: 35vw; max-width: 400px">
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; margin: 2vw">
            <img src="../img/blue.png" alt="Blue Circle" style="width: 5vw;">
            <img src="../img/blue.png" alt="Blue Circle" style="width: 5vw; ">
            <img src="../img/blue.png" alt="Blue Circle" style="width: 5vw;">
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