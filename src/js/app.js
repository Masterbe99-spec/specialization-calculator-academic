// app.js: connects the page to the calculator.
//
// This is the ONLY file that touches the page (buttons, display, keyboard).
// All calculator rules live in engine.js, number text in format.js, key names in keymap.js.
(function () {
  'use strict';

  const displayEl = document.getElementById('display');
  const expressionEl = document.getElementById('expression');
  const errorEl = document.getElementById('error');
  const keysEl = document.getElementById('keys');

  // The whole memory of the calculator is this one variable.
  let state = CalcEngine.initialState();

  // Write the current state into the page.
  function render() {
    const view = CalcFormat.display(state);
    displayEl.textContent = view.main; // textContent, never innerHTML
    expressionEl.textContent = view.expression;
    errorEl.textContent = view.errorMessage || '';
    displayEl.classList.toggle('is-error', state.phase === 'error');
    // Longer text gets a smaller font so that it always fits (see styles.css).
    displayEl.dataset.size = view.main.length <= 9 ? 'lg' : view.main.length <= 13 ? 'md' : 'sm';
  }

  // Send one key name to the engine and redraw if something changed.
  function press(key) {
    const next = CalcEngine.press(state, key);
    if (next !== state) {
      state = next;
      render();
    }
  }

  // Mouse, touch or keyboard activation of a button.
  keysEl.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-key]');
    if (!button) return;
    press(button.dataset.key);
    // After a mouse or touch click, release focus so that a following Enter key means "equals"
    // and not "press this button again". (event.detail is 0 when the click came from the keyboard.)
    if (event.detail !== 0) button.blur();
  });

  // Physical keyboard.
  document.addEventListener('keydown', function (event) {
    // Enter on a focused button or on the help summary must keep its normal browser meaning.
    if (event.key === 'Enter' && event.target.closest && event.target.closest('button, summary, a')) return;
    const key = CalcKeymap.commandForKey(event);
    if (key === null) return; // not our key: leave it to the browser
    event.preventDefault();
    press(key);
  });

  render();
})();
