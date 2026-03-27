// ========================================
// INITIALIZE ON DOM READY
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    createLightboxNavButtons();
    initGallery();
    initLightbox();
    initAnimations();
    initInteractions();
});

// ========================================
// CREATE LIGHTBOX NAV BUTTONS
// ========================================

function createLightboxNavButtons() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    // Créer le conteneur
    const container = document.createElement('div');
    container.className = 'lightbox-container';
    
    // Créer les boutons
    const prevBtn = document.createElement('div');
    prevBtn.className = 'lightbox-nav-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightboxImage(-1);
    });
    
    const nextBtn = document.createElement('div');
    nextBtn.className = 'lightbox-nav-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightboxImage(1);
    });
    
    // Obtenir l'image et le caption existants
    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const caption = lightbox.querySelector('#caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Réorganiser le DOM
    lightbox.innerHTML = '';
    
    container.appendChild(prevBtn);
    if (lightboxImg) container.appendChild(lightboxImg);
    if (caption) container.appendChild(caption);
    container.appendChild(nextBtn);
    
    lightbox.appendChild(container);
    
    // Garder le bouton de fermeture en position fixed
    if (closeBtn) {
        lightbox.appendChild(closeBtn);
    }
}

// ========================================
// IMAGE GALLERY - MAIN IMAGE SWITCHING
// ========================================

function switchImage(element) {
    const masterImg = document.getElementById('master-img');
    const src = element.src;
    const alt = element.alt;
    
    if (!masterImg) return;
    
    // Update main image with fade effect
    masterImg.style.opacity = '0.8';
    setTimeout(() => {
        masterImg.src = src;
        masterImg.style.opacity = '1';
    }, 150);
    
    // Update active thumbnail
    document.querySelectorAll('.thumb').forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
    
    scrollThumbnailIntoView(element);
}

function initGallery() {
    const thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function(e) {
            e.preventDefault();
            switchImage(this);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeThumbs = Array.from(document.querySelectorAll('.thumb'));
        const activeThumb = document.querySelector('.thumb.active');
        const activeIndex = activeThumbs.indexOf(activeThumb);
        
        if (e.key === 'ArrowRight' && activeIndex < activeThumbs.length - 1) {
            switchImage(activeThumbs[activeIndex + 1]);
        } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
            switchImage(activeThumbs[activeIndex - 1]);
        }
    });
}

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const masterImg = document.getElementById('master-img');
    
    if (!lightbox || !lightboxImg || !masterImg) return;
    
    // Open lightbox on main image click
    masterImg.addEventListener('click', () => {
        lightboxImg.src = masterImg.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close lightbox on X click
    lightboxClose.addEventListener('click', () => {
        closeLightbox(lightbox);
    });
    
    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    });
    
    // Navigate lightbox with arrows or by clicking sides
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) return;
        
        const rect = lightboxImg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        
        // Si on clique à gauche (33% de l'image)
        if (clickX < rect.width * 0.33) {
            navigateLightboxImage(-1);
        } 
        // Si on clique à droite (67% de l'image)
        else if (clickX > rect.width * 0.67) {
            navigateLightboxImage(1);
        }
    });
    
    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox(lightbox);
        }
        
        // Navigation dans le lightbox avec flèches
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                navigateLightboxImage(1);
            } else if (e.key === 'ArrowLeft') {
                navigateLightboxImage(-1);
            }
        }
    });
}

function navigateLightboxImage(direction) {
    const lightboxImg = document.getElementById('lightbox-img');
    const thumbs = Array.from(document.querySelectorAll('.thumb'));
    const currentSrc = lightboxImg.src;
    
    // Trouver l'index de l'image actuelle
    const currentIndex = thumbs.findIndex(thumb => 
        thumb.src === currentSrc || thumb.src.split('/').pop() === currentSrc.split('/').pop()
    );
    
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + direction;
    
    // Boucle circulaire
    if (nextIndex >= thumbs.length) {
        nextIndex = 0;
    } else if (nextIndex < 0) {
        nextIndex = thumbs.length - 1;
    }
    
    // Mettre à jour le lightbox
    const nextThumb = thumbs[nextIndex];
    lightboxImg.src = nextThumb.src;
    
    // Mettre à jour aussi la galerie
    document.querySelectorAll('.thumb').forEach(thumb => {
        thumb.classList.remove('active');
    });
    nextThumb.classList.add('active');
    scrollThumbnailIntoView(nextThumb);
}

function closeLightbox(lightbox) {
    if (!lightbox) lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ========================================
// SMOOTH SCROLL OBSERVER FOR REVEAL ANIMATIONS
// ========================================

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to all reveal elements
    document.querySelectorAll('.reveal').forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });

    // Initial animation setup
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, index) => {
        const delayClass = Array.from(el.classList).find(cls => cls.startsWith('stagger-'));
        const delay = delayClass ? parseInt(delayClass.split('-')[1]) * 100 : 0;
        el.style.animationDelay = delay + 'ms';
    });
}

// ========================================
// INTERACTIONS
// ========================================

function initInteractions() {
    // Parallax effect
    const bgGlow = document.querySelector('.background-glow');
    const bgGlow2 = document.querySelector('.background-glow-2');

    if (bgGlow || bgGlow2) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            if (bgGlow) {
                bgGlow.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            }
            if (bgGlow2) {
                bgGlow2.style.transform = `translate(${-x * 20}px, ${-y * 20}px)`;
            }
        });
    }

    // Action buttons hover
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Tech items hover
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ========================================
// THUMBNAIL SCROLL INTO VIEW
// ========================================

function scrollThumbnailIntoView(thumb) {
    const track = document.querySelector('.thumbnails-track');
    if (!track) return;
    
    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    
    if (thumbRect.left < trackRect.left) {
        track.scrollLeft -= (trackRect.left - thumbRect.left) + 10;
    } else if (thumbRect.right > trackRect.right) {
        track.scrollLeft += (thumbRect.right - trackRect.right) + 10;
    }
}