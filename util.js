function validate() {
    // r = parseInt(document.forms["survey-html"]["r"].value)
    rating = parseInt(document.forms["survey-html"]["rating"].value)
    ratingconf = parseInt(document.forms["survey-html"]["rating-conf"].value)
    console.log(rating);
    if  (isNaN(rating)){
        alert('Please select at least one option for the rating.');
        return false;
    }

    if  (isNaN(ratingconf)){
        alert('Please select at least one star for the confidence rating.');
        return false;
    }

    // if (isNaN(r) || /[^\d]/.test(document.forms["survey-html"]["r"].value) || r > 255 || r < 0){
    //     alert('Please enter a valid integer between 0 and 255 for R value.');
    //     return false;
    // }

    // g = parseInt(document.forms["survey-html"]["g"].value)
    // if (isNaN(g) || /[^\d]/.test(document.forms["survey-html"]["g"].value) || g > 255 || g < 0){
    //     alert('Please enter a valid integer between 0 and 255 for G value.');
    //     return false;
    // }

    // b = parseInt(document.forms["survey-html"]["b"].value)
    // if (isNaN(b) || /[^\d]/.test(document.forms["survey-html"]["b"].value) || b > 255 || b < 0){
    //     alert('Please enter a valid integer between 0 and 255 for B value.');
    //     return false;
    // }
    return true;
}             

