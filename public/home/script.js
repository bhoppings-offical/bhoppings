document.addEventListener("DOMContentLoaded", () => {
    const navbarElement = injectNavbar();
    navbarElement.addEventListener("click", (e) => {
        if (
            e.target.matches("#navbar .navbar-item") &&
            !e.target.querySelector(".navbar-dropdown")
        ) {
            const href = e.target.getAttribute("data-href");
            window.open(href, "_blank");
        };
    })
});