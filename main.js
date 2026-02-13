/**
 * Filtrator - Text filtering application
 * Improved version with error handling, validation, and better UX
 */

(function() {
  'use strict';

  // Cache DOM elements
  const elements = {
    textIn: null,
    textOut: null,
    divider: null,
    keepText: null,
    convertBtn: null,
    clearBtn: null,
    copyBtn: null,
    alertBox: null
  };

  // Initialize app when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Cache all elements
    elements.textIn = document.getElementById('textIn');
    elements.textOut = document.getElementById('textOut');
    elements.divider = document.getElementById('divider');
    elements.keepText = document.getElementById('keepText');
    elements.convertBtn = document.getElementById('convertBtn');
    elements.clearBtn = document.getElementById('clearBtn');
    elements.copyBtn = document.getElementById('copyBtn');
    elements.alertBox = document.getElementById('alertBox');

    // Validate that all elements exist
    if (!validateElements()) {
      console.error('Required DOM elements not found');
      return;
    }

    // Attach event listeners
    attachEventListeners();
  }

  function validateElements() {
    return Object.values(elements).every(el => el !== null);
  }

  function attachEventListeners() {
    elements.convertBtn.addEventListener('click', handleConvert);
    elements.clearBtn.addEventListener('click', handleClear);
    elements.copyBtn.addEventListener('click', handleCopy);
    
    // Enable convert on Enter (Ctrl+Enter for textarea)
    elements.textIn.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleConvert();
      }
    });

    // Enable/disable copy button based on output
    elements.textOut.addEventListener('input', updateCopyButton);
  }

  function handleConvert() {
    try {
      // Get input values
      const textIn = elements.textIn.value;
      const divider = elements.divider.value;
      const keepText = elements.keepText.value;

      // Validate inputs
      if (!textIn.trim()) {
        showAlert('Wprowadź tekst do przefiltrowania', 'warning');
        elements.textIn.focus();
        return;
      }

      if (!keepText) {
        showAlert('Wprowadź znaki do zachowania w filtrze', 'warning');
        elements.keepText.focus();
        return;
      }

      if (!divider) {
        showAlert('Wprowadź separator', 'warning');
        elements.divider.focus();
        return;
      }

      // Disable button during processing
      setButtonState(elements.convertBtn, true, 'Przetwarzanie...');

      // Process text
      const result = filterText(textIn, keepText, divider);

      // Update output
      elements.textOut.value = result;
      elements.textOut.focus();

      // Enable copy button
      updateCopyButton();

      // Show success message
      const uniqueCount = result.split(divider).filter(Boolean).length;
      showAlert(`Sukces! Znaleziono ${uniqueCount} unikalnych elementów`, 'success');

    } catch (error) {
      console.error('Conversion error:', error);
      showAlert(`Błąd: ${error.message}`, 'danger');
    } finally {
      // Re-enable button
      setButtonState(elements.convertBtn, false, 'Konwertuj');
    }
  }

  function filterText(textIn, keepText, divider) {
    // Escape special regex characters in keepText
    const escapedKeepText = escapeRegexChars(keepText);
    
    // Create regex pattern for filtering
    let filterPattern;
    try {
      filterPattern = new RegExp(`[^${escapedKeepText}]+`, 'gmu');
    } catch (error) {
      throw new Error('Nieprawidłowy wzorzec filtra. Sprawdź wprowadzone znaki.');
    }

    // Replace unwanted characters with divider
    let filtered = textIn.trim().replace(filterPattern, divider);

    // Remove duplicate delimiters
    const escapedDivider = escapeRegex(divider);
    const duplicateDividerPattern = new RegExp(`${escapedDivider}{2,}`, 'g');
    filtered = filtered.replace(duplicateDividerPattern, divider);

    // Split, remove duplicates, and rejoin
    const parts = filtered.split(divider);
    const unique = [...new Set(parts)].filter(Boolean); // Remove empty strings and duplicates

    return unique.join(divider);
  }

  function escapeRegexChars(str) {
    // Special handling for character class
    // ^ at start, - not at start/end, ] anywhere need escaping
    return str
      .replace(/\\/g, '\\\\')  // Escape backslash first
      .replace(/\]/g, '\\]')   // Escape closing bracket
      .replace(/\^/g, '\\^')   // Escape caret
      .replace(/-/g, '\\-');   // Escape hyphen
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function handleClear() {
    if (confirm('Czy na pewno chcesz wyczyścić wszystkie pola?')) {
      elements.textIn.value = '';
      elements.textOut.value = '';
      elements.textIn.focus();
      updateCopyButton();
      hideAlert();
    }
  }

  async function handleCopy() {
    try {
      const text = elements.textOut.value;
      
      if (!text) {
        showAlert('Brak tekstu do skopiowania', 'warning');
        return;
      }

      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showAlert('Skopiowano do schowka!', 'success');
        setButtonState(elements.copyBtn, true, 'Skopiowano ✓');
        
        setTimeout(() => {
          setButtonState(elements.copyBtn, false, 'Kopiuj wynik');
        }, 2000);
      } else {
        // Fallback for older browsers
        elements.textOut.select();
        document.execCommand('copy');
        showAlert('Skopiowano do schowka!', 'success');
      }
    } catch (error) {
      console.error('Copy error:', error);
      showAlert('Nie udało się skopiować tekstu', 'danger');
    }
  }

  function updateCopyButton() {
    const hasOutput = elements.textOut.value.trim().length > 0;
    elements.copyBtn.disabled = !hasOutput;
  }

  function setButtonState(button, disabled, text) {
    button.disabled = disabled;
    if (text) {
      button.textContent = text;
    }
  }

  function showAlert(message, type = 'info') {
    elements.alertBox.className = `alert alert-${type}`;
    elements.alertBox.textContent = message;
    elements.alertBox.style.display = 'block';

    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(hideAlert, 3000);
    }
  }

  function hideAlert() {
    elements.alertBox.style.display = 'none';
  }

})();
