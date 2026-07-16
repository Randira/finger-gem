// Finger Gems & Jewelry - Shared JS Logic & Multilingual Translation Engine

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initLanguageSwitcher();
  initRevealOnScroll();
  initWhatsAppButtons();
  initContactForm();
  initGemFilter();
  initJewelryForm();
});

// Translation Engine State
let currentLanguage = localStorage.getItem('lang') || 'en';

function initLanguageSwitcher() {
  const langSelects = document.querySelectorAll('.lang-select-btn');
  
  // Set initial active state in buttons
  updateSelectorButtons(currentLanguage);
  
  langSelects.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      if (lang && (lang === 'en' || lang === 'zh')) {
        setLanguage(lang);
      }
    });
  });

  // Apply translations immediately on load
  applyTranslations(currentLanguage);
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('lang', lang);
  updateSelectorButtons(lang);
  applyTranslations(lang);
  
  // Dynamic alerts translate
  const message = lang === 'en' 
    ? "Language switched to English" 
    : "语言已切换为中文";
  showToast(message);
}

function updateSelectorButtons(lang) {
  const langSelects = document.querySelectorAll('.lang-select-btn');
  langSelects.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === lang) {
      btn.classList.add('text-gold', 'font-bold');
      btn.classList.remove('text-gray-400');
    } else {
      btn.classList.remove('text-gold', 'font-bold');
      btn.classList.add('text-gray-400');
    }
  });
}

function applyTranslations(lang) {
  if (typeof translations === 'undefined' || !translations[lang]) return;

  const dictionary = translations[lang];

  // Translate elements with data-i18n
  const translatableElements = document.querySelectorAll('[data-i18n]');
  translatableElements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (dictionary[key] !== undefined) {
      element.innerHTML = dictionary[key];
    }
  });

  // Translate placeholders with data-i18n-placeholder
  const inputs = document.querySelectorAll('[data-i18n-placeholder]');
  inputs.forEach(input => {
    const key = input.getAttribute('data-i18n-placeholder');
    if (dictionary[key] !== undefined) {
      input.setAttribute('placeholder', dictionary[key]);
    }
  });

  // Dynamically update target phone numbers for all static WhatsApp links
  updateWhatsAppLinks(lang);
}

// Dynamically update phone numbers and pre-filled texts for all wa.me links
function updateWhatsAppLinks(lang) {
  const targetPhone = lang === 'zh' ? "94770615088" : "94766640401";
  const oldPhone = lang === 'zh' ? "94766640401" : "94770615088";
  
  const links = document.querySelectorAll('a[href*="wa.me"]');
  links.forEach(link => {
    let href = link.getAttribute('href');
    if (href) {
      // Replace the phone number part in the href
      href = href.replace(oldPhone, targetPhone);
      
      // If it doesn't have custom data-inquire-type, update the pre-filled text for general links
      if (!link.hasAttribute('data-inquire-type')) {
        const text = lang === 'zh'
          ? "您好，芬格尔宝石与珠宝！我想咨询一下斯里兰卡天然蓝宝石与珠宝定制的相关信息。"
          : "Hello Finger Gems & Jewelry, I would like to inquire about your gems and jewelry collection.";
        
        href = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
      }
      
      link.setAttribute('href', href);
    }
  });
}

// Navbar Mobile Toggle
function initNavbar() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.getElementById('main-header');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden');
    });

    // Close menu when clicking links
    const mobileLinks = mobileMenu.querySelectorAll('a:not(.lang-select-btn)');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  // Sticky Header Style
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('bg-black/95', 'shadow-lg', 'py-3');
        header.classList.remove('bg-transparent', 'py-5');
      } else {
        header.classList.remove('bg-black/95', 'shadow-lg', 'py-3');
        header.classList.add('bg-transparent', 'py-5');
      }
    });
  }
}

// Reveal Elements on Scroll
function initRevealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');

  const revealElements = () => {
    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 120; //px from bottom

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealElements);
  revealElements(); // Initial run
}

// Setup WhatsApp Buttons
function initWhatsAppButtons() {
  // Buy/Inquiry Buttons with Custom Messages
  const inquireButtons = document.querySelectorAll('[data-inquire-type]');
  inquireButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const type = button.getAttribute('data-inquire-type'); // e.g., 'gem' or 'jewelry'
      const name = button.getAttribute('data-item-name');   // e.g., 'Ceylon Royal Blue Sapphire'
      const details = button.getAttribute('data-item-details') || '';
      const phone = currentLanguage === 'zh' ? "94770615088" : "94766640401"; // Target WhatsApp Number based on language
      let message = "";

      if (currentLanguage === 'zh') {
        if (type === 'gem') {
          message = `您好，芬格尔宝石与珠宝！我对这颗宝石很感兴趣：*${name}* (${details})。请问它目前的价格和详细规格信息是什么？谢谢！`;
        } else if (type === 'jewelry') {
          message = `您好，芬格尔宝石与珠宝！我看到了你们的定制珠宝作品系列，并对这款很感兴趣：*${name}*。我想向您咨询一下关于定制或者获取报价的信息，谢谢！`;
        } else {
          message = `您好，芬格尔宝石与珠宝！我想咨询一下斯里兰卡天然蓝宝石与珠宝定制的相关信息。`;
        }
      } else {
        if (type === 'gem') {
          message = `Hello Finger Gems & Jewelry, I am interested in purchasing/inquiring about the gemstone: *${name}* (${details}). Please let me know the price and availability. Thank you!`;
        } else if (type === 'jewelry') {
          message = `Hello Finger Gems & Jewelry, I saw your custom jewelry collection and I am interested in: *${name}*. I'd love to discuss custom options or get a quote.`;
        } else {
          message = `Hello Finger Gems & Jewelry, I would like to inquire about your gems and jewelry collection.`;
        }
      }

      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${phone}?text=${encodedMsg}`;
      window.open(url, '_blank');
    });
  });
}

// Contact Form Submission (WhatsApp Integration)
function initContactForm() {
  const contactForm = document.getElementById('custom-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;
      const phone = currentLanguage === 'zh' ? "94770615088" : "94766640401";
      let fullText = "";

      if (currentLanguage === 'zh') {
        fullText = `您好，芬格尔宝石与珠宝，这是我通过网站的留言板提交的咨询细节：\n\n*客户姓名:* ${name}\n*电子邮箱:* ${email}\n*咨询主题:* ${subject}\n*详细留言:* ${message}`;
      } else {
        fullText = `Hello Finger Gems & Jewelry,\n\nI am contacting you via the website form.\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n*Message:* ${message}`;
      }
      
      const encodedMsg = encodeURIComponent(fullText);
      const url = `https://wa.me/${phone}?text=${encodedMsg}`;
      window.open(url, '_blank');

      const toastMsg = currentLanguage === 'zh' 
        ? "正在拉起 WhatsApp 并发送您的留言..." 
        : "Opening WhatsApp with your message details...";
      showToast(toastMsg);
    });
  }
}

// Bespoke Jewelry Custom Request Form
function initJewelryForm() {
  const jewelryForm = document.getElementById('custom-jewelry-form');
  if (jewelryForm) {
    jewelryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('jewel-name').value;
      const itemType = document.getElementById('jewel-item-type').value;
      const metalType = document.getElementById('jewel-metal-type').value;
      const gemType = document.getElementById('jewel-gem-type').value;
      const budget = document.getElementById('jewel-budget').value;
      const description = document.getElementById('jewel-desc').value;
      const phone = currentLanguage === 'zh' ? "94770615088" : "94766640401";
      let fullText = "";

      if (currentLanguage === 'zh') {
        fullText = `您好，芬格尔宝石与珠宝，这是我想发起定制的珠宝首饰详情：\n\n*客户姓名:* ${name}\n*首饰类别:* ${itemType}\n*金属材质:* ${metalType}\n*宝石种类:* ${gemType}\n*预算范围:* ${budget}\n*设计想法:* ${description}`;
      } else {
        fullText = `Hello Finger Gems & Jewelry,\n\nI want to design a custom jewelry piece:\n\n*Client Name:* ${name}\n*Jewelry Type:* ${itemType}\n*Metal Choice:* ${metalType}\n*Gemstone Preference:* ${gemType}\n*Estimated Budget:* ${budget}\n*Description/Ideas:* ${description}`;
      }
      
      const encodedMsg = encodeURIComponent(fullText);
      const url = `https://wa.me/${phone}?text=${encodedMsg}`;
      window.open(url, '_blank');

      const toastMsg = currentLanguage === 'zh'
        ? "已生成您的珠宝定制意向，正在跳转 WhatsApp..."
        : "Generating design request and opening WhatsApp...";
      showToast(toastMsg);
    });
  }
}

// Gemstone Gallery Filtering
function initGemFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('gem-search');
  const gemCards = document.querySelectorAll('.gem-card');

  if (filterButtons.length === 0 || gemCards.length === 0) return;

  let activeCategory = 'all';
  let searchQuery = '';

  const filterGems = () => {
    gemCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const name = card.getAttribute('data-name').toLowerCase();
      const desc = card.getAttribute('data-desc').toLowerCase();

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = (name.includes(searchQuery) || desc.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transition = 'opacity 0.4s ease';
        }, 50);
      } else {
        card.classList.add('hidden');
      }
    });
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterButtons.forEach(b => {
        b.classList.remove('bg-gold-gradient', 'text-black', 'border-transparent');
        b.classList.add('bg-transparent', 'text-gray-400', 'border-gray-700');
      });

      // Add active to clicked
      btn.classList.remove('bg-transparent', 'text-gray-400', 'border-gray-700');
      btn.classList.add('bg-gold-gradient', 'text-black', 'border-transparent');

      activeCategory = btn.getAttribute('data-filter');
      filterGems();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      filterGems();
    });
  }
}

// Simple Toast Helper
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-5 right-5 bg-zinc-900 border border-gold-glow text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up';
  toast.innerHTML = `
    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
    <p class="text-sm font-medium">${message}</p>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}
