const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
let tokenClient;
let gapiInited = false;
let gisInited = false;

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  document.getElementById("in-data").value =
    `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

  const configModal = document.getElementById("config-modal-overlay");
  const btnConfig = document.getElementById("btn-config");
  const closeConfig = document.getElementById("close-config-modal");
  const configForm = document.getElementById("config-form");

  btnConfig.addEventListener(
    "click",
    () => (configModal.style.display = "flex"),
  );
  closeConfig.addEventListener(
    "click",
    () => (configModal.style.display = "none"),
  );

  if (localStorage.getItem("epv_client_id"))
    document.getElementById("cfg-client-id").value =
      localStorage.getItem("epv_client_id");
  if (localStorage.getItem("epv_api_key"))
    document.getElementById("cfg-api-key").value =
      localStorage.getItem("epv_api_key");
  if (localStorage.getItem("epv_sheet_id"))
    document.getElementById("cfg-sheet-id").value =
      localStorage.getItem("epv_sheet_id");

  configForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem(
      "epv_client_id",
      document.getElementById("cfg-client-id").value,
    );
    localStorage.setItem(
      "epv_api_key",
      document.getElementById("cfg-api-key").value,
    );
    localStorage.setItem(
      "epv_sheet_id",
      document.getElementById("cfg-sheet-id").value,
    );
    configModal.style.display = "none";
    showSnackbar("Configurações salvas!", true);
    initGoogleAPI();
  });

  function initGoogleAPI() {
    const apiKey = localStorage.getItem("epv_api_key");
    const clientId = localStorage.getItem("epv_client_id");

    if (!apiKey || !clientId) return;

    gapi.load("client", async () => {
      await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
    });

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: "",
    });
    gisInited = true;
  }

  initGoogleAPI();

  const inputs = document.querySelectorAll(
    '.creator-form input[type="text"], .creator-form textarea',
  );
  inputs.forEach((input) => {
    input.addEventListener("input", updatePreview);
  });

  document.getElementById("in-data").addEventListener("input", updatePreview);

  function updatePreview() {
    const titulo =
      document.getElementById("in-titulo").value || "Título do Post";
    const subtitulo =
      document.getElementById("in-subtitulo").value || "Resumo do post...";
    const categoria =
      document.getElementById("in-categoria").value || "Categoria";
    const data = document.getElementById("in-data").value || "00/00/0000";
    const conteudo =
      document.getElementById("in-conteudo").value ||
      "O conteúdo do seu artigo aparecerá aqui.";
    const autor = document.getElementById("in-autor").value || "É pra Viajar";
    const botao = document.getElementById("in-botao").value || "Leia mais";
    const imgFinal =
      document.getElementById("in-imagem-final").value ||
      "/assets/images/fallback/post-image-fallback.jpeg";

    document.getElementById("out-card-titulo").textContent = titulo;
    document.getElementById("out-card-subtitulo").textContent =
      subtitulo.slice(0, 100) + (subtitulo.length > 100 ? "..." : "");
    document.getElementById("out-card-botao").textContent = botao;
    document.getElementById("out-card-img").src = imgFinal;

    document.getElementById("out-post-titulo").textContent = titulo;
    document.getElementById("out-post-categoria").textContent = categoria;
    document.getElementById("out-post-data").textContent = data;
    document.getElementById("out-post-autor").textContent = autor;
    document
      .getElementById("out-post-hero")
      .style.setProperty("--bg-image", `url('${imgFinal}')`);

    const formatConteudo = conteudo
      .split("\n")
      .map((p) => `<p>${p}</p>`)
      .join("");
    document.getElementById("out-post-conteudo").innerHTML = formatConteudo;
  }

  const urlInput = document.getElementById("in-imagem-url");
  const fileInput = document.getElementById("in-imagem-file");
  const imgFinalInput = document.getElementById("in-imagem-final");

  urlInput.addEventListener("input", () => {
    if (urlInput.value) {
      fileInput.value = "";
      imgFinalInput.value = urlInput.value;
      updatePreview();
    }
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    urlInput.value = "";

    const btnPublicar = document.getElementById("btn-publicar");
    btnPublicar.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Comprimindo Imagem...';
    btnPublicar.disabled = true;

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        let maxWidth = 800;
        let quality = 0.7;
        let dataUrl = "";
        const limiteCaracteres = 48000;

        function compressImage() {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, width, height);

          dataUrl = canvas.toDataURL("image/jpeg", quality);

          if (dataUrl.length > limiteCaracteres) {
            if (quality > 0.3) {
              quality -= 0.1;
              compressImage();
            } else if (maxWidth > 300) {
              maxWidth -= 100;
              compressImage();
            } else {
              showSnackbar(
                'Imagem muito pesada para a planilha. Por favor, use a opção de "Colocar Link" (URL).',
                false,
              );
              imgFinalInput.value = "";
              fileInput.value = "";
              btnPublicar.innerHTML =
                '<i class="fas fa-cloud-upload-alt"></i> Publicar no Google Sheets';
              btnPublicar.disabled = false;
            }
          } else {
            imgFinalInput.value = dataUrl;
            updatePreview();
            showSnackbar("Imagem pronta!", true);
            btnPublicar.innerHTML =
              '<i class="fas fa-cloud-upload-alt"></i> Publicar no Google Sheets';
            btnPublicar.disabled = false;
          }
        }
        compressImage();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".preview-content")
        .forEach((c) => c.classList.remove("active"));

      e.target.classList.add("active");
      document.getElementById(e.target.dataset.target).classList.add("active");
    });
  });

  document.getElementById("btn-publicar").addEventListener("click", () => {
    if (!gapiInited || !gisInited) {
      showSnackbar("Configure a API do Google primeiro.", false);
      configModal.style.display = "flex";
      return;
    }

    const values = [
      document.getElementById("in-titulo").value,
      document.getElementById("in-subtitulo").value,
      document.getElementById("in-imagem-final").value,
      document.getElementById("in-alt").value || "Imagem do Post",
      document.getElementById("in-data").value,
      document.getElementById("in-conteudo").value.replace(/\n/g, "\\n"), // Protege quebras de linha
      document.getElementById("in-botao").value,
      document.getElementById("in-tags").value,
      document.getElementById("in-categoria").value,
      document.getElementById("in-autor").value,
      document.getElementById("in-autor-numero").value,
    ];

    if (!values[0] || !values[4] || !values[7]) {
      showSnackbar("Preencha Título, Data e Conteúdo!", false);
      return;
    }

    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        showSnackbar("Erro de Autenticação!", false);
        throw resp;
      }

      document.getElementById("btn-publicar").innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Publicando...';

      try {
        const sheetId = localStorage.getItem("epv_sheet_id");
        await gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "posts!A:M",
          valueInputOption: "USER_ENTERED",
          resource: { values: [values] },
        });

        showSnackbar("Post publicado com sucesso!", true);
        document.getElementById("post-form").reset();
        document.getElementById("in-imagem-final").value = "";
        updatePreview();
      } catch (err) {
        showSnackbar("Erro ao publicar. Verifique o Console.", false);
        console.error(err);
      } finally {
        document.getElementById("btn-publicar").innerHTML =
          '<i class="fas fa-cloud-upload-alt"></i> Publicar no Google Sheets';
      }
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  });

  const snackbar = document.getElementById("snackbar");
  function showSnackbar(message, isSuccess = true) {
    snackbar.textContent = message;
    snackbar.className = "show";
    if (isSuccess) snackbar.classList.add("success");
    else snackbar.classList.add("error");
    setTimeout(
      () => (snackbar.className = snackbar.className.replace("show", "")),
      3000,
    );
  }
});
