document.addEventListener('DOMContentLoaded', () => {

    // Funzione GLOBALE per ottenere l'ID dell'utente corrente
    // Se l'utente è loggato, restituisce il suo ID. Altrimenti, restituisce un ID 'guest' di default.
    window.getCurrentUserId = function () {
        const user = JSON.parse(localStorage.getItem("user"));
        return user ? user.id : 'guest'; // Usa l'ID dell'utente o 'guest'
    };

    // Funzione GLOBALE per ottenere il carrello dell'utente corrente
    window.getUserCart = function () {
        const userId = getCurrentUserId();
        return JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    };

    // Funzione GLOBALE per salvare il carrello dell'utente corrente
    window.saveUserCart = function (cart) {
        const userId = getCurrentUserId();
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    };

    // Funzione GLOBALE per ottenere i preferiti dell'utente corrente
    window.getUserFavorites = function () {
        const userId = getCurrentUserId();
        return JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
    };

    // Funzione GLOBALE per salvare i preferiti dell'utente corrente
    window.saveUserFavorites = function (favorites) {
        const userId = getCurrentUserId();
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    };


    // Funzione per caricare l'header (navbar e promo banner)
    function loadHeader() {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        // HTML della Navbar - RIPRISTINATO ALLA VERSIONE ORIGINALE (senza email/logout)
        const navbarHtml = `
            <div class="navbar-custom" id="navbar-custom">
                <div class="logo" id="logo">
                    <strong><a href="HomePage.html" class="text-white text-decoration-none navbar-brand" id="home-link">3Dreams</a></strong>
                    <small><a href="catalogo.html" class="text-white ms-2 nav-link-small" id="catalogo-link">Catalogo</a></small>
                    <small><a href="creaLaTuaStampa.html" class="text-white ms-2 nav-link-small" id="custom-print-link">Crea la Tua Stampa 3D</a></small>
                    <small><a href="aiuto.html" class="text-white ms-2 nav-link-small" id="help-link">Aiuto</a></small>
                </div>

                <div class="navbar-right" id="navbar-right">
                    <input type="text" class="search-bar" placeholder="Cerca..." id="search-input-bar" />

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

        const headerContainer = document.createElement('div');
        headerContainer.innerHTML = navbarHtml;

        const hideBannerPages = ["account.html", "profile.html", "signup.html", "contact-preferences.html", "security.html", "eula-history.html"];
        const currentPagePath = window.location.pathname.toLowerCase();
        const currentPageFileName = currentPagePath.split('/').pop();

        if (!hideBannerPages.some(page => currentPagePath.includes(page))) {
            headerContainer.innerHTML += promoBannerHtml;
        }

        document.body.prepend(headerContainer);

        // --- LOGICA PER LA VISIBILITÀ DELLA SEARCH BAR ---
        const searchBar = document.getElementById('search-input-bar');
        if (searchBar) {
            if (currentPageFileName === 'catalogo.html') {
                searchBar.classList.add('visible-on-catalog');
            } else {
                searchBar.classList.remove('visible-on-catalog');
            }
        }

        // Aggiornato: Ora usa getUserCart()
        updateCartCount();

        // Verifica se l'utente è loggato e cambia dinamicamente il link dell'icona profilo
        const accountLink = document.getElementById("account-link");

        if (accountLink) {
            accountLink.href = currentUser ? "profile.html" : "account.html";
        }

        // Rimosso: logica per aggiungere dinamicamente email utente e bottone logout (su richiesta dell'utente)

        adjustMainContentPadding();
    }

    function adjustMainContentPadding() {
        const navbar = document.getElementById('navbar-custom');
        const promoBanner = document.getElementById('promo-banner');
        const mainContentWrapper = document.querySelector('.main-content-wrapper');

        let totalHeaderHeight = 0;

        if (navbar) {
            totalHeaderHeight += navbar.offsetHeight;
        }
        if (promoBanner) {
            totalHeaderHeight += promoBanner.offsetHeight;
        }

        if (mainContentWrapper) {
            mainContentWrapper.style.paddingTop = `${totalHeaderHeight}px`;
        }
    }

    // AGGIORNATO: updateCartCount ora è una funzione globale
    window.updateCartCount = function () {
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            const cart = getUserCart(); // Usa la nuova funzione globale
            cartCountElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
    };

    loadHeader();
    window.addEventListener('resize', adjustMainContentPadding);

    loadFooter(); // Carica il footer dopo l'header
    function loadFooter() {

        if (!window.location.pathname.endsWith("carrello.html")) {
            loadFooter();
        }

        function loadFooter() {
            const footerHtml = `
            <!-- Footer -->
            <footer class="bg-dark text-light pt-5">
                <div class="container">
                    <div class="row">
                        <!-- Shop -->
                        <div class="col-md-3 mb-4 text-start">
                            <h5><strong>Shop</strong></h5>
                            <ul class="list-unstyled">
                                <li><a href="catalogo.html?categoria=creature-adorabili" class="text-light">Creature Adorabili</a></li>
                                <li><a href="catalogo.html?categoria=dinosauri" class="text-light">Dinosauri</a></li>
                                <li><a href="catalogo.html?categoria=formula-1" class="text-light">Formula 1</a></li>
                            </ul>
                        </div>

                        <!-- About us -->
                        <div class="col-md-3 mb-4 text-start">
                            <h5><strong>About us</strong></h5>
                            <ul class="list-unstyled">
                                <li><a href="HomePage.html#chi-siamo" class="text-light">Chi siamo</a></li>
                            </ul>
                        </div>

                        <!-- Assistenza -->
                        <div class="col-md-3 mb-4 text-start">
                            <h5><strong>Assistenza</strong></h5>
                            <ul class="list-unstyled">
                                <li><a href="returns.html" class="text-light">Resi</a></li>
                                <li><a href="aiuto.html" class="text-light">FAQ</a></li>
                                <li><a href="warranty.html" class="text-light">Garanzia</a></li>
                            </ul>
                        </div>

                        <!-- Area legale -->
                        <div class="col-md-3 mb-4 text-start">
                            <h5><strong>Area legale</strong></h5>
                            <ul class="list-unstyled">
                                <li><a href="cookie-policy.html" class="text-light">Cookie policy</a></li>
                                <li><a href="privacy-policy.html" class="text-light">Privacy policy</a></li>
                                <li><a href="terms-and-conditions.html" class="text-light">Termini e condizioni</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="text-center py-3">
                        <small>© 2025 3Dreams S.r.l. - Tutti i diritti riservati.</small>
                    </div>
                </div>
            </footer>
        `;

            // Inserisci il footer alla fine del body
            document.body.insertAdjacentHTML('beforeend', footerHtml);
        }
    }
});
