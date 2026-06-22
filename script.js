// ── Слайдер ────────────────────────────────────────────────────
function initSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track  = slider.querySelector('.slider-track');
  const slides = slider.querySelectorAll('.slide');
  const dots   = slider.querySelectorAll('.dot');
  const prev   = slider.querySelector('.slider-prev');
  const next   = slider.querySelector('.slider-next');
  let current  = 0;
  let timer;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

  // Свайп на мобиле
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  });

  startAuto();
}

// ── Файловый загрузчик ─────────────────────────────────────────
let attachedFiles = [];

function initFileUpload() {
  const drop    = document.getElementById('fileDrop');
  const input   = document.getElementById('fileInput');
  const preview = document.getElementById('filePreview');
  if (!drop) return;

  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
  drop.addEventListener('drop', e => {
    e.preventDefault();
    drop.classList.remove('dragover');
    addFiles(Array.from(e.dataTransfer.files));
  });

  input.addEventListener('change', () => {
    addFiles(Array.from(input.files));
    input.value = '';
  });

  function addFiles(files) {
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" ist zu groß (max. 5 MB)`);
        return;
      }
      if (attachedFiles.find(f => f.name === file.name)) return;
      attachedFiles.push(file);
      renderThumb(file);
    });
  }

  function renderThumb(file) {
    const thumb = document.createElement('div');
    thumb.className = 'file-thumb';
    thumb.dataset.name = file.name;

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      thumb.appendChild(img);
    } else {
      const nm = document.createElement('div');
      nm.className = 'file-name';
      nm.textContent = file.name;
      thumb.appendChild(nm);
    }

    const rm = document.createElement('button');
    rm.className = 'file-remove';
    rm.type = 'button';
    rm.textContent = '×';
    rm.addEventListener('click', () => {
      attachedFiles = attachedFiles.filter(f => f.name !== file.name);
      thumb.remove();
    });
    thumb.appendChild(rm);
    preview.appendChild(thumb);
  }
}

// ── Мобильное меню ─────────────────────────────────────────────
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
}

// ── Обработчик формы (Formsubmit.co — бесплатно) ──────────────
async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');

  btn.textContent = 'Wird gesendet...';
  btn.disabled    = true;

  const data = new FormData(form);

  // Добавляем прикреплённые файлы
  attachedFiles.forEach((file, i) => {
    data.append(`attachment_${i + 1}`, file, file.name);
  });

  try {
    const res = await fetch('https://formsubmit.co/ajax/terzi.slavik@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    });

    const json = await res.json();

    if (json.success === 'true' || json.success === true) {
      btn.textContent      = '✓ Offerte wurde gesendet!';
      btn.style.background = 'linear-gradient(135deg,#1a9e4a,#25c95e)';
      btn.style.boxShadow  = '0 12px 28px rgba(37,201,94,.3)';
      form.reset();
      attachedFiles = [];
      document.getElementById('filePreview').innerHTML = '';
    } else {
      throw new Error('Formsubmit returned failure');
    }

  } catch (err) {
    console.error('Send error:', err);
    btn.textContent      = '✗ Fehler. Bitte erneut versuchen.';
    btn.style.background = 'linear-gradient(135deg,#c0392b,#e74c3c)';
    btn.disabled         = false;
  }
}

// ── Инициализация ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initSlider();
  initFileUpload();

  const menuBtn   = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => mobileNav.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!menuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }
});
