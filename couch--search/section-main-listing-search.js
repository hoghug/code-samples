document.addEventListener('DOMContentLoaded', function () {
  const search = instantsearch({
    indexName: `${searchIndex}:${searchSort}:asc`,
    routing: true,
    searchClient: instantMeiliSearch(
      'https://search.couch.co',
      '57b733eaeb05f22bb1a3a08adb404b83434e469e2a0f70b43d35ccf732571a94'
    ).searchClient,
  });
  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#listing-searchbox',
    }),
    instantsearch.widgets.configure({ hitsPerPage: 200 }),
    instantsearch.widgets.pagination({
      container: '#listing-pagination',
    }),
    // instantsearch.widgets.sortBy({
    //   container: '#listing-sort',
    //   items: [
    //     {
    //       label: 'A-Z',
    //       value: 'brands:title:asc',
    //     },
    //     {
    //       label: 'Z-A',
    //       value: 'brands:title:desc',
    //     },
    //     {
    //       label: 'Random',
    //       value: 'brands:updated_at:asc',
    //     },
    //   ],
    // }),
    instantsearch.widgets.hits({
      container: '#listing-hits',
      cssClasses: {
        list: 'listing-wrapper',
        item: hitItemClass,
      },
      templates: {
        item: `
          ${
            searchIndex === 'brands'
              ? `<div class="listing-card__image">
                    <a href="{{ url }}">
                      <img src="{{ image }}" alt="{{ title }}" loading="lazy">
                    </a>
                  </div>
                  <div class="listing-card__info listing-card__info--no-rating">
                    <a href="{{ url }}">{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</a>
                  </div>`
              : `<div class="listing-card__image">
                  <a href="{{ url }}">
                    <img src="{{ image }}" alt="{{ title }}" loading="lazy">
                    <span class="listing-card__rating medium-hide large-up-hide">
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.53556 13.3496C7.53556 12.8819 7.88717 12.6948 8.15088 12.6948M13.1613 11.1979C13.5129 11.1979 13.9526 11.7592 13.9526 12.1335M18.0839 12.227C18.3476 12.7883 18.1718 13.1625 18.0839 13.3496M17.029 9.04629C16.6774 9.23339 16.0621 8.85919 16.0621 8.67209M9.0299 8.39144C9.20571 8.57854 9.38151 9.13984 9.20571 9.42049M11.2275 3.52683C11.2275 3.52683 11.0517 3.99459 11.4033 4.27524M4.81058 5.39784C5.16219 5.39784 5.4259 5.11719 5.4259 4.74299M2.78882 10.356C1.64609 8.8592 0.32751 6.9881 1.38238 5.02364C2.55694 2.83627 4.54684 3.43328 6.0412 3.05908C7.53556 2.68488 9.11779 1.00103 11.7549 1.00098C14.3919 1.00092 15.8863 2.77839 15.9742 5.49135M4.37107 11.5721C4.19526 9.32686 5.15866 7.03352 7.27198 6.2397C10.2607 5.11706 12.4582 6.80103 13.9526 6.801C15.8884 6.80097 19.8421 5.86549 20.7211 8.39135C21.6001 10.9172 20.6332 15.4076 13.9526 16.7173C6.65666 18.1476 4.54687 13.8173 4.37107 11.5721Z" stroke="#8E1E4D" stroke-linecap="round"/>
                    </svg>
                    <strong>{{ potato_meter_score }}%</strong>
                  </span>
                  </a>
                </div>
                <div class="listing-card__info">
                  <a href="{{ url }}">{{#helpers.highlight}}{ "attribute": "brand" }{{/helpers.highlight}}</a>
                  <span class="listing-card__rating small-hide">
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.53556 13.3496C7.53556 12.8819 7.88717 12.6948 8.15088 12.6948M13.1613 11.1979C13.5129 11.1979 13.9526 11.7592 13.9526 12.1335M18.0839 12.227C18.3476 12.7883 18.1718 13.1625 18.0839 13.3496M17.029 9.04629C16.6774 9.23339 16.0621 8.85919 16.0621 8.67209M9.0299 8.39144C9.20571 8.57854 9.38151 9.13984 9.20571 9.42049M11.2275 3.52683C11.2275 3.52683 11.0517 3.99459 11.4033 4.27524M4.81058 5.39784C5.16219 5.39784 5.4259 5.11719 5.4259 4.74299M2.78882 10.356C1.64609 8.8592 0.32751 6.9881 1.38238 5.02364C2.55694 2.83627 4.54684 3.43328 6.0412 3.05908C7.53556 2.68488 9.11779 1.00103 11.7549 1.00098C14.3919 1.00092 15.8863 2.77839 15.9742 5.49135M4.37107 11.5721C4.19526 9.32686 5.15866 7.03352 7.27198 6.2397C10.2607 5.11706 12.4582 6.80103 13.9526 6.801C15.8884 6.80097 19.8421 5.86549 20.7211 8.39135C21.6001 10.9172 20.6332 15.4076 13.9526 16.7173C6.65666 18.1476 4.54687 13.8173 4.37107 11.5721Z" stroke="#8E1E4D" stroke-linecap="round"/>
                    </svg>
                    <strong>{{ potato_meter_score }}%</strong>
                  </span>
                </div>`
          }
      `,
      },
    }),
  ]);
  search.start();
});
