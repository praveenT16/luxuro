/* ----------------------------------------------------
   LUXORA - Main Application Script
   Crafted for Modern Living.
   ---------------------------------------------------- */

// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// App State
let cart = [];
let wishlist = [];
let customProduct = {
  name: 'Atelier Armchair',
  wood: 'Light White Oak',
  fabric: 'Cream Bouclé',
  basePrice: 1400,
  price: 1400,
  img: 'assets/chair_cream.png'
};

// Elements
const cursorDot = document.getElementById('cursor-dot');
const cursorFollower = document.getElementById('cursor-follower');
const preloader = document.getElementById('preloader');
const preloaderBar = document.getElementById('preloader-bar');
const preloaderPercent = document.getElementById('preloader-percent');
const navHeader = document.getElementById('nav-header');
const heroSpotlight = document.getElementById('hero-spotlight');

// ----------------------------------------------------
// 1. PRELOADER & INITIAL ANIMATION
// ----------------------------------------------------
function startPreloader() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Fade out preloader
      gsap.to(preloader, {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          triggerPageEntrance();
        }
      });
    }
    preloaderBar.style.width = `${progress}%`;
    preloaderPercent.innerText = `${progress}%`;
  }, 80);
}
startPreloader();

function triggerPageEntrance() {
  // Reveal cursor followers
  gsap.to([cursorDot, cursorFollower], { opacity: 1, duration: 0.5 });

  // GSAP Entrance Timeline
  const tl = gsap.timeline();
  
  tl.from('#nav-header', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  tl.from('.hero-tag', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6');

  tl.from('#hero-title', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.6');

  tl.from('.hero-desc', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.7');

  tl.from('.hero-btns', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.7');

  // Trigger ScrollTrigger initialization
  initScrollAnimations();
}

// ----------------------------------------------------
// 2. CUSTOM CURSOR
// ----------------------------------------------------
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorDotX = mouseX;
let cursorDotY = mouseY;
let cursorFollowerX = mouseX;
let cursorFollowerY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Lerp loop for cursor follower
function updateCursor() {
  // Dot follows instantly
  cursorDotX += (mouseX - cursorDotX) * 0.45;
  cursorDotY += (mouseY - cursorDotY) * 0.45;
  cursorDot.style.left = `${cursorDotX}px`;
  cursorDot.style.top = `${cursorDotY}px`;

  // Follower lags behind (lerp)
  cursorFollowerX += (mouseX - cursorFollowerX) * 0.12;
  cursorFollowerY += (mouseY - cursorFollowerY) * 0.12;
  cursorFollower.style.left = `${cursorFollowerX}px`;
  cursorFollower.style.top = `${cursorFollowerY}px`;

  requestAnimationFrame(updateCursor);
}
requestAnimationFrame(updateCursor);

// Add hover classes
function setupCursorHovers() {
  const hoverElements = 'a, button, .swatch-item, .hotspot-trigger, .filter-tab, .gallery-item';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverElements)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverElements)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}
setupCursorHovers();

// ----------------------------------------------------
// 3. MAGNETIC MENU BUTTON & SPOTLIGHT
// ----------------------------------------------------
const magneticBtn = document.getElementById('menu-open-btn');
if (magneticBtn) {
  document.addEventListener('mousemove', (e) => {
    const rect = magneticBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 80) {
      // Pull button towards cursor
      const pullX = (e.clientX - btnCenterX) * 0.35;
      const pullY = (e.clientY - btnCenterY) * 0.35;
      gsap.to(magneticBtn, { x: pullX, y: pullY, duration: 0.3 });
    } else {
      // Return to center
      gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.5 });
    }
  });
}

// Hero spotlight lighting follow
const heroSec = document.getElementById('hero');
if (heroSec && heroSpotlight) {
  heroSec.addEventListener('mousemove', (e) => {
    const rect = heroSec.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroSpotlight.style.setProperty('--mouse-x', `${x}%`);
    heroSpotlight.style.setProperty('--mouse-y', `${y}%`);
  });
}

// ----------------------------------------------------
// 4. HEADER BACKGROUND DYNAMICS
// ----------------------------------------------------
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navHeader.classList.add('scrolled');
  } else {
    navHeader.classList.remove('scrolled');
  }
});

// ----------------------------------------------------
// 5. DRAWERS FUNCTIONALITY (CART, MENU, SEARCH, WISHLIST)
// ----------------------------------------------------
const overlay = document.getElementById('drawer-overlay');
const drawers = {
  menu: document.getElementById('drawer-menu'),
  cart: document.getElementById('drawer-cart'),
  wishlist: document.getElementById('drawer-wishlist'),
  search: document.getElementById('drawer-search')
};

const triggers = {
  menuOpen: document.getElementById('menu-open-btn'),
  menuClose: document.getElementById('menu-close-btn'),
  cartOpen: document.getElementById('cart-open-btn'),
  cartClose: document.getElementById('cart-close-btn'),
  wishlistOpen: document.getElementById('wishlist-open-btn'),
  wishlistClose: document.getElementById('wishlist-close-btn'),
  searchOpen: document.getElementById('search-open-btn'),
  searchClose: document.getElementById('search-close-btn')
};

function openDrawer(drawerKey) {
  drawers[drawerKey].classList.add('open');
  overlay.classList.add('active');
  // Close other drawers
  Object.keys(drawers).forEach(key => {
    if (key !== drawerKey) drawers[key].classList.remove('open');
  });
}

function closeAllDrawers() {
  Object.keys(drawers).forEach(key => drawers[key].classList.remove('open'));
  overlay.classList.remove('active');
}

// Menu
triggers.menuOpen.addEventListener('click', () => openDrawer('menu'));
triggers.menuClose.addEventListener('click', closeAllDrawers);

// Cart
triggers.cartOpen.addEventListener('click', () => openDrawer('cart'));
triggers.cartClose.addEventListener('click', closeAllDrawers);

// Wishlist
triggers.wishlistOpen.addEventListener('click', () => openDrawer('wishlist'));
triggers.wishlistClose.addEventListener('click', closeAllDrawers);

// Search
triggers.searchOpen.addEventListener('click', () => openDrawer('search'));
triggers.searchClose.addEventListener('click', closeAllDrawers);

// Overlay click closes all
overlay.addEventListener('click', closeAllDrawers);

// Escape key closes drawers
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllDrawers();
});

// Menu item click scrolls and closes drawer
document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', () => {
    closeAllDrawers();
  });
});

// ----------------------------------------------------
// 6. STATE-DRIVEN SHOPPING CART SYSTEM
// ----------------------------------------------------
const cartEmptyView = document.getElementById('cart-empty-view');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartFooterView = document.getElementById('cart-footer-view');
const cartTotalVal = document.getElementById('cart-total-val');
const cartIndicator = document.getElementById('cart-indicator');

function renderCart() {
  const itemsContainer = document.getElementById('cart-items-container');
  itemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartEmptyView.style.display = 'flex';
    cartItemsContainer.style.display = 'none';
    cartFooterView.style.display = 'none';
    cartIndicator.style.display = 'none';
  } else {
    cartEmptyView.style.display = 'none';
    cartItemsContainer.style.display = 'flex';
    cartFooterView.style.display = 'block';
    
    // Indicator
    cartIndicator.style.display = 'flex';
    cartIndicator.innerText = cart.length;

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.img}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.title}</h4>
            <p class="cart-item-meta">${item.meta || ''}</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="cart-item-price">$${item.price.toLocaleString()}</span>
            <button class="cart-item-remove" onclick="removeCartItem(${index})">Remove</button>
          </div>
        </div>
      `;
      itemsContainer.appendChild(itemEl);
    });

    cartTotalVal.innerText = `$${total.toLocaleString()}`;
  }
}

window.quickAddToCart = function(title, price, img) {
  cart.push({ title, price, img });
  renderCart();
  openDrawer('cart');
};

window.removeCartItem = function(index) {
  cart.splice(index, 1);
  renderCart();
};

// ----------------------------------------------------
// 7. QUICK PREVIEW MODAL
// ----------------------------------------------------
const qpModal = document.getElementById('quick-preview-modal');
const qpCloseBtn = document.getElementById('qp-close-btn');
const qpImg = document.getElementById('qp-img');
const qpCategory = document.getElementById('qp-category');
const qpTitle = document.getElementById('qp-title');
const qpPrice = document.getElementById('qp-price');
const qpDesc = document.getElementById('qp-desc');
const qpAddCartBtn = document.getElementById('qp-add-cart-btn');
const qpAddWishBtn = document.getElementById('qp-add-wish-btn');

let currentQpProduct = null;

window.openQuickPreview = function(title, priceStr, category, desc, img) {
  currentQpProduct = { title, price: parseInt(priceStr.replace(/[^0-9]/g, '')), img };
  qpImg.src = img;
  qpCategory.innerText = category;
  qpTitle.innerText = title;
  qpPrice.innerText = priceStr;
  qpDesc.innerText = desc;
  
  qpModal.classList.add('open');
};

function closeQuickPreview() {
  qpModal.classList.remove('open');
}

qpCloseBtn.addEventListener('click', closeQuickPreview);
qpModal.addEventListener('click', (e) => {
  if (e.target === qpModal) closeQuickPreview();
});

qpAddCartBtn.addEventListener('click', () => {
  if (currentQpProduct) {
    quickAddToCart(currentQpProduct.title, currentQpProduct.price, currentQpProduct.img);
    closeQuickPreview();
  }
});

qpAddWishBtn.addEventListener('click', () => {
  if (currentQpProduct) {
    // Add to wishlist
    const match = wishlist.find(w => w.title === currentQpProduct.title);
    if (!match) {
      wishlist.push(currentQpProduct);
      renderWishlist();
    }
    closeQuickPreview();
    openDrawer('wishlist');
  }
});

// Render Wishlist
const wishlistEmptyView = document.getElementById('wishlist-empty-view');
const wishlistItemsContainer = document.getElementById('wishlist-items-container');

function renderWishlist() {
  wishlistItemsContainer.innerHTML = '';
  if (wishlist.length === 0) {
    wishlistEmptyView.style.display = 'flex';
    wishlistItemsContainer.style.display = 'none';
  } else {
    wishlistEmptyView.style.display = 'none';
    wishlistItemsContainer.style.display = 'flex';
    
    wishlist.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.img}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.title}</h4>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="cart-item-price">$${item.price.toLocaleString()}</span>
            <button class="cart-item-remove" onclick="removeWishlistItem(${index})">Remove</button>
          </div>
        </div>
      `;
      wishlistItemsContainer.appendChild(el);
    });
  }
}

window.removeWishlistItem = function(index) {
  wishlist.splice(index, 1);
  renderWishlist();
};

// ----------------------------------------------------
// 8. FEATURED COLLECTION FILTERING
// ----------------------------------------------------
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Active class
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filterVal = tab.getAttribute('data-filter');

    // Filter Cards with beautiful GSAP fade
    const cardsToHide = [];
    const cardsToShow = [];

    productCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (filterVal === 'all' || cat === filterVal) {
        cardsToShow.push(card);
      } else {
        cardsToHide.push(card);
      }
    });

    if (cardsToHide.length > 0) {
      gsap.to(cardsToHide, {
        opacity: 0,
        scale: 0.95,
        y: 10,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          cardsToHide.forEach(c => c.style.display = 'none');
          // Show filtered cards
          cardsToShow.forEach(c => {
            c.style.display = 'flex';
          });
          gsap.fromTo(cardsToShow, 
            { opacity: 0, scale: 0.95, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
          );
        }
      });
    } else {
      // Just show them if nothing is currently hidden
      cardsToShow.forEach(c => c.style.display = 'flex');
      gsap.fromTo(cardsToShow, 
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
      );
    }
  });
});

// ----------------------------------------------------
// 9. WOOD FINISH & FABRIC PRODUCT CUSTOMIZER
// ----------------------------------------------------
const customizerImg = document.getElementById('customizer-img');
const woodSwatches = document.querySelectorAll('[data-wood]');
const fabricSwatches = document.querySelectorAll('[data-fabric]');
const customizerPrice = document.getElementById('customizer-product-price');
const labelWood = document.getElementById('label-wood');
const labelFabric = document.getElementById('label-fabric');
const customizerAddBtn = document.getElementById('customizer-add-btn');

function updateCustomizer() {
  // Fade out image
  customizerImg.classList.add('fade-out');

  setTimeout(() => {
    // Select image src based on fabric choice
    if (customProduct.fabric === 'Soft Olive Linen') {
      customProduct.img = 'assets/chair_olive.png';
      customProduct.price = 1100;
    } else if (customProduct.fabric === 'Charcoal Canvas') {
      customProduct.img = 'assets/chair_charcoal.png';
      customProduct.price = 1400;
    } else {
      customProduct.img = 'assets/chair_cream.png';
      customProduct.price = 1400;
    }

    customizerImg.src = customProduct.img;
    customizerPrice.innerText = `$${customProduct.price.toLocaleString()}`;
    labelWood.innerText = customProduct.wood;
    labelFabric.innerText = customProduct.fabric;

    // Fade image in with beautiful bounce scale
    customizerImg.classList.remove('fade-out');
    gsap.fromTo(customizerImg,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }
    );
  }, 300);
}

woodSwatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    woodSwatches.forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    customProduct.wood = swatch.getAttribute('data-wood-label');
    updateCustomizer();
  });
});

fabricSwatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    fabricSwatches.forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    customProduct.fabric = swatch.getAttribute('data-fabric-label');
    updateCustomizer();
  });
});

customizerAddBtn.addEventListener('click', () => {
  const title = `Customized ${customProduct.name}`;
  const price = customProduct.price;
  const meta = `${customProduct.wood} Frame / ${customProduct.fabric}`;
  const img = customProduct.img;

  cart.push({ title, price, meta, img });
  renderCart();
  openDrawer('cart');
});

// ----------------------------------------------------
// 10. MASONRY GALLERY FILTER & LIGHTBOX
// ----------------------------------------------------
const gFilters = document.querySelectorAll('#gallery-filters [data-gfilter]');
const gItems = document.querySelectorAll('.gallery-item');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

gFilters.forEach(tab => {
  tab.addEventListener('click', () => {
    gFilters.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filterVal = tab.getAttribute('data-gfilter');
    
    gItems.forEach(item => {
      const cat = item.getAttribute('data-gcat');
      if (filterVal === 'all' || cat === filterVal) {
        gsap.to(item, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          overwrite: 'auto',
          onStart: () => { item.style.display = 'block'; }
        });
      } else {
        gsap.to(item, {
          opacity: 0,
          scale: 0.9,
          duration: 0.4,
          overwrite: 'auto',
          onComplete: () => { item.style.display = 'none'; }
        });
      }
    });
  });
});

window.openLightbox = function(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.innerText = caption;
  lightboxModal.classList.add('open');
};

function closeLightbox() {
  lightboxModal.classList.remove('open');
}

lightboxCloseBtn.addEventListener('click', closeLightbox);
lightboxModal.addEventListener('click', (e) => {
  if (e.target === lightboxModal) closeLightbox();
});

// ----------------------------------------------------
// 11. PROCESS TIMELINE & SCROLL REVEALS (GSAP)
// ----------------------------------------------------
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  // Register scroll trigger
  gsap.registerPlugin(ScrollTrigger);

  // Parallax Hero Zoom
  gsap.to('#hero-img', {
    scale: 1.25,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Fade Reveal Section Titles
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      opacity: 0,
      y: 40,
      duration: 1,
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // About Section Animations
  gsap.from('#about-main-img', {
    scale: 1.15,
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%'
    }
  });

  gsap.from('#about-float-img', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 50%'
    }
  });

  // Showcase Items Parallax
  gsap.utils.toArray('.showcase-item').forEach(item => {
    const imgWrapper = item.querySelector('.showcase-img-wrapper img');
    gsap.from(imgWrapper, {
      scale: 1.1,
      y: 20,
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Interactive Room visualizer hotspot entry
  gsap.from('.hotspot-trigger', {
    scale: 0,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: '#room-experience',
      start: 'top 60%'
    }
  });

  // Customizer entrance
  gsap.from('.customizer-preview-col', {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#customizer',
      start: 'top 70%'
    }
  });

  // Benefit Cards entry
  gsap.from('.benefit-card', {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#benefits',
      start: 'top 75%'
    }
  });

  // Timeline Scroll Fill & Active step marking
  const timelineProgress = document.getElementById('timeline-progress');
  const steps = gsap.utils.toArray('.process-step');
  
  gsap.to(timelineProgress, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.process-timeline-container',
      start: 'top 40%',
      end: 'bottom 60%',
      scrub: true,
      onUpdate: (self) => {
        // Toggle step class based on scroll progress
        const prog = self.progress;
        steps.forEach((step, idx) => {
          const stepPercent = idx / (steps.length - 1);
          if (prog >= stepPercent - 0.05) {
            step.classList.add('active');
          } else {
            step.classList.remove('active');
          }
        });
      }
    }
  });

  // Statistics Countup Numbers
  const stats = gsap.utils.toArray('.stat-num');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    
    gsap.fromTo(stat, 
      { textContent: 0 }, 
      {
        textContent: target,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: stat,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onUpdate: function() {
          stat.innerHTML = Math.floor(stat.textContent) + (target === 5000 ? '+' : '');
        }
      }
    );
  });
}

// ----------------------------------------------------
// 12. TESTIMONIALS SLIDER
// ----------------------------------------------------
const track = document.getElementById('testimonials-track');
const slides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const dotsContainer = document.getElementById('carousel-dots');

let currentSlideIdx = 0;

function createDots() {
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${idx === currentSlideIdx ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((dot, idx) => {
    if (idx === currentSlideIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function goToSlide(idx) {
  currentSlideIdx = idx;
  track.style.transform = `translateX(-${currentSlideIdx * 100}%)`;
  updateDots();
}

function nextSlide() {
  let nextIdx = currentSlideIdx + 1;
  if (nextIdx >= slides.length) nextIdx = 0;
  goToSlide(nextIdx);
}

function prevSlide() {
  let prevIdx = currentSlideIdx - 1;
  if (prevIdx < 0) prevIdx = slides.length - 1;
  goToSlide(prevIdx);
}

if (track && slides.length > 0) {
  createDots();
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Auto-play testimonials slider
  setInterval(nextSlide, 7000);
}

// ----------------------------------------------------
// 13. FORM SUBMISSIONS
// ----------------------------------------------------
window.handleNewsletterSubmit = function(event) {
  event.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  const msgEl = document.getElementById('newsletter-msg');
  
  if (emailInput.value) {
    // Show premium fade-in message
    msgEl.classList.add('success');
    emailInput.value = '';
    
    setTimeout(() => {
      msgEl.classList.remove('success');
    }, 4000);
  }
};
