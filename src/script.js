console.log("Script loaded");

const chengeText = ["sonhar", "viajar", "viver"];
const shopLink = "https://www.comprarviagem.com.br/epraviajar/home?utm_medium=email&_hsenc=p2ANqtz-_jTeLmf2_JOt1yc5HxoQb3XlV4-rVYFDqmjoYxkLlg2Z5eKNV5ygXc4C9TKJ1aaDCV3JsPFw_S_yI3tAa3WFpRK-jzrw&_hsmi=111888785&utm_content=111888785&utm_source=hs_automation";
const changeLoop = document.getElementById("changeLoop");
const sheetId = '1TQl3J-z-l1Pwt7f2Cie8Hn7wwWXY_6maDgHfqdQF1w0';
const sheetName = 'posts';
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;


let allPosts = [];

const ctas = document.querySelectorAll(".cta");
ctas.forEach(cta => {
    cta.addEventListener("click", () => {
        window.location.href = shopLink;
    });
});

let index = 0;
setInterval(() => {
    if (changeLoop) {
        changeLoop.classList.remove("move-in");
        setTimeout(() => {
            changeLoop.classList.add("move-in");
            changeLoop.textContent = chengeText[index];
            index++;
            if (index >= chengeText.length) index = 0;
        }, 500);
    }
}, 2000);


function formatDateForSort(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length === 2) {
        const [d, m] = parts;
        const y = new Date().getFullYear();
        return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    } else if (parts.length === 3) {
        const [d, m, y] = parts;
        return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    } else {
        return new Date(dateStr);
    }
}

function createCard(row) {
    const article = document.createElement('a');
    article.className = 'post-card';
    article.href = `./post-page/post.html?title=${encodeURIComponent(row.Titulo)}`;

    const img = document.createElement('img');
    img.src = row.Imagem;
    img.alt = row.Alt;

    const divContent = document.createElement('div');
    divContent.className = 'card-content';

    const h3 = document.createElement('h3');
    h3.textContent = row.Titulo;

    const p = document.createElement('p');
    p.textContent = row.Subtitulo.slice(0, 100) + '...';

    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    const a = document.createElement('a');
    a.href = `./post-page/post.html?title=${encodeURIComponent(row.Titulo)}`;
    a.className = 'btn btn-primary';
    a.textContent = row.Botao;
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
    if (!container) return;
    container.innerHTML = '';
    posts.forEach(row => {
        const card = createCard(row);
        container.appendChild(card);
    });
}

function filterPosts(term) {
    const lowerCaseTerm = term.toLowerCase();
    const filteredPosts = allPosts.filter(post => {
        const titleMatch = post.Titulo.toLowerCase().includes(lowerCaseTerm);
        const categoryMatch = post.Categoria ? post.Categoria.toLowerCase().includes(lowerCaseTerm) : false;
        const tagsMatch = post.Tags ? post.Tags.toLowerCase().includes(lowerCaseTerm) : false;
        return titleMatch || categoryMatch || tagsMatch;
    });
    renderPosts(filteredPosts);
}

const header = document.getElementsByClassName("header")[0];
const searchInput = document.getElementById("search-input"); 
const searchIcon = document.getElementById("search-icon"); 

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        searchInput.classList.remove('active');
        header.classList.remove("search-expanded")
    }
});

document.addEventListener('DOMContentLoaded', () => {
    searchIcon.addEventListener("click", (e) => { 
        if (!searchInput.classList.contains("active")) {
            e.preventDefault();
            searchInput.classList.add("active");
            searchInput.focus();
            header.classList.add("search-expanded")
        }
    });
    

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            const parsed = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true
            });

            const data = parsed.data;
            allPosts = data.filter(row =>
                row.Titulo && row.Subtitulo && row.Imagem && row.Alt && row.Data
            );

            allPosts.sort((a, b) => {
                const dateA = formatDateForSort(a.Data);
                const dateB = formatDateForSort(b.Data);
                return dateB - dateA;
            });

            renderPosts(allPosts.slice(0, 6));
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
        });

});