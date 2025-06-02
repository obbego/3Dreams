document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reset-password-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const newPassword = document.getElementById("new-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (newPassword !== confirmPassword) {
            alert("Le nuove password non corrispondono!");
            return;
        }

        const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};

        if (!allUsers[email]) {
            alert("Email non registrata.");
            return;
        }

        allUsers[email].password = newPassword;

        localStorage.setItem("allUsers", JSON.stringify(allUsers));
        alert("Password aggiornata con successo! Ora puoi accedere.");
        window.location.href = "account.html";
    });
});
