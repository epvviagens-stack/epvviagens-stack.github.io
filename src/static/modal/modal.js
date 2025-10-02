const SOURCEMAIL = '';
const TARGETMAIL = '';
const SECURETOKEN = '';

const openModal = document.getElementById("open-modal");
const closeModal = document.getElementById("close-modal");
const overlay = document.getElementById("modal-overlay");
const form = document.getElementById("contact-form");
const submitButton = form.querySelector("button[type='submit']");
const snackbar = document.getElementById("snackbar");

openModal.addEventListener("click", () => overlay.style.display = "flex");
closeModal.addEventListener("click", () => overlay.style.display = "none");
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.style.display = "none";
});

function showSnackbar(message, isSuccess = true) {
    snackbar.textContent = message;
    snackbar.className = "show";
    if (isSuccess) {
        snackbar.classList.add("success");
    } else {
        snackbar.classList.add("error");
    }
    setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Validação
    let valid = true;
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("error"));

    const name = document.getElementById("name");
    const contact = document.getElementById("contact");
    const target = document.getElementById("target");
    const date = document.getElementById("date");

    if (name.value.trim() === "") {
        document.getElementById("name-error").textContent = "Campo obrigatório";
        valid = false;
    }
    if (contact.value.trim() === "") {
        document.getElementById("contact-error").textContent = "Campo obrigatório";
        valid = false;
    }
    if (target.value.trim() === "") {
        document.getElementById("target-error").textContent = "Campo obrigatório";
        valid = false;
    }
    if (date.value === "") {
        document.getElementById("date-error").textContent = "Campo obrigatório";
        valid = false;
    }

    if (!valid) return;
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    const smtpBody = {
        SecureToken: SECURETOKEN,
        To: TARGETMAIL,
        From: SOURCEMAIL,
        Subject: "Novo contato - formulário de viagem",
        Body: `
            <b>Nome:</b> ${name.value}<br>
            <b>Celular:</b> ${contact.value}<br>
            <b>Destino:</b> ${target.value}<br>
            <b>Data:</b> ${date.value}
        `
    }

    Email.send(smtpBody)
        .then(message => {
            if (message === 'OK') {
                showSnackbar('Enviado com sucesso!', true);
                overlay.style.display = 'none';
                form.reset();
            } else {
                throw new Error(message);
            }
        })
        .catch(error => {
            console.error("Erro ao enviar e-mail:", error);
            showSnackbar('Erro ao enviar. Tente novamente.', false);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
});