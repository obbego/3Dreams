document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const messageDiv = document.getElementById("signup-message");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        // Nasconde eventuali messaggi precedenti
        messageDiv.style.display = "none";
        messageDiv.textContent = "";
        messageDiv.className = "alert mt-3 text-center";

        if (password !== confirmPassword) {
            messageDiv.textContent = "Le password non corrispondono!";
            messageDiv.classList.add("alert-danger");
            messageDiv.style.display = "block";
            return;
        }

        const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};
        if (allUsers[email]) {
            messageDiv.textContent = "Questo indirizzo e-mail è già registrato!";
            messageDiv.classList.add("alert-warning");
            messageDiv.style.display = "block";
            return;
        }

        const nuovoUtente = {
            id: Date.now(),
            email,
            password,
            name: "",
            firstName: "",
            lastName: "",
            address1: "",
            address2: "",
            city: "",
            region: "",
            postalCode: "",
            country: ""
        };

        allUsers[email] = nuovoUtente;
        localStorage.setItem("allUsers", JSON.stringify(allUsers));

        let utentiRegistrati = JSON.parse(localStorage.getItem("utentiRegistrati")) || [];
        utentiRegistrati.push({ email, password });
        localStorage.setItem("utentiRegistrati", JSON.stringify(utentiRegistrati));

        messageDiv.textContent = "Registrazione completata! Ora puoi accedere.";
        messageDiv.classList.add("alert-success");
        messageDiv.style.display = "block";

        // Reindirizza dopo 2 secondi
        setTimeout(() => {
            window.location.href = "account.html";
        }, 2000);
    });
});