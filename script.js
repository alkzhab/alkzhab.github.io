class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if(this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;
        if(this.isDeleting) { typeSpeed /= 2; }

        if(!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const txtElement = document.querySelector('.txt-type');
    if(txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

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
            
            if(targetId === 'travaux') {
                setTimeout(refreshSliders, 100);
            }
        });
    });

    const sliders = document.querySelectorAll('.project-slider-component');

    sliders.forEach(sliderComponent => {
        const track = sliderComponent.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = sliderComponent.querySelector('.slider--next');
        const prevButton = sliderComponent.querySelector('.slider--prev');
        const dotsNav = sliderComponent.querySelector('.slider-dots-nav');

        dotsNav.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active-dot');
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        const setSlidePosition = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
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
            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.active-dot');
            
            let nextSlide = currentSlide.nextElementSibling;
            let nextDot = currentDot.nextElementSibling;

            if (!nextSlide) {
                nextSlide = slides[0];
                nextDot = dots[0];
            }

            moveToSlide(currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        });

        prevButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.active-dot');

            let prevSlide = currentSlide.previousElementSibling;
            let prevDot = currentDot.previousElementSibling;

            if (!prevSlide) {
                prevSlide = slides[slides.length - 1];
                prevDot = dots[dots.length - 1];
            }

            moveToSlide(currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.active-dot');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
        });

        window.addEventListener('resize', setSlidePosition);
    });
    
    function refreshSliders() {
        sliders.forEach(slider => {
            const track = slider.querySelector('.slider-track');
            const slides = Array.from(track.children);
            const slideWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
            const currentSlide = track.querySelector('.current-slide');
            track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
        });
    }
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');

const allImages = document.querySelectorAll('.slide img');

allImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        document.body.style.overflow = 'hidden';
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = "none";
    document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.style.display = "none";
        document.body.style.overflow = 'auto';
    }
});