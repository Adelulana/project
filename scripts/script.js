// === ПРЕЛОАДЕР ===
const preloader = document.getElementById('preloader');
document.body.style.overflow = 'hidden';

setTimeout(() => {
  if (preloader) {
    preloader.classList.add('fade-out');
    document.body.style.overflow = '';
    setTimeout(() => {
      preloader.style.display = 'none';
      // AOS после прелоадера
      AOS.init({
        duration: 1000,
        once: true
      });
    }, 500);
  }
}, 3000);

// === АНИМАЦИЯ ЧИСЕЛ ===
const stats = document.querySelectorAll('.stat-number');

const animateValue = (element, start, end, duration) => {
  let current = start;
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;
    if (current === end) {
      element.textContent = current + '+';
      clearInterval(timer);
    }
  }, stepTime);
};

const statsObserver = new IntersectionObserver((entries) => {
  for (let i in entries) {
    if (entries.hasOwnProperty(i)) {
      const entry = entries[i];
      if (entry.isIntersecting) {
        const finalValue = parseInt(entry.target.textContent);
        animateValue(entry.target, 0, finalValue, 2000);
        statsObserver.unobserve(entry.target);
      }
    }
  }
});

for (let i in stats) {
  if (stats.hasOwnProperty(i) && stats[i] instanceof Element) {
    statsObserver.observe(stats[i]);
  }
}

// === ИНИЦИАЛИЗАЦИЯ СКРОЛЛ-ШАПКИ ===
window.addEventListener('scroll', () => {
  document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 100);
});

// === МОДАЛЬНЫЕ ОКНА ===
const modals = {
  login: document.getElementById('loginModal'),
  course: document.getElementById('courseBuyModal'),
  purchase: document.getElementById('purchaseModal'),
  contact: document.getElementById('contactModal'),
};

document.querySelector('.login-btn').addEventListener('click', () => {
  modals.login.classList.add('active');
});

window.addEventListener('click', (e) => {
  const keys = Object.keys(modals);
  for (let i in keys) {
    if (keys.hasOwnProperty(i)) {
      const modal = modals[keys[i]];
      if (e.target === modal) modal.classList.remove('active');
    }
  }
});

// === КНОПКА НАВЕРХ ===
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// === КАРУСЕЛЬ ОТЗЫВОВ ===
async function initReviewsCarousel() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    let reviewsHTML = '';
    for (let i in data.reviews) {
      if (data.reviews.hasOwnProperty(i)) {
        const review = data.reviews[i];
        reviewsHTML += `
          <div class="swiper-slide">
            <div class="review-card">
              <div class="review-content">
                <div class="review-rating">${'★'.repeat(5)}</div>
                <p class="review-text">${review.text}</p>
              </div>
              <div class="reviewer">
                <i class="${review.author.avatar}"></i>
                <div class="reviewer-info">
                  <h4>${review.author.name}</h4>
                  <p>${review.author.role}</p>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    }

    document.querySelector('.swiper-wrapper').innerHTML = reviewsHTML;

    new Swiper('.reviews-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      grabCursor: true,
      centeredSlides: true,
      speed: 600,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    console.log("✅ Карусель отзывов инициализирована");
  } catch (err) {
    console.error('❌ Ошибка загрузки отзывов:', err);
  }
}

// === CLASS: FormHandler (с LocalStorage) ===
class FormHandler {
  constructor(formId, storageKey) {
    this.form = document.getElementById(formId);
    this.storageKey = storageKey;
    this.init();
  }

  init() {
    if (!this.form) return;
    this.loadSavedData();
    this.form.addEventListener('input', () => this.saveData());
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.clearData();
      alert("✅ Форма отправлена!");
    });
  }

  saveData() {
    const formData = {};
    const inputs = this.form.querySelectorAll('input, textarea, select');
    for (let i in inputs) {
      if (inputs.hasOwnProperty(i)) {
        const input = inputs[i];
        if (input.name && input.type !== 'password' && input.type !== 'submit') {
          formData[input.name] = input.value;
        }
      }
    }
    localStorage.setItem(this.storageKey, JSON.stringify(formData));
  }

  loadSavedData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const field = this.form.querySelector(`[name="${key}"]`);
          if (field) field.value = data[key];
        }
      }
    }
  }

  clearData() {
    localStorage.removeItem(this.storageKey);
    this.form.reset();
  }
}

// === ОБРАБОТКА КНОПОК КУРСА
const courseButtons = document.querySelectorAll(".course-button");
const courseSelect = document.getElementById("courseSelect");
const courseModal = modals.course;

for (let i in courseButtons) {
  if (courseButtons.hasOwnProperty(i) && courseButtons[i] instanceof Element) {
    const btn = courseButtons[i];
    btn.addEventListener("click", () => {
      const course = btn.getAttribute("data-course");
      courseModal.classList.add("active");

      for (let j in courseSelect.options) {
        if (courseSelect.options.hasOwnProperty(j)) {
          const opt = courseSelect.options[j];
          if (opt.value === course) {
            opt.selected = true;
          }
        }
      }
    });
  }
}

document.getElementById("courseBuyModal").addEventListener("click", (e) => {
  if (e.target.classList.contains('modal-overlay')) closeCourseModal();
});

function closeCourseModal() {
  courseModal.classList.remove("active");
}

function submitCourseForm(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.userName.value.trim();
  const email = form.userEmail.value.trim();
  const course = form.course.value;
  const message = form.message.value.trim();

  if (!name || !email || !course) {
    alert("⚠️ Заполните все обязательные поля");
    return;
  }

  form.reset();
  closeCourseModal();
  alert(`✅ Заявка на курс "${course}" отправлена! Спасибо, ${name}.`);
}

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', () => {
  initReviewsCarousel();
  new FormHandler('loginForm', 'loginFormData');
  new FormHandler('contactForm', 'contactFormData');
  new FormHandler('courseForm', 'courseFormData');
});

// === КОНТАКТНАЯ ФОРМА (УСПЕШНАЯ ОТПРАВКА) ===
const contactForm = document.querySelector('.contact-form form');
const contactModal = document.getElementById('contactModal');

if (contactForm && contactModal) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Очистка формы
    contactForm.reset();

    // Показываем сообщение об успехе
    contactModal.classList.add('active');

    // Авто-скрытие через 4 секунды
    setTimeout(() => {
      contactModal.classList.remove('active');
    }, 4000);
  });
}

window.addEventListener('click', function(e) {
  if (e.target === contactModal) {
    contactModal.classList.remove('active');
  }
});