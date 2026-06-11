const calculator = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

// Load existing history from localStorage or start fresh
let historyArray = JSON.parse(localStorage.getItem("calcHistory")) || [];

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue =
      displayValue === "0" ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand == null) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const currentValue = firstOperand || 0;
    const result = performCalculation[operator](currentValue, inputValue);

    // Save the equation to history before moving forward
    saveToHistory(currentValue, operator, inputValue, result);

    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

const performCalculation = {
  "/": (firstOperand, secondOperand) => firstOperand / secondOperand,
  "*": (firstOperand, secondOperand) => firstOperand * secondOperand,
  "+": (firstOperand, secondOperand) => firstOperand + secondOperand,
  "-": (firstOperand, secondOperand) => firstOperand - secondOperand,
  "=": (firstOperand, secondOperand) => secondOperand,
};

function resetCalculator() {
  calculator.displayValue = "0";
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

function updateDisplay() {
  const display = document.querySelector(".calculator-screen");
  if (display) {
    display.value = calculator.displayValue;
  }
}

// ------ History Management Functions ------

function saveToHistory(first, op, second, res) {
  if (op === "=") return; // Avoid logging redundant calculations

  const operationText = `${first} ${op} ${second} = ${res}`;
  historyArray.push(operationText);

  // Commit to localStorage
  localStorage.setItem("calcHistory", JSON.stringify(historyArray));
  updateHistoryUI();
}

function updateHistoryUI() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  historyList.innerHTML = "";

  // Display history reversed so the newest calculations sit on top
  [...historyArray].reverse().forEach((item) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item bg-dark text-light border-secondary font-monospace fs-6";
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  historyArray = [];
  localStorage.removeItem("calcHistory");
  updateHistoryUI();
}

// Initialize listeners once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  updateDisplay();
  updateHistoryUI();

  const keys = document.querySelector(".calculator-keys");
  if (keys) {
    keys.addEventListener("click", (event) => {
      const { target } = event;
      if (!target.matches("button")) return;

      if (target.classList.contains("operator")) {
        handleOperator(target.value);
        updateDisplay();
        return;
      }

      if (target.classList.contains("decimal")) {
        inputDecimal(target.value);
        updateDisplay();
        return;
      }

      if (target.classList.contains("all-clear")) {
        resetCalculator();
        updateDisplay();
        return;
      }

      inputDigit(target.value);
      updateDisplay();
    });
  }

  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearHistory);
  }
});
