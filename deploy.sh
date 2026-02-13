#!/bin/bash

# Filtrator - Automated Git Workflow Script
# Ten skrypt automatycznie tworzy branch, commituje zmiany i pushuje do GitHub

set -e  # Zatrzymaj skrypt przy błędzie

echo "🚀 Filtrator - Deployment Script"
echo "=================================="
echo ""

# Kolory dla outputu
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Sprawdź czy jesteś w repozytorium git
echo -e "${BLUE}[1/7]${NC} Sprawdzam repozytorium git..."
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  Nie jesteś w repozytorium git!${NC}"
    echo "Uruchom ten skrypt w głównym folderze swojego projektu."
    exit 1
fi
echo -e "${GREEN}✓${NC} Repozytorium git znalezione"
echo ""

# 2. Sprawdź czy są niezapisane zmiany
echo -e "${BLUE}[2/7]${NC} Sprawdzam niezapisane zmiany..."
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Masz niezapisane zmiany!${NC}"
    echo "Najpierw zapisz lub cofnij zmiany w obecnym branchu."
    echo ""
    echo "Możesz:"
    echo "  git stash          # Tymczasowo ukryj zmiany"
    echo "  git stash pop      # Przywróć zmiany później"
    exit 1
fi
echo -e "${GREEN}✓${NC} Brak niezapisanych zmian"
echo ""

# 3. Przełącz się na main/master
echo -e "${BLUE}[3/7]${NC} Przełączam na główny branch..."
MAIN_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')
git checkout $MAIN_BRANCH
echo -e "${GREEN}✓${NC} Na branchu: $MAIN_BRANCH"
echo ""

# 4. Pobierz najnowsze zmiany
echo -e "${BLUE}[4/7]${NC} Pobieram najnowsze zmiany z GitHub..."
git pull origin $MAIN_BRANCH
echo -e "${GREEN}✓${NC} Repozytorium zaktualizowane"
echo ""

# 5. Stwórz nowy branch
echo -e "${BLUE}[5/7]${NC} Tworzę nowy branch: feature/major-improvements..."
BRANCH_NAME="feature/major-improvements"

# Usuń branch jeśli już istnieje
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    echo -e "${YELLOW}⚠️  Branch $BRANCH_NAME już istnieje, usuwam...${NC}"
    git branch -D $BRANCH_NAME
fi

git checkout -b $BRANCH_NAME
echo -e "${GREEN}✓${NC} Branch utworzony i przełączony"
echo ""

# 6. Dodaj zmiany
echo -e "${BLUE}[6/7]${NC} Dodaję zmienione pliki..."
git add index.html main.js main.css README.md

# Pokaż co zostanie dodane
echo ""
echo "Pliki do commita:"
git status --short
echo ""

# 7. Commit
echo -e "${BLUE}[7/7]${NC} Tworzę commit..."
git commit -m "refactor: major improvements and bug fixes

✨ New Features:
- Add 'Clear' button for quick reset
- Add 'Copy to clipboard' button with visual feedback
- Add success/error alert messages
- Add unique elements counter
- Add Ctrl+Enter keyboard shortcut

🐛 Bug Fixes:
- Fix critical logic error in convert function
- Fix duplicate removal (O(n) instead of O(n²))
- Add proper regex character escaping
- Add comprehensive error handling

♿ Accessibility:
- Add ARIA labels for all form elements
- Add aria-live region for screen readers
- Implement proper focus management
- Add keyboard navigation support
- Add semantic HTML5 structure

🎨 UI/UX Improvements:
- Redesign with modern gradient background
- Add smooth animations and transitions
- Add hover effects on buttons
- Add loading states with spinners
- Add responsive button grid layout
- Add helper text below inputs

🏗️ Code Quality:
- Refactor to IIFE module pattern (no globals)
- Remove unused jQuery dependency (-59KB)
- Replace inline onclick with event listeners
- Split into focused, single-purpose functions
- Add input validation
- Add DOM element caching

📱 Responsive Design:
- Improve mobile layout
- Add CSS variables for easy theming
- Add print styles
- Add reduced-motion support
- Improve cross-browser compatibility

📝 Documentation:
- Add comprehensive README.md
- Add code comments
- Add usage examples
- List all 33+ improvements

Breaking Changes: None
Migration: Simply replace old files with new ones"

echo -e "${GREEN}✓${NC} Commit utworzony"
echo ""

# 8. Push do GitHub
echo "========================================="
echo -e "${YELLOW}⚠️  WAŻNE!${NC}"
echo "========================================="
echo ""
echo "Teraz musisz wykonać push do GitHub:"
echo ""
echo -e "${GREEN}git push -u origin $BRANCH_NAME${NC}"
echo ""
echo "Następnie:"
echo "1. Otwórz GitHub w przeglądarce"
echo "2. Zobaczysz powiadomienie 'Compare & pull request'"
echo "3. Kliknij i utwórz Pull Request"
echo "4. Przejrzyj zmiany i zatwierdź merge"
echo ""
echo "========================================="
echo ""
echo -e "${GREEN}✅ Skrypt zakończony!${NC}"
echo ""
echo "Aktualny branch: $BRANCH_NAME"
echo "Status:"
git status --short
echo ""
