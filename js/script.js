/* ============================================
   WinTutorials - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- DOM References ----
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const mobileDropdown = document.getElementById('mobileDropdown');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const backToTop = document.getElementById('backToTop');
  const searchInput = document.getElementById('searchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const videoCards = document.querySelectorAll('.video-card');
  const collapseToggles = document.querySelectorAll('.collapse-toggle');

  // ---- Mobile Dropdown Menu ----
  // Create overlay element for mobile
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = mobileDropdown.classList.contains('open');
    hamburger.classList.toggle('active', !isOpen);
    mobileDropdown.classList.toggle('open', !isOpen);
    overlay.classList.toggle('active', !isOpen);
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileDropdown.classList.remove('open');
    overlay.classList.remove('active');
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close dropdown when a mobile nav link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close dropdown when a desktop nav link is clicked (no-op on desktop but safe)
  navLinkItems.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ---- Sticky Navbar Shadow on Scroll ----
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar shadow
    if (scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link based on scroll position
    updateActiveNavLink();

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Back to Top ----
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Active Nav Link on Scroll ----
  function updateActiveNavLink() {
    const sections = ['home', 'windows-os', 'windows-server', 'activities', 'about'];
    const scrollPos = window.scrollY + 120;

    let currentSection = 'home';

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section && section.offsetTop <= scrollPos) {
        currentSection = sectionId;
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });

    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
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
    themeIcon.innerHTML = theme === 'dark' ? '&#9788;' : '&#9790;';
    themeIcon.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ---- Search & Filter ----
  let currentFilter = 'all';

  function filterAndSearch() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    videoCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.getAttribute('data-title').toLowerCase();

      const matchesFilter = currentFilter === 'all' || category === currentFilter;
      const matchesSearch = !query || title.includes(query);

      if (matchesFilter && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Show/hide sections based on filter
    const sections = {
      'windows-os': document.getElementById('windows-os'),
      'windows-server': document.getElementById('windows-server'),
      'activities': document.getElementById('activities')
    };

    Object.keys(sections).forEach(key => {
      const section = sections[key];
      if (!section) return;

      if (currentFilter !== 'all' && currentFilter !== key) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
      }
    });

    // Handle no results message across all visible grids
    document.querySelectorAll('.no-results').forEach(el => el.remove());

    if (query && visibleCount === 0) {
      const grids = document.querySelectorAll('.video-grid');
      let inserted = false;
      grids.forEach(grid => {
        const parentSection = grid.closest('.content-section');
        if (parentSection && parentSection.style.display !== 'none' && !inserted) {
          const noResults = document.createElement('div');
          noResults.classList.add('no-results');
          noResults.innerHTML = `
            <h3>No videos found</h3>
            <p>Try a different search term or clear the filter.</p>
          `;
          grid.appendChild(noResults);
          inserted = true;
        }
      });
    }
  }

  // Search input event
  searchInput.addEventListener('input', () => {
    filterAndSearch();
  });

  // Filter button events
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      filterAndSearch();
    });
  });

  // ---- Collapsible Sections ----
  collapseToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const isOpen = content.classList.contains('open');

      if (isOpen) {
        content.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = 'Show Installation Steps &#9662;';
      } else {
        content.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.innerHTML = 'Hide Installation Steps &#9652;';
      }
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
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

  // Observe all cards for entrance animation
  videoCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });

  // Also observe about cards
  document.querySelectorAll('.about-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });

  // ---- Keyboard accessibility: Escape to close menu ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDropdown.classList.contains('open')) {
      closeMenu();
    }
  });

  // ---- Close mobile menu on resize past breakpoint ----
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  // Initial scroll handler call
  handleScroll();
});
