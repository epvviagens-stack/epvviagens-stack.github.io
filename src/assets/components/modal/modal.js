document.addEventListener("DOMContentLoaded", () => {
    const TARGETMAIL = 'epv.viagens@gmail.com';

    const openModal = document.getElementById("open-modal");
    const closeModal = document.getElementById("close-modal");
    const overlay = document.getElementById("modal-overlay");
    const form = document.getElementById("contact-form");
    form.action = `https://formsubmit.co/${TARGETMAIL}`

    const submitButton = form.querySelector("button[type='submit']");
    const snackbar = document.getElementById("snackbar");

    openModal.addEventListener("click", () => overlay.style.display = "flex");
    closeModal.addEventListener("click", () => overlay.style.display = "none");
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.style.display = "none";
    });

    snackbar.addEventListener("click", () => {
        snackbar.classList.remove('show', 'success', 'error')
    })


    function showSnackbar(message, isSuccess = true) {
        snackbar.textContent = message;
        snackbar.className = "show";
        console.log("FeedbackService Message:", message)
        if (isSuccess) {
            snackbar.classList.add("success");
        } else {
            snackbar.classList.add("error");
        }
        setTimeout(() => {
            snackbar.classList.remove('show', 'success', 'error');
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

        const formData = new FormData(form);
        console.log(formData)
        fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showSnackbar('Enviado com sucesso!', true);
                    form.reset();
                    return;
                }
                throw new Error('Erro na resposta do servidor.')
            })
            .catch(error => {
                console.error("Erro ao enviar e-mail:", error || "defaultError");
                showSnackbar('Erro ao enviar. Tente novamente.', false);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
    });
});