document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.content-slide');
    const images = document.querySelectorAll('.carousel-image img');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let currentIndex = 0;

    function showSlide(index, direction) {
        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }

        resetClasses = () => {
            slides.forEach(slide => {
                slide.classList.remove('active', 'next', 'prev');
            });
            images.forEach(img => {
                img.classList.remove('active', 'next', 'prev');
            });
        };

        resetClasses();

        if (direction === 'next') {
            slides[currentIndex].classList.add('next');
            images[currentIndex].classList.add('next');
        } else {
            slides[currentIndex].classList.add('prev');
            images[currentIndex].classList.add('prev');
        }
    }

    function nextSlide() {
        showSlide(currentIndex + 1, 'next');
    }

    function prevSlide() {
        showSlide(currentIndex - 1, 'prev');
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    showSlide(currentIndex);
});