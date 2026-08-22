/* static/script.js */

const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const shiftBtn = document.getElementById("shift-btn");
const modeBtn = document.getElementById("mode-btn");
const historyList = document.getElementById("history-list");

/* =========================
   STATES
========================= */

let currentInput = "";
let displayInput = "";
let shiftMode = false;
let degreeMode = true;

/*
fractionState
0 = normal
1 = numerator
2 = denominator
*/
let fractionState = 0;

let historyData = [];

/* =========================
   DISPLAY FUNCTIONS
========================= */

function updateDisplay() {
    display.innerText = displayInput || "0";
}

function addInput(showText, actualText) {
    displayInput += showText;
    currentInput += actualText;
    updateDisplay();
}

function resetShift() {
    shiftMode = false;
    shiftBtn.style.background = "rgba(255,255,255,0.10)";
}

function toRadians(value) {
    return degreeMode ? value * (Math.PI / 180) : value;
}

function toDegrees(value) {
    return degreeMode ? value * (180 / Math.PI) : value;
}

/* =========================
   SECTION SWITCHING
========================= */

function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");
}

/* =========================
   MOBILE SIDEBAR TOGGLE
========================= */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

function toggleSidebar() {
    sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("active");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
}

/* Called from the sidebar buttons: shows the section, then
   closes the sidebar (so it behaves like a proper mobile menu) */
function selectSection(sectionId) {
    showSection(sectionId);
    closeSidebar();
}

/* =========================
   SHIFT BUTTON
========================= */

shiftBtn.addEventListener("click", () => {
    shiftMode = !shiftMode;

    if (shiftMode) {
        shiftBtn.style.background = "rgba(37,99,235,0.95)";
    } else {
        resetShift();
    }
});

/* =========================
   DEG / RAD
========================= */

modeBtn.addEventListener("click", () => {
    degreeMode = !degreeMode;
    modeBtn.innerText = degreeMode ? "DEG" : "RAD";
});

/* =========================
   HISTORY SYSTEM
========================= */

function saveHistory(expression, result) {
    historyData.unshift(`${expression} = ${result}`);

    if (historyData.length > 15) {
        historyData.pop();
    }

    renderHistory();
}

function renderHistory() {
    if (historyData.length === 0) {
        historyList.innerHTML = "<p>No history yet.</p>";
        return;
    }

    historyList.innerHTML = "";

    historyData.forEach(item => {
        const p = document.createElement("p");
        p.innerText = item;
        historyList.appendChild(p);
    });
}

/* =========================
   MAIN CALCULATOR SYSTEM
========================= */

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.innerText;

        /* CLEAR */

        if (value === "C") {
            currentInput = "";
            displayInput = "";
            fractionState = 0;
            updateDisplay();
            resetShift();
            return;
        }

        /* BACKSPACE */

        if (value === "⌫") {
            currentInput = currentInput.slice(0, -1);
            displayInput = displayInput.slice(0, -1);
            updateDisplay();
            resetShift();
            return;
        }

        /* EQUAL */

        if (value === "=") {
            try {
                let originalExpression = displayInput;

                let expression = currentInput
                    .replaceAll("^", "**")
                    .replaceAll("π", Math.PI)
                    .replaceAll("e", Math.E)
                    .replaceAll("%", "/100");

                let result = eval(expression);

                if (!isFinite(result)) {
                    throw new Error();
                }

                result = parseFloat(result.toFixed(10)).toString();

                saveHistory(originalExpression, result);

                currentInput = result;
                displayInput = result;
                fractionState = 0;
                updateDisplay();

            } catch {
                currentInput = "";
                displayInput = "Error";
                fractionState = 0;
                updateDisplay();
            }

            resetShift();
            return;
        }

        /* FRACTION */

        if (value === "frac") {
            if (fractionState === 0) {
                addInput("(", "(");
                fractionState = 1;
            }

            resetShift();
            return;
        }

        /* FRACTION BRACKET FLOW */

        if (value === ")") {
            if (fractionState === 1) {
                addInput(")/(", ")/(");
                fractionState = 2;
            }
            else if (fractionState === 2) {
                addInput(")", ")");
                fractionState = 0;
            }
            else {
                addInput(")", ")");
            }

            resetShift();
            return;
        }

        /* SQRT */

        if (value === "√") {
            addInput("√(", "Math.sqrt(");
            resetShift();
            return;
        }

        /* LOG + ANTILOG */

        if (value === "log") {
            if (shiftMode) {
                addInput("antilog(", "10**(");
            } else {
                addInput("log(", "Math.log10(");
            }

            resetShift();
            return;
        }

        /* LN */

        if (value === "ln") {
            addInput("ln(", "Math.log(");
            resetShift();
            return;
        }

        /* SIN */

        if (value === "sin") {
            if (shiftMode) {
                addInput("sin⁻¹(", "toDegrees(Math.asin(");
            } else {
                addInput("sin(", "Math.sin(toRadians(");
            }

            resetShift();
            return;
        }

        /* COS */

        if (value === "cos") {
            if (shiftMode) {
                addInput("cos⁻¹(", "toDegrees(Math.acos(");
            } else {
                addInput("cos(", "Math.cos(toRadians(");
            }

            resetShift();
            return;
        }

        /* TAN */

        if (value === "tan") {
            if (shiftMode) {
                addInput("tan⁻¹(", "toDegrees(Math.atan(");
            } else {
                addInput("tan(", "Math.tan(toRadians(");
            }

            resetShift();
            return;
        }

        /* POWERS */

        if (value === "x²") {
            addInput("^2", "**2");
            resetShift();
            return;
        }

        if (value === "x³") {
            addInput("^3", "**3");
            resetShift();
            return;
        }

        /* DEFAULT INPUT */

        addInput(value, value);
        resetShift();
    });
});