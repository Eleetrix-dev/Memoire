document.addEventListener('DOMContentLoaded', async () => {
  async function load() {
    try {
      const res = await fetch('assets/config/gallery.json', {cache:'no-store'});
      if(!res.ok) throw new Error('gallery.json not found');
      const json = await res.json();
      const photos = Array.isArray(json.photos) ? json.photos : [];
      const videos = Array.isArray(json.videos) ? json.videos : [];
      const preview = document.getElementById('portfolio-grid');
      if(preview){
        preview.innerHTML = '';
        photos.slice(0,6).forEach(f => {
          const card = document.createElement('div'); card.className='card';
          const img = document.createElement('img'); img.src = `gallery/photos/${f}`; img.alt = f;
          img.addEventListener('click', ()=> openLightbox(img.src));
          card.appendChild(img);
          preview.appendChild(card);
        });
      }
      const photosNode = document.getElementById('gallery-photos');
      if(photosNode){
        photosNode.innerHTML = '';
        photos.forEach(f => {
          const card = document.createElement('div'); card.className='card';
          const img = document.createElement('img'); img.src = `gallery/photos/${f}`; img.alt=f;
          img.addEventListener('click', ()=> openLightbox(img.src));
          card.appendChild(img);
          photosNode.appendChild(card);
        });
      }
      const videosNode = document.getElementById('gallery-videos');
      if(videosNode){
        videosNode.innerHTML = '';
        videos.forEach(v => {
          const card = document.createElement('div'); card.className='card';
          const vid = document.createElement('video'); vid.src = `gallery/videos/${v}`; vid.controls=true;
          card.appendChild(vid);
          videosNode.appendChild(card);
        });
      }
    } catch (e) {
      console.warn('Gallery loader error', e);
    }
  }
  function openLightbox(src){
    const lb = document.createElement('div'); lb.className='lightbox';
    if(src.match(/\.(mp4|webm)$/i)){
      lb.innerHTML = `<video src="${src}" controls autoplay></video>`;
    } else {
      lb.innerHTML = `<img src="${src}" alt="preview">`;
    }
    lb.addEventListener('click', ()=> lb.remove());
    document.body.appendChild(lb);
  }
  await load();
});
