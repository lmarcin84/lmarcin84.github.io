# 🎯 INSTRUKCJA KROK PO KROKU

## Co masz teraz?

✅ Poprawione pliki aplikacji (index.html, main.js, main.css)
✅ Dokumentację (README.md, CHANGELOG.md)
✅ Automatyczny skrypt (deploy.sh)
✅ Template Pull Request

## Co musisz zrobić?

### KROK 1: Skopiuj pliki do swojego projektu

Pobierz wszystkie pliki z outputs i skopiuj je do swojego lokalnego repozytorium (tam gdzie masz folder `.git`):

```
twoj-projekt/
├── index.html          ← NADPISZ tym nowym
├── main.js             ← NADPISZ tym nowym  
├── main.css            ← NADPISZ tym nowym
├── README.md           ← DODAJ (nowy plik)
├── CHANGELOG.md        ← DODAJ (nowy plik)
└── deploy.sh           ← DODAJ (nowy plik)
```

### KROK 2: Uruchom skrypt

W terminalu, w folderze projektu:

**macOS / Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows (Git Bash):**
```bash
bash deploy.sh
```

Skrypt automatycznie:
- ✅ Sprawdzi czy jesteś w repo git
- ✅ Przełączy na main/master
- ✅ Pobierze najnowsze zmiany
- ✅ Stworzy nowy branch: `feature/major-improvements`
- ✅ Doda wszystkie pliki
- ✅ Stworzy commit z profesjonalnym opisem

### KROK 3: Push do GitHub

Skopiuj i uruchom komendę którą skrypt wyświetli:

```bash
git push -u origin feature/major-improvements
```

### KROK 4: Utwórz Pull Request

1. Otwórz GitHub w przeglądarce
2. Przejdź do swojego repozytorium
3. Zobaczysz żółty pasek: **"Compare & pull request"** ← KLIKNIJ
4. W polu opisu WKLEJ zawartość pliku `PULL_REQUEST_TEMPLATE.md`
5. Kliknij **"Create pull request"**

### KROK 5: Przejrzyj i zatwierdź

1. Sprawdź zakładkę **"Files changed"** - zobacz co się zmieniło
2. Jeśli wszystko OK, kliknij **"Merge pull request"**
3. Potwierdź **"Confirm merge"**
4. Gotowe! 🎉

---

## 🆘 Jeśli coś pójdzie nie tak

### Błąd: "not a git repository"
➜ Upewnij się że jesteś w folderze z `.git`

### Błąd: "uncommitted changes"
➜ Zapisz lub ukryj zmiany:
```bash
git stash
```

### Błąd podczas push
➜ Sprawdź czy masz uprawnienia do repo:
```bash
git remote -v
```

### Nie widzisz przycisku "Compare & pull request"
➜ Ręcznie:
1. Kliknij "Pull requests"
2. Kliknij "New pull request"
3. Wybierz branch `feature/major-improvements`

---

## 📞 Potrzebujesz pomocy?

Daj znać na którym kroku utknąłeś, a pomogę!

---

## ⚡ Skrócona wersja (dla doświadczonych)

```bash
# 1. Skopiuj pliki do repo
# 2. Uruchom:
chmod +x deploy.sh && ./deploy.sh
git push -u origin feature/major-improvements

# 3. GitHub → Create PR → Merge
```

**Tyle!** 🚀
