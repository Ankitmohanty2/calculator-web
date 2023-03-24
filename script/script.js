
// little message for new users
if (localStorage.getItem('newUser') == null) {
    if (window.innerWidth > 768) {
        window.alert('You can use your computer keyboard for giving input to this calculator');
    } else {
        window.alert('I guess you are new here. At last you are in the right place!')
    }
    localStorage.setItem('newUser', false);
}



// select elements of the html file
const screen = document.getElementById('display');
const topScreen = document.getElementById('topDisplay');
const inputButtons = document.querySelectorAll('.input-button');
const numBut = document.querySelectorAll('.numberButton');
const operationBut = document.querySelectorAll('[data-operation]');
const squareBut = document.querySelector('#squareBut');
const sqrtBut = document.querySelector('#sqrtBut');
const oneDividedBut = document.querySelector('#oneDivided');
const percentBut = document.querySelector('#percentBut');
const posNegToggler = document.querySelector('#posNegToggle');
const equalBut = document.querySelector('#equalBut');
const acBut = document.querySelector('#ac');
const delBut = document.querySelector('#del');
const dotBut = document.getElementById('dot');
const answerBut = document.getElementById('ansBut');

// how many numbers will not overflow the calculator screen
const maxLettersCanShow = parseInt(screen.offsetWidth / 35);

// add button animation on click
inputButtons.forEach(element => {
    element.addEventListener('click', () => {
        element.classList.add('clicked');

        setTimeout(() => {
            element.classList.remove('clicked');
        }, 100)
    })
})

// clear all when reload
window.addEventListener('load', acFunc);

// defining some necessary variables
let clickedBut = null, firstValue = null, secondValue = null, operator = null;



// all clear function adding
acBut.addEventListener('click', acFunc);
function acFunc() {
    topScreen.value = '';
    screen.value = '0';
    firstValue = null;
    secondValue = null;
}

// delete button function adding
delBut.addEventListener('click', () => {
    screen.value = screen.value.slice(0, (screen.value.length - 1));
})

// dot(.) button function adding
dotBut.addEventListener('click', dotFunc);
function dotFunc() {
    if (screen.value.toString().indexOf('.') == -1) {
        if (screen.value == '' || screen.value == '0') {
            screen.value = '0' + '.';
        } else { screen.value += '.' }
    }
}

// function of all number buttons
numBut.forEach(element => {
    element.addEventListener('click', numButFunc);
})

function numButFunc(event) {
    if (screen.value === '0') { screen.value = ''; }
    if (screen.value.length < maxLettersCanShow) {
        clickedBut = event.target.innerText;
        screen.value += clickedBut;
    }
}


// function for four [+, -, *, /] operation
operationBut.forEach(element => {
    element.addEventListener('click', operation);
})
function operation(event) {
    if (screen.value != '' && topScreen.value == '') {
        firstValue = Number(screen.value);
        operator = event.target.dataset.operation;
        topScreen.value = screen.value + " " + event.target.innerText;
        screen.value = '';
    }
    else if (screen.value == '' && topScreen.value != '') {
        operator = event.target.dataset.operation;
        topScreen.value = topScreen.value.slice(0, topScreen.value.length - 1) + event.target.innerText;
    }
    else if (screen.value != '' && topScreen.value != '') {
        equalFunc();
        firstValue = Number(screen.value);
        operator = event.target.dataset.operation;
        topScreen.value = screen.value + " " + event.target.innerText;
        screen.value = '';
    }
}

// function for square ^(2) button
squareBut.addEventListener('click', squareFunc);
function squareFunc() {
    if (screen.value != '') {
        /*screen.value = preventOverflow(Math.pow(Number(screen.value), 2));*/
        screen.value = preventOverflow(math.number(math.square(math.fraction(screen.value))));

        // save answer
        saveAnsToLocaleStorage(screen.value)

        // clear the screen if any number button clicked
        numBut.forEach(element => {
            element.addEventListener('click', removeAns);
        })
    }
}

// square root(√) function adding
sqrtBut.addEventListener('click', sqrtFunc);
function sqrtFunc() {
    if (!screen.value) return

    if (Number(screen.value) >= 0) {
        // screen.value = preventOverflow(Math.pow(Number(screen.value), 0.5));
        screen.value = preventOverflow(math.number(math.sqrt(screen.value)));

        // save answer
        saveAnsToLocaleStorage(screen.value);
    } else {
        screen.value = 'Invalid Input';
    }

    // Remove "Invalid Input" of screen when any number button clicked
    numBut.forEach(element => {
        element.addEventListener('click', removeAns);
    })

}

// function for 1 dividing by a number
oneDividedBut.addEventListener('click', () => {
    if (screen.value != '') {
        // screen.value = preventOverflow(1 / Number(screen.value));
        screen.value = preventOverflow(math.number(math.divide(1, math.fraction(screen.value))));

        saveAnsToLocaleStorage(screen.value)

        // clear the screen if any number button clicked
        numBut.forEach(element => {
            element.addEventListener('click', removeAns);
        })
    }
})

// change the number to positive or negative
posNegToggler.addEventListener('click', () => {
    if (screen.value != '') {
        if (Number(screen.value) < 0) {
            screen.value = Math.abs(Number(screen.value));
        } else if (Number(screen.value) > 0) {
            screen.value = '-' + screen.value;
        }
    }
})


// percentage (%) button function
percentBut.addEventListener('click', percentFunc);
function percentFunc() {
    if (screen.value != '') {
        if (operator == '+' || operator == '-') {
            screen.value = (firstValue * Number(screen.value) * 0.01);
        } else {
            screen.value = (firstValue * Number(screen.value) * 0.01);
            topScreen.value = '';
            firstValue = '';
        }

        // clear the screen if any number button clicked
        numBut.forEach(element => {
            element.addEventListener('click', removeAns);
        })
    }
}


// get saved answer
answerBut.addEventListener('click', () => {
    screen.value = JSON.parse(localStorage.getItem('smart-calc-SRT'))?.answer || 0;
})
// save answer to localstorage
function saveAnsToLocaleStorage(answer) {
    localStorage.setItem('smart-calc-SRT', JSON.stringify({ answer: Number(answer) }))
}


// calculation (=) button function
equalBut.addEventListener('click', equalFunc);

function equalFunc() {
    if (screen.value && firstValue) {
        secondValue = screen.value;

        let result = 0;

        /* --- This part has been commented just because javascript is not so good at math
        javascript calculates 0.1 + 0.2 and returns 0.30000000000000004 --- */
        /*
        switch(operator){
            case '+':
                result = Number(firstValue) + Number(secondValue);
                break;
            case '-':
                result = Number(firstValue) - Number(secondValue);
                break;
            case '*':
                result = firstValue * secondValue;
                break;
            case '/':
                result = firstValue / secondValue;
                break;
        }
        */

        // I again tried to solve the issue natively in JavaScript
        /*
        if (operator === '+' || operator === '-') {
            const [value1, value2] = [firstValue.toString(), secondValue.toString()]
            if (value1.includes('.') || value2.includes('.')) {
                const splittedValues = [value1.split('.'), value2.split('.')]
                const nonFractionalParts = splittedValues.map(value => Number(value[0]));
                const nonFractionalResult = operator === '+' ?
                    nonFractionalParts.reduce((a, b) => a + b, 0)
                    : nonFractionalParts[0] - nonFractionalParts[1];

                const fractionalParts = splittedValues.map(value => value[1] ? value[1] : 0);
                const largestFractionLength = Math.max(...fractionalParts.map(x => x.toString().length));
                const fractionalResult =
                    fractionalParts.reduce((a, b) => Math.abs(a) + (operator === '+' ? 1 : -1) * (b.length < largestFractionLength ?
                        (b * Math.pow(10, largestFractionLength - b.length))
                        : Number(b)), 0)

                result = nonFractionalResult + (fractionalResult / Math.pow(10, largestFractionLength));
            } else {
                result = operator === '+' ? firstValue + secondValue :
                    firstValue - secondValue
            }
        }
        else if (operator === '*') {
            const [value1, value2] = [firstValue.toString(), secondValue.toString()];

            if (value1.includes('.') || value2.includes('.')) {
                let fractionalPartLength = (value1.includes('.') && value2.includes('.')) ?
                    (value1.split('.')[1].length > value2.split('.')[1].length) ?
                        value1.split('.')[1].length : value2.split('.')[1].length
                    : value1.includes('.') ? value1.split('.')[1].length
                        : value2.split('.')[1].length;

                result = ((firstValue * Math.pow(10, fractionalPartLength)) *
                    (secondValue * Math.pow(10, fractionalPartLength))) /
                    Math.pow(10, fractionalPartLength + fractionalPartLength);
            } else {
                result = firstValue * secondValue;
            }
        } else if (operator === '/') {
            result = firstValue / secondValue;
        }
        */

        // at last I use mathjs library to fix the calculation issue
        switch (operator) {
            case '+':
                result = math.number(math.add(math.fraction(firstValue), math.fraction(secondValue)));
                break;
            case '-':
                result = math.number(math.subtract(math.fraction(firstValue), math.fraction(secondValue)));
                break;
            case '*':
                result = math.number(math.multiply(math.fraction(firstValue), math.fraction(secondValue)));
                break;
            case '/':
                result = math.number(math.divide(math.fraction(firstValue), math.fraction(secondValue)));
                break;
        }

        // prevent answer from overflowing the display
        screen.value = preventOverflow(result);

        topScreen.value = '';
        firstValue = '';
        secondValue = '';

        // clear answer when number button clicked
        numBut.forEach(element => {
            element.addEventListener('click', removeAns);
        })
        dotBut.addEventListener('click', removeAns);

        // save answer
        saveAnsToLocaleStorage(result)
    }
}

// prevent numbers from overflowing the calculator screen
function preventOverflow(answer) {
    return answer.toString().length > maxLettersCanShow ? Number(answer).toPrecision(maxLettersCanShow) : answer;
}

// remove the answer when any number button clicked
function removeAns(event) {
    screen.value = '';
    clickedBut = event.target.innerText;
    screen.value = clickedBut;
    numBut.forEach(element => {
        element.removeEventListener('click', removeAns);
    })
    dotBut.removeEventListener('click', removeAns);
}


// add keyboard functionality for computers
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'Enter':
            equalBut.click();
            e.preventDefault();
            break;
        case 'Delete':
            delBut.click();
            e.preventDefault();
            break;
        case 'Backspace':
            acBut.click();
            e.preventDefault();
            break;
        case 'ArrowUp':
            answerBut.click();
            e.preventDefault();
            break;
        case '-':
            operationBut.forEach(element => {
                if (element.innerHTML == '−') { element.click() }
            });
            e.preventDefault();
            break;
        case '*':
            operationBut.forEach(element => {
                if (element.innerHTML == '×') { element.click() }
            });
            e.preventDefault();
            break;
        case '/':
            e.preventDefault();
            operationBut.forEach(element => {
                if (element.innerHTML == '÷') { element.click() }
            });
            e.preventDefault();
            break;
        default:
            const targetButton = [...inputButtons].find(element => e.key === element.innerText);
            if (targetButton) {
                targetButton.click(); e.preventDefault();
            }
    }
})
