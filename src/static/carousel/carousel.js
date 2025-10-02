document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let animationID = null;

    function moveToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));

    slides.forEach(slide => slide.addEventListener('dragstart', e => e.preventDefault()));

    slides.forEach((slide, index) => {
        slide.addEventListener('pointerdown', pointerDown(index));
        slide.addEventListener('pointermove', pointerMove);
        slide.addEventListener('pointerup', pointerUp);
        slide.addEventListener('pointercancel', pointerUp);
    });

    function pointerDown(index) {
        return function(e) {
            isDragging = true;
            currentIndex = index;
            startX = e.clientX;
            currentX = startX;
            track.style.transition = 'none';
            if (e.target.setPointerCapture) {
                try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
            }
            animationID = requestAnimationFrame(animation);
        }
    }

    function pointerMove(e) {
        if (!isDragging) return;
        currentX = e.clientX;
    }

    function pointerUp() {
        if (!isDragging) return;
        cancelAnimationFrame(animationID);
        isDragging = false;

        const moved = currentX - startX;
        const slideWidth = slides[currentIndex].getBoundingClientRect().width;
        const threshold = slideWidth * 0.25;

        if (moved < -threshold && currentIndex < slides.length - 1) {
            moveToSlide(currentIndex + 1);
        } else if (moved > threshold && currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        } else {
            moveToSlide(currentIndex);
        }
    }

    function animation() {
        const moved = currentX - startX;
        const slideWidth = slides[currentIndex].getBoundingClientRect().width;
        let percentageMoved = (moved / slideWidth) * 100;
        percentageMoved = Math.max(Math.min(percentageMoved, 100), -100);
        track.style.transform = `translateX(-${currentIndex * 100 - percentageMoved}%)`;
        if (isDragging) animationID = requestAnimationFrame(animation);
    }

    moveToSlide(0);
});