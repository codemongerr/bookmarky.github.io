/**
 * Method to get a HTML element by id
 *
 * @param {string} id - id of the element
 *
 * @return {null | object} - object representing HTML or null if no element found
 */
export const getById = id => {
  return document.getElementById(id);
};

/**
 * Method to get a HTML element(s) by class names
 *
 * @param {string} cls - class of the element(s)
 *
 * @return {array} - an array of HTML elements with matched class names
 */
export const getByClassName = cls => {
  return document.getElementsByClassName(cls);
};

/**
 * Method get query param value
 *
 * @param {string} name - query param name
 *
 * @return {string} - value of query param
 */
export const getUrlParameter = name => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
 * Method to validate a url
 *
 * @param {string} url - a url including protocol
 *
 * @return {boolean}
 */
export const validateUrl = url => {
  // If `url` don't do anything
  if (!url) {
    return false;
  }
  // Check if provided string is a valid url
  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  if (!regex.test(url)) {
    return false;
  }
  return true;
};

/**
 * Method to convert HTML string to node
 *
 * @param {string} string - HTML element in form of string
 *
 * @return {object}
 */
export const createElementFromHTML = htmlString => {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
};

/**
 * Method to check if url exists
 *
 * @param {string} url - url including protocol
 *
 * @return {boolean}
 */
export const checkIfUrlExists = url => {
  // [@TODO] - do http request to check if provided url exists
  return true;
};
