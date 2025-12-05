// Animation ailes
const enterBtn = document.getElementById("enterBtn");
const wings = document.querySelectorAll(".wing");
const portfolio = document.getElementById("portfolio");
const entryContainer = document.getElementById("entryContainer");

enterBtn.onclick = () => {
    wings[0].style.transform = "translateX(-120%)";
    wings[1].style.transform = "translateX(120%)";

    setTimeout(() => {
        entryContainer.style.display = "none";
        portfolio.classList.remove("hidden");
    }, 1500);
};

// Menu
const floatingMenu = document.getElementById("floatingMenu");
const sideMenu = document.getElementById("sideMenu");

floatingMenu.onclick = () => {
    sideMenu.classList.toggle("open");
};

// Plein écran images
document.querySelectorAll(".portfolio-item").forEach(img => {
    img.onclick = () => {
        const full = document.createElement("div");
        full.className = "fullscreen";
        full.innerHTML = `<img src="${img.src}" class="big">`;

        full.onclick = () => full.remove();
        document.body.appendChild(full);
    };
});

// Blocages sécurité
document.addEventListener("contextmenu", event => event.preventDefault());
document.addEventListener("keydown", e => {
    if (["PrintScreen", "F12", "Ctrl+S", "Ctrl+U"].includes(e.key)) {
        e.preventDefault();
    }
});
