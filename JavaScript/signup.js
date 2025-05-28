document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (password !== confirmPassword) {
            alert("Le password non corrispondono!");
            return;
        }

        // Recupero gli utenti registrati
        let utentiRegistrati = JSON.parse(localStorage.getItem("utentiRegistrati")) || [];

        // Controllo se l'email è già registrata
        const utenteEsistente = utentiRegistrati.find(user => user.email === email);
        if (utenteEsistente) {
            alert("Questo indirizzo e-mail è già registrato!");
            return;
        }

        // Aggiungo il nuovo utente
        utentiRegistrati.push({ email, password });
        localStorage.setItem("utentiRegistrati", JSON.stringify(utentiRegistrati));

        alert("Registrazione completata! Ora puoi accedere.");
        window.location.href = "account.html";
    });
});
