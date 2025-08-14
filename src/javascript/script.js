/**
 * Password Generator Application
 *
 * Features:
 * - Generates secure random passwords
 * - Allows customization of password length and character types
 * - Provides visual feedback
 * - Copy to clipboard functionality
 */

// Constants for character sets
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_-+={}[]|\\/?><:;"\'.,~`',
};

// DOM Elements
const dom = {
  sizeInput: document.querySelector('#size'),
  uppercaseCheckbox: document.querySelector('#include_uppercase'),
  lowercaseCheckbox: document.querySelector('#include_lowercase'),
  numbersCheckbox: document.querySelector('#include_number'),
  symbolsCheckbox: document.querySelector('#include_special_character'),
  generateButton: document.querySelector('#generate'),
  passwordContainer: document.querySelector('#password_container'),
  passwordDisplay: document.querySelector('#password'),
  copyButton: document.querySelector('#copy'),
};

// Configuration
const CONFIG = {
  minLength: 4,
  maxLength: 64,
  defaultLength: 12,
};

/**
 * Gets the selected character types for password generation
 * @returns {string[]} Array of character sets to be used
 */
function getSelectedCharacterTypes() {
  const selectedTypes = [];

  if (dom.uppercaseCheckbox.checked) {
    selectedTypes.push(CHAR_SETS.uppercase);
  }
  if (dom.lowercaseCheckbox.checked) {
    selectedTypes.push(CHAR_SETS.lowercase);
  }
  if (dom.numbersCheckbox.checked) {
    selectedTypes.push(CHAR_SETS.numbers);
  }
  if (dom.symbolsCheckbox.checked) {
    selectedTypes.push(CHAR_SETS.symbols);
  }

  return selectedTypes;
}

/**
 * Validates and gets the password length
 * @returns {number|false} Valid password length or false if invalid
 */
function getValidatedPasswordLength() {
  const size = parseInt(dom.sizeInput.value);

  if (isNaN(size) || size < CONFIG.minLength || size > CONFIG.maxLength) {
    showMessage(
      `Tamanho inválido! Digite um número entre ${CONFIG.minLength} e ${CONFIG.maxLength}.`,
      'error'
    );
    return false;
  }

  return size;
}

/**
 * Generates a secure random password
 * @param {number} length - Desired password length
 * @param {string[]} charSets - Array of character sets to use
 * @returns {string} Generated password
 */
function generateSecurePassword(length, charSets) {
  // Create a pool of all allowed characters
  const allChars = charSets.join('');
  let password = '';

  // First, ensure at least one character from each selected set
  charSets.forEach((set) => {
    password += getRandomChar(set);
  });

  // Fill the rest with random characters from all allowed sets
  while (password.length < length) {
    password += getRandomChar(allChars);
  }

  // Shuffle the password to mix the mandatory characters
  return shuffleString(password);
}

/**
 * Gets a random character from a string
 * @param {string} str - String to get random character from
 * @returns {string} Random character
 */
function getRandomChar(str) {
  const randomIndex = Math.floor(Math.random() * str.length);
  return str[randomIndex];
}

/**
 * Shuffles a string using Fisher-Yates algorithm
 * @param {string} str - String to shuffle
 * @returns {string} Shuffled string
 */
function shuffleString(str) {
  const array = str.split('');

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array.join('');
}

/**
 * Shows a toast message to the user
 * @param {string} text - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(text, type = 'success') {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'center',
    stopOnFocus: true,
    style: {
      background: type === 'success' ? '#8bc34a' : '#dc2626',
      borderRadius: '4px',
      boxShadow: 'none',
      fontWeight: '500',
    },
  }).showToast();
}

/**
 * Handles password generation when the button is clicked
 */
function handleGeneratePassword() {
  const length = getValidatedPasswordLength();
  if (!length) return;

  const charSets = getSelectedCharacterTypes();
  if (charSets.length === 0) {
    showMessage('Selecione pelo menos um tipo de caractere!', 'error');
    return;
  }

  const password = generateSecurePassword(length, charSets);
  displayPassword(password);
}

/**
 * Displays the generated password
 * @param {string} password - The password to display
 */
function displayPassword(password) {
  dom.passwordDisplay.textContent = password;
  dom.passwordContainer.classList.add('show');
}

/**
 * Copies the generated password to clipboard
 */
async function copyToClipboard() {
  if (!dom.passwordDisplay.textContent) {
    showMessage('Nenhuma senha para copiar!', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(dom.passwordDisplay.textContent);
    showMessage('Senha copiada com sucesso!', 'success');
  } catch (err) {
    console.error('Failed to copy password:', err);
    showMessage('Falha ao copiar senha!', 'error');
  }
}

/**
 * Initializes the application
 */
function init() {
  // Set default password length
  dom.sizeInput.value = CONFIG.defaultLength;

  // Set default character types
  dom.uppercaseCheckbox.checked = true;
  dom.lowercaseCheckbox.checked = true;
  dom.numbersCheckbox.checked = true;

  // Event listeners
  dom.generateButton.addEventListener('click', handleGeneratePassword);
  dom.copyButton.addEventListener('click', copyToClipboard);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
