let debounceTimer;

class InstantSearchBar extends HTMLElement {
  constructor() {
    super();

    this.displayLimit = parseInt(this.dataset.displayLimit) || 20;
    this.searchInput = this.querySelector('.search__input');
    this.searchValue = this.searchInput.value;
    this.autoRun = this.dataset.autoRun;
    this.resultsContainer = this.querySelector('.autocomplete-results__container');

    this.meiliContainer = this.querySelector('.autocomplete-results__meili');
    this.productsContainer = this.querySelector('.autocomplete-results__products');
    this.termContainer = this.querySelector('.autocomplete-results__term');

    this.searchComparisonCheckbox = this.querySelector('input[name="comparison"]');
    this.currentPage = 1;
    this.totalHits = 0;
    const urlParams = new URLSearchParams(window.location.search);
    this.searchComparisonsOnly =
      (this.searchComparisonCheckbox && this.searchComparisonCheckbox.checked) ||
      urlParams.get('comparison') === 'true';

    if (this.autoRun) {
      this.multiSearch();
    }

    if (this.searchComparisonsOnly && this.searchComparisonCheckbox) {
      this.searchComparisonCheckbox.checked = true;
    }

    document.addEventListener('click', (event) => {
      const isOutsideInput = !event.target.closest('.search__input');
      if (isOutsideInput) {
        this.clearContainers();
      }
    });

    if (this.searchComparisonCheckbox) {
      this.searchComparisonCheckbox.addEventListener('change', () => {
        this.searchComparisonsOnly = !this.searchComparisonsOnly;
        this.multiSearch();
      });
    }

    this.searchInput.addEventListener('focus', () => {
      this.multiSearch();
    });

    this.searchInput.addEventListener('blur', () => {
      // this.clearContainers();
    });

    this.searchInput.addEventListener('input', () => {
      this.searchValue = this.searchInput.value;
      this.multiSearch();
    });
  }

  displayPrice = (product) => {
    const price = parseFloat(product.variants.edges[0].node.price.amount).toFixed(2);
    return `$${price.endsWith('.00') ? price.slice(0, -3) : price}`;
  };

  multiSearch = async () => {
    const searchValue = this.searchInput.value;
    const searchQueries = this.searchComparisonsOnly
      ? [{ indexUid: 'brand_comparisons', q: searchValue, filter: ['published = true'] }]
      : [
          { indexUid: 'brands', q: searchValue },
          { indexUid: 'brand_reviews', q: searchValue },
          {
            indexUid: 'articles',
            q: searchValue,
            // federationOptions: { weight: 1.2 },
            filter: ['published = true', `tags != 'hide from search'`],
          },
        ];
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      if (searchValue.length > 2) {
        const results = await meiliSearch(searchQueries, this.displayLimit, this.displayLimit * (this.currentPage - 1));
        const products = await productSearch(this.searchInput.value);

        this.displayAutocompleteResults(results, products, searchValue);
      } else {
        this.clearContainers();
      }
    }, 300);
  };

  clearContainers = () => {
    this.meiliContainer.innerHTML = '';
    this.productsContainer.innerHTML = '';
    this.termContainer.innerHTML = '';
    this.classList.remove('has-results');
  };

  displayAutocompleteResults = (results, products) => {
    this.clearContainers();

    // autocomplete meili
    if (results && results.hits) {
      this.classList.add('has-results');
      results.hits.slice(0, 6).forEach((hit, index) => {
        const hitElement = `
        <div class="autocomplete-result" data-index="${index}">
          <a href="${hit.url}" class="gtm--autocomplete-item">
            <img src="${hit.image}" alt="${hit.title}">
            <span>${hit.title}</span>
          </a>
        </div>`;
        this.meiliContainer.insertAdjacentHTML('beforeend', hitElement);
      });
    }

    // autocomplete products
    if (this.productsContainer && products && products.length) {
      this.classList.add('has-results');
      this.resultsContainer.classList.remove('no-products');
      products.slice(0, 5).forEach((product, index) => {
        const productElement = `
        <div class="autocomplete-result" data-index="${index}">
          <a href="/products/${product.handle}" class="gtm--autocomplete-product">
            ${
              product.images.edges.length > 0
                ? `<img src="${product.images.edges[0].node.src}" alt="${product.title}">`
                : ''
            }
            <div>
              <span class="product--vendor">${product.vendor}</span>
              <span class="product--title">${product.title}</span>
              <span class="product--price">${this.displayPrice(product)}</span>
            </div>
          </a>
        </div>`;
        this.productsContainer.insertAdjacentHTML('beforeend', productElement);
      });
    } else {
      this.resultsContainer.classList.add('no-products');
    }

    // term reminder
    this.termContainer.innerHTML = `
      <div class="autocomplete-result">
        <a href="/search?q=${this.searchValue}&comparison=${this.searchComparisonsOnly}">
          <strong>Search for "${this.searchValue}"${this.searchComparisonsOnly ? ' in Brand Comparisons' : ''}</strong>
        </a>
      </div>`;
  };
}

customElements.define('instant-search-bar', InstantSearchBar);
