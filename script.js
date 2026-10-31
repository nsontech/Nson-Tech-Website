const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-nav');
const navLinks = menu.querySelectorAll('a');
const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

const setHeaderState = () => {
  header.classList.toggle('scrolled', window.scrollY > 18);
};

const closeMenu = () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('menu-open', open);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;

  form.querySelectorAll('[required]').forEach((field) => {
    const fieldValid = field.checkValidity() && field.value.trim() !== '';
    field.closest('label').classList.toggle('invalid', !fieldValid);
    valid = valid && fieldValid;
  });

  if (!valid) {
    formStatus.textContent = 'Please check the highlighted fields.';
    form.querySelector('.invalid input, .invalid textarea')?.focus();
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(data.get('subject'));
  const body = encodeURIComponent(
    `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
  );

  formStatus.textContent = 'Opening your email application…';
  window.location.href = `mailto:nsontechinnovation@gmail.com?subject=${subject}&body=${body}`;
});

form.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('input', () => {
    if (field.checkValidity() && field.value.trim() !== '') {
      field.closest('label').classList.remove('invalid');
    }
  });
});
