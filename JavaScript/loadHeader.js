document.addEventListener('DOMContentLoaded', () => {
    // Funzione per caricare l'header (navbar e promo banner)
    function loadHeader() {
        // HTML della Navbar
        const navbarHtml = `
            <div class="navbar-custom" id="navbar-custom">
                <div class="logo" id="logo">
                    <strong><a href="HomePage.html" class="text-white text-decoration-none" id="home-link">3Dreams</a></strong>
                    <small><a href="catalogo.html" class="text-white ms-2" id="catalogo-link">Catalogo</a></small>
                    <small><a href="creaLaTuaStampa.html" class="text-white ms-2" id="custom-print-link">Crea la Tua Stampa 3D</a></small>
                    <small><a href="aiuto.html" class="text-white ms-2" id="help-link">Aiuto</a></small>
                </div>

                <div class="navbar-right" id="navbar-right">
                    <input type="text" class="search-bar" placeholder="Cerca..." id="search-bar" />

                    <div class="icon-wrapper" id="cart-icon-wrapper">
                        <div class="icon-background" id="cart-icon-background"></div>
                        <a href="carrello.html" id="cart-link">
                            <img src="assets/icons/cart.svg" alt="Carrello" class="cart-icon" id="cart-icon" />
                            <span class="cart-count" id="cart-count">0</span>
                        </a>
                    </div>

                    <div class="icon-wrapper" id="account-icon-wrapper">
                        <div class="icon-background" id="account-icon-background"></div>
                        <a href="#" id="account-link">
                            <img src="assets/icons/person-circle.svg" alt="Account" class="account-icon" id="account-icon" />
                        </a>
                    </div>
                </div>
            </div>
        `;

        // HTML del Banner Promozionale
        const promoBannerHtml = `
            <div class="promo-banner text-white text-center py-2" id="promo-banner">
                Spedizione gratuita per ordini sopra i 100 €
            </div>
        `;

        // Crea un div temporaneo per contenere l'header
        const headerContainer = document.createElement('div');
        headerContainer.innerHTML = navbarHtml;

        // Verifica se dobbiamo mostrare il banner
        const hideBannerPages = ["account.html", "profile.html", "signup.html"];
        const currentPage = window.location.pathname.toLowerCase();

        if (!hideBannerPages.some(page => currentPage.includes(page))) {
            headerContainer.innerHTML += promoBannerHtml;
        }

        // Inserisce l'header all'inizio del body
        document.body.prepend(headerContainer);

        // Aggiorna il conteggio del carrello
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cartCountElement.textContent = cart.length;
        }

        // Verifica se l'utente è loggato
        const isLoggedIn = localStorage.getItem("user") !== null;

        // Cambia dinamicamente il link dell'icona profilo
        const accountLink = document.getElementById("account-link");
        if (accountLink) {
            accountLink.href = isLoggedIn ? "profile.html" : "account.html";
        }
    }

    // Chiama la funzione per caricare l'header
    loadHeader();
});