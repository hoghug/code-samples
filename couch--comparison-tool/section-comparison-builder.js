class ComparisonBuilder extends HTMLElement {
  constructor() {
    super();

    this.brandList = this.querySelectorAll('select');
    this.brandChoices = this.querySelector('.comparison-builder__choices');
    this.generateButton = this.querySelector('.generate-button');

    this.brand1 = {
      name: '',
      description: '',
      logo: '',
    };
    this.brand2 = {
      name: '',
      description: '',
      logo: '',
    };

    this.brandList.forEach((select) => {
      select.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        if (e.target.id === 'brand-list-1') {
          this.brand1 = {
            name: this.checkBrandName(e.target.value),
            description: selectedOption.getAttribute('data-description'),
            logo: selectedOption.getAttribute('data-logo'),
          };
          this.blockChoice(this.brand1, 1);
          this.displayChoice(this.brand1, 1);
        } else if (e.target.id === 'brand-list-2') {
          this.brand2 = {
            name: this.checkBrandName(e.target.value),
            description: selectedOption.getAttribute('data-description'),
            logo: selectedOption.getAttribute('data-logo'),
          };
          this.blockChoice(this.brand2, 2);
          this.displayChoice(this.brand2, 2);
        }

        this.brandChoices.classList.remove('hidden');

        if (this.brand1.name !== '' && this.brand2.name !== '') {
          this.findArticle();
        }
      });
    });

    // Trigger change event for both selects to initialize the selections
    const event = new Event('change');
    this.querySelector('#brand-list-1').dispatchEvent(event);
    this.querySelector('#brand-list-2').dispatchEvent(event);
  }

  checkBrandName(brand) {
    return (
      {
        'Crate & Barrel': 'Crate and Barrel',
      }[brand] || brand
    );
  }

  blockChoice(brand, index) {
    const otherSelect = this.querySelector(`#brand-list-${index === 1 ? 2 : 1}`);
    Array.from(otherSelect.options).forEach((option) => {
      if (option.value === brand.name) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  }

  displayChoice(brand, index) {
    const existingChoice = this.querySelector(`#choice-${index}`);
    if (existingChoice) {
      existingChoice.remove();
    }

    const choice = document.createElement('div');
    choice.classList.add('comparison-builder__choice');
    choice.id = `choice-${index}`;
    choice.innerHTML = `
      <div class="comparison-builder__choice__logo" style="background-image: url('${brand.logo}')">
      </div>
      <div class="comparison-builder__choice__content">
        <accordion-content data-collapse-text="Collapse" data-expand-text="Expand">
          <div class="content">${brand.description}</div>
          <a href="#" class="accordion-toggle">Expand</a>
        </accordion-content>
      </div>
    `;

    this.brandChoices.appendChild(choice);
  }

  async findArticle() {
    const searchQueries = [
      {
        indexUid: 'brand_comparisons',
        filter: ['published = true', `brands='${this.brand1.name}'`, `brands='${this.brand2.name}'`],
      },
    ];

    const results = await meiliSearch(searchQueries, 5, 0);

    if (results?.hits?.length > 0) {
      this.classList.add('has-article');
      this.generateButton.href = results.hits[0].url;
    } else {
      this.classList.remove('has-article');
      console.log('No article found');
    }
  }
}

customElements.define('comparison-builder', ComparisonBuilder);
