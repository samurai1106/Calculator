let lamp = document.querySelector('.lamp');
let displayContainer = document.querySelector('.display-container');
let display = document.querySelector('.display');
let littleDisplay = document.querySelector('.little-display');
let buttons = document.querySelectorAll('.button');
let numBtns = document.querySelectorAll('#number');
let operatorBtn = document.querySelectorAll('#operator');
let DeleteBtn = document.querySelector('#delete');
let clearAllBtn = document.querySelector('#clear');
let percentageBtn = document.querySelector('#percentage');
let dotBtn = document.querySelector('#dot');
let toggleSignBtn = document.querySelector('#toggle-sign');
let ParenthBtn = document.querySelector('#parenthesis');
let resultBtn = document.querySelector('#result');

let firstvalue = "";
let secondvalue = "";
let sign = "";
let result = 0;
let firstvalueTwin;
let isFirstValue = true;
let isSecondValue = false;
let isFirstOperator = true;
let isResult = false;
let isFirstOpToggle = true;
let isPercentage = false;

// Setting page lighting mode from local storage
if(localStorage.getItem('Mode')) {
    if(localStorage.getItem('Mode') === 'Light') {
        document.body.style.backgroundColor = '#fff';
        lamp.style.color = '#aea31c';
        displayContainer.style.cssText = 'border: 1px solid rgb(255, 255, 255, .5); box-shadow: 0 0 0';
        buttons.forEach((el) => {
            el.style.cssText = 'box-shadow: 0 0 20px 5px rgb(0,0,0,.5) inset'
        })
    }
    else {
        document.body.style.backgroundColor = '#191919';
        lamp.style.color = '#fff';
        displayContainer.style.cssText = 'border: none; box-shadow: 0 0 10px rgb(255, 255, 255, .7) inset';
        buttons.forEach((el) => {
            el.style.cssText = `box-shadow: 0 0 13px ${el.dataset.clr}, 0 0 20px 5px rgb(0,0,0,.3) inset`
        })
    }
}


// The light bulb at the edge functionality
lamp.onclick = function() {  
    document.body.classList.toggle('light-on'); // Toggle the 'light-on' class on body
    if(document.body.classList.contains('light-on')) { // If the body contains the 'light-on' class switch body's, lamp's and calculator's both screen and buttons color and shadow
        document.body.style.backgroundColor = '#fff';
        lamp.style.color = '#aea31c';
        displayContainer.style.cssText = 'border: 1px solid rgb(255, 255, 255, .5); box-shadow: 0 0 0';
        buttons.forEach((el) => {
            el.style.cssText = 'box-shadow: 0 0 20px 5px rgb(0,0,0,.5) inset'
        })
        // Adding local Storage
        localStorage.setItem('Mode','Light');
    }
    else { // If the body doesn't contain the 'light-on' class do the same process backward
        document.body.style.backgroundColor = '#191919';
        lamp.style.color = '#fff';
        displayContainer.style.cssText = 'border: none; box-shadow: 0 0 10px rgb(255, 255, 255, .7) inset';
        buttons.forEach((el) => {
            el.style.cssText = `box-shadow: 0 0 13px ${el.dataset.clr}, 0 0 20px 5px rgb(0,0,0,.3) inset`
        })
        // Adding local Storage
        localStorage.setItem('Mode','Dark');
    }

}

// --------- Functions section --------- (DRY)

function getFirstValue(key) { // [1] Filling the first value with a lenght and screen display condition 
    if(display.innerHTML === '0' && key.dataset.value === '0') {
        display.innerHTML = '0';
    }
    else if(firstvalue.toString().length <= 16) {
        firstvalue += key.dataset.value;
        display.innerHTML = firstvalue;
    }
}

function getSign(key) { // [2] Getting the operator
    sign = key.dataset.value;
}

function getSecondValue(key) { // [3] Filling the first second with a lenght and screen display condition 
    if(display.innerHTML === '0' && key.dataset.value === '0') {
        display.innerHTML = '0';
    }
    else if(secondvalue.toString().length <= 16) {
        secondvalue += key.dataset.value;
        display.innerHTML = secondvalue;
    }
}

function applyOperation() { // [4] Application of the operation with switch statement
    switch(sign) {
        case '÷':
            result = +firstvalue / +secondvalue;
            break;
        case '×':
            result = +firstvalue * +secondvalue;
            break;
        case '+':
            result = +firstvalue + +secondvalue;
            break;
        case '-':
            result = +firstvalue - +secondvalue;
            break;
    }
}

function resetValues() { // Reseting all values
    display.innerHTML = '0';
    firstvalue = '';
    secondvalue = '';
    sign = '';
    isFirstValue = true;
    isSecondValue = false;
    isFirstOperator = true;
    isResult = false;
    isPercentage = false;
    isFirstOpToggle = true;
    result = 0;
    littleDisplay.innerHTML = '';
}

// --------- Buttons functionality section --------- 

numBtns.forEach((key) => { // Numbers buttons configuration
    key.addEventListener('click', () => { // For each button apply the processe below when it's clicked 
        if(isResult === true) { // Reset values if the last thing displayed is the result value 
            resetValues();
        }
        if((firstvalue !== firstvalueTwin || firstvalue !== '') && sign !== '') { // Switching to the second value turn if the firstvalue and sign are known 
            isSecondValue = true;
            isFirstValue = false;
        }
        if(isFirstValue === true && isSecondValue === false && sign === '') { // If it's the first value turn and the sign is unknown, fill first value
            getFirstValue(key);
        }
        if(isSecondValue === true && isFirstValue === false) { // If it's second value turn fill the second value then apply the operation 
            getSecondValue(key);
            applyOperation();
        }
    })
});

operatorBtn.forEach((key) => { // Operators buttons configuration
    key.addEventListener('click', () => { // For each button apply the processe below when it's clicked
        if(firstvalue !== '') { // The operator button will work only if the first value is known
            getSign(key); // [1] Get operator
            // [2] Showing result after operator clicked
            if(isFirstOperator === true) { 
                littleDisplay.innerHTML = `${firstvalue} ${sign}`;
                display.innerHTML = firstvalue; 
                isFirstOperator = false;
            }
            else {
                littleDisplay.innerHTML = `${result} ${sign}`;
                display.innerHTML = result; 
            }
            if(secondvalue !== '') { // [3] Check if it's not the first operation by checking second value, if the condition is true change first value to result value preparing for next operation
                firstvalueTwin = firstvalue;
                firstvalue = result;
            }
            // [4] Reset first value turn, result condition and second value
            isFirstValue = true;
            isSecondValue = false;
            isResult = false;
            secondvalue = '';
        }
    }) 
}) 

resultBtn.onclick = function() { // Result button configuration
    if(firstvalue === result || secondvalue !== '') { // Show result output if last operation is done (first value is equal to result value from sign button function) or if the second value is known
        display.innerHTML = result;
        isResult = true;
        littleDisplay.innerHTML = '';
    }
}

dotBtn.onclick = function() { // dot button configuration
    // Adding dot for both values only if it's not already insered
    if(isResult === true) { //Checking that is the result value turn
        resetValues();
        firstvalue = '0.';
        display.innerHTML = firstvalue;
    }
    if(firstvalue !== '' && sign !== '' && display.innerHTML !== '0') { // Checking that is the second value turn
        if(secondvalue.toString().split('').includes('.') !== true) {
            secondvalue += '.';
            display.innerHTML = secondvalue;
        }
    }
    else if(firstvalue !== '' && sign !== '' && display.innerHTML === '0') { // Avoiding 00 bug in second value
        secondvalue = '0.';
        display.innerHTML = secondvalue;
    }
    if(isFirstValue === true && display.innerHTML !== '0') { // Checking that is the first value turn
        if(firstvalue.toString().split('').includes('.') !== true) {
            firstvalue += '.';
            display.innerHTML = firstvalue;
        }
    }
    else if(isFirstValue === true && display.innerHTML === '0') { // Avoiding 00 bug in first value
        firstvalue = '0.';
        display.innerHTML = firstvalue;
    }
}

toggleSignBtn.onclick = function() { // Toggling sign button configuration
    if(isResult === true) { // When it's result value turn multiply the number by -1 to toggle it's sign
        result *= -1;
        display.innerHTML = result;
    }
    else if ((display.innerHTML === result.toString() || isFirstOpToggle === true) ) {
        if(isFirstOpToggle === true) {
            secondvalue = firstvalue * -1
            display.innerHTML = secondvalue;
            isFirstOpToggle = false
        }
        else {
            result *= -1;
            display.innerHTML = result;
            littleDisplay.innerHTML = result;
        }
    }
    else if(firstvalue !== '' && sign !== '' && display.innerHTML !== '0') { // When it's second value turn multiply the number by -1 to toggle it's sign
        secondvalue *= -1;
        display.innerHTML = secondvalue;
        applyOperation();
    }
    else if(isFirstValue === true && display.innerHTML !== '0') { // When it's first value turn multiply the number by -1 to toggle it's sign
        firstvalue *= -1;
        display.innerHTML = firstvalue;
    }
}

percentageBtn.onclick = function() { // Toggling sign button configuration
    if(isResult === true) { // When it's result value turn multiply the number by 100 to get the percentage
        // Toggling percentage with a condition statement
        if(isPercentage !== true) {
            result *= 100;
            display.innerHTML = `${result}%`;
            isPercentage = true;
        }
        else {
            result /= 100;
            display.innerHTML = result;
            isPercentage = false;
        }
    }
}

DeleteBtn.onclick = function() { // Delete button configuration
    if(isResult !== true) { // The button will work only the screen output is not showing result value
        if(firstvalue !== '' && sign !== '' && display.innerHTML !== '0') { // When it's second value turn
            secondvalue = secondvalue.toString(); //[1] Turn data type to string
            secondvalue = secondvalue.split(''); //[2] split the string into array
            secondvalue.pop(); // [3] Delete the last element
            secondvalue = secondvalue.join(''); // [4] Join the array back to string
            display.innerHTML = secondvalue; // [5] display the updated value
            if(display.innerHTML.length === 0 || display.innerHTML === '-') { // If the second value length is equal to 0 display only '0' on screen
                display.innerHTML = '0';
                secondvalue = '';
            }
            applyOperation();
        }
        if(isFirstValue === true && display.innerHTML !== '0') { // When it's first value turn
            firstvalue = firstvalue.toString(); //[1] Turn data type to string
            firstvalue = firstvalue.split(''); //[2] Split the string into array
            firstvalue.pop(); // [3] Delete the last element
            firstvalue = firstvalue.join(''); // [4] Join the array back to string
            display.innerHTML = firstvalue; // [5] display the updated value
            if(display.innerHTML.length === 0 || display.innerHTML === '-') { // If the first value length is equal to 0 display only '0' on screen
                display.innerHTML = '0';
                firstvalue = '';
            }
        }
    }
}

clearAllBtn.onclick = function() { // Clear all button configuration
    // Reset all values
    resetValues();
}

