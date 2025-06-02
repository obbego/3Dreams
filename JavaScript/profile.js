// Eseguito al caricamento della pagina
document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "account.html"; // Se non autenticato, reindirizza
    } else {
        // Popola i campi con i dati dell'utente
        document.getElementById("user-id").textContent = user.id || "non disponibile";
        document.getElementById("display-name").value = user.name || "";
        document.getElementById("email-address").value = user.email || "";

        document.getElementById("first-name").value = user.firstName || "";
        document.getElementById("last-name").value = user.lastName || "";
        document.getElementById("address-line1").value = user.address1 || "";
        document.getElementById("address-line2").value = user.address2 || "";
        document.getElementById("city").value = user.city || "";
        document.getElementById("region").value = user.region || "";
        document.getElementById("postal-code").value = user.postalCode || "";
        document.getElementById("country").value = user.country || "";
    }
});

function mostraMessaggio(div, testo, tipo) {
    div.textContent = testo;
    div.className = "alert mt-3 text-center"; // reset
    div.classList.add(tipo === "successo" ? "alert-success" : "alert-danger");
    div.style.display = "block";
}

// Funzione per salvare le modifiche dell'utente
function salvaModifiche() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const messageDiv = document.getElementById('profile-message-salvamodifiche');

    // Aggiorna i campi
    user.firstName = document.getElementById("first-name").value;
    user.lastName = document.getElementById("last-name").value;
    user.address1 = document.getElementById("address-line1").value;
    user.address2 = document.getElementById("address-line2").value;
    user.city = document.getElementById("city").value;
    user.region = document.getElementById("region").value;
    user.postalCode = document.getElementById("postal-code").value;
    user.country = document.getElementById("country").value;

    // Salva nel localStorage 'user'
    localStorage.setItem("user", JSON.stringify(user));

    // Salva anche in allUsers[email]
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};
    allUsers[user.email] = user;
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    mostraMessaggio(messageDiv, "Modifiche salvate con successo!", "successo");
}

// Funzione per effettuare il logout
function logout() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email) {
        const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};
        allUsers[user.email] = user;
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
    }

    localStorage.removeItem("user");
    window.location.href = "account.html";
}

// File: profile.js
function cambiaPassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageDiv = document.getElementById('profile-message-password');

    const user = JSON.parse(localStorage.getItem("user"));
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};

    if (!user || !allUsers[user.email]) {
        mostraMessaggio(messageDiv, "Utente non trovato.", "errore");
        return;
    }

    // Controlla che la password corrente sia corretta
    if (user.password !== currentPassword) {
        mostraMessaggio(messageDiv, "La password corrente non è corretta.", "errore");
        return;
    }

    // Controlla che le nuove password coincidano
    if (newPassword !== confirmPassword) {
        mostraMessaggio(messageDiv, "Le nuove password non corrispondono.", "errore");
        return;
    }

    // Aggiorna la password nell'oggetto utente
    user.password = newPassword;
    allUsers[user.email] = user;

    // Salva nel localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    mostraMessaggio(messageDiv, "Password cambiata con successo!", "successo");
}