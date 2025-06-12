// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize Gallery Carousel
        const galleryContainer = document.querySelector('#gallery .carousel-container');
        console.log('Gallery container:', galleryContainer);
        
        if (galleryContainer) {
            const track = galleryContainer.querySelector('.carousel-track');
            const slides = galleryContainer.querySelectorAll('.carousel-slide');
            const nextButton = galleryContainer.querySelector('.carousel-button.next');
            const prevButton = galleryContainer.querySelector('.carousel-button.prev');
            const dotsContainer = galleryContainer.querySelector('.carousel-dots');
            
            console.log('Gallery elements:', {
                track: track,
                slides: slides.length,
                nextButton: nextButton,
                prevButton: prevButton,
                dotsContainer: dotsContainer
            });

            if (track && slides.length && nextButton && prevButton && dotsContainer) {
                initCarousel(galleryContainer);
            } else {
                console.warn('Missing gallery carousel elements');
            }
        }
        
        // Initialize Review Carousel
        const reviewContainer = document.querySelector('#reviews .carousel-container');
        console.log('Review container:', reviewContainer);
        
        if (reviewContainer) {
            const track = reviewContainer.querySelector('.carousel-track');
            const slides = reviewContainer.querySelectorAll('.carousel-slide');
            const nextButton = reviewContainer.querySelector('.carousel-button.next');
            const prevButton = reviewContainer.querySelector('.carousel-button.prev');
            const dotsContainer = reviewContainer.querySelector('.carousel-dots');
            
            console.log('Review elements:', {
                track: track,
                slides: slides.length,
                nextButton: nextButton,
                prevButton: prevButton,
                dotsContainer: dotsContainer
            });

            if (track && slides.length && nextButton && prevButton && dotsContainer) {
                initCarousel(reviewContainer);
            } else {
                console.warn('Missing review carousel elements');
            }
        }
    } catch (error) {
        console.error('Error initializing carousels:', error);
    }
});

function initCarousel(container) {
    try {
        const track = container.querySelector('.carousel-track');
        const slides = container.querySelectorAll('.carousel-slide');
        const nextButton = container.querySelector('.carousel-button.next');
        const prevButton = container.querySelector('.carousel-button.prev');
        const dotsContainer = container.querySelector('.carousel-dots');
        
        let currentIndex = 0;
        const slideCount = slides.length;
        let autoplayInterval;
        let startX, moveX;
        let isDragging = false;

        // Create dots
        dotsContainer.innerHTML = ''; // Clear existing dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            const offset = -currentIndex * 100;
            track.style.transform = `translateX(${offset}%)`;
            updateDots();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slideCount;
            goToSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            goToSlide(currentIndex);
        }

        // Event listeners
        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
        
        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        // Touch events with passive listeners
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveX = e.touches[0].clientX;
            const diff = moveX - startX;
            const offset = -currentIndex * 100 + (diff / track.offsetWidth) * 100;
            track.style.transform = `translateX(${offset}%)`;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            const diff = moveX - startX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            } else {
                goToSlide(currentIndex);
            }
            resetAutoplay();
        }, { passive: true });

        function resetAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        // Start autoplay
        resetAutoplay();

        // Pause autoplay on hover
        container.addEventListener('mouseenter', () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        });

        container.addEventListener('mouseleave', () => {
            resetAutoplay();
        });

        // Initialize first slide
        goToSlide(0);
        
        console.log('Carousel initialized successfully');
    } catch (error) {
        console.error('Error in carousel initialization:', error);
    }
} 