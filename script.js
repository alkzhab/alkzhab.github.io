/* =========================================
   1. CLASSE TYPEWRITER
   ========================================= */
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;
        if (this.isDeleting) { typeSpeed /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

/* =========================================
   2. INITIALISATION GÉNÉRALE (DOMContentLoaded)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    // --- Typewriter ---
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

    // --- Navigation & Sections ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            sections.forEach(section => {
                section.classList.remove('active-section');
                if (section.id === targetId) {
                    section.classList.add('active-section');
                }
            });

            if (targetId === 'travaux') {
                setTimeout(refreshSliders, 100);
            }
        });
    });

    // --- Sliders de Projets ---
    const sliders = document.querySelectorAll('.project-slider-component');

    sliders.forEach(sliderComponent => {
        const track = sliderComponent.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = sliderComponent.querySelector('.slider--next');
        const prevButton = sliderComponent.querySelector('.slider--prev');
        const dotsNav = sliderComponent.querySelector('.slider-dots-nav');

        // Génération des points (dots)
        dotsNav.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active-dot');
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        const setSlidePosition = () => {
            const slideWidth = sliderComponent.getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
        };
        setSlidePosition();

        const moveToSlide = (currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('active-dot');
            targetDot.classList.add('active-dot');
        };

        nextButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide') || slides[0];
            const currentDot = dotsNav.querySelector('.active-dot');
            let nextSlide = currentSlide.nextElementSibling || slides[0];
            let nextDot = currentDot.nextElementSibling || dots[0];
            moveToSlide(currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        });

        prevButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide') || slides[0];
            const currentDot = dotsNav.querySelector('.active-dot');
            let prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
            let prevDot = currentDot.previousElementSibling || dots[dots.length - 1];
            moveToSlide(currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;
            const currentSlide = track.querySelector('.current-slide') || slides[0];
            const currentDot = dotsNav.querySelector('.active-dot');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            moveToSlide(currentSlide, slides[targetIndex]);
            updateDots(currentDot, targetDot);
        });

        window.addEventListener('resize', setSlidePosition);
    });

    function refreshSliders() {
        sliders.forEach(slider => {
            const track = slider.querySelector('.slider-track');
            const slides = Array.from(track.children);
            if(slides.length === 0) return;
            const slideWidth = slider.getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
            const currentSlide = track.querySelector('.current-slide') || slides[0];
            track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    document.querySelectorAll('.slide img').forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        });
    }

    lightbox?.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    // --- Accordéons Universels (Profil & Sport) ---
    function setupSimpleAccordion(btnId, wrapperId, openText, closedText) {
        const btn = document.getElementById(btnId);
        const wrapper = document.getElementById(wrapperId);
        if (!btn || !wrapper) return;

        btn.addEventListener('click', () => {
            const isExpanded = wrapper.classList.toggle('expanded');
            btn.classList.toggle('active');
            const span = btn.querySelector('span');
            if (span) span.textContent = isExpanded ? openText : closedText;
        });
    }

    setupSimpleAccordion('readMoreBtn', 'bioWrapper', 'Réduire', 'Lire la suite');
    setupSimpleAccordion('readMoreSportBtn', 'sportWrapper', 'Masquer le palmarès', 'Voir le palmarès');

    // --- Filtrage des Projets ---
    const filterButtons = document.querySelectorAll('.pillar-card');
    const projects = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');

            const filterValue = btn.getAttribute('data-filter');
            projects.forEach(project => {
                if (filterValue === 'all' || project.classList.contains('category-' + filterValue)) {
                    project.classList.remove('hidden');
                } else {
                    project.classList.add('hidden');
                }
            });
        });
    });

    // --- Accordéons d'Expertise (Stack) ---
    const expertiseCards = document.querySelectorAll('.expertise-card');
    expertiseCards.forEach(card => {
        const header = card.querySelector('.expertise-header');
        header?.addEventListener('click', () => {
            expertiseCards.forEach(c => {
                if (c !== card) c.classList.remove('open');
            });
            card.classList.toggle('open');
        });
    });
});

/* =========================================
   3. FONCTIONS GLOBALES
   ========================================= */
function filterAndScroll(category) {
    const target = document.getElementById('travaux');
    const filterBtn = document.querySelector(`.pillar-card[data-filter="${category}"]`);
    
    // Simuler le clic sur le filtre si le bouton existe
    if (filterBtn) filterBtn.click();
    
    target?.scrollIntoView({ behavior: 'smooth' });
}