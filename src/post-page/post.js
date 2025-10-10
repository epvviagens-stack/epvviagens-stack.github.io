const sheetId = '1TQl3J-z-l1Pwt7f2Cie8Hn7wwWXY_6maDgHfqdQF1w0';
const sheetName = 'posts';
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

function findPostByTitle(data, title) {
    const decodedTitle = decodeURIComponent(title.replace(/\+/g, ' '));
    return data.find(row => row.Titulo && row.Titulo.trim().toLowerCase() === decodedTitle.trim().toLowerCase());
}

function findRelatedPosts(allPosts, currentPost) {
    if (!currentPost.Tags || currentPost.Tags.trim() === '') {
        return allPosts.filter(post =>
            post.Categoria === currentPost.Categoria && post.Titulo !== currentPost.Titulo
        ).slice(0, 3);
    }

    const currentTags = new Set(currentPost.Tags.split(',').map(tag => tag.trim().toLowerCase()));

    const scoredPosts = allPosts
        .filter(post => post.Titulo !== currentPost.Titulo && post.Tags && post.Tags.trim() !== '')
        .map(post => {
            const postTags = post.Tags.split(',').map(tag => tag.trim().toLowerCase());
            const commonTagsCount = postTags.filter(tag => currentTags.has(tag)).length;
            return { post, score: commonTagsCount };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    return scoredPosts.slice(0, 3).map(item => item.post);
}

function createRelatedPostCard(post) {
    return `
        <a href="post.html?title=${encodeURIComponent(post.Titulo)}" class="related-card">
            <img src="${post.Imagem}" alt="${post.Alt}">
            <div class="related-card-content">
                ${post.Categoria ? `<span class="related-card-category">${post.Categoria}</span>` : ''}
                <h5>${post.Titulo}</h5>
            </div>
        </a>
    `;
}

function renderPage(post, relatedPosts) {
    const mainContent = document.getElementById('main-content');
    if (!post) {
        mainContent.innerHTML = '<p style="text-align: center; padding: 2rem;">Post não encontrado.</p>';
        return;
    }

    document.title = `${post.Titulo} - É pra viajar`;

    const shareUrl = window.location.href;
    const shareTitle = encodeURIComponent(post.Titulo);
    
    const authorName = post.Autor || 'É pra Viajar';
    const authorBio = post.AutorSubtitulo || 'Especialistas em realizar o sonho da sua próxima viagem.';
    const authorImage = post.AutorImagem || '../static/logo.png';
    const authorNumber = post.AutorNumber || '+5541987870348'
    const whatsappUrl = `https://wa.me/${authorNumber}?text=Olá!%20Vi%20o%20post%20sobre%20${shareTitle}%20e%20gostaria%20de%20mais%20informações.`;

    const authorBoxHTML = `
        <div class="author-box">
            <img src="${authorImage}" alt="Foto de ${authorName}" class="author-image">
            <div class="author-info">
                <div>
                    <h4>${authorName}</h4>
                    <p>${authorBio}</p>
                </div>
                <a href="${whatsappUrl}" class="btn btn-primary author-cta" target="_blank">
                    <i class="fab fa-whatsapp"></i>
                    <span>Fale comigo</span>
                </a>
            </div>
        </div>
    `;

    const pageHTML = `
        <div class="post-layout">
            <section class="post-hero" style="--bg-image: url('${post.Imagem}')">
                <div class="post-hero-content">
                    ${post.Categoria ? `<span class="post-category">${post.Categoria}</span>` : ''}
                    <h1 class="post-title-hero">${post.Titulo}</h1>
                    <p class="post-meta-hero">Por ${authorName} em ${post.Data}</p>
                </div>
            </section>

            <article class="article-container">
                <div class="post-body">
                    ${post.ConteudoCompleto.split('\\n').map(p => `<p>${p}</p>`).join('')}
                </div>
                
                ${authorBoxHTML}

                <div class="share-section">
                    <h4>Compartilhe este post!</h4>
                    <div class="share-buttons">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" aria-label="Compartilhar no Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" aria-label="Compartilhar no WhatsApp"><i class="fab fa-whatsapp"></i></a>
                        <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" aria-label="Compartilhar no Twitter"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </article>

            ${relatedPosts.length > 0 ? `
            <section class="related-posts-section">
                <div class="related-posts-container">
                    <h2 class="related-title">Você também pode gostar</h2>
                    <div class="related-grid">
                        ${relatedPosts.map(createRelatedPostCard).join('')}
                    </div>
                </div>
            </section>` : ''}
        </div>
    `;

    mainContent.innerHTML = pageHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postTitle = urlParams.get('title');

    if (postTitle) {
        fetch(csvUrl)
            .then(response => response.text())
            .then(csvText => {
                const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
                const allPosts = parsed.data.filter(p => p.Titulo);
                const currentPost = findPostByTitle(allPosts, postTitle);
                
                if (currentPost) {
                    const relatedPosts = findRelatedPosts(allPosts, currentPost);
                    renderPage(currentPost, relatedPosts);
                } else {
                    renderPage(null, []);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar os dados:', error);
                document.getElementById('main-content').innerHTML = '<p style="text-align: center; padding: 2rem;">Ocorreu um erro ao carregar o post.</p>';
            });
    }
});