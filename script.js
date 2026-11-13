/**
 * RAMPAGE CYBER CLUB — Interactive Script
 * Issyk, Kazakhstan
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // 3. Highlight Active Navigation on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });

  // 4. Pricing Tabs Switcher (Общий зал / VIP зал)
  const tabButtons = document.querySelectorAll('.price-tab-btn');
  const tabContents = document.querySelectorAll('.pricing-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  // 5. Booking Modal Logic
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModal');
  const openModalButtons = document.querySelectorAll('.open-booking-btn');
  const zoneSelect = document.getElementById('zoneSelect');
  const bookingForm = document.getElementById('bookingForm');
  const bookingDateInput = document.getElementById('bookingDate');
  const bookingTimeInput = document.getElementById('bookingTime');
  const toast = document.getElementById('toast');

  // Pre-fill today's date & default next hour
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  if (bookingDateInput) {
    bookingDateInput.value = todayStr;
    bookingDateInput.min = todayStr;
  }

  const hours = String((now.getHours() + 1) % 24).padStart(2, '0');
  if (bookingTimeInput) {
    bookingTimeInput.value = `${hours}:00`;
  }

  // Open Modal function
  const openModal = (zoneName = '') => {
    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Match select value if matched
      if (zoneName && zoneSelect) {
        for (let i = 0; i < zoneSelect.options.length; i++) {
          if (zoneSelect.options[i].text.toLowerCase().includes(zoneName.toLowerCase())) {
            zoneSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  };

  // Close Modal function
  const closeModal = () => {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const zoneName = btn.getAttribute('data-zone') || '';
      openModal(zoneName);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close on outside click
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
      closeModal();
    }
  });

  // 6. Booking Form Submission (WhatsApp Dispatch + Toast notification)
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const zone = document.getElementById('zoneSelect').value;
      const pcs = document.getElementById('pcCount').value;
      const date = document.getElementById('bookingDate').value;
      const time = document.getElementById('bookingTime').value;
      const notes = document.getElementById('clientNotes').value.trim();

      // Format WhatsApp message
      const textMessage = 
        `🔥 *Новая бронь в Rampage Cyber Club (Иссык)*\n\n` +
        `👤 *Имя:* ${name}\n` +
        `📞 *Телефон:* ${phone}\n` +
        `🎮 *Зона:* ${zone}\n` +
        `🖥️ *Количество ПК:* ${pcs}\n` +
        `📅 *Дата:* ${date}\n` +
        `⏰ *Время:* ${time}\n` +
        (notes ? `💬 *Пожелания:* ${notes}\n` : '') +
        `\n_Отправлено с сайта rampage-club.kz_`;

      const encodedText = encodeURIComponent(textMessage);
      // Club contact phone (default WhatsApp redirect placeholder)
      const whatsappUrl = `https://wa.me/77000000000?text=${encodedText}`;

      // Show toast
      showToast(`Спасибо, ${name}! Открываем WhatsApp для подтверждения...`);

      // Close modal
      closeModal();

      // Redirect to WhatsApp after 800ms
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);

      bookingForm.reset();
    });
  }

  // Toast Function
  function showToast(message) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-message');
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);
  }

  // 7. Interactive Hover Sounds / Micro-Interactions (Optional visual delight)
  const interactiveCards = document.querySelectorAll('.feature-card, .zone-card, .price-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.25s ease';
    });
  });

  console.log('RAMPAGE Cyber Club Website Loaded Successfully! Welcome, gamers.');
});
