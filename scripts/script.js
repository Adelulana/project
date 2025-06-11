'use strict'

/**
 * @file main.js
 * @description Основной скрипт для инициализации интерактивных элементов на веб-странице,
 * включая прелоадер, анимацию чисел, управление модальными окнами,
 * карусели, формы с LocalStorage и другие динамические компоненты.
 */

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ДОКУМЕНТА ===
// Алгоритм:
// 1. Ожидает, пока весь HTML-документ будет полностью загружен и разобран браузером.
// 2. Как только DOM готов, выполняет переданную функцию.
// 3. Выводит сообщение в консоль, подтверждая успешный запуск скрипта.
document.addEventListener("DOMContentLoaded", () => {
    console.log('Скрипт отработал корректно');

    // Инициализация компонентов, которые должны работать после полной загрузки DOM
    initReviewsCarousel(); // Инициализация карусели отзывов
    new FormHandler('loginForm', 'loginFormData'); // Инициализация FormHandler для формы входа
    new FormHandler('contactForm', 'contactFormData'); // Инициализация FormHandler для контактной формы
    new FormHandler('courseForm', 'courseFormData'); // Инициализация FormHandler для формы покупки курса
    // renderFeaturesBlock(); // Закомментируем предыдущий вызов, если он относится к другому блоку
    renderStellarFeaturesBlock(); // <<< НОВЫЙ ВЫЗОВ: Инициализация динамического блока "Преимущества платформы"
});


// === ПРЕЛОАДЕР ===
const preloader = document.getElementById('preloader');
// Алгоритм:
// 1. Блокирует прокрутку страницы, пока отображается прелоадер.
document.body.style.overflow = 'hidden';

// Алгоритм:
// 1. Запускает таймер на 3000 миллисекунд (3 секунды).
// 2. По истечении таймера:
//    а. Проверяет, существует ли элемент прелоадера.
//    б. Если да, добавляет CSS-класс 'fade-out' для запуска анимации исчезновения.
//    в. Восстанавливает нормальную прокрутку страницы.
//    г. Запускает второй таймер на 500 миллисекунд (длительность анимации исчезновения).
//    д. По истечении второго таймера:
//       i. Полностью скрывает прелоадер, устанавливая его 'display' в 'none'.
//       ii. Инициализирует библиотеку AOS (Animate On Scroll) с заданными параметрами.
setTimeout(() => {
  if (preloader) {
    preloader.classList.add('fade-out');
    document.body.style.overflow = '';
    setTimeout(() => {
      preloader.style.display = 'none';
      // AOS после прелоадера
      AOS.init({
        duration: 1000, // Длительность анимации
        once: true // Анимация срабатывает только один раз
      });
    }, 500);
  }
}, 3000);

// === АНИМАЦИЯ ЧИСЕЛ ===
const stats = document.querySelectorAll('.stat-number');

/**
 * @function animateValue
 * @description Анимирует числовое значение элемента от начального до конечного.
 * @param {HTMLElement} element - Элемент, текстовое содержимое которого нужно анимировать.
 * @param {number} start - Начальное значение анимации.
 * @param {number} end - Конечное значение анимации.
 * @param {number} duration - Длительность анимации в миллисеметрах.
 * @returns {void}
 * @example animateValue(document.getElementById('myNumber'), 0, 100, 2000);
 *
 * Алгоритм:
 * 1. Инициализирует текущее значение 'current' как 'start'.
 * 2. Вычисляет диапазон значений ('range') и шаг инкремента ('increment').
 * 3. Определяет 'stepTime' - время, которое должно пройти между каждым шагом анимации.
 * 4. Запускает интервальный таймер.
 * 5. На каждом шаге таймера:
 *    а. Увеличивает 'current' на 'increment'.
 *    б. Обновляет текстовое содержимое 'element' значением 'current'.
 *    в. Если 'current' достигает 'end':
 *       i. Добавляет '+' к конечному значению и устанавливает его как текст 'element'.
 *       ii. Очищает (останавливает) интервальный таймер.
 */
const animateValue = (element, start, end, duration) => {
  let current = start;
  const range = end - start;
  const increment = end > start ? 1 : -1; // Определяем направление инкремента
  const stepTime = Math.abs(Math.floor(duration / range)); // Время на каждый шаг

  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;
    if (current === end) {
      element.textContent = current + '+'; // Добавляем '+' к конечному значению
      clearInterval(timer); // Останавливаем таймер
    }
  }, stepTime);
};

// Алгоритм:
// 1. Создает новый IntersectionObserver для отслеживания видимости элементов.
// 2. Определяет функцию обратного вызова, которая будет выполняться при изменении видимости элементов.
// 3. Внутри обратного вызова:
//    а. Перебирает все 'entries' (записи об изменении видимости) с помощью forEach.
//    б. Для каждой 'entry' проверяет, пересекается ли элемент с областью видимости ('isIntersecting').
//    в. Если элемент стал видимым:
//       i. Получает его целевое значение (из текущего текстового содержимого).
//       ii. Вызывает функцию 'animateValue' для запуска анимации.
//       iii. Отменяет наблюдение за этим элементом, чтобы анимация сработала только один раз.
const statsObserver = new IntersectionObserver((entries) => {
  // Используем forEach для более читабельной итерации по NodeList/массиву
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const finalValue = parseInt(entry.target.textContent); // Получаем конечное значение из текста
      animateValue(entry.target, 0, finalValue, 2000); // Запускаем анимацию от 0 до finalValue за 2 секунды
      statsObserver.unobserve(entry.target); // Прекращаем наблюдение за элементом
    }
  });
});

// Алгоритм:
// 1. Перебирает все элементы с классом '.stat-number' с помощью forEach.
// 2. Для каждого элемента запускает наблюдение с помощью 'statsObserver'.
stats.forEach(stat => {
  statsObserver.observe(stat); // Начинаем наблюдение за каждым элементом статистики
});

// === ИНИЦИАЛИЗАЦИЯ СКРОЛЛ-ШАПКИ ===
// Алгоритм:
// 1. Добавляет обработчик события 'scroll' к объекту 'window'.
// 2. При каждом событии прокрутки:
//    а. Проверяет, превышает ли вертикальная позиция прокрутки 100 пикселей.
//    б. Переключает (добавляет/удаляет) CSS-класс 'scrolled' на элементе с классом '.header'
//       в зависимости от условия прокрутки.
window.addEventListener('scroll', () => {
  document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 100);
});

// === МОДАЛЬНЫЕ ОКНА ===
// Объект для хранения ссылок на все модальные окна по их ID.
const modals = {
  login: document.getElementById('loginModal'),
  course: document.getElementById('courseBuyModal'),
  purchase: document.getElementById('purchaseModal'),
  contact: document.getElementById('contactModal'),
};

// Алгоритм:
// 1. Добавляет обработчик события 'click' к кнопке с классом '.login-btn'.
// 2. При клике на эту кнопку, добавляет CSS-класс 'active' к модальному окну входа ('loginModal'), делая его видимым.
document.querySelector('.login-btn').addEventListener('click', () => {
  modals.login.classList.add('active');
});

// Алгоритм:
// 1. Добавляет глобальный обработчик события 'click' к объекту 'window'.
// 2. При каждом клике на странице:
//    а. Перебирает все зарегистрированные модальные окна (используя Object.values() для получения значений).
//    б. Для каждого модального окна проверяет, является ли цель клика (e.target) самим модальным окном (его фоном/оверлеем).
//    в. Если клик был по оверлею модального окна, удаляет CSS-класс 'active', тем самым скрывая его.
window.addEventListener('click', (e) => {
  Object.values(modals).forEach(modal => {
    // Проверяем, что modal не null (если какой-то элемент не был найден по ID)
    if (modal && e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

// === КНОПКА НАВЕРХ ===
const scrollBtn = document.getElementById('scrollTopBtn');
// Алгоритм:
// 1. Добавляет обработчик события 'scroll' к объекту 'window'.
// 2. При каждом событии прокрутки:
//    а. Проверяет, превышает ли вертикальная позиция прокрутки 300 пикселей.
//    б. Устанавливает стиль 'display' для кнопки 'scrollBtn':
//       i. 'block', если прокрутка больше 300px (показать кнопку).
//       ii. 'none', если прокрутка меньше или равна 300px (скрыть кнопку).
window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
// Алгоритм:
// 1. Добавляет обработчик события 'click' к кнопке 'scrollBtn'.
// 2. При клике на кнопку, плавно прокручивает страницу к самому верху (позиция 0,0).
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// === КАРУСЕЛЬ ОТЗЫВОВ ===
/**
 * @async
 * @function initReviewsCarousel
 * @description Асинхронно загружает данные отзывов из data.json, генерирует HTML для карусели и инициализирует Swiper.
 * @returns {Promise<void>}
 *
 * Алгоритм:
 * 1. Оборачивает код в блок try-catch для обработки ошибок при загрузке или инициализации.
 * 2. В блоке try:
 *    а. Выполняет асинхронный запрос к 'data.json' с помощью 'fetch'.
 *    б. Ожидает получения ответа и преобразует его в JSON.
 *    в. Инициализирует пустую строку 'reviewsHTML'.
 *    г. Перебирает массив отзывов, полученных из 'data.json', с помощью forEach.
 *    д. Для каждого отзыва генерирует HTML-разметку карточки отзыва и добавляет её в 'reviewsHTML'.
 *    е. Вставляет сгенерированный 'reviewsHTML' в DOM-элемент с классом '.swiper-wrapper'.
 *    ж. Инициализирует новый экземпляр Swiper с заданными параметрами:
 *       - 'slidesPerView': 1 (показывать по одному слайду)
 *       - 'spaceBetween': 30 (отступ между слайдами)
 *       - 'grabCursor': true (изменяет курсор на "руку")
 *       - 'centeredSlides': true (центрирует слайды)
 *       - 'speed': 600 (скорость перехода)
 *       - 'effect': 'fade' (плавный эффект перехода)
 *       - 'autoplay' (автоматическое переключение слайдов с задержкой, без остановки на интеракции, с паузой при наведении)
 *       - 'pagination' (включает точки пагинации)
 *       - 'navigation' (включает кнопки навигации)
 *    з. Выводит сообщение об успешной инициализации в консоль.
 * 3. В блоке catch:
 *    а. Перехватывает любые ошибки, произошедшие в блоке try.
 *    б. Выводит сообщение об ошибке в консоль.
 */
async function initReviewsCarousel() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    let reviewsHTML = '';
    // Изменено: Используем forEach для итерации по массиву data.reviews
    data.reviews.forEach(review => {
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
    });

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
/**
 * @class FormHandler
 * @description Управляет поведением формы, включая сохранение/загрузку данных из LocalStorage.
 */
class FormHandler {
  /**
   * @constructor
   * @param {string} formId - ID HTML-формы.
   * @param {string} storageKey - Ключ для хранения данных формы в LocalStorage.
   *
   * Алгоритм:
   * 1. Получает DOM-элемент формы по переданному 'formId'.
   * 2. Сохраняет 'storageKey' для использования в LocalStorage.
   * 3. Вызывает метод 'init()' для инициализации обработчиков формы.
   */
  constructor(formId, storageKey) {
    this.form = document.getElementById(formId);
    this.storageKey = storageKey;
    this.init();
  }

  /**
   * @method init
   * @description Инициализирует FormHandler: загружает данные, устанавливает обработчики событий.
   * @returns {void}
   *
   * Алгоритм:
   * 1. Проверяет, существует ли форма. Если нет, прекращает выполнение.
   * 2. Загружает ранее сохраненные данные формы из LocalStorage.
   * 3. Добавляет обработчик события 'input' к форме, чтобы при каждом изменении в поле
   *    автоматически сохранять данные (вызывая 'saveData()').
   * 4. Добавляет обработчик события 'submit' к форме:
   *    а. Предотвращает стандартное действие отправки формы браузером.
   *    б. Очищает сохраненные данные формы из LocalStorage и сбрасывает поля формы.
   *    в. Выводит всплывающее сообщение об успешной отправке.
   */
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

  /**
   * @method saveData
   * @description Сохраняет текущие данные формы в LocalStorage.
   * @returns {void}
   *
   * Алгоритм:
   * 1. Создает пустой объект 'formData'.
   * 2. Получает все поля ввода (input, textarea, select) внутри формы.
   * 3. Перебирает каждое поле с помощью forEach:
   *    а. Если поле имеет атрибут 'name' и не является полем для пароля или кнопкой отправки:
   *       i. Добавляет значение поля в 'formData' с использованием его 'name' как ключа.
   * 4. Преобразует объект 'formData' в строку JSON и сохраняет её в LocalStorage под 'storageKey'.
   */
  saveData() {
    const formData = {};
    const inputs = this.form.querySelectorAll('input, textarea, select');
    // Используем forEach для итерации по NodeList 'inputs'
    inputs.forEach(input => {
      // Исключаем поля паролей и кнопки отправки из сохранения
      if (input.name && input.type !== 'password' && input.type !== 'submit') {
        formData[input.name] = input.value;
      }
    });
    localStorage.setItem(this.storageKey, JSON.stringify(formData));
  }

  /**
   * @method loadSavedData
   * @description Загружает сохраненные данные из LocalStorage и заполняет ими поля формы.
   * @returns {void}
   *
   * Алгоритм:
   * 1. Пытается получить данные из LocalStorage по 'storageKey'.
   * 2. Если данные найдены:
   *    а. Парсит JSON-строку обратно в объект JavaScript.
   *    б. Перебирает все ключи в полученном объекте данных с помощью Object.keys().forEach().
   *    в. Для каждого ключа ищет соответствующее поле формы по атрибуту 'name'.
   *    г. Если поле найдено, устанавливает его значение равным загруженным данным.
   */
  loadSavedData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      // Используем Object.keys().forEach() для итерации по ключам объекта данных
      Object.keys(data).forEach(key => {
        const field = this.form.querySelector(`[name="${key}"]`);
        if (field) field.value = data[key];
      });
    }
  }

  /**
   * @method clearData
   * @description Удаляет данные формы из LocalStorage и сбрасывает форму.
   * @returns {void}
   *
   * Алгоритм:
   * 1. Удаляет данные из LocalStorage по 'storageKey'.
   * 2. Сбрасывает все поля формы к их начальным значениям.
   */
  clearData() {
    localStorage.removeItem(this.storageKey);
    this.form.reset();
  }
}

// === ОБРАБОТКА КНОПОК КУРСА ===
const courseButtons = document.querySelectorAll(".course-button");
const courseSelect = document.getElementById("courseSelect");
const courseModal = modals.course; // Получаем модальное окно курса из общего объекта modals

// Алгоритм:
// 1. Перебирает все кнопки с классом ".course-button" с помощью forEach.
// 2. Для каждой кнопки:
//    а. Добавляет обработчик события 'click'.
//    б. При клике:
//       i. Получает значение атрибута 'data-course' с кнопки.
//       ii. Открывает модальное окно покупки курса, добавляя ему класс 'active'.
//       iii. Перебирает все опции в выпадающем списке 'courseSelect' с помощью Array.from().forEach().
//       iv. Если значение опции совпадает с 'data-course', устанавливает эту опцию как выбранную ('selected').
courseButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const course = btn.getAttribute("data-course");
    courseModal.classList.add("active");

    // Используем Array.from().forEach() для итерации по HTMLOptionsCollection
    Array.from(courseSelect.options).forEach(opt => {
      if (opt.value === course) {
        opt.selected = true; // Устанавливаем выбранную опцию в списке курсов
      }
    });
  });
});

// Алгоритм:
// 1. Добавляет обработчик события 'click' к модальному окну покупки курса.
// 2. При клике, если цель клика имеет класс 'modal-overlay' (т.е. клик был по фону, а не по содержимому),
//    вызывает функцию 'closeCourseModal()' для закрытия модального окна.
document.getElementById("courseBuyModal").addEventListener("click", (e) => {
  if (e.target.classList.contains('modal-overlay')) closeCourseModal();
});

/**
 * @function closeCourseModal
 * @description Закрывает модальное окно покупки курса.
 * @returns {void}
 *
 * Алгоритм:
 * 1. Удаляет CSS-класс 'active' с элемента модального окна 'courseModal', тем самым скрывая его.
 */
function closeCourseModal() {
  courseModal.classList.remove("active");
}

/**
 * @function submitCourseForm
 * @description Обрабатывает отправку формы покупки курса.
 * @param {Event} event - Объект события отправки формы.
 * @returns {void}
 *
 * Алгоритм:
 * 1. Предотвращает стандартное действие отправки формы браузером.
 * 2. Получает ссылки на форму и значения полей (имя, email, курс, сообщение).
 * 3. Выполняет простую валидацию: проверяет, заполнены ли обязательные поля (имя, email, курс).
 * 4. Если какое-либо обязательное поле пусто, выводит предупреждающее сообщение и прекращает выполнение функции.
 * 5. Если все поля заполнены:
 *    а. Сбрасывает поля формы.
 *    б. Закрывает модальное окно покупки курса.
 *    в. Выводит всплывающее сообщение об успешной отправке заявки, включая название курса и имя пользователя.
 */
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

  form.reset(); // Сброс формы
  closeCourseModal(); // Закрываем модальное окно
  alert(`✅ Заявка на курс "${course}" отправлена! Спасибо, ${name}.`);
}


// === КОНТАКТНАЯ ФОРМА (УСПЕШНАЯ ОТПРАВКА) ===
const contactForm = document.querySelector('.contact-form form');
const contactModal = document.getElementById('contactModal');

// Алгоритм:
// 1. Проверяет, существуют ли элементы контактной формы и модального окна.
// 2. Если оба существуют, добавляет обработчик события 'submit' к контактной форме.
// 3. При отправке формы:
//    а. Предотвращает стандартное действие отправки формы браузером.
//    б. Сбрасывает все поля контактной формы.
//    в. Добавляет CSS-класс 'active' к модальному окну 'contactModal', делая его видимым.
//    г. Запускает таймер на 4000 миллисекунд (4 секунды).
//    д. По истечении таймера, удаляет CSS-класс 'active' с 'contactModal', автоматически скрывая его.
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

// Алгоритм:
// 1. Добавляет глобальный обработчик события 'click' к объекту 'window'.
// 2. При клике на странице:
//    а. Проверяет, совпадает ли цель клика (e.target) с модальным окном 'contactModal' (т.е., клик был по его фону/оверлею).
//    б. Если да, удаляет CSS-класс 'active' с 'contactModal', скрывая его.
window.addEventListener('click', function(e) {
  if (e.target === contactModal) {
    contactModal.classList.remove('active');
  }
});


// === НОВЫЙ БЛОК: ДИНАМИЧЕСКИЕ ПРЕИМУЩЕСТВА ПЛАТФОРМЫ ===

// 1. Формируем объект из элементов раздела
// Алгоритм:
// 1. Объявляет JavaScript-объект `stellarFeaturesData`, который содержит данные для каждого преимущества платформы.
// 2. Каждый ключ объекта (например, 'topTeachers', 'flexibility') является уникальным идентификатором.
// 3. Значением каждого ключа является другой объект, содержащий свойства:
//    - `iconClass`: CSS-класс для иконки (например, FontAwesome).
//    - `title`: Заголовок преимущества.
//    - `description`: Краткое описание преимущества.
//    - `aosDelay`: Значение задержки для атрибута `data-aos-delay` (необязательно, можно рассчитывать динамически).
const stellarFeaturesData = {
    topTeachers: {
        iconClass: "fas fa-user-astronaut",
        title: "Top-преподаватели",
        description: "Только практики с опытом 8+ лет и сияющими результатами учеников",
        aosDelay: 0
    },
    flexibility: {
        iconClass: "fas fa-infinity",
        title: "Гибкость обучения",
        description: "Онлайн-график под тебя: по будням или в 3 утра — без ограничений",
        aosDelay: 100
    },
    uniqueMethods: {
        iconClass: "fas fa-brain",
        title: "Уникальные методики",
        description: "Мы не повторяем — мы создаём авторские подходы под твою цель",
        aosDelay: 200
    }
};

/**
 * @function renderStellarFeaturesBlock
 * @description Динамически создает и вставляет HTML-блок с преимуществами платформы на основе объекта `stellarFeaturesData`.
 * @returns {void}
 *
 * Алгоритм:
 * 1. Получает DOM-элемент контейнера, в который будут вставлены карточки преимуществ, по его классу ('.stellar-features-grid').
 * 2. Если контейнер не найден, выводит сообщение об ошибке в консоль и прекращает выполнение.
 * 3. Инициализирует пустую строку `cardsHTML` для накопления всей HTML-разметки карточек.
 * 4. Использует цикл `for...in` для итерации по всем собственным ключам (свойствам) объекта `stellarFeaturesData`.
 * 5. Для каждого ключа:
 *    а. Проверяет, является ли свойство собственным свойством объекта (с помощью `hasOwnProperty`), чтобы избежать обработки унаследованных свойств.
 *    б. Если свойство является собственным, получает объект отдельного преимущества (`feature`).
 *    в. Генерирует полную HTML-разметку для одной карточки (`stellar-card`), используя данные из `feature`
 *       (класс иконки, заголовок, описание) и значение `aosDelay`.
 *    г. Добавляет сгенерированную HTML-разметку к `cardsHTML`.
 * 6. После завершения цикла, вставляет весь накопленный `cardsHTML` внутрь контейнера `stellar-features-grid`.
 * 7. Выводит сообщение об успешном динамическом формировании блока в консоль.
 */
function renderStellarFeaturesBlock() {
    const featuresContainer = document.querySelector('.stellar-features-grid');

    if (!featuresContainer) {
        console.error('❌ Контейнер .stellar-features-grid не найден. Динамический блок "Преимущества платформы" не будет отображен.');
        return;
    }

    let cardsHTML = '';
    // Используем for...in для итерации по свойствам объекта stellarFeaturesData
    for (let key in stellarFeaturesData) {
        // Обязательная проверка, чтобы не итерировать по свойствам прототипа
        if (stellarFeaturesData.hasOwnProperty(key)) {
            const feature = stellarFeaturesData[key];
            cardsHTML += `
                <div class="stellar-card" data-aos="zoom-in" data-aos-delay="${feature.aosDelay}">
                    <div class="stellar-glow"></div>
                    <div class="stellar-icon"><i class="${feature.iconClass}"></i></div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `;
        }
    }

    featuresContainer.innerHTML = cardsHTML;
    console.log("✅ Блок 'Преимущества платформы' динамически сформирован.");
}