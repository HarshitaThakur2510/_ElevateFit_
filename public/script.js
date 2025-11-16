// script.js (Deluxe Cinematic - animations + polished UX)
// NOTE: This script is careful to NOT change navbar IDs/classes or session behavior.

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------
  // HAMBURGER MOBILE NAV
  // --------------------------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    hamburger.classList.toggle('open');
    animateHamburger();
  });

  function animateHamburger() {
    const spans = hamburger?.querySelectorAll('span');
    if (!spans) return;
    if (hamburger.classList.contains('open')) {
      spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  // Close mobile nav when a link clicked
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
        hamburger.classList.remove('open');
        animateHamburger();
      }
    });
  });

  // --------------------------
  // TESTIMONIAL SLIDER (original behavior + nicer transitions)
  // --------------------------
  const testimonials = [
    {
      name: "KRITIK THAKUR",
      photo: "images/success_stories_image1.jpg",
      text: "Training with ElevateFit transformed my fitness completely!"
    },
    {
      name: "ROHAN",
      photo: "images/success_stories_image2.jpg",
      text: "Best coaching experience ever. Helped me unlock real athletic power!"
    },
    {
      name: "GULZAR",
      photo: "images/success_stories_image3.jpg",
      text: "Perfect beginner guidance. I learned form, strength, and confidence."
    }
  ];

  let current = 0;
  const carousel = document.querySelector('.testimonial-carousel');
  const next = document.getElementById('nextBtn');
  const prev = document.getElementById('prevBtn');
  let autoplayTimer = null;

  function renderTestimonial(i) {
    const item = testimonials[i];
    if (!item || !carousel) return;

    // entrance animation class toggles
    carousel.innerHTML = `
      <div class="testimonial-slide enter">
        <img src="${item.photo}" alt="${item.name}">
        <div class="testimonial-content">
          <p>"${item.text}"</p>
          <span class="author">- ${item.name}</span>
        </div>
      </div>
    `;

    // allow styles to apply then animate in
    requestAnimationFrame(() => {
      const slide = carousel.querySelector('.testimonial-slide');
      slide.classList.remove('enter');
      slide.classList.add('active-anim');
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      current = (current + 1) % testimonials.length;
      renderTestimonial(current);
    }, 4500);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  next?.addEventListener('click', () => {
    current = (current + 1) % testimonials.length;
    renderTestimonial(current);
    startAutoplay();
  });

  prev?.addEventListener('click', () => {
    current = (current - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(current);
    startAutoplay();
  });

  renderTestimonial(current);
  startAutoplay();

  // Pause autoplay on hover for accessibility
  carousel?.addEventListener('mouseenter', stopAutoplay);
  carousel?.addEventListener('mouseleave', startAutoplay);

  // --------------------------
  // ON-SCREEN CARD ANIMATIONS (Intersection Observer)
  // --------------------------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card-animate').forEach(el => observer.observe(el));
  // also animate other important elements
  document.querySelectorAll('.plan-card, .blog-post, .testimonial-slide, .about-photo, .motivation-card').forEach(el => {
    if (!el.classList.contains('card-animate')) el.classList.add('card-animate');
    observer.observe(el);
  });

  // --------------------------
  // SMOOTH SCROLL for internal links
  // --------------------------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = this.getAttribute('href');
      if (!target || target === "#") return;
      const el = document.querySelector(target);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // --------------------------
  // CONTACT FORM (non-blocking stub)
  // --------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('c-success');
      const error = document.getElementById('c-error');
      success.textContent = 'Thanks — message sent (demo).';
      error.textContent = '';
      contactForm.reset();
      setTimeout(() => success.textContent = '', 3500);
    });
  }

  // --------------------------
  // Lightweight parallax effect on hero accent (subtle)
  // --------------------------
  const heroAccent = document.querySelector('.hero-accent');
  if (heroAccent) {
    window.addEventListener('mousemove', (ev) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (ev.clientX - cx) / cx;
      const dy = (ev.clientY - cy) / cy;
      heroAccent.style.transform = `translate(${dx * 20}px, ${dy * 18}px)`;
    }, { passive: true });
  }

});
