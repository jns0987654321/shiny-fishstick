const DEFAULT_SEARCH_PARAMS = {
  first: 20,
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

    const searchUrl = new URL(location);
    searchUrl.pathname = "/search";
    searchUrl.searchParams.set('q', data.query);
    for (let [name, value] of Object.entries({...DEFAULT_SEARCH_PARAMS, ...options})) {
      searchUrl.searchParams.set(name, value);
    }

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

  nextPage: async (e) => {
    e.preventDefault();

    const resultsLength = Number(Controller.getUrlParam("first") || 0) + DEFAULT_SEARCH_PARAMS['first'];
    const isCaseSensitiveSearch = (Controller.getUrlParam("isCaseSensitive") ?? DEFAULT_SEARCH_PARAMS['isCaseSensitive']) === "true";
    const searchOptions = { first: resultsLength, isCaseSensitive: isCaseSensitiveSearch };
    await Controller.search(e, searchOptions);
  },

  getUrlParam: (param) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return params.get(param);
  },

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