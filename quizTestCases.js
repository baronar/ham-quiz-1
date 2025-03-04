// quizTestCases.js
// quizTestCases.js

// ... (previous runSpacingConsistencyTest function) ...

function runFontSizeConsistencyTest() {
    const questionNumberToTest = quizQuestions[0].number; // Test the first question
    renderQuestionUI(questionNumberToTest); // Render the question in expanded state

    const questionElement = getQuestionElementByNumber(questionNumberToTest);
    if (!questionElement) {
        console.error("Font Size Test Failed: Question element not found.");
        return;
    }

    const questionNumberElement = questionElement.querySelector('.question-number');
    const questionTextElement = questionElement.querySelector('.question-text');

    if (!questionNumberElement || !questionTextElement) {
        console.error("Font Size Test Failed: Question number or text element not found.");
        return;
    }

    // Get font sizes in expanded state
    const expandedNumberFontSize = getComputedStyle(questionNumberElement).fontSize;
    const expandedTextFontSize = getComputedStyle(questionTextElement).fontSize;

    // Collapse the question programmatically
    updateQuestionState(questionNumberToTest, { isCollapsed: true }, { skipDisplayResults: true });

    // Re-query elements after collapse (DOM has updated)
    const collapsedQuestionElement = getQuestionElementByNumber(questionNumberToTest);
    const collapsedQuestionNumberElement = collapsedQuestionElement.querySelector('.question-number');
    const collapsedQuestionTextElement = collapsedQuestionElement.querySelector('.question-text');

    // Get font sizes in collapsed state
    const collapsedNumberFontSize = getComputedStyle(collapsedQuestionNumberElement).fontSize;
    const collapsedTextFontSize = getComputedStyle(collapsedQuestionTextElement).fontSize;

    const numberFontSizeConsistent = expandedNumberFontSize === collapsedNumberFontSize;
    const textFontSizeConsistent = expandedTextFontSize === collapsedTextFontSize;

    if (numberFontSizeConsistent && textFontSizeConsistent) {
        console.log("Font Size Consistency Test Passed:");
        console.log(`  Question Number Font Size: Expanded - ${expandedNumberFontSize}, Collapsed - ${collapsedNumberFontSize}`);
        console.log(`  Question Text Font Size:   Expanded - ${expandedTextFontSize}, Collapsed - ${collapsedTextFontSize}`);
    } else {
        console.error("Font Size Consistency Test Failed:");
        if (!numberFontSizeConsistent) {
            console.error(`  Question Number Font Size: Expanded - ${expandedNumberFontSize}, Collapsed - ${collapsedNumberFontSize} - INCONSISTENT`);
        } else {
            console.log(`  Question Number Font Size: Expanded - ${expandedNumberFontSize}, Collapsed - ${collapsedNumberFontSize} - Consistent`);
        }
        if (!textFontSizeConsistent) {
            console.error(`  Question Text Font Size:   Expanded - ${expandedTextFontSize}, Collapsed - ${collapsedTextFontSize} - INCONSISTENT`);
        } else {
            console.log(`  Question Text Font Size:   Expanded - ${expandedTextFontSize}, Collapsed - ${collapsedTextFontSize} - Consistent`);
        }
    }
}

function runSpacingConsistencyTest() {
    const questionNumberToTest = quizQuestions[0].number; // Test the first question
    renderQuestionUI(questionNumberToTest); // Render the question in expanded state

    const questionElement = getQuestionElementByNumber(questionNumberToTest);
    if (!questionElement) {
        console.error("Test Failed: Question element not found.");
        return;
    }

    const questionNumberElement = questionElement.querySelector('.question-number');
    const questionTextElement = questionElement.querySelector('.question-text');

    if (!questionNumberElement || !questionTextElement) {
        console.error("Test Failed: Question number or text element not found.");
        return;
    }

    // Measure spacing in expanded state
    const expandedNumberRect = questionNumberElement.getBoundingClientRect();
    const expandedTextRect = questionTextElement.getBoundingClientRect();
    const expandedSpacing = expandedTextRect.top - expandedNumberRect.bottom;

    // Collapse the question programmatically
    updateQuestionState(questionNumberToTest, { isCollapsed: true }, { skipDisplayResults: true });

    // Re-query elements after collapse (DOM has updated)
    const collapsedQuestionElement = getQuestionElementByNumber(questionNumberToTest);
    const collapsedQuestionNumberElement = collapsedQuestionElement.querySelector('.question-number');
    const collapsedQuestionTextElement = collapsedQuestionElement.querySelector('.question-text');

    // Measure spacing in collapsed state
    const collapsedNumberRect = collapsedQuestionNumberElement.getBoundingClientRect();
    const collapsedTextRect = collapsedQuestionTextElement.getBoundingClientRect();
    const collapsedSpacing = collapsedTextRect.top - collapsedNumberRect.bottom;

    const tolerance = 1; // 1 pixel tolerance for rounding errors
    const spacingIsConsistent = Math.abs(expandedSpacing - collapsedSpacing) <= tolerance;

    if (spacingIsConsistent) {
        console.log("Spacing Consistency Test Passed:");
        console.log(`  Expanded Spacing: ${expandedSpacing.toFixed(2)}px`);
        console.log(`  Collapsed Spacing: ${collapsedSpacing.toFixed(2)}px`);
    } else {
        console.error("Spacing Consistency Test Failed:");
        console.error(`  Expanded Spacing: ${expandedSpacing.toFixed(2)}px`);
        console.error(`  Collapsed Spacing: ${collapsedSpacing.toFixed(2)}px`);
        console.error(`  Difference: ${Math.abs(expandedSpacing - collapsedSpacing).toFixed(2)}px (Tolerance: ${tolerance}px)`);
    }
}