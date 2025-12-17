class LinkedBlocks extends HTMLElement {
  constructor() {
    super();

    this.navbar = this.querySelector('nav#navbar');
    this.navbarHt = this.navbar.offsetHeight;

    this.leftArrow = this.querySelector('.navbar__arrow--left');
    this.rightArrow = this.querySelector('.navbar__arrow--right');

    this.navLinks = this.querySelectorAll('.linked-block__nav-link');
    this.navLinks.forEach((navLink) => {
      navLink.addEventListener('click', this.onClick.bind(this));
    });

    this.sections = this.querySelectorAll('.linkable-section');
    window.addEventListener('scroll', () => this.navHighlighter());

    this.leftArrow.addEventListener('click', this.leftArrowClick.bind(this));
    this.rightArrow.addEventListener('click', this.rightArrowClick.bind(this));
  }

  leftArrowClick(event) {
    if (!this.querySelector('nav#navbar div.active').previousElementSibling.classList.contains('navbar__arrow')) {
      this.querySelector('nav#navbar div.active').previousElementSibling.querySelector('a').click();
    }
  }
  rightArrowClick(event) {
    if (!this.querySelector('nav#navbar div.active').nextElementSibling.classList.contains('navbar__arrow')) {
      this.querySelector('nav#navbar div.active').nextElementSibling.querySelector('a').click();
    }
  }

  onClick(event) {
    event.preventDefault();
    const targetId = '#' + event.target.getAttribute('href').substring(1);
    const target = this.querySelector(targetId);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  navHighlighter() {
    let scrollY = window.scrollY;

    this.sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.getBoundingClientRect().top + scrollY - this.navbarHt;
      const sectionId = current.getAttribute('id');
      const sectionHr = current.nextElementSibling;
      let hrHeight = 0;
      if (sectionHr) {
        hrHeight = sectionHr.offsetHeight;
        hrHeight += parseInt(window.getComputedStyle(sectionHr).getPropertyValue('margin-top'));
        hrHeight += parseInt(window.getComputedStyle(sectionHr).getPropertyValue('margin-bottom'));
      }

      if (scrollY + hrHeight > sectionTop && scrollY <= sectionTop + sectionHeight) {
        this.querySelector('nav#navbar a[href*=' + sectionId + ']')
          .closest('div')
          .classList.add('active');
        if (this.querySelector('nav#navbar div.placeholder')) {
          this.querySelector('nav#navbar div.placeholder').classList.remove('placeholder');
        }
      } else {
        this.querySelector('nav#navbar a[href*=' + sectionId + ']')
          .closest('div')
          .classList.remove('active');
      }
    });

    if (scrollY >= this.navbar.offsetTop) {
      this.navbar.classList.add('is-sticky');
    } else {
      this.navbar.classList.remove('is-sticky');
    }

    if (!!this.querySelector('nav#navbar div.active')) {
      this.querySelector('nav#navbar').classList.add('has-active');
    } else {
      this.querySelector('nav#navbar').classList.remove('has-active');
    }
  }
}

customElements.define('linked-blocks', LinkedBlocks);
