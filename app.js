/* =========================================
   AI Data Evaluation Platform
   Evaluation Logic + History
   ========================================= */

const STORAGE_KEY = "aiEvaluationHistory";

let selectedDecision = null;


// -----------------------------------------
// Page elements
// -----------------------------------------

const responseABtn = document.getElementById("responseABtn");
const responseBBtn = document.getElementById("responseBBtn");
const tieBtn = document.getElementById("tieBtn");
const submitBtn = document.getElementById("submitBtn");

const scoreIds = [
    "accuracy",
    "relevance",
    "clarity",
    "completeness",
    "safety"
];


// -----------------------------------------
// Local Storage
// -----------------------------------------

function getEvaluations() {
    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];
    } catch (error) {
        console.error(
            "Could not read evaluation history:",
            error
        );
        return [];
    }
}

function saveEvaluations(evaluations) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(evaluations)
    );
}


// -----------------------------------------
// Decision buttons
// -----------------------------------------

function setDecisionStyle(selectedButton) {
    [
        responseABtn,
        responseBBtn,
        tieBtn
    ].forEach(button => {
        button.style.opacity = "0.5";
        button.classList.remove("selected");
    });

    selectedButton.style.opacity = "1";
    selectedButton.classList.add("selected");
}

function selectDecision(decision, button) {
    selectedDecision = decision;
    setDecisionStyle(button);
}

responseABtn.addEventListener(
    "click",
    () => selectDecision(
        "Response A",
        responseABtn
    )
);

responseBBtn.addEventListener(
    "click",
    () => selectDecision(
        "Response B",
        responseBBtn
    )
);

tieBtn.addEventListener(
    "click",
    () => selectDecision(
        "Tie",
        tieBtn
    )
);


// -----------------------------------------
// Score sliders
// -----------------------------------------

scoreIds.forEach(id => {

    const slider =
        document.getElementById(id);

    const value =
        document.getElementById(`${id}Value`);

    if (slider && value) {

        value.textContent = slider.value;

        slider.addEventListener(
            "input",
            () => {
                value.textContent =
                    slider.value;
            }
        );
    }
});


// -----------------------------------------
// Character counters
// -----------------------------------------

function updateCharacterCount(
    textareaId,
    countId
) {

    const textarea =
        document.getElementById(textareaId);

    const count =
        document.getElementById(countId);

    if (!textarea || !count) return;

    function update() {
        count.textContent =
            `${textarea.value.length} characters`;
    }

    textarea.addEventListener(
        "input",
        update
    );

    update();
}

updateCharacterCount(
    "responseA",
    "lengthA"
);

updateCharacterCount(
    "responseB",
    "lengthB"
);


// -----------------------------------------
// Evaluation ID
// -----------------------------------------

function updateEvaluationId() {

    const evaluations =
        getEvaluations();

    const nextNumber =
        evaluations.length + 1;

    document.getElementById(
        "evaluationId"
    ).textContent =
        `#${String(nextNumber).padStart(5, "0")}`;
}


// -----------------------------------------
// Dashboard statistics
// -----------------------------------------

function updateDashboard() {

    const evaluations =
        getEvaluations();

    const count =
        evaluations.length;

    document.getElementById(
        "evaluationCount"
    ).textContent = count;

    if (count === 0) {

        document.getElementById(
            "averageScore"
        ).textContent = "—";

        document.getElementById(
            "aPreferred"
        ).textContent = "0%";

        document.getElementById(
            "bPreferred"
        ).textContent = "0%";

        updateEvaluationId();

        return;
    }

    const totalScore =
        evaluations.reduce(
            (sum, evaluation) =>
                sum +
                Number(evaluation.overallScore),
            0
        );

    const averageScore =
        totalScore / count;

    const aCount =
        evaluations.filter(
            evaluation =>
                evaluation.preferredResponse ===
                "Response A"
        ).length;

    const bCount =
        evaluations.filter(
            evaluation =>
                evaluation.preferredResponse ===
                "Response B"
        ).length;

    document.getElementById(
        "averageScore"
    ).textContent =
        averageScore.toFixed(1);

    document.getElementById(
        "aPreferred"
    ).textContent =
        `${Math.round(
            (aCount / count) * 100
        )}%`;

    document.getElementById(
        "bPreferred"
    ).textContent =
        `${Math.round(
            (bCount / count) * 100
        )}%`;

    updateEvaluationId();
}


// -----------------------------------------
// Result score bars
// -----------------------------------------

function updateResultBars(scores) {

    scoreIds.forEach(id => {

        const bar =
            document.getElementById(
                `${id}Bar`
            );

        if (bar) {

            const percentage =
                (Number(scores[id]) / 5) * 100;

            bar.style.width =
                `${percentage}%`;
        }
    });
}


// -----------------------------------------
// Format date
// -----------------------------------------

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


// -----------------------------------------
// Evaluation History
// -----------------------------------------

function updateHistory() {

    const evaluations =
        getEvaluations();

    const tableBody =
        document.getElementById(
            "historyTableBody"
        );

    const historyCount =
        document.getElementById(
            "historyCount"
        );

    if (!tableBody) return;

    if (historyCount) {
        historyCount.textContent =
            evaluations.length;
    }

    if (evaluations.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="empty-history"
                >
                    No evaluations yet.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML =
        evaluations
            .slice()
            .reverse()
            .map(evaluation => {

                return `
                    <tr>

                        <td>
                            <span class="history-id">
                                ${evaluation.id}
                            </span>
                        </td>

                        <td>
                            <div class="history-prompt">
                                ${escapeHtml(
                                    evaluation.prompt
                                )}
                            </div>
                        </td>

                        <td>
                            <span class="history-score">
                                ${evaluation.overallScore}/5
                            </span>
                        </td>

                        <td>
                            <span class="history-preferred">
                                ${evaluation.preferredResponse}
                            </span>
                        </td>

                        <td>
                            <span class="history-date">
                                ${formatDate(
                                    evaluation.createdAt
                                )}
                            </span>
                        </td>

                    </tr>
                `;

            })
            .join("");
}


// -----------------------------------------
// Protect displayed text
// -----------------------------------------

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// -----------------------------------------
// Submit evaluation
// -----------------------------------------

submitBtn.addEventListener(
    "click",
    function () {

        const prompt =
            document
                .getElementById("prompt")
                .value
                .trim();

        const responseA =
            document
                .getElementById("responseA")
                .value
                .trim();

        const responseB =
            document
                .getElementById("responseB")
                .value
                .trim();

        const notes =
            document
                .getElementById("notes")
                .value
                .trim();


        // Validation

        if (!prompt) {
            alert(
                "Please enter the evaluation prompt."
            );
            return;
        }

        if (!responseA) {
            alert(
                "Please enter Response A."
            );
            return;
        }

        if (!responseB) {
            alert(
                "Please enter Response B."
            );
            return;
        }

        if (!selectedDecision) {
            alert(
                "Please select which response is better."
            );
            return;
        }

        if (!notes) {
            alert(
                "Please provide evaluator notes."
            );
            return;
        }


        // Get scores

        const scores = {};

        scoreIds.forEach(id => {
            scores[id] =
                Number(
                    document
                        .getElementById(id)
                        .value
                );
        });


        // Calculate overall score

        const totalScore =
            Object.values(scores)
                .reduce(
                    (sum, score) =>
                        sum + score,
                    0
                );

        const overallScore =
            (
                totalScore /
                scoreIds.length
            ).toFixed(1);


        // Get existing evaluations

        const evaluations =
            getEvaluations();


        // Create evaluation

        const evaluation = {

            id:
                `#${String(
                    evaluations.length + 1
                ).padStart(5, "0")}`,

            prompt: prompt,

            responseA: responseA,

            responseB: responseB,

            scores: scores,

            overallScore:
                Number(overallScore),

            preferredResponse:
                selectedDecision,

            notes: notes,

            createdAt:
                new Date().toISOString()
        };


        // Save evaluation

        evaluations.push(evaluation);

        saveEvaluations(
            evaluations
        );


        // Show result

        document.getElementById(
            "overallScore"
        ).textContent =
            overallScore;

        document.getElementById(
            "resultMessage"
        ).textContent =
            `Evaluation completed. ${selectedDecision} was selected as the preferred response.`;


        // Update score bars

        updateResultBars(
            scores
        );


        // Show result section

        const result =
            document.getElementById(
                "result"
            );

        result.classList.remove(
            "hidden"
        );


        // Update dashboard

        updateDashboard();


        // Update history

        updateHistory();


        // Scroll to result

        result.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// -----------------------------------------
// Initial page load
// -----------------------------------------

updateDashboard();

updateHistory();
