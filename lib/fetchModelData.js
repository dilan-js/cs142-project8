var Promise = require("Promise");

/**
 * FetchModel - Fetch a model from the web server.
 *     url - string - The URL to issue the GET request.
 * Returns: a Promise that should be filled
 * with the response of the GET request parsed
 * as a JSON object and returned in the property
 * named "data" of an object.
 * If the requests has an error the promise should be
 * rejected with an object contain the properties:
 *    status:  The HTTP response status
 *    statusText:  The statusText from the xhr request
 *
 */

function fetchModel(url) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        resolve(request);
      } else {
        reject({ status: request.status, statusText: request.statusText });
      }
    };
    request.open("GET", url, true);
    request.send();
  });
}

export default fetchModel;
