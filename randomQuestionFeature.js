// randomQuestionFeature.js
function initializeRandomQuestionFeature() {

    function getRandomQuestion() {
        if (quizQuestions.length === 0) {
            console.warn("No questions available.");
            return null;
        }
        const randomIndex = Math.floor(Math.random() * quizQuestions.length);
        return quizQuestions[randomIndex];
    }

    // Example usage (you can remove this in your actual implementation)
    //const randomQ = getRandomQuestion();
    //if (randomQ) {
    //   console.log("Random Question:", randomQ.number, randomQ.text);
    //}

    return {
        getRandomQuestion  // Expose the method
    };
}

// Ensure this runs *before* anything that depends on quizMethods.
// In a real-world scenario with multiple files, make sure this script
// is loaded before quiz.html tries to use quizMethods.  The DOMContentLoaded
// handler in quiz.html takes care of this ordering.
// quizMethods = initializeRandomQuestionFeature(); // Removed global assignment.