// quizDisplay.js

function renderQuizUI() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    quizQuestions.forEach(questionData => {
        renderQuestionUI(questionData.number);
    });
}

function getQuestionElementByNumber(questionNumber) {
    return document.querySelector(`[data-question-number="${questionNumber}"]`);
}

function renderQuestionUI(questionNumber) {
    const questionData = quizQuestions.find(q => q.number === questionNumber);
    if (!questionData) {
        console.error(`Question data not found for: ${questionNumber}`);
        return;
    }

    const questionElement = getQuestionElementByNumber(questionNumber);

    if (!questionElement) {
        const newQuestionElement = createQuestionElement(questionData);
        document.getElementById('quiz-container').appendChild(newQuestionElement);
    } else {
        updateQuestionElement(questionElement, questionData, getQuestionState(questionNumber));
    }
}

function createQuestionElement(questionData) {
    // Simplified Debugging
    console.log(`--- createQuestionElement: ${questionData.number} ---`);

    const questionState = getQuestionState(questionData.number);
    const container = document.createElement('div');
    container.classList.add('question-container');
    container.dataset.questionNumber = questionData.number;

    const questionNumberEl = document.createElement('div');
    questionNumberEl.classList.add('question-number');
    questionNumberEl.textContent = questionData.number;
    questionNumberEl.addEventListener('click', () => {
        handleQuestionClick(questionData.number);  // Use helper function
    });

    const questionTextEl = document.createElement('div');
    questionTextEl.classList.add('question-text');
    questionTextEl.textContent = questionData.question;
    questionTextEl.addEventListener('click', () => {
        handleQuestionClick(questionData.number); // Use helper function
    });


    const answerChoicesEl = document.createElement('div');
    answerChoicesEl.classList.add('answer-choices');

    if (typeof questionData.choices === 'object' && questionData.choices !== null) {
        for (const key in questionData.choices) {
            if (questionData.choices.hasOwnProperty(key)) {
                const choice = questionData.choices[key];
                const choiceEl = document.createElement('div');
                choiceEl.classList.add('answer-choice');
                choiceEl.textContent = choice;
                choiceEl.dataset.choiceKey = key;

                choiceEl.addEventListener('click', () => {
                    handleAnswerClick(questionData, key); // Use helper function
                });
                answerChoicesEl.appendChild(choiceEl);
            }
        }
    } else {
        console.error(`questionData.choices is not a valid object for question number: ${questionData.number}`);
    }

    container.appendChild(questionNumberEl);
    container.appendChild(questionTextEl);
    container.appendChild(answerChoicesEl);

    // Image Display
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container'); // Add a class
    container.appendChild(imageContainer);
    if (questionData.question.toLowerCase().includes("figure t-")) {
          const match = questionData.question.toLowerCase().match(/figure t-(\d)/);
          if (match)
          {
            const imageNumber = match[1];
            const imageEl = document.createElement('img');
            imageEl.src = `T${imageNumber}.jpg`;
            imageEl.alt = `Figure T-${imageNumber}`;
            imageEl.classList.add('question-image');
            imageContainer.appendChild(imageEl);
           }
    }


    applyQuestionState(container, questionData, questionState);
    return container;
}


function updateQuestionElement(container, questionData, questionState) {
    applyQuestionState(container, questionData, questionState);
}

function applyQuestionState(container, questionData, questionState) {
    // Simplified Debugging
    // console.log(`--- applyQuestionState: ${questionData.number} - Answered: ${questionState.answered}, Collapsed: ${questionState.isCollapsed}, Correct: ${questionState.isCorrectlyAnswered}, Revealed:${questionState.revealed} ---`);

    const questionTextEl = container.querySelector('.question-text');
    if (!questionTextEl) {
        console.error("Question text element not found in container:", container);
    } else {
        questionTextEl.textContent = questionData.question;
    }

    // Handle collapsing/expanding.
    if (questionState.isCollapsed) {
        container.classList.add('collapsed');
    } else {
        container.classList.remove('collapsed');
    }

    const answerChoices = container.querySelectorAll('.answer-choice');
    if (!answerChoices) {
        return;
    }

    // Add/remove 'answered' class to the *container*
    if (questionState.answered) {
        // console.log(`applyQuestionState - Question ${questionData.number}: Adding 'answered' class`); // DEBUG
        container.classList.add('answered');
    } else {
        // console.log(`applyQuestionState - Question ${questionData.number}: Removing 'answered' class`); // DEBUG
        container.classList.remove('answered');
    }

    answerChoices.forEach(choiceEl => {
        const choiceKey = choiceEl.dataset.choiceKey;

        // *** FIX: Always remove highlighting classes, THEN re-apply if needed ***
        choiceEl.classList.remove('correct-answer', 'incorrect-answer');
        choiceEl.style.backgroundColor = ''; // Remove inline styles

        if (questionState.answered || questionState.revealed) {
            // Highlighting logic (only if answered or revealed)
            if (questionState.revealed && choiceKey === questionData.correctAnswer){
                choiceEl.classList.add('correct-answer');
            }
            if (questionState.answered) {
                if (choiceKey === questionData.correctAnswer) {
                    choiceEl.classList.add('correct-answer');
                } else if (choiceKey === questionState.selectedAnswer) {
                    choiceEl.classList.add('incorrect-answer');
                }
            }
        }


        // Debugging: Check pointer-events style
        const pointerEventsStyle = getComputedStyle(choiceEl).pointerEvents;
        // console.log(`  Choice ${choiceKey} - pointer-events: ${pointerEventsStyle}`); // DEBUG
    });
}


// --- Helper Functions ---

function handleQuestionClick(questionNumber) {
    const currentState = getQuestionState(questionNumber);
    console.log(`toggleQuestionCollapse - Question: ${questionNumber}, Answered: ${currentState.answered}, Collapsed: ${currentState.isCollapsed}`); // DEBUG

    if (currentState.answered) { //ORIGINAL CONDITION: Only allow toggling if answered
        updateQuestionState(questionNumber, { isCollapsed: !currentState.isCollapsed });
    }
     else {
        // Allow EXPANDING unanswered questions
        if (currentState.isCollapsed) {
            console.log(`toggleQuestionCollapse - Expanding unanswered question: ${questionNumber}`); // DEBUG
            updateQuestionState(questionNumber, { isCollapsed: false }); // Force expand
        }
         else {
            console.log(`toggleQuestionCollapse - Ignoring collapse of unanswered question: ${questionNumber}`); // DEBUG
            //Do nothing - prevent collapsing of unanswered questions manually.
        }
    }
}

function handleAnswerClick(questionData, selectedKey) {
    const questionNumber = questionData.number;
    const questionState = getQuestionState(questionNumber);

    if (questionState.answered) {
        return; // Already answered, do nothing
    }

    const isCorrect = (selectedKey === questionData.correctAnswer);
    updateQuestionState(questionNumber, {
        answered: true,
        isCorrectlyAnswered: isCorrect,
        selectedAnswer: selectedKey,
        isCollapsed: false, // Expand on answer
    });

    if (isRandomMode) {
        // Start the delay timer
        setTimeout(() => {
            if (isRandomMode) { // Check again in case mode changed
                document.getElementById('quiz-container').innerHTML = ''; // Clear current
                displayRandomQuestion();
            }
        }, isCorrect ? randomModeCorrectDelay : randomModeIncorrectDelay);
    }
}