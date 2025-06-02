document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (password !== confirmPassword) {
            alert("Le password non corrispondono!");
            return;
        }

        // Controlla che non esista già in allUsers
        const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};
        if (allUsers[email]) {
            alert("Questo indirizzo e-mail è già registrato!");
            return;
        }

        // Crea oggetto utente
        const nuovoUtente = {
            id: Date.now(), // ID univoco (opzionale)
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

        // Salva in allUsers
        allUsers[email] = nuovoUtente;
        localStorage.setItem("allUsers", JSON.stringify(allUsers));

        // (Facoltativo) Salva anche in utentiRegistrati
        let utentiRegistrati = JSON.parse(localStorage.getItem("utentiRegistrati")) || [];
        utentiRegistrati.push({ email, password });
        localStorage.setItem("utentiRegistrati", JSON.stringify(utentiRegistrati));

        alert("Registrazione completata! Ora puoi accedere.");
        window.location.href = "account.html";
    });
});
