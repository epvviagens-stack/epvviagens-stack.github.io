const sheetId = '1TQl3J-z-l1Pwt7f2Cie8Hn7wwWXY_6maDgHfqdQF1w0';
const sheetName = 'posts';
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

let allPosts = [];
const searchInput = document.getElementById('search-input');
const searchTitle = document.getElementById('search-results-title');

function createCard(row) {
    const article = document.createElement('a');
    article.className = 'post-card';
    article.href = `/post-page/post.html?title=${encodeURIComponent(row.Titulo)}`;

    const img = document.createElement('img');
    img.src = row.Imagem;
    img.alt = row.Alt;

    const divContent = document.createElement('div');
    divContent.className = 'card-content';

    const h3 = document.createElement('h3');
    h3.textContent = row.Titulo;

    const p = document.createElement('p');
    p.textContent = (row.Subtitulo || '').slice(0, 100) + '...';

    cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';
    const a = document.createElement('a');
    a.href = `/post-page/post.html?title=${encodeURIComponent(row.Titulo)}`;
    a.className = 'btn btn-primary';
    a.textContent = row.Botao || 'Leia mais';
    a.setAttribute('aria-label', `Leia mais sobre ${row.Titulo}`);
    cardFooter.appendChild(a);

    divContent.appendChild(h3);
    divContent.appendChild(p);
    divContent.appendChild(cardFooter);

    article.appendChild(img);
    article.appendChild(divContent);

    return article;
}

function renderPosts(posts) {
    const container = document.getElementById('render-posts');
    container.innerHTML = '';
    if (posts.length === 0) {
        container.innerHTML = '<p>Nenhum post encontrado.</p>';
    } else {
        posts.forEach(row => {
            container.appendChild(createCard(row));
        });
    }
}

function filterPosts(term) {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = allPosts.filter(post => {
        const titleMatch = post.Titulo.toLowerCase().includes(lowerCaseTerm);
        const categoryMatch = (post.Categoria || '').toLowerCase().includes(lowerCaseTerm);
        const tagsMatch = (post.Tags || '').toLowerCase().includes(lowerCaseTerm);
        return titleMatch || categoryMatch || tagsMatch;
    });
    renderPosts(filtered);
    searchTitle.textContent = `Resultados da busca para: "${term}"`;
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedFilter = debounce(filterPosts, 300);

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q') || '';
    searchInput.value = searchTerm;

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            const parsed = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true
            });
            allPosts = parsed.data;
            filterPosts(searchTerm);

            searchInput.addEventListener('input', e => {
                const newSearchTerm = e.target.value.trim();
                const newUrl = `${window.location.pathname}?q=${encodeURIComponent(newSearchTerm)}`;
                history.replaceState(null, '', newUrl);
                debouncedFilter(newSearchTerm);
                });

            searchInput.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const confirmedTerm = e.target.value.trim();
                    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(confirmedTerm)}`;
                    history.pushState(null, '', newUrl);
                    filterPosts(confirmedTerm);
                }
            });
        });
});


const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
});