document.addEventListener('DOMContentLoaded', () => {
    fetch(`https://epraviajar.com.br/src/assets/components/floating-button/floating-button.html`)
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        });
});