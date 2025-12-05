document.querySelectorAll("img").forEach(img => {
    img.onclick = () => {
        const full = document.createElement("div");
        full.className = "fullscreen";
        full.innerHTML = `<img src="${img.src}" class="big">`;

        full.onclick = () => full.remove();
        document.body.appendChild(full);
    };
});
