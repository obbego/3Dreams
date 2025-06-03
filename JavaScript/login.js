document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const errorMessage = document.getElementById("error-message");
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};

    const utente = allUsers[email];

    if (utente && utente.password === password) {
        localStorage.setItem("user", JSON.stringify(utente));
        window.location.href = "HomePage.html";
    } else {
        errorMessage.textContent = "Credenziali errate! Riprova.";
        errorMessage.style.display = "block";
    }
});
