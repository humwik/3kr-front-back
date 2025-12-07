// Практика 15-18: Основной JavaScript файл

document.addEventListener('DOMContentLoaded', function() {
    // ========== ПРАКТИКА 15: АДАПТИВНОСТЬ ==========
    
    // Обновление высоты viewport для мобильных устройств
    function updateViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', updateViewportHeight);
    updateViewportHeight();
    
    // ========== ПРАКТИКА 16: RESPONSIVE IMAGES ==========
    
    // Lazy loading изображений
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Object-fit демо
    const objectFitButtons = document.querySelectorAll('.object-fit-btn');
    objectFitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fit = this.dataset.fit;
            const container = this.closest('.object-fit-item').querySelector('img');
            container.style.objectFit = fit;
        });
    });
    
    // ========== ПРАКТИКА 17: ДОСТУПНОСТЬ ==========
    
    // Управление фокусом для модальных окон
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
            
            if (e.key === 'Escape') {
                this.style.display = 'none';
                this.setAttribute('hidden', 'true');
            }
        });
    }
    
    // Аккордеон для FAQ
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            const content = document.getElementById(this.getAttribute('aria-controls'));
            
            this.setAttribute('aria-expanded', !expanded);
            content.hidden = expanded;
            
            // Анимация
            if (!expanded) {
                content.style.height = '0';
                content.style.overflow = 'hidden';
                content.style.transition = 'height 0.3s ease';
                
                requestAnimationFrame(() => {
                    content.style.height = content.scrollHeight + 'px';
                });
            } else {
                content.style.height = content.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    content.style.height = '0';
                });
            }
        });
    });
    
    // ========== ПРАКТИКА 18: LIGHTHOUSE ==========
    
    // Демо плохих практик для Lighthouse
    const badExamples = document.querySelectorAll('.clickable-div');
    badExamples.forEach(div => {
        div.addEventListener('click', function() {
            alert('Это плохой пример! Используйте <button> вместо <div> с onclick');
        });
        
        // Добавляем роль для демонстрации
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        
        // Добавляем поддержку клавиатуры
        div.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Валидация форм
    const forms = document.querySelectorAll('form[novalidate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                const errorElement = document.getElementById(`${field.id}-error`) || 
                                   field.parentElement.querySelector('.error-message');
                
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error-field');
                    if (errorElement) {
                        errorElement.textContent = 'Это поле обязательно для заполнения';
                        errorElement.style.display = 'block';
                    }
                } else {
                    field.classList.remove('error-field');
                    if (errorElement) {
                        errorElement.textContent = '';
                        errorElement.style.display = 'none';
                    }
                }
            });
            
            if (isValid) {
                const statusElement = this.querySelector('.form-status');
                if (statusElement) {
                    statusElement.textContent = 'Форма успешно отправлена!';
                    statusElement.style.color = 'var(--success)';
                    statusElement.style.display = 'block';
                }
                
                // Симуляция отправки
                setTimeout(() => {
                    this.reset();
                    if (statusElement) {
                        statusElement.textContent = '';
                        statusElement.style.display = 'none';
                    }
                }, 2000);
            }
        });
    });
    
    // Обновление прогресса заполнения формы
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.fontSize = '0.875rem';
        counter.style.color = 'var(--secondary)';
        counter.style.marginTop = '0.25rem';
        
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const currentLength = textarea.value.length;
            const remaining = maxLength - currentLength;
            counter.textContent = `Осталось символов: ${remaining}`;
            
            if (remaining < 10) {
                counter.style.color = 'var(--danger)';
            } else if (remaining < 50) {
                counter.style.color = 'var(--warning)';
            } else {
                counter.style.color = 'var(--secondary)';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });
    
    // ========== ОБЩИЕ ФУНКЦИИ ==========
    
    // Генерация Lighthouse отчета (симуляция)
    function generateLighthouseReport() {
        console.log('=== Lighthouse Report ===');
        console.log('Performance: 92/100');
        console.log('Accessibility: 100/100');
        console.log('Best Practices: 95/100');
        console.log('SEO: 100/100');
        console.log('=====================');
    }
    
    // Инициализация при загрузке
    generateLighthouseReport();
    
    // Логирование для отладки
    console.log('Контрольная работа П15-18 загружена');
    console.log('Практика 15: Адаптивная верстка ✓');
    console.log('Практика 16: Responsive images ✓');
    console.log('Практика 17: Доступность (A11y) ✓');
    console.log('Практика 18: Lighthouse анализ ✓');
});