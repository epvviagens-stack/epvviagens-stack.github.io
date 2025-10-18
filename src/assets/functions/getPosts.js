const sheetId = '1TQl3J-z-l1Pwt7f2Cie8Hn7wwWXY_6maDgHfqdQF1w0';
const sheetName = 'posts';
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

let allPosts = []

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

export async function getPosts() {
    const cachedPosts = sessionStorage.getItem('cachedPosts');
    if (cachedPosts) {
        allPosts = JSON.parse(cachedPosts);
        return allPosts;
    }

    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();
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

        sessionStorage.setItem('cachedPosts', JSON.stringify(allPosts));
        return allPosts;
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        return []; 
    }
}