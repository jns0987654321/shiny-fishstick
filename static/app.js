/**
 * The parameters used for a search query if none are provided.
 */
const DEFAULT_SEARCH_PARAMS = {
  /**
   * Number of `edges` to return i.e. the results per `page`.
   * Naming terminology source: https://relay.dev/graphql/connections.htm
   */
  first: 20,
  /**
   * Whether or not query searching is case sensitive.
   */
  isCaseSensitive: "false"
};

const Controller = {
  search: async (ev, options = {}) => {
    ev.preventDefault();
    const form = document.getElementById("form");
    const data = Object.fromEntries(new FormData(form));

    if (!data.query) {
      alert("No query entered. Please enter a valid query and try again!");
      return;
    }

    // Construct search URL
    const searchUrl = new URL(location);
    searchUrl.pathname = "/search";
    searchUrl.searchParams.set('q', data.query);
    for (let [name, value] of Object.entries({...DEFAULT_SEARCH_PARAMS, ...options})) {
      searchUrl.searchParams.set(name, value);
    }

    // Fetch results
    await fetch(searchUrl).then((response) => {
      response.json().then((results) => {
        Controller.updateTable(results);
        Controller.toggleLoadMoreVisibility(results);
        history.pushState({}, "", searchUrl);
      });
    });
  },

  updateTable: (results) => {
    const table = document.getElementById("table-body");
    const rows = [];
    for (let result of results) {
      rows.push(`<tr><td>${result}</td></tr>`);
    }
    table.innerHTML = rows;
  },

  /**
   * Navigates to the next page of results.
   */
  nextPage: async (e) => {
    e.preventDefault();

    const resultsLength = Number(Controller.getUrlParam("first") || 0) + DEFAULT_SEARCH_PARAMS['first'];
    const isCaseSensitiveSearch = (Controller.getUrlParam("isCaseSensitive") ?? DEFAULT_SEARCH_PARAMS['isCaseSensitive']) === "true";
    const searchOptions = { first: resultsLength, isCaseSensitive: isCaseSensitiveSearch };
    await Controller.search(e, searchOptions);
  },

  /**
   * Gets the parameter value from the current URL.
   */
  getUrlParam: (param) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return params.get(param);
  },

  /**
   * Conditionally show/hide the Load More button.
   * 
   * TODO: Handle case where there are no more pages to load.
   */
  toggleLoadMoreVisibility: (results) => {
    const hasResults = results && results.length;
    document.getElementById("load-more").disabled = !hasResults;
  }
};

const form = document.getElementById("form");
form.addEventListener("submit", (e) => Controller.search(e));

const loadMore = document.getElementById("load-more");
loadMore.addEventListener("click", (e) => Controller.nextPage(e));
Controller.toggleLoadMoreVisibility();