document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically handle the form submission
            // For now, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Add active class to navigation links on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Add animation to program cards on scroll
    const programCards = document.querySelectorAll('.program-card');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    programCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Modal functionality
    const modal = document.getElementById('bookingModal');
    const openModalTopBtn = document.getElementById('openBookingTopModal');
    const openModalBottomBtn = document.getElementById('openBookingBottomModal');
    const closeModalBtn = document.querySelector('.close-modal');
    let calendarInstance;

    // Initialize calendar
    const initCalendar = (mode) => {
        if (calendarInstance) calendarInstance.destroy();

        // Get current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];

        calendarInstance = flatpickr("#calendar", {
            mode: mode,
            minDate: currentDate,
            maxDate: "2026-12-31",
            dateFormat: "Y-m-d",
            disable: [
                function(date) {
                    // Disable all days except Saturday (day 6)
                    return date.getDay() !== 6;
                }
            ],
            locale: {
                firstDayOfWeek: 1,
                weekdays: {
                    shorthand: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                    longhand: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
                },
                months: {
                    shorthand: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                    longhand: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
                }
            },
            onChange: function(selectedDates, dateStr) {
                const hiddenInput = document.getElementById('selectedDates');
                hiddenInput.value = mode === 'range'
                    ? dateStr
                    : selectedDates.map(d => d.toISOString().split('T')[0]).join(', ');
            }
        });
    };

    // Listen for mode changes
    document.querySelectorAll('input[name="mode"]').forEach((el) => {
        el.addEventListener('change', (e) => {
            initCalendar(e.target.value);
        });
    });

    // Open modal
    openModalTopBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Initialize calendar when modal opens
        initCalendar('multiple');
    });

    // Open modal
    openModalBottomBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Initialize calendar when modal opens
        initCalendar('multiple');
    });

    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Destroy calendar instance when modal closes
        if (calendarInstance) {
            calendarInstance.destroy();
        }
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Destroy calendar instance when modal closes
            if (calendarInstance) {
                calendarInstance.destroy();
            }
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Destroy calendar instance when modal closes
            if (calendarInstance) {
                calendarInstance.destroy();
            }
        }
    });
}); 