document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reset-password-form");
    const messageDiv = document.getElementById("password-recovery-message");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        messageDiv.textContent = "";
        messageDiv.className = "alert mt-3 text-center"; // Pulisce tutte le classi e imposta quelle di base
        messageDiv.style.display = "none";
        
        const email = document.getElementById("email").value.trim().toLowerCase();
        const newPassword = document.getElementById("new-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (newPassword !== confirmPassword) {
            messageDiv.textContent = "Le password non corrispondono!";
            messageDiv.classList.add("alert-danger");
            messageDiv.style.display = "block";
            return;
        }

        const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};

        if (!allUsers[email]) {
            messageDiv.textContent = "Email non registrata!";
            messageDiv.classList.add("alert-danger");
            messageDiv.style.display = "block";
            return;
        }

        allUsers[email].password = newPassword;

        localStorage.setItem("allUsers", JSON.stringify(allUsers));
        messageDiv.textContent = "Recupero password completato con successo!";
        messageDiv.classList.add("alert-success");
        messageDiv.style.display = "block";

        // Reindirizza dopo 2 secondi
        setTimeout(() => {
            window.location.href = "account.html";
        }, 2000);
    });
});
