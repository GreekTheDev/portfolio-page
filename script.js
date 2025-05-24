document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const html = document.documentElement;
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle');
    const langToggle = document.querySelector('.lang-toggle');
    const translateElements = document.querySelectorAll('.translate');

    // Inicjalizacja trybu ciemnego na podstawie czasu
    initDarkMode();

    // Obsługa menu mobilnego
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Zamykanie menu po kliknięciu w link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Obsługa przełącznika trybu ciemnego
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Obsługa przełącznika języka
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Obsługa scrollowania - chowanie/pokazywanie menu
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Chowanie/pokazywanie menu przy scrollowaniu
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll w dół - chowamy menu
            header.classList.add('hidden');
        } else {
            // Scroll w górę - pokazujemy menu
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });

    // Funkcja inicjalizująca tryb ciemny na podstawie czasu
    function initDarkMode() {
        const currentHour = new Date().getHours();
        const isDarkModeTime = currentHour >= 18 || currentHour < 8;
        
        // Sprawdzamy, czy użytkownik już wybrał tryb
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // Używamy zapisanego trybu
            html.setAttribute('data-theme', savedTheme);
        } else if (isDarkModeTime) {
            // Używamy trybu ciemnego w godzinach 18-8
            html.setAttribute('data-theme', 'dark');
        } else {
            // Domyślnie tryb jasny
            html.setAttribute('data-theme', 'light');
        }
    }

    // Funkcja przełączająca tryb ciemny/jasny
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Funkcja przełączająca język
    function toggleLanguage() {
        const currentLang = html.getAttribute('data-lang') || 'pl';
        const newLang = currentLang === 'pl' ? 'en' : 'pl';
        
        html.setAttribute('data-lang', newLang);
        localStorage.setItem('lang', newLang);
        
        // Aktualizacja tekstów
        translateElements.forEach(element => {
            const translatedText = element.getAttribute(`data-${newLang}`);
            if (translatedText) {
                element.textContent = translatedText;
            }
        });
        
        // Aktualizacja elementów nawigacji
        document.querySelectorAll('.nav-link').forEach(element => {
            const translatedText = element.getAttribute(`data-${newLang}`);
            if (translatedText) {
                element.textContent = translatedText;
            }
        });
        
        // Aktualizacja atrybutów title i placeholder
        document.querySelectorAll('[data-' + newLang + '-title]').forEach(element => {
            element.setAttribute('title', element.getAttribute('data-' + newLang + '-title'));
        });
        
        document.querySelectorAll('[data-' + newLang + '-placeholder]').forEach(element => {
            element.setAttribute('placeholder', element.getAttribute('data-' + newLang + '-placeholder'));
        });
    }

    // Inicjalizacja języka z localStorage
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        html.setAttribute('data-lang', savedLang);
        
        // Aktualizacja tekstów przy ładowaniu strony
        if (savedLang === 'en') {
            translateElements.forEach(element => {
                const translatedText = element.getAttribute('data-en');
                if (translatedText) {
                    element.textContent = translatedText;
                }
            });
            
            // Aktualizacja elementów nawigacji
            document.querySelectorAll('.nav-link').forEach(element => {
                const translatedText = element.getAttribute('data-en');
                if (translatedText) {
                    element.textContent = translatedText;
                }
            });
            
            document.querySelectorAll('[data-en-title]').forEach(element => {
                element.setAttribute('title', element.getAttribute('data-en-title'));
            });
            
            document.querySelectorAll('[data-en-placeholder]').forEach(element => {
                element.setAttribute('placeholder', element.getAttribute('data-en-placeholder'));
            });
        }
    } else {
        html.setAttribute('data-lang', 'pl');
    }

    // Obsługa płynnego scrollowania do sekcji
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Odejmujemy wysokość nagłówka
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Obsługa płynnego przewijania za pomocą klawiszy strzałek
    document.addEventListener('keydown', function(e) {
        const sections = document.querySelectorAll('.section');
        const currentPosition = window.scrollY;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            // Znajdź następną sekcję
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                if (section.offsetTop > currentPosition + 100) { // Dodajemy margines 100px
                    window.scrollTo({
                        top: section.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    break;
                }
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            // Znajdź poprzednią sekcję
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.offsetTop < currentPosition - 100) { // Dodajemy margines 100px
                    window.scrollTo({
                        top: section.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    break;
                }
            }
        }
    });
});