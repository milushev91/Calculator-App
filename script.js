let display = document.getElementById('display');
let inputLocked = false; // prevents typing during error messages

/* ------------------------------
   Helper: Adjust font size
--------------------------------*/
function adjustFontSize() {
  const maxWidth = display.clientWidth;
  let fontSize = 32; // starting size
  display.style.fontSize = fontSize + "px";

  while (display.scrollWidth > maxWidth && fontSize > 12) {
    fontSize--;
    display.style.fontSize = fontSize + "px";
  }
}

/* ------------------------------
   Helper: Temporary message
--------------------------------*/
function showTemporaryMessage(msg) {
  display.innerText = msg;
  inputLocked = true;

  setTimeout(() => {
    display.innerText = '0';
    inputLocked = false;
    adjustFontSize();
  }, 1000);
}

/* ------------------------------
   Append digits/operators
--------------------------------*/
function append(value) {
  if (inputLocked) return;

  if (display.innerText === '0') display.innerText = '';
  display.innerText += value;

  adjustFontSize();
}

/* ------------------------------
   Clear display
--------------------------------*/
function clearDisplay() {
  if (inputLocked) return;
  display.innerText = '0';
  adjustFontSize();
}

/* ------------------------------
   Toggle sign
--------------------------------*/
function toggleSign() {
  if (inputLocked) return;

  let current = display.innerText;
  if (current.startsWith('-')) {
    display.innerText = current.slice(1);
  } else {
    display.innerText = '-' + current;
  }

  adjustFontSize();
}

/* ------------------------------
   Calculate result
--------------------------------*/
function calculate() {
  if (inputLocked) return;

  try {
    let result = eval(display.innerText);

    // Divide by zero handling
    if (result === Infinity || result === -Infinity) {
      showTemporaryMessage("Cannot divide by zero");
      return;
    }

    // NaN handling
    if (isNaN(result)) {
      showTemporaryMessage("Error");
      return;
    }

    display.innerText = result;
    adjustFontSize();

  } catch {
    showTemporaryMessage("Error");
  }
}

/* ------------------------------
   Glow animation
--------------------------------*/
function flashButton(key) {
  const button = document.querySelector(`[data-key="${key}"]`);
  if (!button) return;

  button.classList.add("glow");
  setTimeout(() => button.classList.remove("glow"), 150);
}

/* ------------------------------
   Keyboard support
--------------------------------*/
document.addEventListener('keydown', (event) => {
  const key = event.key;

  // Flash matching button
  flashButton(key);

  if (inputLocked) return;

  // Digits and operators
  if (!isNaN(key) || ['+', '-', '*', '/', '%', '.'].includes(key)) {
    append(key);
  }

  // Enter or = triggers calculation
  if (key === 'Enter' || key === '=') {
    calculate();
  }

  // Escape clears
  if (key === 'Escape') {
    clearDisplay();
  }

  // Backspace deletes last character
  if (key === 'Backspace') {
    display.innerText = display.innerText.slice(0, -1) || '0';
    adjustFontSize();
  }
});
