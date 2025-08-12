        const STORAGE_KEY = 'slideshow_images'; // Key for localStorage
        let slides = []; // Array to hold image URLs
        let currentSlideIndex = 0;
        let slideshowInterval;
        const SLIDESHOW_DELAY = 5000; // 5 seconds

        function loadImagesAndStartSlideshow() {
            const storedImages = localStorage.getItem(STORAGE_KEY);
            if (storedImages) {
                try {
                    slides = JSON.parse(storedImages);
                    // Sort slides by timestamp to maintain order, new images added last
                    slides.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                } catch (e) {
                    console.error("Error parsing stored images:", e);
                    slides = [];
                }
            }

            if (slides.length > 0) {
                showSlide(currentSlideIndex);
                startSlideshow();
            } else {
                // No images, display a placeholder
                const imageElement = document.getElementById('slideshow-image');
                imageElement.src = 'https://placehold.co/800x450/cccccc/333333?text=No+Images+Yet';
                imageElement.alt = 'No images available';
                imageElement.classList.remove('opacity-0'); // Ensure visible
                document.getElementById('slide-indicators').innerHTML = '';
                stopSlideshow();
            }
        }

        function showSlide(index) {
            if (slides.length === 0) return;

            // Fade out current image
            const imageElement = document.getElementById('slideshow-image');
            imageElement.classList.add('opacity-0');

            setTimeout(() => {
                currentSlideIndex = (index + slides.length) % slides.length;
                imageElement.src = slides[currentSlideIndex].url;
                imageElement.alt = `Slide ${currentSlideIndex + 1}`;

                // Handle image loading errors
                imageElement.onerror = () => {
                    console.error("Failed to load image:", slides[currentSlideIndex].url);
                    imageElement.src = 'https://placehold.co/800x450/ff0000/ffffff?text=Image+Error';
                    imageElement.alt = 'Error loading image';
                };

                // Fade in new image
                imageElement.classList.remove('opacity-0');
                updateIndicators();
            }, 300); // Wait for fade-out transition
        }

        function nextSlide() {
            stopSlideshow();
            showSlide(currentSlideIndex + 1);
            startSlideshow();
        }

        function prevSlide() {
            stopSlideshow();
            showSlide(currentSlideIndex - 1);
            startSlideshow();
        }

        function updateIndicators() {
            const indicatorsContainer = document.getElementById('slide-indicators');
            indicatorsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === currentSlideIndex) {
                    dot.classList.add('active');
                }
                dot.onclick = () => {
                    stopSlideshow();
                    showSlide(i);
                    startSlideshow();
                };
                indicatorsContainer.appendChild(dot);
            });
        }

        function startSlideshow() {
            stopSlideshow(); // Clear any existing interval
            if (slides.length > 1) { // Only start if there's more than one slide
                slideshowInterval = setInterval(() => {
                    nextSlide();
                }, SLIDESHOW_DELAY);
            }
        }

        function stopSlideshow() {
            if (slideshowInterval) {
                clearInterval(slideshowInterval);
            }
        }

        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50; // Minimum pixels for a recognized swipe


        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
        }

        function handleTouchMove(e) {
            touchEndX = e.touches[0].clientX;
        }

        function handleTouchEnd() {
            const swipeDistance = touchEndX - touchStartX;

            if (slides.length <= 1) return;

            if (swipeDistance > minSwipeDistance) {
                // Swipe right (previous)
                prevSlide();
            } else if (swipeDistance < -minSwipeDistance) {
                // Swipe left (next)
                nextSlide();
            }
            touchStartX = 0;
            touchEndX = 0;
        }

        window.onload = loadImagesAndStartSlideshow;
        const slideshowContainer = document.getElementById('slideshow-container');
        slideshowContainer.addEventListener('touchstart', handleTouchStart, false);
        slideshowContainer.addEventListener('touchmove', handleTouchMove, false);
        slideshowContainer.addEventListener('touchend', handleTouchEnd, false);

        window.addEventListener('storage', (event) => {
            if (event.key === STORAGE_KEY) {
                loadImagesAndStartSlideshow();
            }
        });