import {initJsPsych} from '../jspsych/dist/jspsych';
import jsPsychHtmlKeyboardResponse from '../jspsych/disk/plugin-html-keyboard-response';

const jsPsych = initJsPsych();

const trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Hello world!',
}

jsPsych.run([trial]);