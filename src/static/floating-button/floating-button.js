document.addEventListener('DOMContentLoaded', () => {
    fetch('static/floating-button/floating-button.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        });
});