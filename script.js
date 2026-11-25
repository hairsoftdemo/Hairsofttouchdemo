/* =========================================================
   HAIR SOFT — script.js
   ========================================================= */
'use strict';

/* =========================================================
   1. SERVICES & PRICES
   ----- Edit service names, descriptions and prices here -----
   ========================================================= */
const SERVICES = [
    {
        name: "Men's Haircut",
        desc: 'Precision cuts, fades and classic styles tailored to your face shape',
        price: 800,
        img: 'young-man-barbershop-trimming-hair_1303-26254.avif'
    },
    {
        name: "Women's Haircut",
        desc: 'Layered cuts, bobs, trims and complete restyles by expert hands.',
        price: 1200,
        img: 'images%20(2).jpg'
    },
    {
        name: 'Hair Coloring',
        desc: 'Full color, highlights, balayage and global coloring with premium dyes.',
        price: 5000,
        img: 'images%20(1).jpg'
    },
    {
        name: 'Hair Styling',
        desc: 'Blow-dry, curls, waves and elegant styling for any occasion.',
        price: 6000,
        img: 'images%20(3).jpg'
    },
    {
        name: 'Hair Straightening',
        desc: 'Smooth, silky, frizz-free hair with professional straightening.',
        price: 3000,
        img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=700&auto=format&fit=crop'
    },
    {
        name: 'Hair Rebonding',
        desc: 'Long-lasting rebonding for sleek, poker-straight glossy hair.',
        price: 6000,
        img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=700&auto=format&fit=crop'
    },
    {
        name: 'Hair Treatments',
        desc: 'Keratin, spa and deep-conditioning treatments for healthy hair.',
        price: 10000,
        img: 'images%20(4).jpg'
    },
    {
        name: 'Hair Washing',
        desc: 'Relaxing wash with premium shampoo, conditioning and head massage.',
        price: 5420,
        img: 'hair-4-1.jpg'
    },
    {
        name: 'Beard Trimming',
        desc: 'Sharp beard shaping, trimming and grooming for a refined look.',
        price: 500,
        img: 'Beard_hero1.webp'
    }
];

const CURRENCY = 'Rs.'; // change to '$', '€', etc. if needed

/* =========================================================
   2. RENDER SERVICE CARDS
   ========================================================= */
function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    grid.innerHTML = SERVICES.map(s => `
        <article class="service-card reveal">
            <div class="service-card-img">
                <img src="${s.img}" alt="${s.name}" loading="lazy">
            </div>
            <div class="service-card-body">
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
                <div class="service-price">
                    <span class="price">${CURRENCY}${s.price}</span>
                    <a href="#appointment" class="book-link" data-service="${s.name}">Book →</a>
                </div>
            </div>
        </article>
    `).join('');

    // Populate the booking form's service dropdown
    const serviceSelect = document.getElementById('serviceSelect');
    SERVICES.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.name;
        opt.textContent = `${s.name} — ${CURRENCY}${s.price}`;
        serviceSelect.appendChild(opt);
    });

    // Clicking "Book" on a card pre-selects that service
    grid.querySelectorAll('.book-link').forEach(link => {
        link.addEventListener('click', () => {
            serviceSelect.value = link.dataset.service;
            clearError(serviceSelect);
        });
    });

    observeReveals();
}

/* =========================================================
   3. NAVBAR — sticky style + mobile menu
   ========================================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
        });
    });
}

/* =========================================================
   4. ACTIVE NAV LINK ON SCROLL
   ========================================================= */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');

    const spy = () => {
        const pos = window.scrollY + 120;
        sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id));
            }
        });
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
}

/* =========================================================
   5. SCROLL REVEAL ANIMATION
   ========================================================= */
let revealObserver;
function observeReveals() {
    if (!revealObserver) {
        revealObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    revealObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
    }
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

/* =========================================================
   6. APPOINTMENT BOOKING
   ========================================================= */
function initBooking() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
   emailjs.init({
    publicKey: '879rW8HC3_ERfWrvK'
});

    // --- Prevent past dates: date input minimum = today ---
    const dateInput = document.getElementById('apptDate');
    const today = new Date();
    const pad = n => String(n).padStart(2, '0');
    dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    // Block manually-typed past dates as well
    dateInput.addEventListener('change', () => {
        if (dateInput.value && dateInput.value < dateInput.min) {
            showError(dateInput, 'Please choose today or a future date.');
        } else {
            clearError(dateInput);
        }
    });

    // --- Live validation: clear errors while typing ---
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => clearError(field));
        field.addEventListener('change', () => clearError(field));
    });

    // --- Submit & validate ---
    form.addEventListener('submit', async e => {
        e.preventDefault();
        let valid = true;

        const name = document.getElementById('custName');
        const phone = document.getElementById('custPhone');
        const email = document.getElementById('custEmail');
        const service = document.getElementById('serviceSelect');
        const stylist = document.getElementById('stylistSelect');
        const time = document.getElementById('apptTime');

        if (!name.value.trim() || name.value.trim().length < 2) {
            showError(name, 'Please enter your full name.'); valid = false;
        }
        if (!/^[+]?[\d\s\-()]{7,16}$/.test(phone.value.trim())) {
            showError(phone, 'Please enter a valid phone number.'); valid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address.'); valid = false;
        }
        if (!service.value) { showError(service, 'Please select a service.'); valid = false; }
        if (!stylist.value) { showError(stylist, 'Please select a stylist.'); valid = false; }
        if (!dateInput.value) {
            showError(dateInput, 'Please choose a date.'); valid = false;
        } else if (dateInput.value < dateInput.min) {
            showError(dateInput, 'Past dates are not allowed.'); valid = false;
        }
        if (!time.value) { showError(time, 'Please choose a time slot.'); valid = false; }

        if (!valid) {
            const firstInvalid = form.querySelector('.form-group.invalid input, .form-group.invalid select');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const details = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    email: email.value.trim(),
    service: service.value,
    stylist: stylist.value,
    date: dateInput.value,
    time: time.value,
    message: document.getElementById('custMsg').value.trim()
};

const bookingId = 'HS-' + Date.now().toString(36).toUpperCase().slice(-6);

try {
    await emailjs.send(
        'service_ajih5pf',
        'template_5pn9aq8',
        {
            booking_id: bookingId,
            customer_name: details.name,
            customer_phone: details.phone,
            customer_email: details.email,
            selected_service: details.service,
            selected_stylist: details.stylist,
            appointment_date: details.date,
            appointment_time: details.time,
            additional_message: details.message
        }
    );

    openConfirmation(details, bookingId);

} catch (error) {
    console.error('EmailJS Error:', error);
    alert('Booking notification failed. Please try again.');
    }
});
}

function showError(field, message) {
    const group = field.closest('.form-group');
    group.classList.add('invalid');
    group.querySelector('.error-msg').textContent = message;
}

function clearError(field) {
    const group = field.closest('.form-group');
    if (group) group.classList.remove('invalid');
}

/* =========================================================
   7. CONFIRMATION MODAL
   ========================================================= */
function openConfirmation(details, bookingId) {
    const overlay = document.getElementById('modalOverlay');
    const box = document.getElementById('modalDetails');
   
    const prettyDate = new Date(details.date + 'T00:00:00')
        .toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

    const row = (label, value) =>
        value ? `<div class="row"><span>${label}</span><span>${value}</span></div>` : '';

    box.innerHTML =
        `<div class="row booking-id"><span>Booking ID</span><span>${bookingId}</span></div>` +
        row('Name', details.name) +
        row('Phone', details.phone) +
        row('Email', details.email) +
        row('Service', details.service) +
        row('Stylist', details.stylist) +
        row('Date', prettyDate) +
        row('Time', details.time) +
        row('Message', details.message);

    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset form after a successful booking
    document.getElementById('bookingForm').reset();
}

function closeConfirmation() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function initModal() {
    document.getElementById('modalClose').addEventListener('click', closeConfirmation);
    document.getElementById('modalDone').addEventListener('click', closeConfirmation);
    document.getElementById('modalOverlay').addEventListener('click', e => {
        if (e.target.id === 'modalOverlay') closeConfirmation();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeConfirmation();
    });
}

/* =========================================================
   8. FOOTER YEAR
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    initNavbar();
    initScrollSpy();
    initBooking();
    initModal();
    observeReveals();
});
