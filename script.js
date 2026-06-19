// ── EmailJS настройки ──────────────────────────────────────────
// 1. Зарегистрируйтесь на https://www.emailjs.com (бесплатно)
// 2. Создайте Email Service (Gmail, SMTP и др.) → скопируйте Service ID
// 3. Создайте Email Template → скопируйте Template ID
//    В теле шаблона используйте переменные: {{from_name}}, {{phone}},
//    {{reply_to}}, {{service_type}}, {{message}}
//    Укажите To Email: kundenservice@nexo-umzug.ch
// 4. Скопируйте Public Key из Account → API Keys
// 5. Вставьте значения ниже:

const EMAILJS_PUBLIC_KEY  = 'ВСТАВЬТЕ_PUBLIC_KEY';   // например: 'aBcDeFgHiJkLmNoP'
const EMAILJS_SERVICE_ID  = 'ВСТАВЬТЕ_SERVICE_ID';   // например: 'service_xxxxxxx'
const EMAILJS_TEMPLATE_ID = 'ВСТАВЬТЕ_TEMPLATE_ID';  // например: 'template_xxxxxxx'

// ── Инициализация ───────────────────────────────────────────────
emailjs.init(EMAILJS_PUBLIC_KEY);

// ── Обработчик формы ────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');

  btn.textContent = 'Отправляем...';
  btn.disabled    = true;

  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(() => {
      btn.textContent    = '✓ Заявка отправлена!';
      btn.style.background = 'linear-gradient(135deg, #6dbf6d, #90d890)';
      form.reset();
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      btn.textContent    = '✗ Ошибка. Попробуйте ещё раз';
      btn.style.background = 'linear-gradient(135deg, #bf6d6d, #d89090)';
      btn.disabled       = false;
    });
}
