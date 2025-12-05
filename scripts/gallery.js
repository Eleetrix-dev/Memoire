document.querySelectorAll('.gallery-grid img').forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    overlay.innerHTML = `<img src="${img.src}" class="big" alt="">`;
    overlay.addEventListener('click', ()=> overlay.remove());
    document.body.appendChild(overlay);
    requestAnimationFrame(()=> overlay.classList.add('show'));
  });
});
