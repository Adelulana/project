В данной папке размещаем скриптовые файлы *.js


# Описание динамических блоков и элементов JavaScript

Этот документ описывает основные динамические блоки и интерактивные элементы, реализованные в файле `main.js` (или аналогичном) данного проекта.

---

### 1. Прелоадер (`#preloader`)

*   **Назначение:** Отображает экран загрузки перед полным рендерингом страницы, скрывает его по истечении времени.
*   **Динамика:**
    *   При загрузке страницы: Элементу `#preloader` присваивается стиль `overflow: hidden;` для `body`, чтобы предотвратить прокрутку во время загрузки.
    *   Через 3 секунды: Добавляется класс `fade-out` для плавной анимации исчезновения прелоадера.
    *   Через 0.5 секунды после `fade-out`: `display: none;` для `#preloader` и восстанавливается `overflow` для `body`.
    *   **Зависимости:** Инициализация библиотеки `AOS` (Animate On Scroll) происходит после скрытия прелоадера, чтобы анимации срабатывали корректно.

---

### 2. Анимация чисел (`.stat-number`)

*   **Назначение:** Анимирует числовые значения (например, в статистике) при их появлении в области видимости пользователя.
*   **Динамика:**
    *   Использует `IntersectionObserver` для отслеживания видимости элементов с классом `.stat-number`.
    *   Когда элемент становится видимым, его текстовое содержимое анимируется от 0 до конечного значения, указанного в самом элементе.
    *   После завершения анимации к числу добавляется символ `+` (например, `100+`).
    *   **Повторное срабатывание:** Анимация срабатывает один раз для каждого элемента.

---

### 3. Скролл-шапка (`.header`)

*   **Назначение:** Изменяет внешний вид шапки сайта при прокрутке страницы.
*   **Динамика:**
    *   При прокрутке страницы более чем на 100 пикселей: Элементу с классом `.header` добавляется класс `scrolled`.
    *   При возвращении прокрутки на позицию менее 100 пикселей: Класс `scrolled` удаляется.
    *   **Эффект:** Обычно класс `scrolled` используется в CSS для изменения фона, тени или размера шапки.

---

### 4. Модальные окна

*   **Назначение:** Управление отображением различных всплывающих модальных окон.
*   **Элементы:**
    *   `#loginModal`
    *   `#courseBuyModal`
    *   `#purchaseModal`
    *   `#contactModal`
    *   Кнопка открытия модального окна входа: `.login-btn`
*   **Динамика:**
    *   При клике на `.login-btn`: Модальное окно `#loginModal` получает класс `active`, делая его видимым.
    *   При клике в любом месте за пределами содержимого модального окна (на "оверлее"): Активное модальное окно закрывается (удаляется класс `active`).
    *   **Важно:** Для корректной работы модальные окна должны иметь стили, скрывающие их по умолчанию и отображающие при наличии класса `active`.

---

### 5. Кнопка "Наверх" (`#scrollTopBtn`)

*   **Назначение:** Позволяет пользователю быстро прокрутить страницу к началу.
*   **Динамика:**
    *   При прокрутке страницы более чем на 300 пикселей: Кнопка `#scrollTopBtn` становится видимой (`display: block`).
    *   При прокрутке менее 300 пикселей: Кнопка скрывается (`display: none`).
    *   При клике на `#scrollTopBtn`: Страница плавно прокручивается к самому верху (`top: 0`).

---

### 6. Карусель отзывов (`.reviews-slider`)

*   **Назначение:** Отображение отзывов пользователей в интерактивной карусели.
*   **Элементы:**
    *   Контейнер карусели: `.reviews-slider`
    *   Обертка для слайдов: `.swiper-wrapper`
    *   Навигация: `.swiper-pagination`, `.swiper-button-next`, `.swiper-button-prev`
*   **Динамика:**
    *   **Загрузка данных:** Отзывы динамически подгружаются из файла `data.json` при загрузке страницы.
    *   **Рендеринг:** Отзывы встраиваются в HTML-структуру `.swiper-wrapper`.
    *   **Инициализация Swiper:** После загрузки и рендеринга данных инициализируется библиотека Swiper с параметрами:
        *   `slidesPerView: 1`
        *   `spaceBetween: 30`
        *   `grabCursor: true`
        *   `centeredSlides: true`
        *   `speed: 600`
        *   `effect: 'fade'` (с плавным переходом)
        *   `autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }`
        *   `pagination: { el: '.swiper-pagination', clickable: true }`
        *   `navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }`
    *   **Зависимости:** Библиотека Swiper, файл `data.json`.

---

### 7. Обработчик форм (`FormHandler` Class)

*   **Назначение:** Универсальный класс для обработки форм, сохранения данных в `localStorage` и их очистки.
*   **Экземпляры в проекте:**
    *   Форма входа: `new FormHandler('loginForm', 'loginFormData')`
    *   Контактная форма: `new FormHandler('contactForm', 'contactFormData')`
    *   Форма покупки курса: `new FormHandler('courseForm', 'courseFormData')`
*   **Динамика:**
    *   **Сохранение данных:** При вводе данных в поля формы (кроме паролей), они автоматически сохраняются в `localStorage` по указанному ключу.
    *   **Загрузка данных:** При загрузке страницы, если в `localStorage` есть сохраненные данные для формы, они автоматически заполняются в соответствующие поля.
    *   **Отправка и очистка:** При успешной отправке формы (событие `submit`), данные из `localStorage` удаляются, и форма сбрасывается (`form.reset()`).
    *   **Зависимости:** `localStorage` API.

---

### 8. Обработка кнопок выбора курса (`.course-button`)

*   **Назначение:** Связывает кнопки выбора курса с модальным окном покупки курса, автоматически выбирая нужный курс.
*   **Элементы:**
    *   Кнопки выбора курса: `.course-button` (с атрибутом `data-course`)
    *   Модальное окно покупки курса: `#courseBuyModal`
    *   Выпадающий список выбора курса в модальном окне: `#courseSelect`
*   **Динамика:**
    *   При клике на `.course-button`:
        *   Открывается модальное окно `#courseBuyModal`.
        *   Значение атрибута `data-course` кнопки используется для автоматического выбора соответствующего `option` в выпадающем списке `#courseSelect`.
    *   **Отправка формы:** При отправке формы внутри `#courseBuyModal`:
        *   Выполняется простая валидация (проверка заполнения обязательных полей).
        *   Форма сбрасывается, модальное окно закрывается.
        *   Показывается всплывающее сообщение об успешной отправке заявки.

---

### 9. Контактная форма (сообщение об успехе)

*   **Назначение:** Отображение сообщения об успешной отправке контактной формы.
*   **Элементы:**
    *   Контактная форма: `.contact-form form`
    *   Модальное окно с сообщением об успехе: `#contactModal`
*   **Динамика:**
    *   При отправке формы `.contact-form form` (событие `submit`):
        *   Стандартное поведение отправки формы отменяется (`preventDefault()`).
        *   Форма сбрасывается (`form.reset()`).
        *   Модальное окно `#contactModal` получает класс `active` и отображается.
        *   Через 4 секунды класс `active` удаляется, и модальное окно автоматически скрывается.
    *   При клике на "оверлей" модального окна `#contactModal`: Модальное окно немедленно скрывается.

---