/* =================================
   AI Data Evaluation Platform
   Evaluation Logic
================================= */

let selectedDecision = null;

// Response decision buttons
const responseABtn = document.getElementById("responseABtn");
const responseBBtn = document.getElementById("responseBBtn");
const tieBtn = document.getElementById("tieBtn");

responseABtn.addEventListener("click", function () {
    selectedDecision = "Response A";
    setDecisionStyle(responseABtn);
});

responseBBtn.addEventListener("click", function () {
    selectedDecision = "Response B";
    setDecisionStyle(responseBBtn);
});

tieBtn.addEventListener("click", function () {
    selectedDecision = "Tie";
    setDecisionStyle(tieBtn);
});


// Highlight selected decision
function setDecisionStyle(selectedButton) {

    responseABtn.style.opacity = "0.5";
    responseBBtn.style.opacity = "0.5";
    tieBtn.style.opacity = "0.5";

    selectedButton.style.opacity = "1";
}


// Submit evaluation
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", function () {

    const prompt = document.getElementById("prompt").value.trim();
    const responseA = document.getElementById("responseA").value.trim();
    const responseB = document.getElementById("responseB").value.trim();
    const notes = document.getElementById("notes").value.trim();

    // Validate required fields
    if (!prompt) {
        alert("Please enter the evaluation prompt.");
        return;
    }

    if (!responseA) {
        alert("Please enter Response A.");
        return;
    }

    if (!responseB) {
        alert("Please enter Response B.");
        return;
    }

    if (!selectedDecision) {
        alert("Please select which response is better.");
        return;
    }

    if (!notes) {
        alert("Please provide evaluator notes.");
        return;
    }


    // Get scores
    const accuracy = Number(
        document.getElementById("accuracy").value
    );

    const relevance = Number(
        document.getElementById("relevance").value
    );

    const clarity = Number(
        document.getElementById("clarity").value
    );

    const completeness = Number(
        document.getElementById("completeness").value
    );

    const safety = Number(
        document.getElementById("safety").value
    );


    // Calculate average score
    const overallScore = (
        (accuracy +
            relevance +
            clarity +
            completeness +
            safety) / 5
    ).toFixed(1);


    // Display result
    const result = document.getElementById("result");
    const resultMessage = document.getElementById("resultMessage");
    const scoreElement = document.getElementById("overallScore");


    resultMessage.textContent =
        "Evaluation completed. " +
        selectedDecision +
        " was selected as the preferred response.";

    scoreElement.textContent = overallScore;

    result.classList.remove("hidden");


    // Scroll to result
    result.scrollIntoView({
        behavior: "smooth"
    });
});
