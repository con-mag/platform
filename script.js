document.addEventListener('DOMContentLoaded', () => {
  // --- Icons Initialization ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Theme Management ---
  const htmlEl = document.documentElement;
  const themeBtns = document.querySelectorAll('.theme-btn');
  const indicator = document.querySelector('.theme-indicator');
  
  // Load saved theme or default to 'cream'
  const savedTheme = localStorage.getItem('con-theme') || 'cream';
  setTheme(savedTheme);

  themeBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-val');
      setTheme(theme);
    });
  });

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('con-theme', theme);
    
    // Update active button
    themeBtns.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.theme-btn[data-theme-val="${theme}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      
      // Move indicator (RTL considered)
      const index = Array.from(themeBtns).indexOf(activeBtn);
      if (indicator) {
        // In RTL, items are right-to-left
        indicator.style.transform = `translateX(${index * -36}px)`;
      }
    }
  }

  // --- Mobile Navigation ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        const isMenuOpen = navLinks.classList.contains('active');
        icon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Statistics Counters ---
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = target.getAttribute('data-value');
        animateValue(target, finalValue);
        statObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statObserver.observe(stat));

  function animateValue(obj, finalString) {
    // Extract numbers and suffixes (like M, K, +)
    const numMatch = finalString.match(/[\d.]+/);
    if (!numMatch) {
      obj.innerText = finalString;
      return;
    }
    
    const numValue = parseFloat(numMatch[0]);
    const isFloat = finalString.includes('.');
    const suffix = finalString.replace(/[\d.]+/g, '');
    
    let startTimestamp = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = numValue * easeOut;
      
      if (isFloat) {
        obj.innerText = currentVal.toFixed(1) + suffix;
      } else {
        obj.innerText = Math.floor(currentVal) + suffix;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerText = finalString; // Ensure exact final text
      }
    };
    
    window.requestAnimationFrame(step);
  }

  // --- Accordions ---
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(acc => {
    acc.addEventListener('click', () => {
      const isExpanded = acc.getAttribute('aria-expanded') === 'true';
      acc.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // --- Active Nav Highlighting (Join Page) ---
  const sections = document.querySelectorAll('.policy-section');
  const navItems = document.querySelectorAll('.sidebar-nav a');
  
  if (sections.length > 0 && navItems.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });

    sections.forEach(section => scrollObserver.observe(section));
    
    // Smooth scroll for sidebar nav
    navItems.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});
