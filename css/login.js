document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    let utentiRegistrati = JSON.parse(localStorage.getItem("utentiRegistrati")) || [];

    const utente = utentiRegistrati.find(user => user.email === email && user.password === password);

    if (utente) {
        localStorage.setItem("user", JSON.stringify(utente));
        window.location.href = "HomePage.html";
    } else {
        alert("Credenziali errate! Riprova.");
    }
});
