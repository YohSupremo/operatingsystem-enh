/* ============================================
   WinTutorials - Main JavaScript
   Multi-page site with dropdown navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- DOM References ----
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileDropdown = document.getElementById('mobileDropdown');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const backToTop = document.getElementById('backToTop');

  // ---- Mobile Menu Toggle ----
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = mobileDropdown.classList.contains('open');
    hamburger.classList.toggle('active', !isOpen);
    mobileDropdown.classList.toggle('open', !isOpen);
    overlay.classList.toggle('active', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileDropdown.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close mobile menu when a direct link is clicked
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Also close when sub-menu links are clicked
  document.querySelectorAll('.mobile-sub-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ---- Mobile Sub-menu Accordion ----
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.mobile-has-dropdown');
      const isOpen = parent.classList.contains('open');

      // Close all other sub-menus
      document.querySelectorAll('.mobile-has-dropdown').forEach(item => {
        if (item !== parent) item.classList.remove('open');
      });

      // Toggle this one
      parent.classList.toggle('open', !isOpen);
    });
  });

  // ---- Desktop Dropdown: Click support (for touch devices) ----
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // On mobile/touch, prevent navigation and toggle dropdown
      if (window.innerWidth <= 1024 && 'ontouchstart' in window) {
        e.preventDefault();
        const parent = link.closest('.has-dropdown');
        const isOpen = parent.classList.contains('open');

        // Close all other dropdowns
        document.querySelectorAll('.has-dropdown').forEach(item => {
          if (item !== parent) item.classList.remove('open');
        });

        parent.classList.toggle('open', !isOpen);
      }
      // On desktop, allow normal navigation (href)
    });
  });

  // Close desktop dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown').forEach(item => {
        item.classList.remove('open');
      });
    }
  });

  // ---- Sticky Navbar Shadow on Scroll ----
  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Back to Top ----
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Theme Toggle ----
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'dark' ? '&#9788;' : '&#9790;';
      themeIcon.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ---- Intersection Observer for scroll animations ----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
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

  // Observe video cards, link cards, and about blocks for entrance animation
  const animatedElements = document.querySelectorAll('.video-card, .link-card, .featured-card, .about-block');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // ---- Keyboard accessibility: Escape to close menus ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDropdown && mobileDropdown.classList.contains('open')) {
        closeMenu();
      }
      document.querySelectorAll('.has-dropdown').forEach(item => {
        item.classList.remove('open');
      });
    }
  });

  // ---- Close mobile menu on resize past breakpoint ----
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  // Initial
  handleScroll();
});
