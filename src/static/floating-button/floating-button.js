document.addEventListener('DOMContentLoaded', () => {
    fetch(`https://epvviagens-stack.github.io/src/floating-button/floating-button.html`)
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        });
});