// Calculator input display
const display = document.querySelector('.display');
// Calculator interface button
const buttons = document.querySelectorAll('.calc-btn');
// Previous calculation results
const history = document.querySelector('#history-cells');
// Previous calculation results
const historyCell = document.querySelectorAll('.history-cell');
// Clear history button
const clearHistory = document.querySelector('.clear-history');
// List of calculator buttons
const validKeys = [
    '0', '1', '2', '3', '4', '5', '6', 
    '7', '8', '9', '+', '-', '*', '/',
    '.', '^', 'Enter', 'c'
];
// List of supported operations
const validOperators = [
    '+', '-', '*', '/', '^'
];
// FSM variables
let operand1Str = '';
let operand2Str = '';
let operator = '';
let state = 'start';
let isError = false;
let isManyOperators = false;

const calculate = (input) => {
    if (isError) {
        display.textContent = '';
        isError = false;
    }
    display.textContent += input;
    if (input === 'c' || input === 'clear') {
        resetCalculator();
    }
    if (input === '=' || input === 'Enter') {
        compute();
        if (!isError) {
            display.textContent = operand1Str;
        }
    }
    switch (state) {
        case 'start':
            if (!isNaN(input) || input === '.' || input === '-') {
                operand1Str = input;
                state = 'firstOperand';
            }
            break;
        case 'firstOperand':
            if (!isNaN(input) || input === '.') {
                operand1Str += input;
            } else if (validOperators.includes(input)) {
                operator = input;
                state = 'operator';
            }
            break;
        case 'operator':
            if (validOperators.includes(input)) {
                operator = input;
                state = 'operator';
            } else if (!isNaN(input) || input === '.') {
                operand2Str += input;
                state = 'secondOperand'; 
            }
            break;
        case 'secondOperand':
            if (!isNaN(input) || input === '.') {
                operand2Str += input;
            } else if (input === '=' || input === 'Enter') {
                state = 'firstOperand';
            } else if (validOperators.includes(input)) {
                isManyOperators = true;
                state = 'operator';
                compute();
                operator = input;
            }
            break;
    }
}

const compute = () => {
    // Invalid computation
    if (isNaN(operand1Str) || isNaN(operand2Str)) {
        isError = true;
        resetCalculator();
    } else if (operand1Str === '' || operand2Str === '' ) {
        resetCalculator();
    }
    else {
        let num1 = new Number(operand1Str);
        let num2 = new Number(operand2Str);
        switch (operator) {
            case "+":
                num1 += num2;
                break;
            case "-":
                num1 -= num2;
                break;
            case "*":
                num1 *= num2;
                break;
            case "/":
                num1 /= num2;
                break;
            case '^':
                num1 = Math.pow(num1, num2);
                break;
        }
        if (isNaN(num1) || !isFinite(num1)) {
            isError = true;
            resetCalculator();
        } else {
            // Remove floating point precision errors.
            num1 = Number(num1.toFixed(8));
            updateHistory(num1);
            if (!isManyOperators) {
                operator = '';
                state = 'firstOperand';
            }
            operand2Str = '';
            operand1Str = num1.toString();
        }
    }
}

const resetCalculator = () => {
    operand1Str = '';
    operand2Str = '';
    operator = '';
    state = 'start';
    if (isError) {
        display.textContent = 'ERROR';
    } else {
        display.textContent = '';
    }
    isManyOperators = false;
};

// Event listener for pressing calculator buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        calculate(button.textContent);
    });
});

// Keyboard input validation
document.addEventListener('keydown', (event) => {
    if (validKeys.includes(event.key)) {
        calculate(event.key);
    }
});

// Clear history behavior
clearHistory.addEventListener('click', () => {
    const cells = document.querySelectorAll('.history-cell');
    cells.forEach(cell => {
        cell.remove();
    });
});

// Adding calculator result history
const updateHistory = (result) => {
    let newResult = document.createElement("button");
    newResult.className = "history-cell";
    newResult.textContent = result;
    newResult.addEventListener("click", (button) => {
        if (state === 'start' || state === 'operator') {
            calculate(button.target.textContent);
        }
    });
    history.appendChild(newResult);
}

// Prevent Enter key from adding calculator button input
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('focus', function(event) {
        button.blur(); // Removes focus so Enter won't trigger the button
    });
});
