document.addEventListener('DOMContentLoaded', () => {
  const menuNode = document.getElementById('main-menu');
  if(!menuNode) return;
  menuNode.innerHTML = `
    <ul class="menu">
      <li><a href="index.html">Home</a></li>
      <li class="dropdown">
        <a href="#" id="gallery-toggle">Gallery ▾</a>
        <div class="dropdown-menu hidden" id="gallery-submenu">
          <a href="gallery.html">Photos</a>
          <a href="gallery-full.html">Full gallery</a>
        </div>
      </li>
      <li><a href="tribute.html">Tribute</a></li>
      <li><a href="texts.html">Texts</a></li>
    </ul>
  `;
  const toggle = document.getElementById('gallery-toggle');
  const submenu = document.getElementById('gallery-submenu');
  toggle.addEventListener('click', (e)=>{
    e.preventDefault(); e.stopPropagation(); submenu.classList.toggle('hidden');
  });
  document.addEventListener('click', ()=> submenu.classList.add('hidden'));
  menuNode.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> submenu.classList.add('hidden')));
});
