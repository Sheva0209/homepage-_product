/* ========================================
   GOOGLESS — Interactive Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar Scroll Effect ---- 
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ---- Mobile Nav Toggle ---- 
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ---- Scroll Animations (Intersection Observer) ---- 
  const animatedElements = document.querySelectorAll('[data-animate]');

  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay));
        animateObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => animateObserver.observe(el));

  // ---- Animated Counter ---- 
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quad
          const eased = 1 - (1 - progress) * (1 - progress);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ---- Hero Particles ---- 
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
      particlesContainer.appendChild(particle);
    }
  }

  // ---- Testimonial Carousel ---- 
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsContainer = document.getElementById('testiDots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();

    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    const totalDots = Math.ceil(cards.length / cardsPerView);

    // Create dots
    function createDots() {
      dotsContainer.innerHTML = '';
      const dotCount = Math.max(1, cards.length - cardsPerView + 1);
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const gap = 24;
      const cardWidth = cards[0].offsetWidth + gap;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      // Update dots
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goToSlide(index) {
      const maxIndex = Math.max(0, cards.length - cardsPerView);
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateSlider();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Auto-play
    let autoPlay = setInterval(() => {
      const maxIndex = Math.max(0, cards.length - cardsPerView);
      if (currentIndex >= maxIndex) {
        goToSlide(0);
      } else {
        goToSlide(currentIndex + 1);
      }
    }, 5000);

    // Pause autoplay on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        if (currentIndex >= maxIndex) {
          goToSlide(0);
        } else {
          goToSlide(currentIndex + 1);
        }
      }, 5000);
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
      cardsPerView = getCardsPerView();
      createDots();
      goToSlide(0);
    });

    createDots();
    updateSlider();
  }

  // ---- Smooth Scroll for Anchor Links ---- 
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Newsletter Form ---- 
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('emailInput');
      const btn = newsletterForm.querySelector('button[type="submit"] span');
      const originalText = btn.textContent;

      btn.textContent = 'Subscribed! ✓';
      input.value = '';
      input.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        input.disabled = false;
      }, 3000);
    });
  }

  // ---- Parallax Effect on Scroll ---- 
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroImage = document.querySelector('.hero-image');
    if (heroImage && scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  });

  // ---- Active Nav Link Highlight ---- 
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(l => l.style.color = '');
        if (navLink) navLink.style.color = '#c9a84c';
      }
    });
  });

  // ---- Tilt Effect on Product Cards (Desktop) ---- 
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

});
