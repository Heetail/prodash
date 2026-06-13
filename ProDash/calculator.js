// Calculator Module
const CalculatorApp = (() => {
    const display = document.getElementById('calcDisplay');
    const historyList = document.getElementById('calcHistory');
    let currentValue = '0';
    let operator = null;
    let previousValue = null;
    let history = DB.get('calcHistory', []);

    const updateDisplay = () => {
        display.value = currentValue;
    };

    const appendNumber = (num) => {
        if (currentValue === '0' && num !== '.') {
            currentValue = String(num);
        } else if (num === '.' && currentValue.includes('.')) {
            return;
        } else {
            currentValue += num;
        }
        updateDisplay();
    };

    const setOperator = (op) => {
        if (operator && previousValue !== null) {
            calculate();
        }
        previousValue = currentValue;
        operator = op;
        currentValue = '0';
    };

    const calculate = () => {
        if (operator === null || previousValue === null) return;

        let result;
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 0;
                break;
            default:
                return;
        }

        const calculation = `${prev} ${operator} ${current} = ${result}`;
        history.unshift(calculation);
        if (history.length > 10) history.pop();
        DB.set('calcHistory', history);
        renderHistory();

        currentValue = String(result);
        operator = null;
        previousValue = null;
        updateDisplay();
    };

    const clear = () => {
        currentValue = '0';
        operator = null;
        previousValue = null;
        updateDisplay();
    };

    const backspace = () => {
        if (currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        } else {
            currentValue = '0';
        }
        updateDisplay();
    };

    const renderHistory = () => {
        historyList.innerHTML = history.map((item, index) => 
            `<li>${item}</li>`
        ).join('');
    };

    const setupEventListeners = () => {
        // Number buttons
        document.querySelectorAll('.btn-num').forEach(btn => {
            btn.addEventListener('click', () => appendNumber(btn.textContent));
        });

        // Operator buttons
        document.querySelectorAll('.btn-op').forEach(btn => {
            btn.addEventListener('click', () => setOperator(btn.textContent));
        });

        // Equals button
        document.querySelector('.btn-equals').addEventListener('click', calculate);

        // Clear button
        document.querySelector('.btn-clear').addEventListener('click', clear);

        // Backspace button
        document.querySelector('.btn-backspace').addEventListener('click', backspace);

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!/^\d|\.|\+|\-|\*|\/|=|Enter|Backspace|Delete$/.test(e.key)) return;
            e.preventDefault();
            
            if (/\d|\./.test(e.key)) appendNumber(e.key);
            if (/[\+\-\*\/]/.test(e.key)) setOperator(e.key);
            if (e.key === 'Enter' || e.key === '=') calculate();
            if (e.key === 'Backspace') backspace();
            if (e.key === 'Delete') clear();
        });
    };

    return {
        init: () => {
            setupEventListeners();
            renderHistory();
            updateDisplay();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    CalculatorApp.init();
});
