function mostraMessaggio(div, testo, tipo) {
    div.textContent = testo;
    div.className = "alert mt-3 text-center";
    div.classList.add(tipo === "successo" ? "alert-success" : "alert-danger");
    div.style.display = "block";
}

function salvaPreferenze() {
    const messageDiv = document.getElementById('profile-message-preferences');

    const user = JSON.parse(localStorage.getItem("user"));
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};

    if (!user || !user.email || !allUsers[user.email]) {
        mostraMessaggio(messageDiv, "Utente non trovato.", "errore");
        return;
    }

    // Salva le preferenze
    user.contactPreferences = {
        emailUpdates: document.getElementById("email-updates").checked,
        smsAlerts: document.getElementById("sms-alerts").checked,
        promoEmails: document.getElementById("promo-emails").checked,
    };

    // Aggiorna dati
    allUsers[user.email] = user;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    mostraMessaggio(messageDiv, "Preferenze salvate con successo!", "successo");
}

// Caricamento preferenze quando si entra nella pagina
document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.contactPreferences) return;

    document.getElementById("email-updates").checked = user.contactPreferences.emailUpdates || false;
    document.getElementById("sms-alerts").checked = user.contactPreferences.smsAlerts || false;
    document.getElementById("promo-emails").checked = user.contactPreferences.promoEmails || false;
});