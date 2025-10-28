<details>
  <summary><strong>🇬🇧 View in English (Click to expand)</strong></summary>
  
  # É pra viajar!
  ![É pra viajar! Logo](src/static/logo.png)

  Welcome to the official website repository for the **É pra viajar!** travel agency. This project is hosted on GitHub Pages and is publicly accessible via our custom domain:

  ### ➡️ **[www.epraviajar.com.br](https://www.epraviajar.com.br)**

  This site serves as our agency's primary marketing and sales platform, offering a portal for quoting travel packages, airfare, and a blog with travel tips.

  We are official partners with **OnerTravel** ([https://onertravel.com](https://onertravel.com)), using the Befly search widget to provide the best travel options to our clients.

  ## ✨ Key Features

  This is not just a typical static site. It was built with several dynamic features to be fast, modern, and easy to manage:

  * **✈️ OnerTravel Integration:** The site integrates the Befly search widget, allowing users to get quotes for flights, hotels, and packages directly through our partner's platform.
  * **📰 Headless Dynamic Blog:** Blog posts are not hard-coded. They are managed via a **Google Sheet** and dynamically loaded onto the site using the `fetch` API and `PapaParse.js`.
  * **🔍 Client-Side Search:** A search page (`search-page.html`) that filters all blog posts by title, category, or tags in real-time, with no backend required.
  * **📄 Dynamic Post Pages:** Individual article pages (`post-page/post.html`) are generated dynamically. The script retrieves the post title from the URL parameters, finds the corresponding content from the Google Sheet, and renders it.
  * **❤️ Related Posts:** At the end of each article, an algorithm suggests other posts based on common tags and categories.
  * **📱 Custom Components:** The site uses several custom JavaScript components, including a 100% custom-built carousel with touch and drag gesture support.
  * **📧 Functional Contact Form:** The "Fale Conosco" (Contact Us) modal is fully functional and uses the [formsubmit.co](https://formsubmit.co/) service to forward form messages directly to the agency's email, requiring no server-side code.
  * **🚀 Modern & Responsive Design:** Built with pure HTML5, modern CSS3 (Variables, Flexbox, Grid), and vanilla JavaScript for high performance and full responsiveness.

  ## 🛠️ Tech Stack

  * **Frontend:**
      * HTML5
      * CSS3 (with CSS Variables, Flexbox, Grid)
      * JavaScript (ES6+ with Modules)
  * **Libraries & Services:**
      * **PapaParse.js:** Used to parse the `.csv` export from Google Sheets into a usable JSON object.
      * **FormSubmit.co:** Backend service for the contact form.
      * **Befly (OnerTravel):** Travel search widget.
      * **Font Awesome:** For icons.
      * **Google Fonts:** For the "Montserrat" font family.
  * **Hosting:**
      * GitHub Pages

  ## 💡 How the Blog Works (Google Sheets as CMS)

  The blog's content management is handled intelligently, without needing a traditional database or CMS:

  1.  All post content (titles, text, images, tags, author, etc.) is stored in a **Google Sheet**.
  2.  The `src/assets/functions/getPosts.js` script fetches this public sheet in `.csv` format using the `fetch` API.
  3.  The `PapaParse` library converts the CSV text into a JSON object.
  4.  Posts are cached in the browser's `sessionStorage` to prevent redundant requests and speed up navigation.
  5.  Page scripts (`script.js`, `search-page.js`, `post.js`) use this JSON to render post lists, the search results, and individual post pages.

  ## 📜 License

  This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.

</details>

<br>

<details>
  <summary><strong>🇧🇷 Ver em Português (Clique para expandir)</strong></summary>
  
  # É pra viajar!
  ![Logo do É pra viajar](src/static/logo.png)

  Bem-vindo ao repositório oficial do site da agência de viagens **É pra viajar!**. Este projeto é hospedado diretamente no GitHub Pages e está disponível publicamente através do nosso domínio:

  ### ➡️ **[www.epraviajar.com.br](https://www.epraviajar.com.br)**

  O site serve como a principal plataforma de marketing e vendas da agência, oferecendo um portal para cotação de pacotes, passagens aéreas e um blog com dicas de viagem.

  Somos parceiros oficiais da **OnerTravel** ([https://onertravel.com](https://onertravel.com)), utilizando o widget de busca Befly para fornecer as melhores opções de viagem aos nossos clientes.

  ## ✨ Principais Funcionalidades

  Este não é um site estático comum. Ele foi construído com várias funcionalidades dinâmicas para ser rápido, moderno e fácil de gerenciar:

  * **✈️ Integração com OnerTravel:** O site integra o widget de busca Befly, permitindo que os usuários façam cotações de voos, hotéis e pacotes diretamente pela plataforma da nossa parceira.
  * **📰 Blog Dinâmico "Headless":** As postagens do blog não estão fixas no código. Elas são gerenciadas através de uma **Planilha Google** e carregadas dinamicamente no site via `fetch` API e `PapaParse.js`.
  * **🔍 Busca Client-Side:** Uma página de busca (`search-page.html`) que filtra todas as postagens do blog por título, categoria ou tags em tempo real, sem a necessidade de um backend.
  * **📄 Páginas de Post Dinâmicas:** As páginas de cada artigo (`post-page/post.html`) são geradas dinamicamente. O script busca o título do post nos parâmetros da URL, encontra o conteúdo correspondente na planilha e o renderiza.
  * **❤️ Posts Relacionados:** Ao final de cada artigo, um algoritmo sugere outras postagens com base em tags e categorias em comum.
  * **📱 Componentes Customizados:** O site utiliza vários componentes JavaScript customizados, incluindo um carrossel de slides 100% próprio com suporte a toque e gestos de arrastar.
  * **📧 Formulário de Contato:** O modal "Fale Conosco" é totalmente funcional e utiliza o serviço [formsubmit.co](https://formsubmit.co/) para encaminhar mensagens do formulário diretamente para o email da agência, sem a necessidade de um servidor.
  * **🚀 Design Moderno e Responsivo:** Construído com HTML5, CSS3 moderno (Variáveis, Flexbox, Grid) e JavaScript puro, garantindo alta performance e total responsividade.

  ## 🛠️ Tecnologias Utilizadas

  * **Frontend:**
      * HTML5
      * CSS3 (com Variáveis CSS, Flexbox, Grid)
      * JavaScript (ES6+ com Módulos)
  * **Bibliotecas e Serviços:**
      * **PapaParse.js:** Usado para converter o `.csv` exportado do Google Sheets em um objeto JSON fácil de usar.
      * **FormSubmit.co:** Serviço de backend para o formulário de contato.
      * **Befly (OnerTravel):** Widget de busca de viagens.
      * **Font Awesome:** Para ícones.
      * **Google Fonts:** Para a fonte "Montserrat".
  * **Hospedagem:**
      * GitHub Pages

  ## 💡 Como o Blog Funciona (Google Sheets como CMS)

  O gerenciamento de conteúdo do blog é feito de forma inteligente, sem a necessidade de um banco de dados ou CMS tradicional:

  1.  Todo o conteúdo dos posts (títulos, textos, imagens, tags, autor, etc.) é armazenado em uma **Planilha Google**.
  2.  O script `src/assets/functions/getPosts.js` busca essa planilha pública no formato `.csv` usando a `fetch` API.
  3.  A biblioteca `PapaParse` converte o texto CSV em um objeto JSON.
  4.  Os posts são cacheados no `sessionStorage` do navegador para evitar requisições desnecessárias e acelerar a navegação.
  5.  Os scripts das páginas (`script.js`, `search-page.js`, `post.js`) usam esse JSON para renderizar as listas de posts, a busca e as páginas de post individuais.

  ## 📜 Licença

  Este projeto é distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

</details>