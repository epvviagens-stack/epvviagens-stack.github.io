document.addEventListener('DOMContentLoaded', () => {
    fetch(`/assets/components/floating-button/floating-button.html`)
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        });
});