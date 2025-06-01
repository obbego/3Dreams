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


// Funzione per selezionare un'immagine casuale
function getRandomImage() {
    // Array di immagini presenti nella cartella
    const images = ["profile1.jpg", "profile2.jpg", "profile3.jpg", "profile4.jpg", "profile5.jpg"];
    const randomIndex = Math.floor(Math.random() * images.length);
    return `assets/img/${images[randomIndex]}`; // Presupponendo che le immagini siano nella cartella "assets"
}

// Imposta l'immagine del profilo al caricamento della pagina
document.addEventListener("DOMContentLoaded", function () {
    const profileImg = document.getElementById("profile-img");
    profileImg.src = getRandomImage();
});