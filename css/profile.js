document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "account.html"; // Se non autenticato, reindirizza alla login
    } else {
        document.getElementById("user-email").textContent = user.email;
        document.getElementById("user-name").textContent = user.name;
    }
});

function logout() {
    localStorage.removeItem("user");
    window.location.href = "account.html"; // Torna alla pagina di login
}
