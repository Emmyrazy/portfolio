/**
 * Emmanuel Ibrang Portfolio — Application Script
 *
 * Responsibilities:
 *  - Navigation active-state scroll spy
 *  - Mobile menu drawer toggle
 *  - Contact form UX (submit feedback, loading state)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavSelection();
  initContactForm();
});

/**
 * Mobile Navigation Drawer
 * Toggles the drawer open/closed on the hamburger button click.
 * Closes when any nav link is tapped, on backdrop click, or on Escape key.
 */
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');

  if (!toggle || !drawer) return;

  // Create backdrop element if it doesn't exist
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const closeMenu = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.classList.remove('is-active');
  };

  const openMenu = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.classList.add('is-active');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu if window is resized to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Navigation Active State
 * Keeps the active pill on Home while scrolling; only updates
 * the active item when a navigation link is explicitly clicked.
 */
function initNavSelection() {
  const navLinks = document.querySelectorAll('.nav-pill-capsule a, .mobile-nav-drawer a');

  if (!navLinks.length) return;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetHref = link.getAttribute('href');
      if (!targetHref) return;

      navLinks.forEach(item => {
        item.classList.toggle('active', item.getAttribute('href') === targetHref);
      });
    });
  });
}

/**
 * Contact Form
 * Sends form submissions directly to emmyrazy.emma@gmail.com via Web3Forms
 * (authenticated SPF/DKIM delivery for reliable inbox placement).
 */
function initContactForm() {
  const form  = document.getElementById('contactForm');
  const toast = document.getElementById('formFeedbackToast');

  if (!form || !toast) return;

  // Get your free access key at https://web3forms.com using emmyrazy.emma@gmail.com
  const WEB3FORMS_ACCESS_KEY = '693a5a88-c1a4-4d0b-b353-3546f4cf0424';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      toast.textContent = 'Add your Web3Forms access key in js/app.js to enable delivery.';
      toast.classList.add('is-visible', 'is-error');
      setTimeout(() => { toast.classList.remove('is-visible', 'is-error'); }, 6000);
      return;
    }

    const submitBtn   = form.querySelector('.btn-form-send');
    const originalTxt = submitBtn.textContent;

    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMsg').value.trim();

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending...';
    toast.classList.remove('is-visible', 'is-error');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          replyto: email,
          subject: `Portfolio message from ${name}`,
          from_name: 'Emmanuel Portfolio',
          message
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send message.');
      }

      form.reset();
      toast.textContent = 'Message sent successfully! Thank you.';
      toast.classList.add('is-visible');
    } catch (error) {
      console.error('Contact form error:', error);
      toast.textContent = error.message || 'Could not send message. Please try again later.';
      toast.classList.add('is-visible', 'is-error');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = originalTxt;
      setTimeout(() => { toast.classList.remove('is-visible', 'is-error'); }, 5000);
    }
  });
}
