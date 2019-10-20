import * as constants from "./utils/constants";
import {
  getById,
  getByClassName,
  getUrlParameter,
  validateUrl,
  checkIfUrlExists,
  createElementFromHTML
} from "./utils/helpers";
import css from "./assets/css/styles.css";

/**
 * Class manage bookmarks and all operations related to it
 *
 * @category  Bookmark
 * @package   Bookmark
 *
 * @author    Talwinder Singh
 * @since     20 October 2019
 */
class App {
  /**
   * Constructor method called on initialization
   * Sets the current page number from query param
   * Sets the list of bookmars from store
   * Bootstrap app
   *
   * @return {void}
   */
  constructor() {
    this.currentPage =
      parseInt(getUrlParameter(constants.PAGE_QUERY_PARAM_NAME)) || 1;
    this.bookmarks = this.initStore();
    this.bootstrap();
  }

  /**
   * Method to call after constructor and all requried params are set
   * Gets the list bookmarks basd on current page
   * Creates pagination
   *
   * @return {void}
   */
  bootstrap() {
    this.getList();
    this.createPagination();
  }

  /**
   * Method to get initial bookmarks
   *
   * @return {void}
   */
  initStore() {
    let store = this.getStore() || "[]";
    return JSON.parse(store);
  }

  /**
   * Method to get bookmarks from local storage
   *
   * @return {void}
   */
  getStore() {
    const store = localStorage.getItem(constants.STORE_KEY_NAME);
    return store;
  }

  /**
   * Method to set bookmarks in local storage
   *
   * @return {void}
   */
  setStore() {
    localStorage.setItem(
      constants.STORE_KEY_NAME,
      JSON.stringify(this.bookmarks)
    );
  }

  /**
   * Gets the paginated list of bookmarks based on current page
   *
   * @return {void}
   */
  getList() {
    const bookmarkList = getById("bookmarks-list");
    const start = (this.currentPage - 1) * constants.TOTAL_BOOKMARKS_PER_PAGE;
    const end = this.currentPage * constants.TOTAL_BOOKMARKS_PER_PAGE;

    bookmarkList.innerHTML = "";
    this.bookmarks.slice(start, end).forEach((bookmark, index) => {
      let bookmarkTmpl = getById("bookmark-tmpl").innerHTML;
      bookmarkTmpl = bookmarkTmpl.replace(new RegExp("{{index}}", "g"), index);
      bookmarkTmpl = bookmarkTmpl.replace(new RegExp("{{url}}", "g"), bookmark);
      const el = createElementFromHTML(bookmarkTmpl);
      bookmarkList.appendChild(el);
    });

    // Attach events once elements are added to DOM
    this.addBookmark();
    this.editBookmark();
    this.removeBookmark();
  }

  /**
   * Method to add new bookmark and store in local storage
   *
   * @return {void}
   */
  addBookmark() {
    const form = getById("bookmark-form");
    const handleSubmit = event => {
      event.preventDefault();
      // Gets the url provided by user
      const url = getById("url").value;
      // Only add url to store if it is a valid url
      if (
        validateUrl(url) && 
        checkIfUrlExists(url) &&
        !this.bookmarks.includes(url)
      ) {
        this.bookmarks = [url, ...this.bookmarks];
        // Rebuild view after URL is added to store
        this.setStore();
        this.getList();
        this.createPagination();
      }
    };
    form.addEventListener("submit", handleSubmit);
  }

  /**
   * Method to remove url from store
   *
   * @return {void}
   */
  removeBookmark() {
    const btns = getByClassName("bookmark-remove");

    const removeFromStore = i => {
      if (!i) {
        return false;
      }
      i = parseInt(i);
      this.bookmarks = this.bookmarks.filter((bookmark, j) => {
        return i !== j;
      });
      // Update the view after user have removed the url
      this.setStore();
      this.getList();
      this.createPagination();
    };

    const removeNode = function(event) {
      event.preventDefault();
      if (confirm("Are you sure you want to remove this bookmark?")) {
        const index = this.getAttribute("data-index");
        removeFromStore(index);
      }
    };
    // Bind click event to each button
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", removeNode);
    }
  }

  /**
   * Method to edit bookmarked url from store
   *
   * @return {void}
   */
  editBookmark() {
    const btns = getByClassName("bookmark-update");
    const ths = this;

    const update = function(event) {
      event.preventDefault();
      const index = this.getAttribute("data-index");
      const urlEl = getById(`bookmark-${index}`);

      if (
        confirm("Are you sure you want to update this bookmark?") &&
        ths.bookmarks[index] != urlEl.value &&
        checkIfUrlExists(urlEl.value) &&
        validateUrl(urlEl.value)
      ) {
        ths.bookmarks[index] = urlEl.value;
        // Update store and rebuild the view
        ths.setStore();
        ths.getList();
        ths.createPagination();
      }
    };

    // Attach click event to button
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", update);
    }
  }

  /**
   * Created the pagination
   *
   * @return {void}
   */
  createPagination() {
    const el = getById("pagination");
    const totalBookmarks = this.bookmarks.length;
    const maxPerPage = constants.TOTAL_BOOKMARKS_PER_PAGE;
    const totalPages = Math.ceil(totalBookmarks / maxPerPage);
    el.innerHTML = "";
    if (totalPages > 1) {
      // Add prev link if current page is greater than 1
      if (this.currentPage > 1) {
        const prevLinkEl = document.createElement("a");
        prevLinkEl.href = `?${constants.PAGE_QUERY_PARAM_NAME}=${this
          .currentPage - 1}`;
        prevLinkEl.innerText = "<";
        el.appendChild(prevLinkEl);
      }
      // Create pagination links
      for (let i = 1; i <= totalPages; i++) {
        const linkEl = document.createElement("a");
        linkEl.href = `?${constants.PAGE_QUERY_PARAM_NAME}=${i}`;
        linkEl.innerText = i;
        if (this.currentPage === i) {
          linkEl.className = "active";
        }
        el.appendChild(linkEl);
      }
      // Add next link if current page less than total page
      if (this.currentPage < totalPages) {
        const prevLinkEl = document.createElement("a");
        prevLinkEl.href = `?${constants.PAGE_QUERY_PARAM_NAME}=${this
          .currentPage + 1}`;
        prevLinkEl.innerText = ">";
        el.appendChild(prevLinkEl);
      }
    }
  }
}

export default App;
