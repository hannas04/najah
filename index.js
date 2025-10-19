
        // --- Scroll Reveal Logic using Intersection Observer ---
        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(element => {
            observer.observe(element);
        });

        // --- Data and Logic for Dua Feature ---
        const duas = [
            {
                arabic: "رَبِّ زِدْنِي عِلْمًا",
                translation: "\"My Lord, increase me in knowledge.\"",
                source: "Qur'an 20:114"
            },
            {
                arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
                translation: "\"O Allah, I ask You for guidance, piety, abstinence (from the unlawful), and self-sufficiency.\"",
                source: "Sahih Muslim"
            },
            {
                arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
                translation: "\"Exalted is Allah with praise.\"",
                source: "Sahih al-Bukhari (A means to plant a palm tree in Paradise)"
            }
        ];
        let currentDuaIndex = 0;

        function updateDua() {
            const dua = duas[currentDuaIndex];
            const arabicElement = document.getElementById('dua-arabic');
            const translationElement = document.getElementById('dua-translation');
            const sourceElement = document.getElementById('dua-source');
            const displayElement = document.getElementById('dua-display');

            // Simple fading transition
            displayElement.style.opacity = 0;

            setTimeout(() => {
                arabicElement.textContent = dua.arabic;
                translationElement.textContent = dua.translation;
                sourceElement.textContent = dua.source;
                displayElement.style.opacity = 1;
            }, 400); 
        }

        function nextDua() {
            currentDuaIndex = (currentDuaIndex + 1) % duas.length;
            updateDua();
        }

        // --- FIXED: Seamless Looping Slider Logic ---
        
        // Initial indices are set to 1, because index 0 is the clone of the last slide.
        let hadithCurrentIndex = 1; 
        let quranCurrentIndex = 1;
        const hadithContainer = document.getElementById('hadith-slides');
        const quranContainer = document.getElementById('quran-slides');

        // Initialize positions to show the *actual* first slide (index 1) on load
        window.onload = function() {
            updateDua();
            // Initial positioning (must be done without transition)
            hadithContainer.classList.add('no-transition');
            hadithContainer.style.transform = `translateX(-100%)`;
            
            quranContainer.classList.add('no-transition');
            quranContainer.style.transform = `translateX(-100%)`;

            // Re-enable transition after a small delay
            setTimeout(() => {
                hadithContainer.classList.remove('no-transition');
                quranContainer.classList.remove('no-transition');
            }, 50);

            // Start auto-advance after initialization
            setInterval(() => {
                nextSlide('hadith');
                nextSlide('quran');
            }, 8000);
        };


        /**
         * Updates the slider position for the given ID (hadith or quran) using cloning logic.
         */
        function updateSlide(id, index) {
            const container = (id === 'hadith') ? hadithContainer : quranContainer;
            if (!container) return; 

            // The total number of visible slides is totalSlides - 2 (due to the two clones)
            const slides = container.querySelectorAll('.slide-item');
            const totalSlides = slides.length; // Includes both clones
            const actualSlidesCount = totalSlides - 2; 

            // Update the index state
            if (id === 'hadith') {
                hadithCurrentIndex = index;
            } else if (id === 'quran') {
                quranCurrentIndex = index;
            }

            const offset = -index * 100;
            container.style.transform = `translateX(${offset}%)`;

            // --- Looping Logic ---
            
            // If we moved to the clone of the last slide (index 0)
            if (index === 0) {
                // Instantly jump to the actual last slide (index totalSlides - 2)
                setTimeout(() => {
                    container.classList.add('no-transition');
                    container.style.transform = `translateX(-${actualSlidesCount * 100}%)`;
                    
                    if (id === 'hadith') hadithCurrentIndex = actualSlidesCount;
                    else if (id === 'quran') quranCurrentIndex = actualSlidesCount;
                    
                    // Re-enable transition
                    setTimeout(() => container.classList.remove('no-transition'), 50);
                }, 700); // Must match the CSS transition duration
            } 
            
            // If we moved to the clone of the first slide (index totalSlides - 1)
            else if (index === totalSlides - 1) {
                // Instantly jump back to the actual first slide (index 1)
                setTimeout(() => {
                    container.classList.add('no-transition');
                    container.style.transform = `translateX(-100%)`; // 100% is always the first actual slide
                    
                    if (id === 'hadith') hadithCurrentIndex = 1;
                    else if (id === 'quran') quranCurrentIndex = 1;
                    
                    // Re-enable transition
                    setTimeout(() => container.classList.remove('no-transition'), 50);
                }, 700); // Must match the CSS transition duration
            }
        }

        function nextSlide(id) {
            let index = (id === 'hadith') ? hadithCurrentIndex + 1 : quranCurrentIndex + 1;
            const container = (id === 'hadith') ? hadithContainer : quranContainer;
            const totalSlides = container.querySelectorAll('.slide-item').length;
            
            // If we are on the last clone, set the next index to the last clone index
            if (index > totalSlides - 1) {
                index = totalSlides - 1; 
            }
            updateSlide(id, index);
        }

        function prevSlide(id) {
            let index = (id === 'hadith') ? hadithCurrentIndex - 1 : quranCurrentIndex - 1;
            
            // If we are on the first clone, set the previous index to the first clone index
            if (index < 0) {
                index = 0;
            }
            updateSlide(id, index);
        }

        // --- Mobile Menu Toggle (makes the mobile menu button work) ---
        (function() {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');

            if (!mobileMenuBtn || !mobileMenu) return; // Nothing to do if markup missing

            // SVG icons
            const hamburgerSVG = `<svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
            const closeSVG = `<svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

            // Ensure initial icon matches aria-expanded state (defaults to false)
            function setButtonIcon(isOpen) {
                mobileMenuBtn.innerHTML = isOpen ? closeSVG : hamburgerSVG;
            }

            // Expose a global function so inline onclick handlers can call it from HTML.
            window.toggleMobileMenu = function(forceOpen) {
                const isOpen = mobileMenu.classList.contains('mobile-menu-open');
                const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;

                if (shouldOpen) {
                    // If already closing, cancel the closing state
                    mobileMenu.classList.remove('mobile-menu-closing');
                    mobileMenu.style.display = 'flex';
                    // Allow paint then add open class for transition
                    requestAnimationFrame(() => mobileMenu.classList.add('mobile-menu-open'));
                    mobileMenuBtn.setAttribute('aria-expanded', 'true');
                    mobileMenuBtn.setAttribute('aria-label', 'Close Menu');
                    setButtonIcon(true);
                    // Prevent background scrolling while menu is open on small screens
                    document.documentElement.style.overflow = 'hidden';
                    document.body.style.overflow = 'hidden';
                } else {
                    // Add closing class to run CSS transition, then hide after it finishes
                    mobileMenu.classList.remove('mobile-menu-open');
                    mobileMenu.classList.add('mobile-menu-closing');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.setAttribute('aria-label', 'Open Menu');
                    setButtonIcon(false);
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';

                    // Wait for transitionend on mobileMenu, with a fallback timeout
                    function onClose(e) {
                        if (e && e.target !== mobileMenu) return;
                        mobileMenu.style.display = 'none';
                        mobileMenu.classList.remove('mobile-menu-closing');
                        mobileMenu.removeEventListener('transitionend', onClose);
                        clearTimeout(timeoutId);
                    }

                    mobileMenu.addEventListener('transitionend', onClose);
                    const timeoutId = setTimeout(onClose, 320); // slightly longer than CSS transition
                }

            };

            // Initialize icon (in case JS loads after markup)
            setButtonIcon(false);

            // Button toggles the menu
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.toggleMobileMenu();
            });

            // Close the menu when clicking outside of it
            document.addEventListener('click', (e) => {
                if (!mobileMenu.classList.contains('mobile-menu-open')) return;
                if (mobileMenu.contains(e.target) || mobileMenuBtn.contains(e.target)) return;
                window.toggleMobileMenu(false);
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu-open')) {
                    window.toggleMobileMenu(false);
                }
            });
        })();

   