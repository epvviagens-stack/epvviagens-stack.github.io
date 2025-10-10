console.log("Script loaded");

const chengeText = ["sonhar", "viajar", "viver"]
const shopLink = "https://www.comprarviagem.com.br/epraviajar/home?utm_medium=email&_hsenc=p2ANqtz-_jTeLmf2_JOt1yc5HxoQb3XlV4-rVYFDqmjoYxkLlg2Z5eKNV5ygXc4C9TKJ1aaDCV3JsPFw_S_yI3tAa3WFpRK-jzrw&_hsmi=111888785&utm_content=111888785&utm_source=hs_automation"
const changeLoop = document.getElementById("changeLoop");
const sheetId = '1TQl3J-z-l1Pwt7f2Cie8Hn7wwWXY_6maDgHfqdQF1w0'
const sheetName = 'posts'

const ctas = document.querySelectorAll(".cta")
ctas.forEach(cta => {
    cta.addEventListener("click", () => {
        window.location.href = shopLink;
    });
});

let index = 0;
setInterval(() => {
    changeLoop.classList.remove("move-in");
    setTimeout(() => {
        changeLoop.classList.add("move-in");
        changeLoop.textContent = chengeText[index];
        index++;
        if (index >= chengeText.length) index = 0;
    }, 500);
}, 2000);


const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

function parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const header = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(l => {
        const cols = l.split(',').map(c => c.trim());
        const obj = {};
        header.forEach((h, i) => {
            obj[h] = cols[i];
        });
        return obj;
    });
    return rows;
}

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
    const article = document.createElement('article');
    article.className = 'post-card';

    const img = document.createElement('img');
    img.src = row.Imagem;
    img.alt = row.Alt;

    const divContent = document.createElement('div');
    divContent.className = 'card-content';

    const h3 = document.createElement('h3');
    h3.textContent = row.Titulo;

    const p = document.createElement('p');
    p.textContent = row.Conteudo.slice(0, 100) + '...';

    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    const a = document.createElement('a');
    a.href = a.href = `./post-page/post.html?title=${encodeURIComponent(row.Titulo)}`;
    a.className = 'btn btn-primary';
    a.textContent = row.Botao;
    a.setAttribute('aria-label', `Leia mais sobre ${row.Titulo}`);

    // const span = document.createElement('span');
    // span.className = 'post-date';
    // span.textContent = (row.Data.length <= 5) ? `${row.Data}/${new Date().getFullYear()}` : row.Data;

    cardFooter.appendChild(a);
    // cardFooter.appendChild(span);

    divContent.appendChild(h3);
    divContent.appendChild(p);
    divContent.appendChild(cardFooter);

    article.appendChild(img);
    article.appendChild(divContent);

    return article;
}

console.log("Fetching CSV");
fetch(csvUrl)
    .then(response => response.text())
    .then(csvText => {
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });

        const data = parsed.data;
        const validRows = data.filter(row =>
            row.Titulo && row.Conteudo && row.Imagem && row.Alt && row.Data
        );

        validRows.sort((a, b) => {
            const dateA = formatDateForSort(a.Data);
            const dateB = formatDateForSort(b.Data);
            return dateB - dateA;
        });

        const top6 = validRows.slice(0, 6);
        const container = document.getElementById('render-posts');

        top6.forEach(row => {
            const card = createCard(row);
            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
    });