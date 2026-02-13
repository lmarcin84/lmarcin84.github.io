/**
 * Filtrator - Text filtering application
 * Improved version with error handling, validation, and better UX
 */

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  window.addEventListener('load', function() {
    
    // Cache DOM elements
    const elements = {
      textIn: document.getElementById('textIn'),
      textOut: document.getElementById('textOut'),
      divider: document.getElementById('divider'),
      keepText: document.getElementById('keepText'),
      convertBtn: document.getElementById('convertBtn'),
      clearBtn: document.getElementById('clearBtn'),
      copyBtn: document.getElementById('copyBtn'),
      alertBox: document.getElementById('alertBox')
    };

    // Validate that all elements exist
    if (!validateElements()) {
      console.error('Required DOM elements not found');
      console.log('Elements:', elements);
      return;
    }

    console.log('Filtrator initialized successfully!');

    // Attach event listeners
    attachEventListeners();

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
        console.log('Convert button clicked');
        
        // Get input values
        const textIn = elements.textIn.value;
        const divider = elements.divider.value;
        const keepText = elements.keepText.value;

        console.log('Input:', textIn);
        console.log('Divider:', divider);
        console.log('KeepText:', keepText);

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
        console.log('Result:', result);

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
      // STEP 1: Replace newlines with divider FIRST
      // This treats each line as a separate item
      let processed = textIn.replace(/\r?\n/g, divider);
      
      // STEP 2: Escape special regex characters in keepText
      const escapedKeepText = escapeRegexChars(keepText);
      
      // STEP 3: Create regex pattern for filtering
      let filterPattern;
      try {
        filterPattern = new RegExp(`[^${escapedKeepText}]+`, 'gmu');
      } catch (error) {
        throw new Error('Nieprawidłowy wzorzec filtra. Sprawdź wprowadzone znaki.');
      }

      // STEP 4: Replace unwanted characters with divider
      let filtered = processed.trim().replace(filterPattern, divider);

      // STEP 5: Remove duplicate delimiters
      const escapedDivider = escapeRegex(divider);
      const duplicateDividerPattern = new RegExp(`${escapedDivider}{2,}`, 'g');
      filtered = filtered.replace(duplicateDividerPattern, divider);
      
      // STEP 6: Remove leading/trailing dividers
      const leadingTrailingPattern = new RegExp(`^${escapedDivider}+|${escapedDivider}+$`, 'g');
      filtered = filtered.replace(leadingTrailingPattern, '');

      // STEP 7: Split, remove duplicates, and rejoin
      const parts = filtered.split(divider);
      const unique = [...new Set(parts)].filter(Boolean); // Remove empty strings and duplicates

      return unique.join(divider);
    }

    function escapeRegexChars(str) {
      // Special handling for character class
      // Only escape: ] (closing bracket), ^ (caret at start), \ (backslash)
      // DO NOT escape hyphen (-) as it's used for ranges like a-z
      return str
        .replace(/\\/g, '\\\\')  // Escape backslash first
        .replace(/\]/g, '\\]')   // Escape closing bracket
        .replace(/\^/g, '\\^');  // Escape caret
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

  }); // end window.load

})();
