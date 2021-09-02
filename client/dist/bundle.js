/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/imgs/noitems.png":
/*!******************************!*\
  !*** ./src/imgs/noitems.png ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "e5c7a7da4c1055110a7dcc3212100e15.png";

/***/ }),

/***/ "./src/Components/Calculation.ts":
/*!***************************************!*\
  !*** ./src/Components/Calculation.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HeroStatsForCalculation": () => (/* binding */ HeroStatsForCalculation)
/* harmony export */ });
/* harmony import */ var _Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Models/heroStartItems/startItems */ "./src/Models/heroStartItems/startItems.ts");

const atkSpeed90 = [
    'Centaur Warrunner',
    'Shadow Shaman',
    'Spectre',
    'Techies',
    'Tiny',
];
const atkSpeed110 = ['Juggernaut', 'Sand King', 'Storm Spirit', 'Visage'];
const atkSpeed115 = ['Dark Willow', 'Lion', 'Mirana', 'Slark', 'Venomancer'];
const atkSpeed120 = ['Abaddon', 'Lifestealer', 'Viper', 'Weaver'];
const atkSpeed125 = ['Broodmother', 'Gyrocopter'];
function calculateItemStats(relevantItems) {
    let str = 0;
    let agi = 0;
    let int = 0;
    let bonusHealth = 0;
    let bonusHealthRegenPermanent = 0;
    let bonusHealthRegenTemp = 0;
    let healthRegenTempDuration = 0;
    let bonusArmor = 0;
    let dmgRaw = 0;
    let dmgTempValue = 0;
    let atkSpeedRaw = 0;
    let armorDebuff = 0;
    let heal = 0;
    relevantItems.map((x) => {
        if (x.strBonus) {
            str += x.strBonus;
        }
        if (x.agiBonus) {
            agi += x.agiBonus;
        }
        if (x.intBonus) {
            int += x.intBonus;
        }
        if (x.hpRaw) {
            bonusHealth += x.hpRaw;
        }
        if (x.hpRegenPermanent) {
            bonusHealthRegenPermanent += x.hpRegenPermanent;
        }
        if (x.hpRegenTemp) {
            if (bonusHealthRegenTemp === 0) {
                bonusHealthRegenTemp += x.hpRegenTemp;
            }
        }
        if (x.hpRegenDuration) {
            healthRegenTempDuration += x.hpRegenDuration * 3;
        }
        if (x.armorRaw) {
            bonusArmor += x.armorRaw;
        }
        if (x.dmgRaw) {
            dmgRaw += x.dmgRaw;
        }
        if (x.dmgTempValue) {
            if (dmgTempValue === 0) {
                dmgTempValue += x.dmgTempValue;
            }
        }
        if (x.attSpeedRaw) {
            atkSpeedRaw += x.attSpeedRaw;
        }
        if (x.armorDebuff) {
            if (armorDebuff === 0) {
                armorDebuff += x.armorDebuff;
            }
        }
        if (x.heal) {
            heal += x.heal;
        }
    });
    return {
        str,
        agi,
        int,
        bonusHealth,
        bonusHealthRegenPermanent,
        bonusHealthRegenTemp,
        healthRegenTempDuration,
        bonusArmor,
        dmgRaw,
        dmgTempValue,
        atkSpeedRaw,
        armorDebuff,
        heal,
    };
}
function getAtkSpeed(minionName) {
    let atkSpeed = 100;
    if (atkSpeed90.indexOf(minionName) !== -1) {
        return (atkSpeed = 90);
    }
    if (atkSpeed110.indexOf(minionName) !== -1) {
        return (atkSpeed = 110);
    }
    if (atkSpeed115.indexOf(minionName) !== -1) {
        return (atkSpeed = 115);
    }
    if (atkSpeed120.indexOf(minionName) !== -1) {
        return (atkSpeed = 120);
    }
    if (atkSpeed125.indexOf(minionName) !== -1) {
        return (atkSpeed = 125);
    }
    return atkSpeed;
}
function HeroStatsForCalculation(minionObj, minionItems) {
    let relevantItems = [];
    minionItems.map((x) => {
        if (_Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_0__.itemStats[x['id']]['relevantValues']) {
            return relevantItems.push(_Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_0__.itemStats[x['id']]);
        }
    });
    const extraItemStats = calculateItemStats(relevantItems);
    console.log(minionObj);
    console.log(extraItemStats);
    let _strTotal = minionObj.base_str + extraItemStats.str;
    let health = minionObj.base_health + _strTotal * 20 + extraItemStats.bonusHealth;
    let healthRegen = minionObj.base_health_regen +
        _strTotal * 0.1 +
        extraItemStats.bonusHealthRegenPermanent +
        extraItemStats.bonusHealthRegenTemp;
    let tempHealthRegenDuration = extraItemStats.healthRegenTempDuration;
    let heal = extraItemStats.heal;
    let _agiTotal = minionObj.base_agi + extraItemStats.agi;
    let _rawArmorTotal = minionObj.base_armor + extraItemStats.bonusArmor;
    let armor = (_agiTotal * 1) / 6 + _rawArmorTotal;
    let _extraDamageItems = extraItemStats.dmgRaw + extraItemStats[minionObj['primary_attr']];
    let _damageFromHeroStats;
    minionObj.primary_attr === 'str'
        ? (_damageFromHeroStats = minionObj.base_str)
        : minionObj.primary_attr === 'agi'
            ? (_damageFromHeroStats = minionObj.base_agi)
            : (_damageFromHeroStats = minionObj.base_int);
    let damage = (minionObj.base_attack_max + minionObj.base_attack_min) / 2 +
        _damageFromHeroStats +
        _extraDamageItems;
    let damageTemp = extraItemStats.dmgTempValue;
    let armorDebuff = extraItemStats.armorDebuff;
    let _getAtkSpeed = getAtkSpeed(minionObj.localized_name);
    let atkPerSec = (_getAtkSpeed + _agiTotal) / (100 * minionObj.attack_rate);
    let isMelee = minionObj.attack_type === 'Melee';
    const obj = {
        health,
        healthRegen,
        tempHealthRegenDuration,
        heal,
        armor,
        damage,
        damageTemp,
        armorDebuff,
        atkPerSec,
        isMelee,
    };
    console.log(obj);
    return obj;
}
// for the returned object:
// damage Temp comes ontop without calculations
// armorDebuff is needed in calculation of opponents damage reduction
// when heal is activated => remove 2 damage from variable damage and recalculate damage reduction


/***/ }),

/***/ "./src/Components/Component.ts":
/*!*************************************!*\
  !*** ./src/Components/Component.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ Component)
/* harmony export */ });
class Component {
    constructor(templatedId, hostElementId) {
        this.templateElement = document.getElementById(templatedId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = Array.from(importedNode.children);
    }
    attach(atStart) {
        this.element.forEach((el) => {
            this.hostElement.insertAdjacentElement(atStart ? 'afterbegin' : 'beforeend', el);
        });
    }
    dispatch() {
        Array.from(this.hostElement.children).forEach((el) => {
            el.remove();
        });
    }
}


/***/ }),

/***/ "./src/Components/DataContainer.ts":
/*!*****************************************!*\
  !*** ./src/Components/DataContainer.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DataContainer": () => (/* binding */ DataContainer)
/* harmony export */ });
/* harmony import */ var _GameState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameState */ "./src/Components/GameState.ts");
/* harmony import */ var _Heroes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Heroes */ "./src/Components/Heroes.ts");
/* harmony import */ var _Items__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Items */ "./src/Components/Items.ts");
/* harmony import */ var _Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Models/heroStartItems/startItems */ "./src/Models/heroStartItems/startItems.ts");




class DataContainer {
    constructor() {
        this.heroStartItems = _Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_3__.heroStartItems;
    }
    initHeroList(apiResponse) {
        const heroes = new _Heroes__WEBPACK_IMPORTED_MODULE_1__.Heroes(apiResponse);
        return (this.heroes = heroes);
    }
    initItemList(apiResponse) {
        const items = new _Items__WEBPACK_IMPORTED_MODULE_2__.Items(apiResponse);
        return (this.items = items);
    }
    initGameState(heroId, gameMode) {
        const gameState = new _GameState__WEBPACK_IMPORTED_MODULE_0__.GameState(heroId, gameMode);
        return (this.gameState = gameState);
    }
}


/***/ }),

/***/ "./src/Components/GameState.ts":
/*!*************************************!*\
  !*** ./src/Components/GameState.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameState": () => (/* binding */ GameState)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Models/heroStartItems/startItems */ "./src/Models/heroStartItems/startItems.ts");
/* harmony import */ var _Calculation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Calculation */ "./src/Components/Calculation.ts");



class GameState {
    constructor(heroId, gameMode) {
        this.gameMode = gameMode;
        // get hero
        this.heroObj = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.heroes.plainHeroObj(heroId);
        this.heroKeys = Object.keys(_index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.heroes.list);
        const heroIndex = this.heroKeys.indexOf(this.heroObj['id'].toString());
        this.heroKeys.splice(heroIndex, 1);
        // get hero items
        const itemKeys = Object.values(_index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.heroStartItems[this.heroObj['id']]);
        this.heroItems = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.items.plainItemObj(itemKeys);
        this.setGold(this.heroItems, 'heroGold');
        this.setCurrentOpponent();
        this.getOpponentItems();
        this.getStartItems();
    }
    initChange(newItem, oldItem, target) {
        if (target === 'hero') {
            this.setHeroItems(newItem, oldItem);
            this.setGold(this.heroItems, 'heroGold');
            return true;
        }
        if (target === 'opponent') {
            this.setOpponentItems(newItem, oldItem);
            this.setGold(this.opponentItems, 'opponentGold');
            return true;
        }
    }
    enoughGold(newItem, oldItem, target) {
        const goldCount = +this[target] +
            _Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_1__.itemStats[newItem].gold -
            _Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_1__.itemStats[oldItem].gold;
        return goldCount < 601;
    }
    performCalculation() {
        (0,_Calculation__WEBPACK_IMPORTED_MODULE_2__.HeroStatsForCalculation)(this.heroObj, this.heroItems);
    }
    setOpponentItems(newItem, oldItem) {
        let list = [];
        this.opponentItems.map((x) => {
            list.push(+x.id);
        });
        let index = this.opponentItems.findIndex((x) => {
            return x.id === +oldItem;
        });
        list[index] = +newItem;
        this.opponentItems = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.items.plainItemObj(list);
    }
    reset(goldTarget, itemsTarget) {
        const arrayForReset = [999, 999, 999, 999, 999, 999];
        this[itemsTarget] = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.items.plainItemObj(arrayForReset);
        this.setGold(this[itemsTarget], goldTarget);
    }
    setHeroItems(newItem, oldItem) {
        let list = [];
        this.heroItems.map((x) => {
            list.push(+x.id);
        });
        let index = this.heroItems.findIndex((x) => {
            return x.id === +oldItem;
        });
        list[index] = +newItem;
        this.heroItems = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.items.plainItemObj(list);
    }
    setCurrentOpponent() {
        if (this.heroKeys.length === 0) {
            return alert('Finish');
        }
        const randomIndex = Math.floor(Math.random() * this.heroKeys.length);
        this.currentOpponent = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.heroes.plainHeroObj(this.heroKeys[randomIndex].toString());
        // remove opp from list of keys
        this.heroKeys.splice(randomIndex, 1);
    }
    getOpponentItems() {
        const oppItemKeys = Object.values(_index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.heroStartItems[this.currentOpponent['id']]);
        this.opponentItems = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.items.plainItemObj(oppItemKeys);
        this.setGold(this.opponentItems, 'opponentGold');
    }
    getStartItems() {
        const itemKeys = Object.keys(_Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_1__.itemStats);
        this.startItems = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.items.plainItemObj(itemKeys);
    }
    setGold(items, target) {
        let gold = 0;
        items.map((x) => {
            if (x !== undefined) {
                gold += _Models_heroStartItems_startItems__WEBPACK_IMPORTED_MODULE_1__.itemStats[x['id']].gold;
            }
        });
        this[target] = gold;
    }
}


/***/ }),

/***/ "./src/Components/GameView.ts":
/*!************************************!*\
  !*** ./src/Components/GameView.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameView": () => (/* binding */ GameView)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/Components/Component.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Decorators/autobind */ "./src/Decorators/autobind.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



class GameView extends _Component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor() {
        super('tmpl-game-view', 'app');
        this.gameContainer = this.element[0].firstElementChild.children;
        this.startItemsContainer = this.element[0].children[2];
        this.renderHero();
        this.renderOpponent();
        this.renderStartItems();
        this.dispatch();
        this.attach(true);
        this.configureEventListeners();
    }
    renderItems(source, target, className) {
        const items = Object.values(source);
        while (target.firstChild) {
            target.removeChild(target.lastChild);
        }
        items.map((x) => {
            if (x) {
                const img = document.createElement('img');
                img.src = x['img'];
                img.id = x['id'].toString();
                img.classList.add(className);
                target.appendChild(img);
                return;
            }
        });
    }
    renderStartItems() {
        this.renderItems(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.startItems, this.startItemsContainer, 'allItems');
    }
    renderGold(source, target) {
        target.textContent = (600 - source).toString() + ' Gold left';
    }
    renderHero() {
        const heroContainer = this.gameContainer[0];
        heroContainer.children[0].src =
            _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.heroObj.img;
        this.renderItems(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.heroItems, heroContainer.children[1], 'hero');
        this.renderGold(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.heroGold, heroContainer.children[3]);
    }
    renderOpponent() {
        const opponentContainer = this.gameContainer[2];
        opponentContainer.children[0].src =
            _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.currentOpponent.img.toString();
        this.renderItems(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.opponentItems, opponentContainer.children[1], 'opponent');
        this.renderGold(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.opponentGold, opponentContainer.children[3]);
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.effectAllowed = 'copy';
    }
    dragEndHandler(_) { }
    dragOverHandler(event) {
        event.preventDefault();
    }
    dragLeaveHandler(event) { }
    // drophandler only for hero
    dropHandler(event) {
        event.preventDefault();
        const newItem = event.dataTransfer.getData('text/plain');
        if (!+newItem) {
            return;
        }
        const oldItem = event.target.id;
        const target = event.target.className;
        if (_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.enoughGold(newItem, oldItem, 'heroGold')) {
            _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.initChange(newItem, oldItem, target);
            const heroContainer = this.gameContainer[0];
            this.renderItems(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.heroItems, heroContainer.children[1], 'hero');
            this.renderGold(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.heroGold, heroContainer.children[3]);
        }
    }
    // drophandler opponent
    dropOpponent(event) {
        event.preventDefault();
        const newItem = event.dataTransfer.getData('text/plain');
        const oldItem = event.target.id;
        const target = event.target.className;
        if (_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.enoughGold(newItem, oldItem, 'opponentGold')) {
            _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.initChange(newItem, oldItem, target);
            const opponentContainer = this.gameContainer[2];
            this.renderItems(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.opponentItems, opponentContainer.children[1], 'opponent');
            this.renderGold(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.opponentGold, opponentContainer.children[3]);
        }
    }
    resetItems(event) {
        const id = event.target.id;
        if (id === 'reset-hero') {
            const heroContainer = this.gameContainer[0];
            _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.reset('heroGold', 'heroItems');
            this.renderItems(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.heroItems, heroContainer.children[1], 'hero');
            this.renderGold(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.heroGold, heroContainer.children[3]);
            return;
        }
        if (id === 'reset-opponent') {
            _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.reset('opponentGold', 'opponentItems');
            const opponentContainer = this.gameContainer[2];
            this.renderItems(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.opponentItems, opponentContainer.children[1], 'opponent');
            this.renderGold(_index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.opponentGold, opponentContainer.children[3]);
        }
    }
    calculateWinner() {
        _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.performCalculation();
    }
    callNextOpponent(event) {
        _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.setCurrentOpponent();
        _index__WEBPACK_IMPORTED_MODULE_1__.dataContainer.gameState.getOpponentItems();
        const opponentContainer = this.gameContainer[2];
        this.renderOpponent();
    }
    configureEventListeners() {
        const resetBtns = document.querySelectorAll('.reset-btns');
        resetBtns.forEach((btn) => btn.addEventListener('click', this.resetItems));
        const nextOpponent = document.querySelector('#next');
        nextOpponent.addEventListener('click', this.callNextOpponent);
        const calculateBtn = document.querySelector('#calculate');
        calculateBtn.addEventListener('click', this.calculateWinner);
        this.startItemsContainer.addEventListener('dragstart', this.dragStartHandler);
        this.startItemsContainer.addEventListener('dragend', this.dragEndHandler);
        this.gameContainer[0].children[1].addEventListener('dragover', this.dragOverHandler);
        this.gameContainer[0].children[1].addEventListener('dragleave', this.dragLeaveHandler);
        this.gameContainer[0].children[1].addEventListener('drop', this.dropHandler);
        // opponent
        this.gameContainer[2].children[1].addEventListener('dragover', this.dragOverHandler);
        this.gameContainer[2].children[1].addEventListener('dragleave', this.dragLeaveHandler);
        this.gameContainer[2].children[1].addEventListener('drop', this.dropOpponent);
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameView();
        return this.instance;
    }
}
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "dragStartHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "dragEndHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "dragOverHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "dragLeaveHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "dropHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "dropOpponent", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "resetItems", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "calculateWinner", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_2__.autobind
], GameView.prototype, "callNextOpponent", null);


/***/ }),

/***/ "./src/Components/Heroes.ts":
/*!**********************************!*\
  !*** ./src/Components/Heroes.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Heroes": () => (/* binding */ Heroes)
/* harmony export */ });
class Heroes {
    constructor(apiResponse) {
        this.list = {};
        for (const key in apiResponse) {
            this.list[apiResponse[key]['id']] = {
                img: 'https://api.opendota.com' + apiResponse[key]['img'],
                agi_gain: apiResponse[key]['agi_gain'],
                attack_range: apiResponse[key]['attack_range'],
                attack_rate: apiResponse[key]['attack_rate'],
                attack_type: apiResponse[key]['attack_type'],
                base_agi: apiResponse[key]['base_agi'],
                base_armor: apiResponse[key]['base_armor'],
                base_attack_max: apiResponse[key]['base_attack_max'],
                base_attack_min: apiResponse[key]['base_attack_min'],
                base_health: apiResponse[key]['base_health'],
                base_health_regen: apiResponse[key]['base_health_regen'],
                base_int: apiResponse[key]['base_int'],
                base_mana: apiResponse[key]['base_mana'],
                base_mana_regen: apiResponse[key]['base_mana_regen'],
                base_mr: apiResponse[key]['base_mr'],
                base_str: apiResponse[key]['base_str'],
                int_gain: apiResponse[key]['int_gain'],
                localized_name: apiResponse[key]['localized_name'],
                move_speed: apiResponse[key]['move_speed'],
                primary_attr: apiResponse[key]['primary_attr'],
                projectile_speed: apiResponse[key]['projectile_speed'],
                str_gain: apiResponse[key]['str_gain'],
                id: apiResponse[key]['id'],
            };
        }
    }
    plainHeroObj(id) {
        return this.list[id];
    }
    getOpponents(gameMode, heroId) {
        if (gameMode === 'random') {
            const listClone = Object.assign({}, this.list);
            delete listClone[+heroId];
            return listClone;
        }
        if (gameMode === 'choice') {
            return;
        }
    }
}


/***/ }),

/***/ "./src/Components/Items.ts":
/*!*********************************!*\
  !*** ./src/Components/Items.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Items": () => (/* binding */ Items)
/* harmony export */ });
const img = __webpack_require__(/*! ../imgs/noitems.png */ "./src/imgs/noitems.png");
class Items {
    constructor(apiResponse) {
        this.list = {};
        for (const key in apiResponse) {
            this.list[apiResponse[key]['id']] = {
                img: 'https://api.opendota.com' + apiResponse[key]['img'],
                dname: apiResponse[key]['dname'],
                id: apiResponse[key]['id'],
            };
        }
    }
    plainItemObj(itemsArr) {
        let itemProperties = [];
        itemsArr.map((x) => {
            if (x === undefined || x === 999) {
                itemProperties.push({
                    dname: 'no item',
                    id: 999,
                    img: img,
                });
                return;
            }
            if (x) {
                itemProperties.push(this.list[x]);
                return;
            }
        });
        return itemProperties;
    }
}


/***/ }),

/***/ "./src/Components/Loading.ts":
/*!***********************************!*\
  !*** ./src/Components/Loading.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Loading": () => (/* binding */ Loading)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/Components/Component.ts");

class Loading extends _Component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor() {
        super('tmpl-loading-screen', 'app');
        this.attach(true);
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Loading();
        return this.instance;
    }
}


/***/ }),

/***/ "./src/Components/Router.ts":
/*!**********************************!*\
  !*** ./src/Components/Router.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Router": () => (/* binding */ Router)
/* harmony export */ });
/* harmony import */ var _Loading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Loading */ "./src/Components/Loading.ts");
/* harmony import */ var _StartView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StartView */ "./src/Components/StartView.ts");
/* harmony import */ var _GameView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameView */ "./src/Components/GameView.ts");



class Router {
    static loading() {
        _Loading__WEBPACK_IMPORTED_MODULE_0__.Loading.getInstance();
    }
    static startView() {
        _StartView__WEBPACK_IMPORTED_MODULE_1__.StartView.getInstance();
    }
    static gameView() {
        _GameView__WEBPACK_IMPORTED_MODULE_2__.GameView.getInstance();
    }
}


/***/ }),

/***/ "./src/Components/StartView.ts":
/*!*************************************!*\
  !*** ./src/Components/StartView.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StartView": () => (/* binding */ StartView)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _Decorators_autobind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Decorators/autobind */ "./src/Decorators/autobind.ts");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Component */ "./src/Components/Component.ts");
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Router */ "./src/Components/Router.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class StartView extends _Component__WEBPACK_IMPORTED_MODULE_2__.Component {
    constructor() {
        super('tmpl-hero-overview', 'app');
        this.imagesLoaded = 0;
        this.selectedHeroId = '';
        this.heroList = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.heroes.list;
        this.render();
    }
    render() {
        for (const key in this.heroList) {
            const img = document.createElement('img');
            img.id = this.heroList[key].id.toString();
            img.classList.add('hero-portrait');
            img.onerror = () => this.updateDOM();
            img.onload = () => this.updateDOM();
            img.src = this.heroList[key].img;
            this.element[0].appendChild(img);
        }
        this.configureEventListeners();
    }
    updateDOM() {
        this.imagesLoaded += 1;
        if (this.imagesLoaded === 121) {
            this.dispatch();
            this.attach(false);
            this.imagesLoaded = 0;
        }
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.effectAllowed = 'copy';
    }
    dragEndHandler(_) { }
    dragOverHandler(event) {
        event.preventDefault();
        event.target.classList.add('droppable');
    }
    dragLeaveHandler(event) {
        event.target.classList.remove('droppable');
    }
    dropHandler(event) {
        event.preventDefault();
        const heroId = event.dataTransfer.getData('text/plain');
        const img = document.createElement('img');
        const transferData = this.heroList[event.dataTransfer.getData('text/plain')];
        const firstChild = this.element[1].firstElementChild;
        img.id = transferData['id'];
        img.src = transferData['img'];
        if (firstChild === null || firstChild === void 0 ? void 0 : firstChild.firstElementChild) {
            firstChild === null || firstChild === void 0 ? void 0 : firstChild.firstElementChild.remove();
        }
        firstChild.appendChild(img);
        this.selectedHeroId = transferData['id'];
    }
    clickHandler(event) {
        if (this.selectedHeroId)
            this.callGameView(this.selectedHeroId);
    }
    callGameView(heroId) {
        return __awaiter(this, void 0, void 0, function* () {
            let init;
            try {
                init = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.initGameState(heroId, 'random');
                yield _Router__WEBPACK_IMPORTED_MODULE_3__.Router.gameView();
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    configureEventListeners() {
        this.element[0].addEventListener('dragstart', this.dragStartHandler);
        this.element[0].addEventListener('dragend', this.dragEndHandler);
        this.element[1].children[0].addEventListener('dragover', this.dragOverHandler);
        this.element[1].children[0].addEventListener('dragleave', this.dragLeaveHandler);
        this.element[1].children[0].addEventListener('drop', this.dropHandler);
        this.element[1].children[1].addEventListener('click', this.clickHandler);
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new StartView();
        return this.instance;
    }
}
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_1__.autobind
], StartView.prototype, "dragStartHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_1__.autobind
], StartView.prototype, "dragEndHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_1__.autobind
], StartView.prototype, "dragOverHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_1__.autobind
], StartView.prototype, "dragLeaveHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_1__.autobind
], StartView.prototype, "dropHandler", null);
__decorate([
    _Decorators_autobind__WEBPACK_IMPORTED_MODULE_1__.autobind
], StartView.prototype, "clickHandler", null);


/***/ }),

/***/ "./src/Components/Util.ts":
/*!********************************!*\
  !*** ./src/Components/Util.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Util": () => (/* binding */ Util)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Util {
    static getData(baseUrl, urlExtension) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios__WEBPACK_IMPORTED_MODULE_0___default()(baseUrl + urlExtension);
            return response.data;
        });
    }
}


/***/ }),

/***/ "./src/Decorators/autobind.ts":
/*!************************************!*\
  !*** ./src/Decorators/autobind.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autobind": () => (/* binding */ autobind)
/* harmony export */ });
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}


/***/ }),

/***/ "./src/Models/heroStartItems/_enums.ts":
/*!*********************************************!*\
  !*** ./src/Models/heroStartItems/_enums.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Heroes": () => (/* binding */ Heroes),
/* harmony export */   "ItemsEnum": () => (/* binding */ ItemsEnum)
/* harmony export */ });
var Heroes;
(function (Heroes) {
    Heroes[Heroes["Anti-Mage"] = 1] = "Anti-Mage";
    Heroes[Heroes["Axe"] = 2] = "Axe";
    Heroes[Heroes["Bane"] = 3] = "Bane";
    Heroes[Heroes["Bloodseeker"] = 4] = "Bloodseeker";
    Heroes[Heroes["Crystal Maiden"] = 5] = "Crystal Maiden";
    Heroes[Heroes["Drow Ranger"] = 6] = "Drow Ranger";
    Heroes[Heroes["Earthshaker"] = 7] = "Earthshaker";
    Heroes[Heroes["Juggernaut"] = 8] = "Juggernaut";
    Heroes[Heroes["Mirana"] = 9] = "Mirana";
    Heroes[Heroes["Morphling"] = 10] = "Morphling";
    Heroes[Heroes["Shadow Fiend"] = 11] = "Shadow Fiend";
    Heroes[Heroes["Phantom Lancer"] = 12] = "Phantom Lancer";
    Heroes[Heroes["Puck"] = 13] = "Puck";
    Heroes[Heroes["Pudge"] = 14] = "Pudge";
    Heroes[Heroes["Razor"] = 15] = "Razor";
    Heroes[Heroes["Sand King"] = 16] = "Sand King";
    Heroes[Heroes["Storm Spirit"] = 17] = "Storm Spirit";
    Heroes[Heroes["Sven"] = 18] = "Sven";
    Heroes[Heroes["Tiny"] = 19] = "Tiny";
    Heroes[Heroes["Vengeful Spirit"] = 20] = "Vengeful Spirit";
    Heroes[Heroes["Windranger"] = 21] = "Windranger";
    Heroes[Heroes["Zeus"] = 22] = "Zeus";
    Heroes[Heroes["Kunkka"] = 23] = "Kunkka";
    Heroes[Heroes["Lina"] = 25] = "Lina";
    Heroes[Heroes["Lion"] = 26] = "Lion";
    Heroes[Heroes["Shadow Shaman"] = 27] = "Shadow Shaman";
    Heroes[Heroes["Slardar"] = 28] = "Slardar";
    Heroes[Heroes["Tidehunter"] = 29] = "Tidehunter";
    Heroes[Heroes["Witch Doctor"] = 30] = "Witch Doctor";
    Heroes[Heroes["Lich"] = 31] = "Lich";
    Heroes[Heroes["Riki"] = 32] = "Riki";
    Heroes[Heroes["Enigma"] = 33] = "Enigma";
    Heroes[Heroes["Tinker"] = 34] = "Tinker";
    Heroes[Heroes["Sniper"] = 35] = "Sniper";
    Heroes[Heroes["Necrophos"] = 36] = "Necrophos";
    Heroes[Heroes["Warlock"] = 37] = "Warlock";
    Heroes[Heroes["Beastmaster"] = 38] = "Beastmaster";
    Heroes[Heroes["Queen of Pain"] = 39] = "Queen of Pain";
    Heroes[Heroes["Venomancer"] = 40] = "Venomancer";
    Heroes[Heroes["Faceless Void"] = 41] = "Faceless Void";
    Heroes[Heroes["Wraith King"] = 42] = "Wraith King";
    Heroes[Heroes["Death Prophet"] = 43] = "Death Prophet";
    Heroes[Heroes["Phantom Assassin"] = 44] = "Phantom Assassin";
    Heroes[Heroes["Pugna"] = 45] = "Pugna";
    Heroes[Heroes["Templar Assassin"] = 46] = "Templar Assassin";
    Heroes[Heroes["Viper"] = 47] = "Viper";
    Heroes[Heroes["Luna"] = 48] = "Luna";
    Heroes[Heroes["Dragon Knight"] = 49] = "Dragon Knight";
    Heroes[Heroes["Dazzle"] = 50] = "Dazzle";
    Heroes[Heroes["Clockwerk"] = 51] = "Clockwerk";
    Heroes[Heroes["Leshrac"] = 52] = "Leshrac";
    Heroes[Heroes["Nature's Prophet"] = 53] = "Nature's Prophet";
    Heroes[Heroes["Lifestealer"] = 54] = "Lifestealer";
    Heroes[Heroes["Dark Seer"] = 55] = "Dark Seer";
    Heroes[Heroes["Clinkz"] = 56] = "Clinkz";
    Heroes[Heroes["Omniknight"] = 57] = "Omniknight";
    Heroes[Heroes["Enchantress"] = 58] = "Enchantress";
    Heroes[Heroes["Huskar"] = 59] = "Huskar";
    Heroes[Heroes["Night Stalker"] = 60] = "Night Stalker";
    Heroes[Heroes["Broodmother"] = 61] = "Broodmother";
    Heroes[Heroes["Bounty Hunter"] = 62] = "Bounty Hunter";
    Heroes[Heroes["Weaver"] = 63] = "Weaver";
    Heroes[Heroes["Jakiro"] = 64] = "Jakiro";
    Heroes[Heroes["Batrider"] = 65] = "Batrider";
    Heroes[Heroes["Chen"] = 66] = "Chen";
    Heroes[Heroes["Spectre"] = 67] = "Spectre";
    Heroes[Heroes["Ancient Apparition"] = 68] = "Ancient Apparition";
    Heroes[Heroes["Doom"] = 69] = "Doom";
    Heroes[Heroes["Ursa"] = 70] = "Ursa";
    Heroes[Heroes["Spirit Breaker"] = 71] = "Spirit Breaker";
    Heroes[Heroes["Gyrocopter"] = 72] = "Gyrocopter";
    Heroes[Heroes["Alchemist"] = 73] = "Alchemist";
    Heroes[Heroes["Invoker"] = 74] = "Invoker";
    Heroes[Heroes["Silencer"] = 75] = "Silencer";
    Heroes[Heroes["Outworld Devourer"] = 76] = "Outworld Devourer";
    Heroes[Heroes["Lycan"] = 77] = "Lycan";
    Heroes[Heroes["Brewmaster"] = 78] = "Brewmaster";
    Heroes[Heroes["Shadow Demon"] = 79] = "Shadow Demon";
    Heroes[Heroes["Lone Druid"] = 80] = "Lone Druid";
    Heroes[Heroes["Chaos Knight"] = 81] = "Chaos Knight";
    Heroes[Heroes["Meepo"] = 82] = "Meepo";
    Heroes[Heroes["Treant Protector"] = 83] = "Treant Protector";
    Heroes[Heroes["Ogre Magi"] = 84] = "Ogre Magi";
    Heroes[Heroes["Undying"] = 85] = "Undying";
    Heroes[Heroes["Rubick"] = 86] = "Rubick";
    Heroes[Heroes["Disruptor"] = 87] = "Disruptor";
    Heroes[Heroes["Nyx Assassin"] = 88] = "Nyx Assassin";
    Heroes[Heroes["Naga Siren"] = 89] = "Naga Siren";
    Heroes[Heroes["Keeper of the Light"] = 90] = "Keeper of the Light";
    Heroes[Heroes["Wisp"] = 91] = "Wisp";
    Heroes[Heroes["Visage"] = 92] = "Visage";
    Heroes[Heroes["Slark"] = 93] = "Slark";
    Heroes[Heroes["Medusa"] = 94] = "Medusa";
    Heroes[Heroes["Troll Warlord"] = 95] = "Troll Warlord";
    Heroes[Heroes["Centaur Warrunner"] = 96] = "Centaur Warrunner";
    Heroes[Heroes["Magnus"] = 97] = "Magnus";
    Heroes[Heroes["Timbersaw"] = 98] = "Timbersaw";
    Heroes[Heroes["Bristleback"] = 99] = "Bristleback";
    Heroes[Heroes["Tusk"] = 100] = "Tusk";
    Heroes[Heroes["Skywrath Mage"] = 101] = "Skywrath Mage";
    Heroes[Heroes["Abaddon"] = 102] = "Abaddon";
    Heroes[Heroes["Elder Titan"] = 103] = "Elder Titan";
    Heroes[Heroes["Legion Commander"] = 104] = "Legion Commander";
    Heroes[Heroes["Techies"] = 105] = "Techies";
    Heroes[Heroes["Ember Spirit"] = 106] = "Ember Spirit";
    Heroes[Heroes["Earth Spirit"] = 107] = "Earth Spirit";
    Heroes[Heroes["Underlord"] = 108] = "Underlord";
    Heroes[Heroes["Terrorblade"] = 109] = "Terrorblade";
    Heroes[Heroes["Phoenix"] = 110] = "Phoenix";
    Heroes[Heroes["Oracle"] = 111] = "Oracle";
    Heroes[Heroes["Winter Wyvern"] = 112] = "Winter Wyvern";
    Heroes[Heroes["Arc Warden"] = 113] = "Arc Warden";
    Heroes[Heroes["Monkey King"] = 114] = "Monkey King";
    Heroes[Heroes["Dark Willow"] = 119] = "Dark Willow";
    Heroes[Heroes["Pangolier"] = 120] = "Pangolier";
    Heroes[Heroes["Grimstroke"] = 121] = "Grimstroke";
    Heroes[Heroes["Hoodwink"] = 123] = "Hoodwink";
    Heroes[Heroes["Void Spirit"] = 126] = "Void Spirit";
    Heroes[Heroes["Snapfire"] = 128] = "Snapfire";
    Heroes[Heroes["Mars"] = 129] = "Mars";
    Heroes[Heroes["Dawnbreaker"] = 135] = "Dawnbreaker";
})(Heroes || (Heroes = {}));
var ItemsEnum;
(function (ItemsEnum) {
    ItemsEnum[ItemsEnum["Blades of Attack"] = 2] = "Blades of Attack";
    ItemsEnum[ItemsEnum["Chainmail"] = 4] = "Chainmail";
    ItemsEnum[ItemsEnum["Quelling Blade"] = 11] = "Quelling Blade";
    ItemsEnum[ItemsEnum["Ring of Protection"] = 12] = "Ring of Protection";
    ItemsEnum[ItemsEnum["Gauntlets of Strength"] = 13] = "Gauntlets of Strength";
    ItemsEnum[ItemsEnum["Slippers of Agility"] = 14] = "Slippers of Agility";
    ItemsEnum[ItemsEnum["Mantle of Intelligence"] = 15] = "Mantle of Intelligence";
    ItemsEnum[ItemsEnum["Iron Branch"] = 16] = "Iron Branch";
    ItemsEnum[ItemsEnum["Belt of Strength"] = 17] = "Belt of Strength";
    ItemsEnum[ItemsEnum["Band of Elvenskin"] = 18] = "Band of Elvenskin";
    ItemsEnum[ItemsEnum["Robe of the Magi"] = 19] = "Robe of the Magi";
    ItemsEnum[ItemsEnum["Circlet"] = 20] = "Circlet";
    ItemsEnum[ItemsEnum["Gloves of Haste"] = 25] = "Gloves of Haste";
    ItemsEnum[ItemsEnum["Ring of Regen"] = 27] = "Ring of Regen";
    ItemsEnum[ItemsEnum["Sage's Mask"] = 28] = "Sage's Mask";
    ItemsEnum[ItemsEnum["Boots of Speed"] = 29] = "Boots of Speed";
    ItemsEnum[ItemsEnum["Cloak"] = 31] = "Cloak";
    ItemsEnum[ItemsEnum["Magic Stick"] = 34] = "Magic Stick";
    ItemsEnum[ItemsEnum["Magic Wand"] = 36] = "Magic Wand";
    ItemsEnum[ItemsEnum["Clarity"] = 38] = "Clarity";
    ItemsEnum[ItemsEnum["Healing Salve"] = 39] = "Healing Salve";
    ItemsEnum[ItemsEnum["Dust of Appearance"] = 40] = "Dust of Appearance";
    ItemsEnum[ItemsEnum["Observer Ward"] = 42] = "Observer Ward";
    ItemsEnum[ItemsEnum["Sentry Ward"] = 43] = "Sentry Ward";
    ItemsEnum[ItemsEnum["Tango"] = 44] = "Tango";
    ItemsEnum[ItemsEnum["Bracer"] = 73] = "Bracer";
    ItemsEnum[ItemsEnum["Wraith Band"] = 75] = "Wraith Band";
    ItemsEnum[ItemsEnum["Null Talisman"] = 77] = "Null Talisman";
    ItemsEnum[ItemsEnum["Buckler"] = 86] = "Buckler";
    ItemsEnum[ItemsEnum["Ring of Basilius"] = 88] = "Ring of Basilius";
    ItemsEnum[ItemsEnum["Headdress"] = 94] = "Headdress";
    ItemsEnum[ItemsEnum["Orb of Venom"] = 181] = "Orb of Venom";
    ItemsEnum[ItemsEnum["Smoke of Deceit"] = 188] = "Smoke of Deceit";
    ItemsEnum[ItemsEnum["Enchanted Mango"] = 216] = "Enchanted Mango";
    ItemsEnum[ItemsEnum["Faerie Fire"] = 237] = "Faerie Fire";
    ItemsEnum[ItemsEnum["Blight Stone"] = 240] = "Blight Stone";
    ItemsEnum[ItemsEnum["Wind Lace"] = 244] = "Wind Lace";
    ItemsEnum[ItemsEnum["Crown"] = 261] = "Crown";
    ItemsEnum[ItemsEnum["Raindrops"] = 265] = "Raindrops";
    ItemsEnum[ItemsEnum["Fluffy Hat"] = 593] = "Fluffy Hat";
    ItemsEnum[ItemsEnum["no item"] = 999] = "no item";
})(ItemsEnum || (ItemsEnum = {}));


/***/ }),

/***/ "./src/Models/heroStartItems/startItems.ts":
/*!*************************************************!*\
  !*** ./src/Models/heroStartItems/startItems.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "itemStats": () => (/* binding */ itemStats),
/* harmony export */   "heroStartItems": () => (/* binding */ heroStartItems)
/* harmony export */ });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_enums */ "./src/Models/heroStartItems/_enums.ts");

const itemStats = {
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity]: {
        relevantValues: true,
        gold: 50,
        manaRegenTemp: 6,
        manaRegenDuration: 25,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Dust of Appearance"]]: {
        relevantValues: false,
        gold: 80,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"]]: {
        relevantValues: true,
        gold: 70,
        hpRegenPermanent: 0.6,
        manaRegenTemp: 100,
        manaRegenDuration: 1,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"]]: {
        relevantValues: true,
        gold: 70,
        heal: 85,
        dmgRaw: 2,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"]]: {
        relevantValues: false,
        gold: 110,
        hpRegenTemp: 40,
        hpRegenDuration: 10,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Sentry Ward"]]: {
        relevantValues: false,
        gold: 50,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"]]: {
        relevantValues: false,
        gold: 0,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Smoke of Deceit"]]: {
        relevantValues: false,
        gold: 50,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango]: {
        relevantValues: true,
        gold: 90,
        hpRegenTemp: 7.1875,
        hpRegenDuration: 16,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Band of Elvenskin"]]: {
        relevantValues: true,
        gold: 450,
        agiBonus: 6,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Belt of Strength"]]: {
        relevantValues: true,
        gold: 450,
        strBonus: 6,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet]: {
        relevantValues: true,
        gold: 155,
        strBonus: 2,
        agiBonus: 2,
        intBonus: 2,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Crown]: {
        relevantValues: true,
        gold: 450,
        strBonus: 4,
        agiBonus: 4,
        intBonus: 4,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gauntlets of Strength"]]: {
        relevantValues: true,
        gold: 140,
        strBonus: 3,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"]]: {
        relevantValues: true,
        gold: 50,
        strBonus: 1,
        agiBonus: 1,
        intBonus: 1,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"]]: {
        relevantValues: true,
        gold: 140,
        intBonus: 3,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Robe of the Magi"]]: {
        relevantValues: true,
        gold: 450,
        intBonus: 6,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"]]: {
        relevantValues: true,
        gold: 140,
        agiBonus: 3,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Blades of Attack"]]: {
        relevantValues: true,
        gold: 450,
        dmgRaw: 9,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Blight Stone"]]: {
        relevantValues: true,
        gold: 300,
        armorDebuff: 2,
        armorDebuffDuration: 8,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Chainmail]: {
        relevantValues: true,
        gold: 550,
        armorRaw: 4,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gloves of Haste"]]: {
        relevantValues: true,
        gold: 450,
        attSpeedRaw: 20,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Raindrops]: {
        relevantValues: false,
        gold: 225,
        manaRegenPermanent: 0.8,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Orb of Venom"]]: {
        relevantValues: true,
        gold: 275,
        dmgTempValue: 2,
        dmgTempDuration: 2,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"]]: {
        relevantValues: false,
        gold: 130,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"]]: {
        relevantValues: true,
        gold: 175,
        armorRaw: 2,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Boots of Speed"]]: {
        relevantValues: false,
        gold: 500,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Cloak]: {
        relevantValues: false,
        gold: 500,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Fluffy Hat"]]: {
        relevantValues: true,
        gold: 250,
        hpRaw: 125,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Magic Stick"]]: {
        relevantValues: false,
        gold: 200,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Regen"]]: {
        relevantValues: true,
        gold: 175,
        hpRegenPermanent: 1.25,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Sage's Mask"]]: {
        relevantValues: false,
        gold: 175,
        manaRegenPermanent: 0.7,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Wind Lace"]]: {
        relevantValues: false,
        gold: 250,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Bracer]: {
        relevantValues: true,
        gold: 505,
        strBonus: 5,
        agiBonus: 2,
        intBonus: 2,
        hpRegenPermanent: 1,
        dmgRaw: 3,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Magic Wand"]]: {
        relevantValues: true,
        gold: 450,
        strBonus: 3,
        agiBonus: 3,
        intBonus: 3,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Null Talisman"]]: {
        relevantValues: true,
        gold: 505,
        strBonus: 2,
        agiBonus: 2,
        intBonus: 5,
        manaRegenPermanent: 0.6,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Wraith Band"]]: {
        relevantValues: true,
        gold: 505,
        strBonus: 2,
        agiBonus: 5,
        intBonus: 2,
        armorRaw: 1.5,
        attSpeedRaw: 5,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Buckler]: {
        relevantValues: true,
        gold: 425,
        armorRaw: 3,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Headdress]: {
        relevantValues: true,
        gold: 425,
        hpRegenPermanent: 2.5,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Basilius"]]: {
        relevantValues: true,
        gold: 425,
        manaRegenPermanent: 1.5,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["no item"]]: {
        relevantValues: false,
        gold: 0,
    },
};
const heroStartItems = {
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Anti-Mage"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Axe]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Bane]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Bloodseeker]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Crystal Maiden"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Drow Ranger"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Earthshaker]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Boots of Speed"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item4: undefined,
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Juggernaut]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Mirana]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Sage's Mask"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Morphling]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Shadow Fiend"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Phantom Lancer"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Puck]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Pudge]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Razor]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Sand King"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Storm Spirit"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Sven]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Tiny]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Vengeful Spirit"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Windranger]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Zeus]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Kunkka]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Lina]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Lion]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Wind Lace"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Shadow Shaman"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Slardar]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Tidehunter]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Witch Doctor"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Lich]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Riki]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Orb of Venom"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Enigma]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Null Talisman"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item4: undefined,
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Tinker]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Sniper]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Necrophos]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Warlock]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Sage's Mask"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Beastmaster]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Queen of Pain"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Venomancer]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Faceless Void"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Wraith King"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Death Prophet"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Phantom Assassin"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Pugna]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Templar Assassin"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Viper]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Luna]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Dragon Knight"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Dazzle]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Sage's Mask"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Clockwerk]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Wind Lace"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Leshrac]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Nature's Prophet"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Blight Stone"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Lifestealer]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gauntlets of Strength"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Dark Seer"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Clinkz]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Omniknight]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gauntlets of Strength"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Enchantress]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Blight Stone"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Huskar]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gauntlets of Strength"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Night Stalker"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Broodmother]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Bounty Hunter"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Boots of Speed"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item4: undefined,
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Weaver]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Jakiro]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Batrider]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Chen]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Sage's Mask"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Spectre]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Ancient Apparition"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Doom]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Ursa]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Spirit Breaker"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Boots of Speed"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item4: undefined,
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Gyrocopter]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Sage's Mask"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Alchemist]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gauntlets of Strength"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Invoker]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Silencer]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Outworld Devourer"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Crown,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Lycan]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Brewmaster]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Shadow Demon"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Lone Druid"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Orb of Venom"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Chaos Knight"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Meepo]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Treant Protector"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Orb of Venom"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Ogre Magi"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Undying]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Rubick]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Boots of Speed"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item4: undefined,
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Disruptor]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Nyx Assassin"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Boots of Speed"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item4: undefined,
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Naga Siren"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Keeper of the Light"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Wisp]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Headdress,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Visage]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Slark]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Medusa]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Troll Warlord"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Centaur Warrunner"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Magnus]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Timbersaw]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Bristleback]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Tusk]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Boots of Speed"],
        item3: undefined,
        item4: undefined,
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Skywrath Mage"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    // last round
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Abaddon]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Sage's Mask"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Elder Titan"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Wind Lace"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Legion Commander"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gauntlets of Strength"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gauntlets of Strength"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Techies]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Wind Lace"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Ember Spirit"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Earth Spirit"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Underlord]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Ring of Protection"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Terrorblade]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Phoenix]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Crown,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
        item5: undefined,
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Oracle]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Winter Wyvern"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Arc Warden"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Slippers of Agility"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Monkey King"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Orb of Venom"],
        item6: undefined,
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Dark Willow"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Pangolier]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Grimstroke]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Enchanted Mango"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Hoodwink]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Blight Stone"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes["Void Spirit"]]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Mantle of Intelligence"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Snapfire]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Clarity,
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Blight Stone"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Mars]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Healing Salve"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Circlet,
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Observer Ward"],
    },
    [_enums__WEBPACK_IMPORTED_MODULE_0__.Heroes.Dawnbreaker]: {
        item1: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum.Tango,
        item2: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Faerie Fire"],
        item3: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item4: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Iron Branch"],
        item5: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Quelling Blade"],
        item6: _enums__WEBPACK_IMPORTED_MODULE_0__.ItemsEnum["Gauntlets of Strength"],
    },
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dataContainer": () => (/* binding */ dataContainer)
/* harmony export */ });
/* harmony import */ var _Components_Router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Components/Router */ "./src/Components/Router.ts");
/* harmony import */ var _Components_Util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Components/Util */ "./src/Components/Util.ts");
/* harmony import */ var _Components_DataContainer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Components/DataContainer */ "./src/Components/DataContainer.ts");



_Components_Router__WEBPACK_IMPORTED_MODULE_0__.Router.loading();
const dataContainer = new _Components_DataContainer__WEBPACK_IMPORTED_MODULE_2__.DataContainer();
_Components_Util__WEBPACK_IMPORTED_MODULE_1__.Util.getData('https://api.opendota.com/api', '/constants/heroes')
    .then((res) => {
    dataContainer.initHeroList(res);
    _Components_Router__WEBPACK_IMPORTED_MODULE_0__.Router.startView();
})
    .catch((err) => {
    console.log(err);
});
_Components_Util__WEBPACK_IMPORTED_MODULE_1__.Util.getData('https://api.opendota.com/api', '/constants/items')
    .then((res) => {
    dataContainer.initItemList(res);
})
    .catch((err) => {
    console.log(err);
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7VUVmQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvYnVpbGRGdWxsUGF0aC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvY3JlYXRlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL2ltZ3Mvbm9pdGVtcy5wbmciLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvQ2FsY3VsYXRpb24udHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvQ29tcG9uZW50LnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL0RhdGFDb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvR2FtZVN0YXRlLnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL0dhbWVWaWV3LnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL0hlcm9lcy50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9JdGVtcy50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9Mb2FkaW5nLnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL1JvdXRlci50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9TdGFydFZpZXcudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvVXRpbC50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvRGVjb3JhdG9ycy9hdXRvYmluZC50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvTW9kZWxzL2hlcm9TdGFydEl0ZW1zL19lbnVtcy50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvTW9kZWxzL2hlcm9TdGFydEl0ZW1zL3N0YXJ0SXRlbXMudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLmF1dGgucGFzc3dvcmQpKSA6ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9ICd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCc7XG4gICAgICBpZiAoY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKHRpbWVvdXRFcnJvck1lc3NhZ2UsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXF1ZXN0RGF0YSkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9jb3JlL21lcmdlQ29uZmlnJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGF4aW9zLmRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxuLy8gRXhwb3NlIGlzQXhpb3NFcnJvclxuYXhpb3MuaXNBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzQXhpb3NFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBhcmd1bWVudHNbMF07XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICB9XG5cbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblxuICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gdGhpcy5kZWZhdWx0cy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcubWV0aG9kID0gJ2dldCc7XG4gIH1cblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuQXhpb3MucHJvdG90eXBlLmdldFVyaSA9IGZ1bmN0aW9uIGdldFVyaShjb25maWcpIHtcbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vZW5oYW5jZUVycm9yJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1xuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG5cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIGVycm9yLmlzQXhpb3NFcnJvciA9IHRydWU7XG5cbiAgZXJyb3IudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgY29kZTogdGhpcy5jb2RlXG4gICAgfTtcbiAgfTtcbiAgcmV0dXJuIGVycm9yO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBDb25maWctc3BlY2lmaWMgbWVyZ2UtZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhIG5ldyBjb25maWctb2JqZWN0XG4gKiBieSBtZXJnaW5nIHR3byBjb25maWd1cmF0aW9uIG9iamVjdHMgdG9nZXRoZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzFcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBOZXcgb2JqZWN0IHJlc3VsdGluZyBmcm9tIG1lcmdpbmcgY29uZmlnMiB0byBjb25maWcxXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIHZhciBjb25maWcgPSB7fTtcblxuICB2YXIgdmFsdWVGcm9tQ29uZmlnMktleXMgPSBbJ3VybCcsICdtZXRob2QnLCAnZGF0YSddO1xuICB2YXIgbWVyZ2VEZWVwUHJvcGVydGllc0tleXMgPSBbJ2hlYWRlcnMnLCAnYXV0aCcsICdwcm94eScsICdwYXJhbXMnXTtcbiAgdmFyIGRlZmF1bHRUb0NvbmZpZzJLZXlzID0gW1xuICAgICdiYXNlVVJMJywgJ3RyYW5zZm9ybVJlcXVlc3QnLCAndHJhbnNmb3JtUmVzcG9uc2UnLCAncGFyYW1zU2VyaWFsaXplcicsXG4gICAgJ3RpbWVvdXQnLCAndGltZW91dE1lc3NhZ2UnLCAnd2l0aENyZWRlbnRpYWxzJywgJ2FkYXB0ZXInLCAncmVzcG9uc2VUeXBlJywgJ3hzcmZDb29raWVOYW1lJyxcbiAgICAneHNyZkhlYWRlck5hbWUnLCAnb25VcGxvYWRQcm9ncmVzcycsICdvbkRvd25sb2FkUHJvZ3Jlc3MnLCAnZGVjb21wcmVzcycsXG4gICAgJ21heENvbnRlbnRMZW5ndGgnLCAnbWF4Qm9keUxlbmd0aCcsICdtYXhSZWRpcmVjdHMnLCAndHJhbnNwb3J0JywgJ2h0dHBBZ2VudCcsXG4gICAgJ2h0dHBzQWdlbnQnLCAnY2FuY2VsVG9rZW4nLCAnc29ja2V0UGF0aCcsICdyZXNwb25zZUVuY29kaW5nJ1xuICBdO1xuICB2YXIgZGlyZWN0TWVyZ2VLZXlzID0gWyd2YWxpZGF0ZVN0YXR1cyddO1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgdXRpbHMuZm9yRWFjaCh2YWx1ZUZyb21Db25maWcyS2V5cywgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gobWVyZ2VEZWVwUHJvcGVydGllc0tleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuXG4gIHV0aWxzLmZvckVhY2goZGVmYXVsdFRvQ29uZmlnMktleXMsIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKGRpcmVjdE1lcmdlS2V5cywgZnVuY3Rpb24gbWVyZ2UocHJvcCkge1xuICAgIGlmIChwcm9wIGluIGNvbmZpZzIpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGF4aW9zS2V5cyA9IHZhbHVlRnJvbUNvbmZpZzJLZXlzXG4gICAgLmNvbmNhdChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cylcbiAgICAuY29uY2F0KGRlZmF1bHRUb0NvbmZpZzJLZXlzKVxuICAgIC5jb25jYXQoZGlyZWN0TWVyZ2VLZXlzKTtcblxuICB2YXIgb3RoZXJLZXlzID0gT2JqZWN0XG4gICAgLmtleXMoY29uZmlnMSlcbiAgICAuY29uY2F0KE9iamVjdC5rZXlzKGNvbmZpZzIpKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gZmlsdGVyQXhpb3NLZXlzKGtleSkge1xuICAgICAgcmV0dXJuIGF4aW9zS2V5cy5pbmRleE9mKGtleSkgPT09IC0xO1xuICAgIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gob3RoZXJLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICByZXR1cm4gY29uZmlnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdBY2NlcHQnKTtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gKHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JykgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbCkge1xuICBpZiAodG9TdHJpbmcuY2FsbCh2YWwpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuZnVuY3Rpb24gc3RyaXBCT00oY29udGVudCkge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW0sXG4gIHN0cmlwQk9NOiBzdHJpcEJPTVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImU1YzdhN2RhNGMxMDU1MTEwYTdkY2MzMjEyMTAwZTE1LnBuZ1wiOyIsImltcG9ydCB7IEhlcm9WYWx1ZXNDaGlsZCwgSXRlbVZhbHVlc0NoaWxkIH0gZnJvbSAnLi4vTW9kZWxzL3Jlc3BvbnNlTW9kZWxzJztcbmltcG9ydCB7IGl0ZW1TdGF0cyB9IGZyb20gJy4uL01vZGVscy9oZXJvU3RhcnRJdGVtcy9zdGFydEl0ZW1zJztcbmltcG9ydCB7IEl0ZW1MaXN0U3RhdGljQ2hpbGRzIH0gZnJvbSAnLi4vTW9kZWxzL2hlcm9TdGFydEl0ZW1zL19pbnRlcmZhY2VzJztcbmNvbnN0IGF0a1NwZWVkOTAgPSBbXG4gICdDZW50YXVyIFdhcnJ1bm5lcicsXG4gICdTaGFkb3cgU2hhbWFuJyxcbiAgJ1NwZWN0cmUnLFxuICAnVGVjaGllcycsXG4gICdUaW55Jyxcbl07XG5cbmNvbnN0IGF0a1NwZWVkMTEwID0gWydKdWdnZXJuYXV0JywgJ1NhbmQgS2luZycsICdTdG9ybSBTcGlyaXQnLCAnVmlzYWdlJ107XG5jb25zdCBhdGtTcGVlZDExNSA9IFsnRGFyayBXaWxsb3cnLCAnTGlvbicsICdNaXJhbmEnLCAnU2xhcmsnLCAnVmVub21hbmNlciddO1xuY29uc3QgYXRrU3BlZWQxMjAgPSBbJ0FiYWRkb24nLCAnTGlmZXN0ZWFsZXInLCAnVmlwZXInLCAnV2VhdmVyJ107XG5jb25zdCBhdGtTcGVlZDEyNSA9IFsnQnJvb2Rtb3RoZXInLCAnR3lyb2NvcHRlciddO1xuXG5mdW5jdGlvbiBjYWxjdWxhdGVJdGVtU3RhdHMocmVsZXZhbnRJdGVtczogSXRlbUxpc3RTdGF0aWNDaGlsZHNbXSkge1xuICBsZXQgc3RyID0gMDtcbiAgbGV0IGFnaSA9IDA7XG4gIGxldCBpbnQgPSAwO1xuICBsZXQgYm9udXNIZWFsdGggPSAwO1xuICBsZXQgYm9udXNIZWFsdGhSZWdlblBlcm1hbmVudCA9IDA7XG4gIGxldCBib251c0hlYWx0aFJlZ2VuVGVtcCA9IDA7XG4gIGxldCBoZWFsdGhSZWdlblRlbXBEdXJhdGlvbiA9IDA7XG4gIGxldCBib251c0FybW9yID0gMDtcbiAgbGV0IGRtZ1JhdyA9IDA7XG4gIGxldCBkbWdUZW1wVmFsdWUgPSAwO1xuICBsZXQgYXRrU3BlZWRSYXcgPSAwO1xuICBsZXQgYXJtb3JEZWJ1ZmYgPSAwO1xuICBsZXQgaGVhbCA9IDA7XG5cbiAgcmVsZXZhbnRJdGVtcy5tYXAoKHgpID0+IHtcbiAgICBpZiAoeC5zdHJCb251cykge1xuICAgICAgc3RyICs9IHguc3RyQm9udXM7XG4gICAgfVxuICAgIGlmICh4LmFnaUJvbnVzKSB7XG4gICAgICBhZ2kgKz0geC5hZ2lCb251cztcbiAgICB9XG4gICAgaWYgKHguaW50Qm9udXMpIHtcbiAgICAgIGludCArPSB4LmludEJvbnVzO1xuICAgIH1cbiAgICBpZiAoeC5ocFJhdykge1xuICAgICAgYm9udXNIZWFsdGggKz0geC5ocFJhdztcbiAgICB9XG4gICAgaWYgKHguaHBSZWdlblBlcm1hbmVudCkge1xuICAgICAgYm9udXNIZWFsdGhSZWdlblBlcm1hbmVudCArPSB4LmhwUmVnZW5QZXJtYW5lbnQ7XG4gICAgfVxuICAgIGlmICh4LmhwUmVnZW5UZW1wKSB7XG4gICAgICBpZiAoYm9udXNIZWFsdGhSZWdlblRlbXAgPT09IDApIHtcbiAgICAgICAgYm9udXNIZWFsdGhSZWdlblRlbXAgKz0geC5ocFJlZ2VuVGVtcDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHguaHBSZWdlbkR1cmF0aW9uKSB7XG4gICAgICBoZWFsdGhSZWdlblRlbXBEdXJhdGlvbiArPSB4LmhwUmVnZW5EdXJhdGlvbiAqIDM7XG4gICAgfVxuICAgIGlmICh4LmFybW9yUmF3KSB7XG4gICAgICBib251c0FybW9yICs9IHguYXJtb3JSYXc7XG4gICAgfVxuICAgIGlmICh4LmRtZ1Jhdykge1xuICAgICAgZG1nUmF3ICs9IHguZG1nUmF3O1xuICAgIH1cbiAgICBpZiAoeC5kbWdUZW1wVmFsdWUpIHtcbiAgICAgIGlmIChkbWdUZW1wVmFsdWUgPT09IDApIHtcbiAgICAgICAgZG1nVGVtcFZhbHVlICs9IHguZG1nVGVtcFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoeC5hdHRTcGVlZFJhdykge1xuICAgICAgYXRrU3BlZWRSYXcgKz0geC5hdHRTcGVlZFJhdztcbiAgICB9XG4gICAgaWYgKHguYXJtb3JEZWJ1ZmYpIHtcbiAgICAgIGlmIChhcm1vckRlYnVmZiA9PT0gMCkge1xuICAgICAgICBhcm1vckRlYnVmZiArPSB4LmFybW9yRGVidWZmO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoeC5oZWFsKSB7XG4gICAgICBoZWFsICs9IHguaGVhbDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3RyLFxuICAgIGFnaSxcbiAgICBpbnQsXG4gICAgYm9udXNIZWFsdGgsXG4gICAgYm9udXNIZWFsdGhSZWdlblBlcm1hbmVudCxcbiAgICBib251c0hlYWx0aFJlZ2VuVGVtcCxcbiAgICBoZWFsdGhSZWdlblRlbXBEdXJhdGlvbixcbiAgICBib251c0FybW9yLFxuICAgIGRtZ1JhdyxcbiAgICBkbWdUZW1wVmFsdWUsXG4gICAgYXRrU3BlZWRSYXcsXG4gICAgYXJtb3JEZWJ1ZmYsXG4gICAgaGVhbCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0QXRrU3BlZWQobWluaW9uTmFtZTogc3RyaW5nKSB7XG4gIGxldCBhdGtTcGVlZCA9IDEwMDtcbiAgaWYgKGF0a1NwZWVkOTAuaW5kZXhPZihtaW5pb25OYW1lKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gKGF0a1NwZWVkID0gOTApO1xuICB9XG4gIGlmIChhdGtTcGVlZDExMC5pbmRleE9mKG1pbmlvbk5hbWUpICE9PSAtMSkge1xuICAgIHJldHVybiAoYXRrU3BlZWQgPSAxMTApO1xuICB9XG4gIGlmIChhdGtTcGVlZDExNS5pbmRleE9mKG1pbmlvbk5hbWUpICE9PSAtMSkge1xuICAgIHJldHVybiAoYXRrU3BlZWQgPSAxMTUpO1xuICB9XG4gIGlmIChhdGtTcGVlZDEyMC5pbmRleE9mKG1pbmlvbk5hbWUpICE9PSAtMSkge1xuICAgIHJldHVybiAoYXRrU3BlZWQgPSAxMjApO1xuICB9XG4gIGlmIChhdGtTcGVlZDEyNS5pbmRleE9mKG1pbmlvbk5hbWUpICE9PSAtMSkge1xuICAgIHJldHVybiAoYXRrU3BlZWQgPSAxMjUpO1xuICB9XG4gIHJldHVybiBhdGtTcGVlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhlcm9TdGF0c0ZvckNhbGN1bGF0aW9uKFxuICBtaW5pb25PYmo6IEhlcm9WYWx1ZXNDaGlsZCxcbiAgbWluaW9uSXRlbXM6IEl0ZW1WYWx1ZXNDaGlsZFtdXG4pIHtcbiAgbGV0IHJlbGV2YW50SXRlbXM6IEl0ZW1MaXN0U3RhdGljQ2hpbGRzW10gPSBbXTtcbiAgbWluaW9uSXRlbXMubWFwKCh4KSA9PiB7XG4gICAgaWYgKGl0ZW1TdGF0c1t4WydpZCddXVsncmVsZXZhbnRWYWx1ZXMnXSkge1xuICAgICAgcmV0dXJuIHJlbGV2YW50SXRlbXMucHVzaChpdGVtU3RhdHNbeFsnaWQnXV0pO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IGV4dHJhSXRlbVN0YXRzID0gY2FsY3VsYXRlSXRlbVN0YXRzKHJlbGV2YW50SXRlbXMpO1xuICBjb25zb2xlLmxvZyhtaW5pb25PYmopO1xuICBjb25zb2xlLmxvZyhleHRyYUl0ZW1TdGF0cyk7XG5cbiAgbGV0IF9zdHJUb3RhbCA9IG1pbmlvbk9iai5iYXNlX3N0ciArIGV4dHJhSXRlbVN0YXRzLnN0cjtcbiAgbGV0IGhlYWx0aCA9XG4gICAgbWluaW9uT2JqLmJhc2VfaGVhbHRoICsgX3N0clRvdGFsICogMjAgKyBleHRyYUl0ZW1TdGF0cy5ib251c0hlYWx0aDtcbiAgbGV0IGhlYWx0aFJlZ2VuID1cbiAgICBtaW5pb25PYmouYmFzZV9oZWFsdGhfcmVnZW4gK1xuICAgIF9zdHJUb3RhbCAqIDAuMSArXG4gICAgZXh0cmFJdGVtU3RhdHMuYm9udXNIZWFsdGhSZWdlblBlcm1hbmVudCArXG4gICAgZXh0cmFJdGVtU3RhdHMuYm9udXNIZWFsdGhSZWdlblRlbXA7XG4gIGxldCB0ZW1wSGVhbHRoUmVnZW5EdXJhdGlvbiA9IGV4dHJhSXRlbVN0YXRzLmhlYWx0aFJlZ2VuVGVtcER1cmF0aW9uO1xuICBsZXQgaGVhbCA9IGV4dHJhSXRlbVN0YXRzLmhlYWw7XG5cbiAgbGV0IF9hZ2lUb3RhbCA9IG1pbmlvbk9iai5iYXNlX2FnaSArIGV4dHJhSXRlbVN0YXRzLmFnaTtcbiAgbGV0IF9yYXdBcm1vclRvdGFsID0gbWluaW9uT2JqLmJhc2VfYXJtb3IgKyBleHRyYUl0ZW1TdGF0cy5ib251c0FybW9yO1xuICBsZXQgYXJtb3IgPSAoX2FnaVRvdGFsICogMSkgLyA2ICsgX3Jhd0FybW9yVG90YWw7XG5cbiAgbGV0IF9leHRyYURhbWFnZUl0ZW1zID1cbiAgICBleHRyYUl0ZW1TdGF0cy5kbWdSYXcgKyBleHRyYUl0ZW1TdGF0c1ttaW5pb25PYmpbJ3ByaW1hcnlfYXR0ciddXTtcbiAgbGV0IF9kYW1hZ2VGcm9tSGVyb1N0YXRzO1xuICBtaW5pb25PYmoucHJpbWFyeV9hdHRyID09PSAnc3RyJ1xuICAgID8gKF9kYW1hZ2VGcm9tSGVyb1N0YXRzID0gbWluaW9uT2JqLmJhc2Vfc3RyKVxuICAgIDogbWluaW9uT2JqLnByaW1hcnlfYXR0ciA9PT0gJ2FnaSdcbiAgICA/IChfZGFtYWdlRnJvbUhlcm9TdGF0cyA9IG1pbmlvbk9iai5iYXNlX2FnaSlcbiAgICA6IChfZGFtYWdlRnJvbUhlcm9TdGF0cyA9IG1pbmlvbk9iai5iYXNlX2ludCk7XG4gIGxldCBkYW1hZ2UgPVxuICAgIChtaW5pb25PYmouYmFzZV9hdHRhY2tfbWF4ICsgbWluaW9uT2JqLmJhc2VfYXR0YWNrX21pbikgLyAyICtcbiAgICBfZGFtYWdlRnJvbUhlcm9TdGF0cyArXG4gICAgX2V4dHJhRGFtYWdlSXRlbXM7XG5cbiAgbGV0IGRhbWFnZVRlbXAgPSBleHRyYUl0ZW1TdGF0cy5kbWdUZW1wVmFsdWU7XG4gIGxldCBhcm1vckRlYnVmZiA9IGV4dHJhSXRlbVN0YXRzLmFybW9yRGVidWZmO1xuXG4gIGxldCBfZ2V0QXRrU3BlZWQgPSBnZXRBdGtTcGVlZChtaW5pb25PYmoubG9jYWxpemVkX25hbWUpO1xuXG4gIGxldCBhdGtQZXJTZWMgPSAoX2dldEF0a1NwZWVkICsgX2FnaVRvdGFsKSAvICgxMDAgKiBtaW5pb25PYmouYXR0YWNrX3JhdGUpO1xuXG4gIGxldCBpc01lbGVlID0gbWluaW9uT2JqLmF0dGFja190eXBlID09PSAnTWVsZWUnO1xuXG4gIGNvbnN0IG9iaiA9IHtcbiAgICBoZWFsdGgsXG4gICAgaGVhbHRoUmVnZW4sXG4gICAgdGVtcEhlYWx0aFJlZ2VuRHVyYXRpb24sXG4gICAgaGVhbCxcbiAgICBhcm1vcixcbiAgICBkYW1hZ2UsXG4gICAgZGFtYWdlVGVtcCxcbiAgICBhcm1vckRlYnVmZixcbiAgICBhdGtQZXJTZWMsXG4gICAgaXNNZWxlZSxcbiAgfTtcbiAgY29uc29sZS5sb2cob2JqKTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLy8gZm9yIHRoZSByZXR1cm5lZCBvYmplY3Q6XG4vLyBkYW1hZ2UgVGVtcCBjb21lcyBvbnRvcCB3aXRob3V0IGNhbGN1bGF0aW9uc1xuLy8gYXJtb3JEZWJ1ZmYgaXMgbmVlZGVkIGluIGNhbGN1bGF0aW9uIG9mIG9wcG9uZW50cyBkYW1hZ2UgcmVkdWN0aW9uXG4vLyB3aGVuIGhlYWwgaXMgYWN0aXZhdGVkID0+IHJlbW92ZSAyIGRhbWFnZSBmcm9tIHZhcmlhYmxlIGRhbWFnZSBhbmQgcmVjYWxjdWxhdGUgZGFtYWdlIHJlZHVjdGlvblxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxcbiAgVCBleHRlbmRzIEhUTUxFbGVtZW50LFxuICBVIGV4dGVuZHMgSFRNTEVsZW1lbnRbXVxuPiB7XG4gIHRlbXBsYXRlRWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgaG9zdEVsZW1lbnQ6IFQ7XG4gIGVsZW1lbnQ6IFU7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGVkSWQ6IHN0cmluZywgaG9zdEVsZW1lbnRJZDogc3RyaW5nKSB7XG4gICAgdGhpcy50ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgIHRlbXBsYXRlZElkXG4gICAgKSEgYXMgSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgICB0aGlzLmhvc3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaG9zdEVsZW1lbnRJZCkhIGFzIFQ7XG5cbiAgICBjb25zdCBpbXBvcnRlZE5vZGUgPSBkb2N1bWVudC5pbXBvcnROb2RlKFxuICAgICAgdGhpcy50ZW1wbGF0ZUVsZW1lbnQuY29udGVudCxcbiAgICAgIHRydWVcbiAgICApO1xuICAgIHRoaXMuZWxlbWVudCA9IEFycmF5LmZyb20oaW1wb3J0ZWROb2RlLmNoaWxkcmVuKSBhcyBVO1xuICB9XG5cbiAgYXR0YWNoKGF0U3RhcnQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmVsZW1lbnQuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIHRoaXMuaG9zdEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFxuICAgICAgICBhdFN0YXJ0ID8gJ2FmdGVyYmVnaW4nIDogJ2JlZm9yZWVuZCcsXG4gICAgICAgIGVsXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzcGF0Y2goKSB7XG4gICAgQXJyYXkuZnJvbSh0aGlzLmhvc3RFbGVtZW50LmNoaWxkcmVuKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgZWwucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEhlcm9WYWx1ZXMsIEl0ZW1WYWx1ZXMgfSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuaW1wb3J0IHsgR2FtZVN0YXRlIH0gZnJvbSAnLi9HYW1lU3RhdGUnO1xuaW1wb3J0IHsgSGVyb2VzIH0gZnJvbSAnLi9IZXJvZXMnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL0l0ZW1zJztcbmltcG9ydCB7IGhlcm9TdGFydEl0ZW1zIH0gZnJvbSAnLi4vTW9kZWxzL2hlcm9TdGFydEl0ZW1zL3N0YXJ0SXRlbXMnO1xuXG5leHBvcnQgY2xhc3MgRGF0YUNvbnRhaW5lciB7XG4gIGhlcm9lcyE6IEhlcm9lcztcbiAgaW5pdEhlcm9MaXN0KGFwaVJlc3BvbnNlOiBIZXJvVmFsdWVzKSB7XG4gICAgY29uc3QgaGVyb2VzID0gbmV3IEhlcm9lcyhhcGlSZXNwb25zZSk7XG4gICAgcmV0dXJuICh0aGlzLmhlcm9lcyA9IGhlcm9lcyk7XG4gIH1cblxuICBpdGVtcyE6IEl0ZW1zO1xuICBpbml0SXRlbUxpc3QoYXBpUmVzcG9uc2U6IEl0ZW1WYWx1ZXMpIHtcbiAgICBjb25zdCBpdGVtcyA9IG5ldyBJdGVtcyhhcGlSZXNwb25zZSk7XG4gICAgcmV0dXJuICh0aGlzLml0ZW1zID0gaXRlbXMpO1xuICB9XG4gIGdhbWVTdGF0ZSE6IEdhbWVTdGF0ZTtcbiAgaW5pdEdhbWVTdGF0ZShoZXJvSWQ6IHN0cmluZywgZ2FtZU1vZGU6IHN0cmluZykge1xuICAgIGNvbnN0IGdhbWVTdGF0ZSA9IG5ldyBHYW1lU3RhdGUoaGVyb0lkLCBnYW1lTW9kZSk7XG4gICAgcmV0dXJuICh0aGlzLmdhbWVTdGF0ZSA9IGdhbWVTdGF0ZSk7XG4gIH1cbiAgaGVyb1N0YXJ0SXRlbXMgPSBoZXJvU3RhcnRJdGVtcztcbn1cbiIsImltcG9ydCB7IGRhdGFDb250YWluZXIgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQge1xuICBIZXJvVmFsdWVzLFxuICBIZXJvVmFsdWVzQ2hpbGQsXG4gIEl0ZW1WYWx1ZXNDaGlsZCxcbn0gZnJvbSAnLi4vTW9kZWxzL3Jlc3BvbnNlTW9kZWxzJztcbmltcG9ydCB7IGl0ZW1TdGF0cyB9IGZyb20gJy4uL01vZGVscy9oZXJvU3RhcnRJdGVtcy9zdGFydEl0ZW1zJztcbmltcG9ydCB7IEhlcm9TdGF0c0ZvckNhbGN1bGF0aW9uIH0gZnJvbSAnLi9DYWxjdWxhdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBHYW1lU3RhdGUge1xuICBoZXJvT2JqOiBIZXJvVmFsdWVzQ2hpbGQ7XG4gIGhlcm9JdGVtczogSXRlbVZhbHVlc0NoaWxkW107XG4gIGN1cnJlbnRPcHBvbmVudCE6IEhlcm9WYWx1ZXNDaGlsZDtcbiAgb3Bwb25lbnRJdGVtcyE6IEl0ZW1WYWx1ZXNDaGlsZFtdO1xuICBnYW1lTW9kZTtcbiAgaGVyb0tleXM7XG4gIHN0YXJ0SXRlbXMhOiBJdGVtVmFsdWVzQ2hpbGRbXTtcbiAgaGVyb0dvbGQhOiBudW1iZXI7XG4gIG9wcG9uZW50R29sZCE6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihoZXJvSWQ6IHN0cmluZywgZ2FtZU1vZGU6IHN0cmluZykge1xuICAgIHRoaXMuZ2FtZU1vZGUgPSBnYW1lTW9kZTtcblxuICAgIC8vIGdldCBoZXJvXG4gICAgdGhpcy5oZXJvT2JqID0gZGF0YUNvbnRhaW5lci5oZXJvZXMucGxhaW5IZXJvT2JqKGhlcm9JZCk7XG4gICAgdGhpcy5oZXJvS2V5cyA9IE9iamVjdC5rZXlzKGRhdGFDb250YWluZXIuaGVyb2VzLmxpc3QgYXMgSGVyb1ZhbHVlcyk7XG5cbiAgICBjb25zdCBoZXJvSW5kZXggPSB0aGlzLmhlcm9LZXlzLmluZGV4T2YodGhpcy5oZXJvT2JqWydpZCddLnRvU3RyaW5nKCkpO1xuICAgIHRoaXMuaGVyb0tleXMuc3BsaWNlKGhlcm9JbmRleCwgMSk7XG5cbiAgICAvLyBnZXQgaGVybyBpdGVtc1xuICAgIGNvbnN0IGl0ZW1LZXlzID0gT2JqZWN0LnZhbHVlcyhcbiAgICAgIGRhdGFDb250YWluZXIuaGVyb1N0YXJ0SXRlbXNbdGhpcy5oZXJvT2JqWydpZCddXVxuICAgICk7XG4gICAgdGhpcy5oZXJvSXRlbXMgPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihpdGVtS2V5cyk7XG4gICAgdGhpcy5zZXRHb2xkKHRoaXMuaGVyb0l0ZW1zLCAnaGVyb0dvbGQnKTtcblxuICAgIHRoaXMuc2V0Q3VycmVudE9wcG9uZW50KCk7XG4gICAgdGhpcy5nZXRPcHBvbmVudEl0ZW1zKCk7XG4gICAgdGhpcy5nZXRTdGFydEl0ZW1zKCk7XG4gIH1cblxuICBpbml0Q2hhbmdlKG5ld0l0ZW06IHN0cmluZywgb2xkSXRlbTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZykge1xuICAgIGlmICh0YXJnZXQgPT09ICdoZXJvJykge1xuICAgICAgdGhpcy5zZXRIZXJvSXRlbXMobmV3SXRlbSwgb2xkSXRlbSk7XG4gICAgICB0aGlzLnNldEdvbGQodGhpcy5oZXJvSXRlbXMsICdoZXJvR29sZCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh0YXJnZXQgPT09ICdvcHBvbmVudCcpIHtcbiAgICAgIHRoaXMuc2V0T3Bwb25lbnRJdGVtcyhuZXdJdGVtLCBvbGRJdGVtKTtcbiAgICAgIHRoaXMuc2V0R29sZCh0aGlzLm9wcG9uZW50SXRlbXMsICdvcHBvbmVudEdvbGQnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGVub3VnaEdvbGQobmV3SXRlbTogc3RyaW5nLCBvbGRJdGVtOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nKSB7XG4gICAgY29uc3QgZ29sZENvdW50ID1cbiAgICAgICt0aGlzW3RhcmdldCBhcyBrZXlvZiBHYW1lU3RhdGVdICtcbiAgICAgIGl0ZW1TdGF0c1tuZXdJdGVtXS5nb2xkIC1cbiAgICAgIGl0ZW1TdGF0c1tvbGRJdGVtXS5nb2xkO1xuICAgIHJldHVybiBnb2xkQ291bnQgPCA2MDE7XG4gIH1cblxuICBwZXJmb3JtQ2FsY3VsYXRpb24oKSB7XG4gICAgSGVyb1N0YXRzRm9yQ2FsY3VsYXRpb24odGhpcy5oZXJvT2JqLCB0aGlzLmhlcm9JdGVtcyk7XG4gIH1cblxuICBwcml2YXRlIHNldE9wcG9uZW50SXRlbXMobmV3SXRlbTogc3RyaW5nLCBvbGRJdGVtOiBzdHJpbmcpIHtcbiAgICBsZXQgbGlzdCA9IFtdO1xuICAgIHRoaXMub3Bwb25lbnRJdGVtcy5tYXAoKHgpID0+IHtcbiAgICAgIGxpc3QucHVzaCgreC5pZCk7XG4gICAgfSk7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5vcHBvbmVudEl0ZW1zLmZpbmRJbmRleCgoeCkgPT4ge1xuICAgICAgcmV0dXJuIHguaWQgPT09ICtvbGRJdGVtO1xuICAgIH0pO1xuXG4gICAgbGlzdFtpbmRleF0gPSArbmV3SXRlbTtcbiAgICB0aGlzLm9wcG9uZW50SXRlbXMgPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihsaXN0KTtcbiAgfVxuXG4gIHJlc2V0KFxuICAgIGdvbGRUYXJnZXQ6ICdoZXJvR29sZCcgfCAnb3Bwb25lbnRHb2xkJyxcbiAgICBpdGVtc1RhcmdldDogJ2hlcm9JdGVtcycgfCAnb3Bwb25lbnRJdGVtcydcbiAgKSB7XG4gICAgY29uc3QgYXJyYXlGb3JSZXNldCA9IFs5OTksIDk5OSwgOTk5LCA5OTksIDk5OSwgOTk5XTtcbiAgICB0aGlzW2l0ZW1zVGFyZ2V0XSA9IGRhdGFDb250YWluZXIuaXRlbXMucGxhaW5JdGVtT2JqKGFycmF5Rm9yUmVzZXQpO1xuICAgIHRoaXMuc2V0R29sZCh0aGlzW2l0ZW1zVGFyZ2V0XSwgZ29sZFRhcmdldCk7XG4gIH1cblxuICBwcml2YXRlIHNldEhlcm9JdGVtcyhuZXdJdGVtOiBzdHJpbmcsIG9sZEl0ZW06IHN0cmluZykge1xuICAgIGxldCBsaXN0ID0gW107XG4gICAgdGhpcy5oZXJvSXRlbXMubWFwKCh4KSA9PiB7XG4gICAgICBsaXN0LnB1c2goK3guaWQpO1xuICAgIH0pO1xuICAgIGxldCBpbmRleCA9IHRoaXMuaGVyb0l0ZW1zLmZpbmRJbmRleCgoeCkgPT4ge1xuICAgICAgcmV0dXJuIHguaWQgPT09ICtvbGRJdGVtO1xuICAgIH0pO1xuXG4gICAgbGlzdFtpbmRleF0gPSArbmV3SXRlbTtcbiAgICB0aGlzLmhlcm9JdGVtcyA9IGRhdGFDb250YWluZXIuaXRlbXMucGxhaW5JdGVtT2JqKGxpc3QpO1xuICB9XG5cbiAgc2V0Q3VycmVudE9wcG9uZW50KCkge1xuICAgIGlmICh0aGlzLmhlcm9LZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGFsZXJ0KCdGaW5pc2gnKTtcbiAgICB9XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlcm9LZXlzLmxlbmd0aCk7XG4gICAgdGhpcy5jdXJyZW50T3Bwb25lbnQhID0gZGF0YUNvbnRhaW5lci5oZXJvZXMucGxhaW5IZXJvT2JqKFxuICAgICAgdGhpcy5oZXJvS2V5c1tyYW5kb21JbmRleF0udG9TdHJpbmcoKVxuICAgICk7XG4gICAgLy8gcmVtb3ZlIG9wcCBmcm9tIGxpc3Qgb2Yga2V5c1xuICAgIHRoaXMuaGVyb0tleXMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgfVxuXG4gIGdldE9wcG9uZW50SXRlbXMoKSB7XG4gICAgY29uc3Qgb3BwSXRlbUtleXMgPSBPYmplY3QudmFsdWVzKFxuICAgICAgZGF0YUNvbnRhaW5lci5oZXJvU3RhcnRJdGVtc1t0aGlzLmN1cnJlbnRPcHBvbmVudFsnaWQnXV1cbiAgICApO1xuICAgIHRoaXMub3Bwb25lbnRJdGVtcyA9IGRhdGFDb250YWluZXIuaXRlbXMucGxhaW5JdGVtT2JqKG9wcEl0ZW1LZXlzKTtcbiAgICB0aGlzLnNldEdvbGQodGhpcy5vcHBvbmVudEl0ZW1zLCAnb3Bwb25lbnRHb2xkJyk7XG4gIH1cblxuICBwcml2YXRlIGdldFN0YXJ0SXRlbXMoKSB7XG4gICAgY29uc3QgaXRlbUtleXMgPSBPYmplY3Qua2V5cyhpdGVtU3RhdHMpO1xuICAgIHRoaXMuc3RhcnRJdGVtcyA9IGRhdGFDb250YWluZXIuaXRlbXMucGxhaW5JdGVtT2JqKGl0ZW1LZXlzKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0R29sZChcbiAgICBpdGVtczogSXRlbVZhbHVlc0NoaWxkW10sXG4gICAgdGFyZ2V0OiAnaGVyb0dvbGQnIHwgJ29wcG9uZW50R29sZCdcbiAgKSB7XG4gICAgbGV0IGdvbGQgPSAwO1xuICAgIGl0ZW1zLm1hcCgoeCkgPT4ge1xuICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBnb2xkICs9IGl0ZW1TdGF0c1t4WydpZCddXS5nb2xkO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpc1t0YXJnZXRdID0gZ29sZDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgZGF0YUNvbnRhaW5lciB9IGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7IEl0ZW1WYWx1ZXNDaGlsZCB9IGZyb20gJy4uL01vZGVscy9yZXNwb25zZU1vZGVscyc7XG5pbXBvcnQgeyBhdXRvYmluZCB9IGZyb20gJy4uL0RlY29yYXRvcnMvYXV0b2JpbmQnO1xuaW1wb3J0IHsgRHJhZ2dhYmxlLCBEcmFnVGFyZ2V0IH0gZnJvbSAnLi4vTW9kZWxzL2V2ZW50bGlzdGVuZXJzJztcblxuZXhwb3J0IGNsYXNzIEdhbWVWaWV3XG4gIGV4dGVuZHMgQ29tcG9uZW50PEhUTUxEaXZFbGVtZW50LCBbSFRNTERpdkVsZW1lbnRdPlxuICBpbXBsZW1lbnRzIERyYWdnYWJsZSwgRHJhZ1RhcmdldFxue1xuICBzdGF0aWMgaW5zdGFuY2U6IEdhbWVWaWV3O1xuICBnYW1lQ29udGFpbmVyID0gdGhpcy5lbGVtZW50WzBdLmZpcnN0RWxlbWVudENoaWxkIS5jaGlsZHJlbjtcbiAgc3RhcnRJdGVtc0NvbnRhaW5lciA9IHRoaXMuZWxlbWVudFswXS5jaGlsZHJlblsyXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigndG1wbC1nYW1lLXZpZXcnLCAnYXBwJyk7XG4gICAgdGhpcy5yZW5kZXJIZXJvKCk7XG4gICAgdGhpcy5yZW5kZXJPcHBvbmVudCgpO1xuICAgIHRoaXMucmVuZGVyU3RhcnRJdGVtcygpO1xuICAgIHRoaXMuZGlzcGF0Y2goKTtcbiAgICB0aGlzLmF0dGFjaCh0cnVlKTtcbiAgICB0aGlzLmNvbmZpZ3VyZUV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckl0ZW1zKFxuICAgIHNvdXJjZTogSXRlbVZhbHVlc0NoaWxkW10sXG4gICAgdGFyZ2V0OiBFbGVtZW50LFxuICAgIGNsYXNzTmFtZTogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IGl0ZW1zID0gT2JqZWN0LnZhbHVlcyhzb3VyY2UpO1xuXG4gICAgd2hpbGUgKHRhcmdldC5maXJzdENoaWxkKSB7XG4gICAgICB0YXJnZXQucmVtb3ZlQ2hpbGQoPEhUTUxFbGVtZW50PnRhcmdldC5sYXN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGl0ZW1zLm1hcCgoeCkgPT4ge1xuICAgICAgaWYgKHgpIHtcbiAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGltZy5zcmMgPSB4WydpbWcnXTtcbiAgICAgICAgaW1nLmlkID0geFsnaWQnXS50b1N0cmluZygpO1xuICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTdGFydEl0ZW1zKCkge1xuICAgIHRoaXMucmVuZGVySXRlbXMoXG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5zdGFydEl0ZW1zLFxuICAgICAgdGhpcy5zdGFydEl0ZW1zQ29udGFpbmVyLFxuICAgICAgJ2FsbEl0ZW1zJ1xuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckdvbGQoc291cmNlOiBudW1iZXIsIHRhcmdldDogRWxlbWVudCkge1xuICAgIHRhcmdldC50ZXh0Q29udGVudCA9ICg2MDAgLSBzb3VyY2UpLnRvU3RyaW5nKCkgKyAnIEdvbGQgbGVmdCc7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckhlcm8oKSB7XG4gICAgY29uc3QgaGVyb0NvbnRhaW5lciA9IHRoaXMuZ2FtZUNvbnRhaW5lclswXTtcbiAgICAoPEhUTUxJbWFnZUVsZW1lbnQ+aGVyb0NvbnRhaW5lci5jaGlsZHJlblswXSkuc3JjID1cbiAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLmhlcm9PYmpbJ2ltZyddO1xuICAgIHRoaXMucmVuZGVySXRlbXMoXG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5oZXJvSXRlbXMsXG4gICAgICBoZXJvQ29udGFpbmVyLmNoaWxkcmVuWzFdLFxuICAgICAgJ2hlcm8nXG4gICAgKTtcbiAgICB0aGlzLnJlbmRlckdvbGQoXG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5oZXJvR29sZCxcbiAgICAgIGhlcm9Db250YWluZXIuY2hpbGRyZW5bM11cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJPcHBvbmVudCgpIHtcbiAgICBjb25zdCBvcHBvbmVudENvbnRhaW5lciA9IHRoaXMuZ2FtZUNvbnRhaW5lclsyXTtcbiAgICAoPEhUTUxJbWFnZUVsZW1lbnQ+b3Bwb25lbnRDb250YWluZXIuY2hpbGRyZW5bMF0pLnNyYyA9XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5jdXJyZW50T3Bwb25lbnRbJ2ltZyddLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5yZW5kZXJJdGVtcyhcbiAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLm9wcG9uZW50SXRlbXMsXG4gICAgICBvcHBvbmVudENvbnRhaW5lci5jaGlsZHJlblsxXSxcbiAgICAgICdvcHBvbmVudCdcbiAgICApO1xuICAgIHRoaXMucmVuZGVyR29sZChcbiAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLm9wcG9uZW50R29sZCxcbiAgICAgIG9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzNdXG4gICAgKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBkcmFnU3RhcnRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIhLnNldERhdGEoJ3RleHQvcGxhaW4nLCAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCkuaWQpO1xuICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuZWZmZWN0QWxsb3dlZCA9ICdjb3B5JztcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBkcmFnRW5kSGFuZGxlcihfOiBEcmFnRXZlbnQpIHt9XG4gIEBhdXRvYmluZFxuICBkcmFnT3ZlckhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ0xlYXZlSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7fVxuXG4gIC8vIGRyb3BoYW5kbGVyIG9ubHkgZm9yIGhlcm9cbiAgQGF1dG9iaW5kXG4gIGRyb3BIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IG5ld0l0ZW0gPSBldmVudC5kYXRhVHJhbnNmZXIhLmdldERhdGEoJ3RleHQvcGxhaW4nKTtcbiAgICBpZiAoIStuZXdJdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9sZEl0ZW0gPSAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCEpLmlkO1xuICAgIGNvbnN0IHRhcmdldCA9ICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0ISkuY2xhc3NOYW1lO1xuXG4gICAgaWYgKGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLmVub3VnaEdvbGQobmV3SXRlbSwgb2xkSXRlbSwgJ2hlcm9Hb2xkJykpIHtcbiAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLmluaXRDaGFuZ2UobmV3SXRlbSwgb2xkSXRlbSwgdGFyZ2V0KTtcbiAgICAgIGNvbnN0IGhlcm9Db250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMF07XG4gICAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5oZXJvSXRlbXMsXG4gICAgICAgIGhlcm9Db250YWluZXIuY2hpbGRyZW5bMV0sXG4gICAgICAgICdoZXJvJ1xuICAgICAgKTtcbiAgICAgIHRoaXMucmVuZGVyR29sZChcbiAgICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0dvbGQsXG4gICAgICAgIGhlcm9Db250YWluZXIuY2hpbGRyZW5bM11cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gZHJvcGhhbmRsZXIgb3Bwb25lbnRcbiAgQGF1dG9iaW5kXG4gIGRyb3BPcHBvbmVudChldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBuZXdJdGVtID0gZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgY29uc3Qgb2xkSXRlbSA9ICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0ISkuaWQ7XG4gICAgY29uc3QgdGFyZ2V0ID0gKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQhKS5jbGFzc05hbWU7XG4gICAgaWYgKGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLmVub3VnaEdvbGQobmV3SXRlbSwgb2xkSXRlbSwgJ29wcG9uZW50R29sZCcpKSB7XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5pbml0Q2hhbmdlKG5ld0l0ZW0sIG9sZEl0ZW0sIHRhcmdldCk7XG4gICAgICBjb25zdCBvcHBvbmVudENvbnRhaW5lciA9IHRoaXMuZ2FtZUNvbnRhaW5lclsyXTtcbiAgICAgIHRoaXMucmVuZGVySXRlbXMoXG4gICAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLm9wcG9uZW50SXRlbXMsXG4gICAgICAgIG9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzFdLFxuICAgICAgICAnb3Bwb25lbnQnXG4gICAgICApO1xuICAgICAgdGhpcy5yZW5kZXJHb2xkKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEdvbGQsXG4gICAgICAgIG9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzNdXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZFxuICBwcml2YXRlIHJlc2V0SXRlbXMoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBpZCA9ICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS5pZDtcbiAgICBpZiAoaWQgPT09ICdyZXNldC1oZXJvJykge1xuICAgICAgY29uc3QgaGVyb0NvbnRhaW5lciA9IHRoaXMuZ2FtZUNvbnRhaW5lclswXTtcbiAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLnJlc2V0KCdoZXJvR29sZCcsICdoZXJvSXRlbXMnKTtcbiAgICAgIHRoaXMucmVuZGVySXRlbXMoXG4gICAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLmhlcm9JdGVtcyxcbiAgICAgICAgaGVyb0NvbnRhaW5lci5jaGlsZHJlblsxXSxcbiAgICAgICAgJ2hlcm8nXG4gICAgICApO1xuICAgICAgdGhpcy5yZW5kZXJHb2xkKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5oZXJvR29sZCxcbiAgICAgICAgaGVyb0NvbnRhaW5lci5jaGlsZHJlblszXVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlkID09PSAncmVzZXQtb3Bwb25lbnQnKSB7XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5yZXNldCgnb3Bwb25lbnRHb2xkJywgJ29wcG9uZW50SXRlbXMnKTtcbiAgICAgIGNvbnN0IG9wcG9uZW50Q29udGFpbmVyID0gdGhpcy5nYW1lQ29udGFpbmVyWzJdO1xuICAgICAgdGhpcy5yZW5kZXJJdGVtcyhcbiAgICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUub3Bwb25lbnRJdGVtcyxcbiAgICAgICAgb3Bwb25lbnRDb250YWluZXIuY2hpbGRyZW5bMV0sXG4gICAgICAgICdvcHBvbmVudCdcbiAgICAgICk7XG4gICAgICB0aGlzLnJlbmRlckdvbGQoXG4gICAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLm9wcG9uZW50R29sZCxcbiAgICAgICAgb3Bwb25lbnRDb250YWluZXIuY2hpbGRyZW5bM11cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIHByaXZhdGUgY2FsY3VsYXRlV2lubmVyKCkge1xuICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLnBlcmZvcm1DYWxjdWxhdGlvbigpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIHByaXZhdGUgY2FsbE5leHRPcHBvbmVudChldmVudDogTW91c2VFdmVudCkge1xuICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLnNldEN1cnJlbnRPcHBvbmVudCgpO1xuICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLmdldE9wcG9uZW50SXRlbXMoKTtcbiAgICBjb25zdCBvcHBvbmVudENvbnRhaW5lciA9IHRoaXMuZ2FtZUNvbnRhaW5lclsyXTtcbiAgICB0aGlzLnJlbmRlck9wcG9uZW50KCk7XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZUV2ZW50TGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IHJlc2V0QnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXNldC1idG5zJyk7XG4gICAgcmVzZXRCdG5zLmZvckVhY2goKGJ0bikgPT5cbiAgICAgICg8SFRNTEVsZW1lbnQ+YnRuKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucmVzZXRJdGVtcylcbiAgICApO1xuXG4gICAgY29uc3QgbmV4dE9wcG9uZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25leHQnKTtcbiAgICAoPEhUTUxFbGVtZW50Pm5leHRPcHBvbmVudCkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjbGljaycsXG4gICAgICB0aGlzLmNhbGxOZXh0T3Bwb25lbnRcbiAgICApO1xuXG4gICAgY29uc3QgY2FsY3VsYXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhbGN1bGF0ZScpO1xuICAgICg8SFRNTEVsZW1lbnQ+Y2FsY3VsYXRlQnRuKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2FsY3VsYXRlV2lubmVyKTtcblxuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnN0YXJ0SXRlbXNDb250YWluZXIpLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ3N0YXJ0JyxcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0SGFuZGxlclxuICAgICk7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuc3RhcnRJdGVtc0NvbnRhaW5lcikuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcmFnZW5kJyxcbiAgICAgIHRoaXMuZHJhZ0VuZEhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmdhbWVDb250YWluZXJbMF0uY2hpbGRyZW5bMV0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ292ZXInLFxuICAgICAgdGhpcy5kcmFnT3ZlckhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmdhbWVDb250YWluZXJbMF0uY2hpbGRyZW5bMV0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ2xlYXZlJyxcbiAgICAgIHRoaXMuZHJhZ0xlYXZlSGFuZGxlclxuICAgICk7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZ2FtZUNvbnRhaW5lclswXS5jaGlsZHJlblsxXSkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcm9wJyxcbiAgICAgIHRoaXMuZHJvcEhhbmRsZXJcbiAgICApO1xuXG4gICAgLy8gb3Bwb25lbnRcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5nYW1lQ29udGFpbmVyWzJdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdvdmVyJyxcbiAgICAgIHRoaXMuZHJhZ092ZXJIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5nYW1lQ29udGFpbmVyWzJdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdsZWF2ZScsXG4gICAgICB0aGlzLmRyYWdMZWF2ZUhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmdhbWVDb250YWluZXJbMl0uY2hpbGRyZW5bMV0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJvcCcsXG4gICAgICB0aGlzLmRyb3BPcHBvbmVudFxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbiAgICB0aGlzLmluc3RhbmNlID0gbmV3IEdhbWVWaWV3KCk7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IEhlcm9WYWx1ZXMgfSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuZXhwb3J0IGNsYXNzIEhlcm9lcyB7XG4gIGxpc3Q6IEhlcm9WYWx1ZXM7XG5cbiAgY29uc3RydWN0b3IoYXBpUmVzcG9uc2U6IEhlcm9WYWx1ZXMpIHtcbiAgICB0aGlzLmxpc3QgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcGlSZXNwb25zZSkge1xuICAgICAgdGhpcy5saXN0W2FwaVJlc3BvbnNlW2tleV1bJ2lkJ11dID0ge1xuICAgICAgICBpbWc6ICdodHRwczovL2FwaS5vcGVuZG90YS5jb20nICsgYXBpUmVzcG9uc2Vba2V5XVsnaW1nJ10sXG4gICAgICAgIGFnaV9nYWluOiBhcGlSZXNwb25zZVtrZXldWydhZ2lfZ2FpbiddLFxuICAgICAgICBhdHRhY2tfcmFuZ2U6IGFwaVJlc3BvbnNlW2tleV1bJ2F0dGFja19yYW5nZSddLFxuICAgICAgICBhdHRhY2tfcmF0ZTogYXBpUmVzcG9uc2Vba2V5XVsnYXR0YWNrX3JhdGUnXSxcbiAgICAgICAgYXR0YWNrX3R5cGU6IGFwaVJlc3BvbnNlW2tleV1bJ2F0dGFja190eXBlJ10sXG4gICAgICAgIGJhc2VfYWdpOiBhcGlSZXNwb25zZVtrZXldWydiYXNlX2FnaSddLFxuICAgICAgICBiYXNlX2FybW9yOiBhcGlSZXNwb25zZVtrZXldWydiYXNlX2FybW9yJ10sXG4gICAgICAgIGJhc2VfYXR0YWNrX21heDogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9hdHRhY2tfbWF4J10sXG4gICAgICAgIGJhc2VfYXR0YWNrX21pbjogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9hdHRhY2tfbWluJ10sXG4gICAgICAgIGJhc2VfaGVhbHRoOiBhcGlSZXNwb25zZVtrZXldWydiYXNlX2hlYWx0aCddLFxuICAgICAgICBiYXNlX2hlYWx0aF9yZWdlbjogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9oZWFsdGhfcmVnZW4nXSxcbiAgICAgICAgYmFzZV9pbnQ6IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfaW50J10sXG4gICAgICAgIGJhc2VfbWFuYTogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9tYW5hJ10sXG4gICAgICAgIGJhc2VfbWFuYV9yZWdlbjogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9tYW5hX3JlZ2VuJ10sXG4gICAgICAgIGJhc2VfbXI6IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfbXInXSxcbiAgICAgICAgYmFzZV9zdHI6IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2Vfc3RyJ10sXG4gICAgICAgIGludF9nYWluOiBhcGlSZXNwb25zZVtrZXldWydpbnRfZ2FpbiddLFxuICAgICAgICBsb2NhbGl6ZWRfbmFtZTogYXBpUmVzcG9uc2Vba2V5XVsnbG9jYWxpemVkX25hbWUnXSxcbiAgICAgICAgbW92ZV9zcGVlZDogYXBpUmVzcG9uc2Vba2V5XVsnbW92ZV9zcGVlZCddLFxuICAgICAgICBwcmltYXJ5X2F0dHI6IGFwaVJlc3BvbnNlW2tleV1bJ3ByaW1hcnlfYXR0ciddLFxuICAgICAgICBwcm9qZWN0aWxlX3NwZWVkOiBhcGlSZXNwb25zZVtrZXldWydwcm9qZWN0aWxlX3NwZWVkJ10sXG4gICAgICAgIHN0cl9nYWluOiBhcGlSZXNwb25zZVtrZXldWydzdHJfZ2FpbiddLFxuICAgICAgICBpZDogYXBpUmVzcG9uc2Vba2V5XVsnaWQnXSxcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHBsYWluSGVyb09iaihpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFtpZF07XG4gIH1cbiAgZ2V0T3Bwb25lbnRzKGdhbWVNb2RlOiBzdHJpbmcsIGhlcm9JZDogc3RyaW5nKSB7XG4gICAgaWYgKGdhbWVNb2RlID09PSAncmFuZG9tJykge1xuICAgICAgY29uc3QgbGlzdENsb25lID0geyAuLi50aGlzLmxpc3QgfTtcbiAgICAgIGRlbGV0ZSBsaXN0Q2xvbmVbK2hlcm9JZF07XG4gICAgICByZXR1cm4gbGlzdENsb25lO1xuICAgIH1cbiAgICBpZiAoZ2FtZU1vZGUgPT09ICdjaG9pY2UnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBJdGVtVmFsdWVzLCBJdGVtVmFsdWVzQ2hpbGQgfSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuY29uc3QgaW1nID0gcmVxdWlyZSgnLi4vaW1ncy9ub2l0ZW1zLnBuZycpO1xuXG5leHBvcnQgY2xhc3MgSXRlbXMge1xuICBsaXN0OiBJdGVtVmFsdWVzO1xuICBjb25zdHJ1Y3RvcihhcGlSZXNwb25zZTogSXRlbVZhbHVlcykge1xuICAgIHRoaXMubGlzdCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXBpUmVzcG9uc2UpIHtcbiAgICAgIHRoaXMubGlzdFthcGlSZXNwb25zZVtrZXldWydpZCddXSA9IHtcbiAgICAgICAgaW1nOiAnaHR0cHM6Ly9hcGkub3BlbmRvdGEuY29tJyArIGFwaVJlc3BvbnNlW2tleV1bJ2ltZyddLFxuICAgICAgICBkbmFtZTogYXBpUmVzcG9uc2Vba2V5XVsnZG5hbWUnXSxcbiAgICAgICAgaWQ6IGFwaVJlc3BvbnNlW2tleV1bJ2lkJ10sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBwbGFpbkl0ZW1PYmooaXRlbXNBcnI6IG51bWJlcltdIHwgc3RyaW5nW10pIHtcbiAgICBsZXQgaXRlbVByb3BlcnRpZXM6IEl0ZW1WYWx1ZXNDaGlsZFtdID0gW107XG4gICAgaXRlbXNBcnIubWFwKCh4KSA9PiB7XG4gICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkIHx8IHggPT09IDk5OSkge1xuICAgICAgICBpdGVtUHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgICBkbmFtZTogJ25vIGl0ZW0nLFxuICAgICAgICAgIGlkOiA5OTksXG4gICAgICAgICAgaW1nOiBpbWcsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoeCkge1xuICAgICAgICBpdGVtUHJvcGVydGllcy5wdXNoKHRoaXMubGlzdFt4XSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtUHJvcGVydGllcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG5leHBvcnQgY2xhc3MgTG9hZGluZyBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgSFRNTERpdkVsZW1lbnRbXT4ge1xuICBzdGF0aWMgaW5zdGFuY2U6IExvYWRpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ3RtcGwtbG9hZGluZy1zY3JlZW4nLCAnYXBwJyk7XG4gICAgdGhpcy5hdHRhY2godHJ1ZSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbiAgICB0aGlzLmluc3RhbmNlID0gbmV3IExvYWRpbmcoKTtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTG9hZGluZyB9IGZyb20gJy4vTG9hZGluZyc7XG5pbXBvcnQgeyBTdGFydFZpZXcgfSBmcm9tICcuL1N0YXJ0Vmlldyc7XG5pbXBvcnQgeyBHYW1lVmlldyB9IGZyb20gJy4vR2FtZVZpZXcnO1xuXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgc3RhdGljIGxvYWRpbmcoKSB7XG4gICAgTG9hZGluZy5nZXRJbnN0YW5jZSgpO1xuICB9XG4gIHN0YXRpYyBzdGFydFZpZXcoKSB7XG4gICAgU3RhcnRWaWV3LmdldEluc3RhbmNlKCk7XG4gIH1cbiAgc3RhdGljIGdhbWVWaWV3KCkge1xuICAgIEdhbWVWaWV3LmdldEluc3RhbmNlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGRhdGFDb250YWluZXIgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBIZXJvVmFsdWVzIH0gZnJvbSAnLi4vTW9kZWxzL3Jlc3BvbnNlTW9kZWxzJztcblxuaW1wb3J0IHsgQ2xpY2thYmxlLCBEcmFnZ2FibGUsIERyYWdUYXJnZXQgfSBmcm9tICcuLi9Nb2RlbHMvZXZlbnRsaXN0ZW5lcnMnO1xuaW1wb3J0IHsgYXV0b2JpbmQgfSBmcm9tICcuLi9EZWNvcmF0b3JzL2F1dG9iaW5kJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJy4vUm91dGVyJztcblxuZXhwb3J0IGNsYXNzIFN0YXJ0Vmlld1xuICBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgSFRNTERpdkVsZW1lbnRbXT5cbiAgaW1wbGVtZW50cyBEcmFnZ2FibGUsIERyYWdUYXJnZXQsIENsaWNrYWJsZVxue1xuICBzdGF0aWMgaW5zdGFuY2U6IFN0YXJ0VmlldztcbiAgaW1hZ2VzTG9hZGVkOiBudW1iZXIgPSAwO1xuICBzZWxlY3RlZEhlcm9JZDogc3RyaW5nID0gJyc7XG4gIGhlcm9MaXN0OiBIZXJvVmFsdWVzID0gZGF0YUNvbnRhaW5lci5oZXJvZXMubGlzdDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigndG1wbC1oZXJvLW92ZXJ2aWV3JywgJ2FwcCcpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5oZXJvTGlzdCkge1xuICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICBpbWcuaWQgPSB0aGlzLmhlcm9MaXN0W2tleV0uaWQudG9TdHJpbmcoKTtcbiAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdoZXJvLXBvcnRyYWl0Jyk7XG4gICAgICBpbWcub25lcnJvciA9ICgpID0+IHRoaXMudXBkYXRlRE9NKCk7XG4gICAgICBpbWcub25sb2FkID0gKCkgPT4gdGhpcy51cGRhdGVET00oKTtcbiAgICAgIGltZy5zcmMgPSB0aGlzLmhlcm9MaXN0W2tleV0uaW1nO1xuICAgICAgdGhpcy5lbGVtZW50WzBdLmFwcGVuZENoaWxkKGltZyk7XG4gICAgfVxuICAgIHRoaXMuY29uZmlndXJlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRE9NKCkge1xuICAgIHRoaXMuaW1hZ2VzTG9hZGVkICs9IDE7XG4gICAgaWYgKHRoaXMuaW1hZ2VzTG9hZGVkID09PSAxMjEpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2goKTtcbiAgICAgIHRoaXMuYXR0YWNoKGZhbHNlKTtcbiAgICAgIHRoaXMuaW1hZ2VzTG9hZGVkID0gMDtcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5zZXREYXRhKCd0ZXh0L3BsYWluJywgKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQpLmlkKTtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIhLmVmZmVjdEFsbG93ZWQgPSAnY29weSc7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ0VuZEhhbmRsZXIoXzogRHJhZ0V2ZW50KSB7fVxuICBAYXV0b2JpbmRcbiAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS5jbGFzc0xpc3QuYWRkKCdkcm9wcGFibGUnKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBkcmFnTGVhdmVIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCkuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBhYmxlJyk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJvcEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgaGVyb0lkID0gZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgdHJhbnNmZXJEYXRhID1cbiAgICAgIHRoaXMuaGVyb0xpc3RbZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKCd0ZXh0L3BsYWluJyldO1xuICAgIGNvbnN0IGZpcnN0Q2hpbGQgPSB0aGlzLmVsZW1lbnRbMV0uZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICBpbWcuaWQgPSB0cmFuc2ZlckRhdGFbJ2lkJ107XG4gICAgaW1nLnNyYyA9IHRyYW5zZmVyRGF0YVsnaW1nJ107XG5cbiAgICBpZiAoZmlyc3RDaGlsZD8uZmlyc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgIGZpcnN0Q2hpbGQ/LmZpcnN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgIH1cbiAgICBmaXJzdENoaWxkIS5hcHBlbmRDaGlsZChpbWcpO1xuICAgIHRoaXMuc2VsZWN0ZWRIZXJvSWQgPSB0cmFuc2ZlckRhdGFbJ2lkJ107XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgY2xpY2tIYW5kbGVyKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRIZXJvSWQpIHRoaXMuY2FsbEdhbWVWaWV3KHRoaXMuc2VsZWN0ZWRIZXJvSWQpO1xuICB9XG5cbiAgYXN5bmMgY2FsbEdhbWVWaWV3KGhlcm9JZDogc3RyaW5nKSB7XG4gICAgbGV0IGluaXQ7XG4gICAgdHJ5IHtcbiAgICAgIGluaXQgPSBkYXRhQ29udGFpbmVyLmluaXRHYW1lU3RhdGUoaGVyb0lkLCAncmFuZG9tJyk7XG4gICAgICBhd2FpdCBSb3V0ZXIuZ2FtZVZpZXcoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVFdmVudExpc3RlbmVycygpIHtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzBdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdzdGFydCcsXG4gICAgICB0aGlzLmRyYWdTdGFydEhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmVsZW1lbnRbMF0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ2VuZCcsXG4gICAgICB0aGlzLmRyYWdFbmRIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzFdLmNoaWxkcmVuWzBdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdvdmVyJyxcbiAgICAgIHRoaXMuZHJhZ092ZXJIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzFdLmNoaWxkcmVuWzBdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdsZWF2ZScsXG4gICAgICB0aGlzLmRyYWdMZWF2ZUhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmVsZW1lbnRbMV0uY2hpbGRyZW5bMF0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJvcCcsXG4gICAgICB0aGlzLmRyb3BIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzFdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIHRoaXMuY2xpY2tIYW5kbGVyXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgU3RhcnRWaWV3KCk7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cbn1cbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5leHBvcnQgY2xhc3MgVXRpbCB7XG4gIHN0YXRpYyBhc3luYyBnZXREYXRhKGJhc2VVcmw6IHN0cmluZywgdXJsRXh0ZW5zaW9uOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zKGJhc2VVcmwgKyB1cmxFeHRlbnNpb24pO1xuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYXV0b2JpbmQoXzogYW55LCBfMjogc3RyaW5nLCBkZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IpIHtcbiAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xuICBjb25zdCBhZGpEZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldCgpIHtcbiAgICAgIGNvbnN0IGJvdW5kRm4gPSBvcmlnaW5hbE1ldGhvZC5iaW5kKHRoaXMpO1xuICAgICAgcmV0dXJuIGJvdW5kRm47XG4gICAgfSxcbiAgfTtcbiAgcmV0dXJuIGFkakRlc2NyaXB0b3I7XG59XG4iLCJleHBvcnQgZW51bSBIZXJvZXMge1xuICAnQW50aS1NYWdlJyA9IDEsXG4gICdBeGUnLFxuICAnQmFuZScsXG4gICdCbG9vZHNlZWtlcicsXG4gICdDcnlzdGFsIE1haWRlbicsXG4gICdEcm93IFJhbmdlcicsXG4gICdFYXJ0aHNoYWtlcicsXG4gICdKdWdnZXJuYXV0JyxcbiAgJ01pcmFuYScsXG4gICdNb3JwaGxpbmcnLCAvLyBpZDogMTBcbiAgJ1NoYWRvdyBGaWVuZCcsXG4gICdQaGFudG9tIExhbmNlcicsXG4gICdQdWNrJyxcbiAgJ1B1ZGdlJyxcbiAgJ1Jhem9yJyxcbiAgJ1NhbmQgS2luZycsXG4gICdTdG9ybSBTcGlyaXQnLFxuICAnU3ZlbicsXG4gICdUaW55JyxcbiAgJ1ZlbmdlZnVsIFNwaXJpdCcsIC8vIGlkOiAyMFxuICAnV2luZHJhbmdlcicsXG4gICdaZXVzJyxcbiAgJ0t1bmtrYScsXG4gICdMaW5hJyA9IDI1LFxuICAnTGlvbicsXG4gICdTaGFkb3cgU2hhbWFuJyxcbiAgJ1NsYXJkYXInLFxuICAnVGlkZWh1bnRlcicsXG4gICdXaXRjaCBEb2N0b3InLCAvLyBpZDogMzAgKFNraXAgYXQgS3Vua2EvTGluYSBieSAxKVxuICAnTGljaCcsXG4gICdSaWtpJyxcbiAgJ0VuaWdtYScsXG4gICdUaW5rZXInLFxuICAnU25pcGVyJyxcbiAgJ05lY3JvcGhvcycsXG4gICdXYXJsb2NrJyxcbiAgJ0JlYXN0bWFzdGVyJyxcbiAgJ1F1ZWVuIG9mIFBhaW4nLFxuICAnVmVub21hbmNlcicsIC8vIGlkOiA0MFxuICAnRmFjZWxlc3MgVm9pZCcsXG4gICdXcmFpdGggS2luZycsXG4gICdEZWF0aCBQcm9waGV0JyxcbiAgJ1BoYW50b20gQXNzYXNzaW4nLFxuICAnUHVnbmEnLFxuICAnVGVtcGxhciBBc3Nhc3NpbicsXG4gICdWaXBlcicsXG4gICdMdW5hJyxcbiAgJ0RyYWdvbiBLbmlnaHQnLFxuICAnRGF6emxlJywgLy8gaWQ6IDUwXG4gICdDbG9ja3dlcmsnLFxuICAnTGVzaHJhYycsXG4gIFwiTmF0dXJlJ3MgUHJvcGhldFwiLFxuICAnTGlmZXN0ZWFsZXInLFxuICAnRGFyayBTZWVyJyxcbiAgJ0NsaW5reicsXG4gICdPbW5pa25pZ2h0JyxcbiAgJ0VuY2hhbnRyZXNzJyxcbiAgJ0h1c2thcicsXG4gICdOaWdodCBTdGFsa2VyJywgLy8gaWQ6IDYwXG4gICdCcm9vZG1vdGhlcicsXG4gICdCb3VudHkgSHVudGVyJyxcbiAgJ1dlYXZlcicsXG4gICdKYWtpcm8nLFxuICAnQmF0cmlkZXInLFxuICAnQ2hlbicsXG4gICdTcGVjdHJlJyxcbiAgJ0FuY2llbnQgQXBwYXJpdGlvbicsXG4gICdEb29tJyxcbiAgJ1Vyc2EnLCAvLyBpZDogNzBcbiAgJ1NwaXJpdCBCcmVha2VyJyxcbiAgJ0d5cm9jb3B0ZXInLFxuICAnQWxjaGVtaXN0JyxcbiAgJ0ludm9rZXInLFxuICAnU2lsZW5jZXInLFxuICAnT3V0d29ybGQgRGV2b3VyZXInLFxuICAnTHljYW4nLFxuICAnQnJld21hc3RlcicsXG4gICdTaGFkb3cgRGVtb24nLFxuICAnTG9uZSBEcnVpZCcsIC8vIGlkOiA4MFxuICAnQ2hhb3MgS25pZ2h0JyxcbiAgJ01lZXBvJyxcbiAgJ1RyZWFudCBQcm90ZWN0b3InLFxuICAnT2dyZSBNYWdpJyxcbiAgJ1VuZHlpbmcnLFxuICAnUnViaWNrJyxcbiAgJ0Rpc3J1cHRvcicsXG4gICdOeXggQXNzYXNzaW4nLFxuICAnTmFnYSBTaXJlbicsXG4gICdLZWVwZXIgb2YgdGhlIExpZ2h0JywgLy8gaWQ6IDkwXG4gICdXaXNwJyxcbiAgJ1Zpc2FnZScsXG4gICdTbGFyaycsXG4gICdNZWR1c2EnLFxuICAnVHJvbGwgV2FybG9yZCcsXG4gICdDZW50YXVyIFdhcnJ1bm5lcicsXG4gICdNYWdudXMnLFxuICAnVGltYmVyc2F3JyxcbiAgJ0JyaXN0bGViYWNrJyxcbiAgJ1R1c2snLCAvLyBpZDogMTAwXG4gICdTa3l3cmF0aCBNYWdlJyxcbiAgJ0FiYWRkb24nLFxuICAnRWxkZXIgVGl0YW4nLFxuICAnTGVnaW9uIENvbW1hbmRlcicsXG4gICdUZWNoaWVzJyxcbiAgJ0VtYmVyIFNwaXJpdCcsXG4gICdFYXJ0aCBTcGlyaXQnLFxuICAnVW5kZXJsb3JkJyxcbiAgJ1RlcnJvcmJsYWRlJyxcbiAgJ1Bob2VuaXgnLCAvL2lkOiAxMTBcbiAgJ09yYWNsZScsXG4gICdXaW50ZXIgV3l2ZXJuJyxcbiAgJ0FyYyBXYXJkZW4nLFxuICAnTW9ua2V5IEtpbmcnLFxuICAnRGFyayBXaWxsb3cnID0gMTE5LFxuICAnUGFuZ29saWVyJywgLy8gaWQ6IDEyMCAoc2tpcCBhdCBNb25rZXkgS2luZy9EYXJrIFdpbGxvdyBieSA2KVxuICAnR3JpbXN0cm9rZScsXG4gICdIb29kd2luaycgPSAxMjMsXG4gICdWb2lkIFNwaXJpdCcgPSAxMjYsXG4gICdTbmFwZmlyZScgPSAxMjgsXG4gICdNYXJzJyxcbiAgJ0Rhd25icmVha2VyJyA9IDEzNSwgLy8gbXVsdGlwbGUgc2tpcHMgYmV0d2VlbiAxMjAgYW5kIDEzNVxufVxuXG5leHBvcnQgZW51bSBJdGVtc0VudW0ge1xuICAnQmxhZGVzIG9mIEF0dGFjaycgPSAyLFxuICAnQ2hhaW5tYWlsJyA9IDQsXG4gICdRdWVsbGluZyBCbGFkZScgPSAxMSxcbiAgJ1Jpbmcgb2YgUHJvdGVjdGlvbicgPSAxMixcbiAgJ0dhdW50bGV0cyBvZiBTdHJlbmd0aCcgPSAxMyxcbiAgJ1NsaXBwZXJzIG9mIEFnaWxpdHknID0gMTQsXG4gICdNYW50bGUgb2YgSW50ZWxsaWdlbmNlJyA9IDE1LFxuICAnSXJvbiBCcmFuY2gnID0gMTYsXG4gICdCZWx0IG9mIFN0cmVuZ3RoJyA9IDE3LFxuICAnQmFuZCBvZiBFbHZlbnNraW4nID0gMTgsXG4gICdSb2JlIG9mIHRoZSBNYWdpJyA9IDE5LFxuICAnQ2lyY2xldCcgPSAyMCxcbiAgJ0dsb3ZlcyBvZiBIYXN0ZScgPSAyNSxcbiAgJ1Jpbmcgb2YgUmVnZW4nID0gMjcsXG4gIFwiU2FnZSdzIE1hc2tcIiA9IDI4LFxuICAnQm9vdHMgb2YgU3BlZWQnID0gMjksXG4gICdDbG9haycgPSAzMSxcbiAgJ01hZ2ljIFN0aWNrJyA9IDM0LFxuICAnTWFnaWMgV2FuZCcgPSAzNixcbiAgJ0NsYXJpdHknID0gMzgsXG4gICdIZWFsaW5nIFNhbHZlJyA9IDM5LFxuICAnRHVzdCBvZiBBcHBlYXJhbmNlJyA9IDQwLFxuICAnT2JzZXJ2ZXIgV2FyZCcgPSA0MixcbiAgJ1NlbnRyeSBXYXJkJyA9IDQzLFxuICAnVGFuZ28nID0gNDQsXG4gICdCcmFjZXInID0gNzMsXG4gICdXcmFpdGggQmFuZCcgPSA3NSxcbiAgJ051bGwgVGFsaXNtYW4nID0gNzcsXG4gICdCdWNrbGVyJyA9IDg2LFxuICAnUmluZyBvZiBCYXNpbGl1cycgPSA4OCxcbiAgJ0hlYWRkcmVzcycgPSA5NCxcbiAgJ09yYiBvZiBWZW5vbScgPSAxODEsXG4gICdTbW9rZSBvZiBEZWNlaXQnID0gMTg4LFxuICAnRW5jaGFudGVkIE1hbmdvJyA9IDIxNixcbiAgJ0ZhZXJpZSBGaXJlJyA9IDIzNyxcbiAgJ0JsaWdodCBTdG9uZScgPSAyNDAsXG4gICdXaW5kIExhY2UnID0gMjQ0LFxuICAnQ3Jvd24nID0gMjYxLFxuICAnUmFpbmRyb3BzJyA9IDI2NSxcbiAgJ0ZsdWZmeSBIYXQnID0gNTkzLFxuICAnbm8gaXRlbScgPSA5OTksXG59XG4iLCJpbXBvcnQgeyBIZXJvZXMsIEl0ZW1zRW51bSB9IGZyb20gJy4vX2VudW1zJztcbmltcG9ydCB7IGhlcm9JdGVtU2xvdHMsIEl0ZW1MaXN0U3RhdGljIH0gZnJvbSAnLi9faW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjb25zdCBpdGVtU3RhdHM6IEl0ZW1MaXN0U3RhdGljID0ge1xuICBbSXRlbXNFbnVtWydDbGFyaXR5J11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNTAsXG4gICAgbWFuYVJlZ2VuVGVtcDogNixcbiAgICBtYW5hUmVnZW5EdXJhdGlvbjogMjUsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0R1c3Qgb2YgQXBwZWFyYW5jZSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiA4MCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNzAsXG4gICAgaHBSZWdlblBlcm1hbmVudDogMC42LFxuICAgIG1hbmFSZWdlblRlbXA6IDEwMCxcbiAgICBtYW5hUmVnZW5EdXJhdGlvbjogMSxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnRmFlcmllIEZpcmUnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA3MCxcbiAgICBoZWFsOiA4NSxcbiAgICBkbWdSYXc6IDIsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogMTEwLFxuICAgIGhwUmVnZW5UZW1wOiA0MCxcbiAgICBocFJlZ2VuRHVyYXRpb246IDEwLFxuICB9LFxuICBbSXRlbXNFbnVtWydTZW50cnkgV2FyZCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiA1MCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiAwLFxuICB9LFxuICBbSXRlbXNFbnVtWydTbW9rZSBvZiBEZWNlaXQnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogNTAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1RhbmdvJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogOTAsXG4gICAgaHBSZWdlblRlbXA6IDcuMTg3NSxcbiAgICBocFJlZ2VuRHVyYXRpb246IDE2LFxuICB9LFxuICBbSXRlbXNFbnVtWydCYW5kIG9mIEVsdmVuc2tpbiddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQ1MCxcbiAgICBhZ2lCb251czogNixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQmVsdCBvZiBTdHJlbmd0aCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQ1MCxcbiAgICBzdHJCb251czogNixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQ2lyY2xldCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDE1NSxcbiAgICBzdHJCb251czogMixcbiAgICBhZ2lCb251czogMixcbiAgICBpbnRCb251czogMixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQ3Jvd24nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0NTAsXG4gICAgc3RyQm9udXM6IDQsXG4gICAgYWdpQm9udXM6IDQsXG4gICAgaW50Qm9udXM6IDQsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0dhdW50bGV0cyBvZiBTdHJlbmd0aCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDE0MCxcbiAgICBzdHJCb251czogMyxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA1MCxcbiAgICBzdHJCb251czogMSxcbiAgICBhZ2lCb251czogMSxcbiAgICBpbnRCb251czogMSxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDE0MCxcbiAgICBpbnRCb251czogMyxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnUm9iZSBvZiB0aGUgTWFnaSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQ1MCxcbiAgICBpbnRCb251czogNixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDE0MCxcbiAgICBhZ2lCb251czogMyxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQmxhZGVzIG9mIEF0dGFjayddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQ1MCxcbiAgICBkbWdSYXc6IDksXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0JsaWdodCBTdG9uZSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDMwMCxcbiAgICBhcm1vckRlYnVmZjogMixcbiAgICBhcm1vckRlYnVmZkR1cmF0aW9uOiA4LFxuICB9LFxuICBbSXRlbXNFbnVtWydDaGFpbm1haWwnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA1NTAsXG4gICAgYXJtb3JSYXc6IDQsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0dsb3ZlcyBvZiBIYXN0ZSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQ1MCxcbiAgICBhdHRTcGVlZFJhdzogMjAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1JhaW5kcm9wcyddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiAyMjUsXG4gICAgbWFuYVJlZ2VuUGVybWFuZW50OiAwLjgsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ09yYiBvZiBWZW5vbSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDI3NSxcbiAgICBkbWdUZW1wVmFsdWU6IDIsXG4gICAgZG1nVGVtcER1cmF0aW9uOiAyLFxuICB9LFxuICBbSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiAxMzAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDE3NSxcbiAgICBhcm1vclJhdzogMixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogNTAwLFxuICB9LFxuICBbSXRlbXNFbnVtWydDbG9hayddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiA1MDAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0ZsdWZmeSBIYXQnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAyNTAsXG4gICAgaHBSYXc6IDEyNSxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnTWFnaWMgU3RpY2snXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogMjAwLFxuICB9LFxuICBbSXRlbXNFbnVtWydSaW5nIG9mIFJlZ2VuJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogMTc1LFxuICAgIGhwUmVnZW5QZXJtYW5lbnQ6IDEuMjUsXG4gIH0sXG4gIFtJdGVtc0VudW1bXCJTYWdlJ3MgTWFza1wiXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogMTc1LFxuICAgIG1hbmFSZWdlblBlcm1hbmVudDogMC43LFxuICB9LFxuICBbSXRlbXNFbnVtWydXaW5kIExhY2UnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogMjUwLFxuICB9LFxuICBbSXRlbXNFbnVtWydCcmFjZXInXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA1MDUsXG4gICAgc3RyQm9udXM6IDUsXG4gICAgYWdpQm9udXM6IDIsXG4gICAgaW50Qm9udXM6IDIsXG4gICAgaHBSZWdlblBlcm1hbmVudDogMSxcbiAgICBkbWdSYXc6IDMsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ01hZ2ljIFdhbmQnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0NTAsXG4gICAgc3RyQm9udXM6IDMsXG4gICAgYWdpQm9udXM6IDMsXG4gICAgaW50Qm9udXM6IDMsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ051bGwgVGFsaXNtYW4nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA1MDUsXG4gICAgc3RyQm9udXM6IDIsXG4gICAgYWdpQm9udXM6IDIsXG4gICAgaW50Qm9udXM6IDUsXG4gICAgbWFuYVJlZ2VuUGVybWFuZW50OiAwLjYsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1dyYWl0aCBCYW5kJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNTA1LFxuICAgIHN0ckJvbnVzOiAyLFxuICAgIGFnaUJvbnVzOiA1LFxuICAgIGludEJvbnVzOiAyLFxuICAgIGFybW9yUmF3OiAxLjUsXG4gICAgYXR0U3BlZWRSYXc6IDUsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0J1Y2tsZXInXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0MjUsXG4gICAgYXJtb3JSYXc6IDMsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0hlYWRkcmVzcyddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQyNSxcbiAgICBocFJlZ2VuUGVybWFuZW50OiAyLjUsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1Jpbmcgb2YgQmFzaWxpdXMnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0MjUsXG4gICAgbWFuYVJlZ2VuUGVybWFuZW50OiAxLjUsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ25vIGl0ZW0nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogMCxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBoZXJvU3RhcnRJdGVtczogaGVyb0l0ZW1TbG90cyA9IHtcbiAgW0hlcm9lc1snQW50aS1NYWdlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydBeGUnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydCYW5lJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snQmxvb2RzZWVrZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0NyeXN0YWwgTWFpZGVuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snRHJvdyBSYW5nZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0VhcnRoc2hha2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydCb290cyBvZiBTcGVlZCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNDogdW5kZWZpbmVkLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snSnVnZ2VybmF1dCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ01pcmFuYSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVtcIlNhZ2UncyBNYXNrXCJdLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTW9ycGhsaW5nJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydTaGFkb3cgRmllbmQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snUGhhbnRvbSBMYW5jZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ1B1Y2snXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ1B1ZGdlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snUmF6b3InXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NhbmQgS2luZyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICB9LFxuICBbSGVyb2VzWydTdG9ybSBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ1N2ZW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snVGlueSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1ZlbmdlZnVsIFNwaXJpdCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydXaW5kcmFuZ2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydaZXVzJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydLdW5ra2EnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0xpbmEnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0xpb24nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDbGFyaXR5J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1dpbmQgTGFjZSddLFxuICB9LFxuICBbSGVyb2VzWydTaGFkb3cgU2hhbWFuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snU2xhcmRhciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydUaWRlaHVudGVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snV2l0Y2ggRG9jdG9yJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydMaWNoJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snUmlraSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnT3JiIG9mIFZlbm9tJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snRW5pZ21hJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydOdWxsIFRhbGlzbWFuJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW00OiB1bmRlZmluZWQsXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydUaW5rZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydTbmlwZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydOZWNyb3Bob3MnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dhcmxvY2snXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtW1wiU2FnZSdzIE1hc2tcIl0sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydCZWFzdG1hc3RlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1F1ZWVuIG9mIFBhaW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVmVub21hbmNlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snRmFjZWxlc3MgVm9pZCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snV3JhaXRoIEtpbmcnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydEZWF0aCBQcm9waGV0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICB9LFxuICBbSGVyb2VzWydQaGFudG9tIEFzc2Fzc2luJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydQdWduYSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVGVtcGxhciBBc3Nhc3NpbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydWaXBlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0x1bmEnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICB9LFxuICBbSGVyb2VzWydEcmFnb24gS25pZ2h0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICB9LFxuICBbSGVyb2VzWydEYXp6bGUnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bXCJTYWdlJ3MgTWFza1wiXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0Nsb2Nrd2VyayddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1dpbmQgTGFjZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydMZXNocmFjJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzW1wiTmF0dXJlJ3MgUHJvcGhldFwiXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0JsaWdodCBTdG9uZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTGlmZXN0ZWFsZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydHYXVudGxldHMgb2YgU3RyZW5ndGgnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snRGFyayBTZWVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgfSxcbiAgW0hlcm9lc1snQ2xpbmt6J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydPbW5pa25pZ2h0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydFbmNoYW50cmVzcyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0JsaWdodCBTdG9uZSddLFxuICB9LFxuICBbSGVyb2VzWydIdXNrYXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydHYXVudGxldHMgb2YgU3RyZW5ndGgnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydOaWdodCBTdGFsa2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydCcm9vZG1vdGhlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgfSxcbiAgW0hlcm9lc1snQm91bnR5IEh1bnRlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTQ6IHVuZGVmaW5lZCxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ1dlYXZlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydKYWtpcm8nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDbGFyaXR5J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydCYXRyaWRlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0NoZW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVtcIlNhZ2UncyBNYXNrXCJdLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snU3BlY3RyZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0FuY2llbnQgQXBwYXJpdGlvbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0Rvb20nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydVcnNhJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snU3Bpcml0IEJyZWFrZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0Jvb3RzIG9mIFNwZWVkJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW00OiB1bmRlZmluZWQsXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydHeXJvY29wdGVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVtcIlNhZ2UncyBNYXNrXCJdLFxuICB9LFxuICBbSGVyb2VzWydBbGNoZW1pc3QnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydHYXVudGxldHMgb2YgU3RyZW5ndGgnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydJbnZva2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NpbGVuY2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ091dHdvcmxkIERldm91cmVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0Nyb3duJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snTHljYW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snQnJld21hc3RlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NoYWRvdyBEZW1vbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0xvbmUgRHJ1aWQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09yYiBvZiBWZW5vbSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0NoYW9zIEtuaWdodCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICB9LFxuICBbSGVyb2VzWydNZWVwbyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydUcmVhbnQgUHJvdGVjdG9yJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnT3JiIG9mIFZlbm9tJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snT2dyZSBNYWdpJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydVbmR5aW5nJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snUnViaWNrJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydCb290cyBvZiBTcGVlZCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNDogdW5kZWZpbmVkLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snRGlzcnVwdG9yJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ055eCBBc3Nhc3NpbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTQ6IHVuZGVmaW5lZCxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ05hZ2EgU2lyZW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0tlZXBlciBvZiB0aGUgTGlnaHQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snV2lzcCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydIZWFkZHJlc3MnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydWaXNhZ2UnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydTbGFyayddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTWVkdXNhJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snVHJvbGwgV2FybG9yZCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snQ2VudGF1ciBXYXJydW5uZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydNYWdudXMnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydUaW1iZXJzYXcnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydCcmlzdGxlYmFjayddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICB9LFxuICBbSGVyb2VzWydUdXNrJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydCb290cyBvZiBTcGVlZCddLFxuICAgIGl0ZW0zOiB1bmRlZmluZWQsXG4gICAgaXRlbTQ6IHVuZGVmaW5lZCxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ1NreXdyYXRoIE1hZ2UnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIC8vIGxhc3Qgcm91bmRcbiAgW0hlcm9lc1snQWJhZGRvbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtW1wiU2FnZSdzIE1hc2tcIl0sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydFbGRlciBUaXRhbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnV2luZCBMYWNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydMZWdpb24gQ29tbWFuZGVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydHYXVudGxldHMgb2YgU3RyZW5ndGgnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydHYXVudGxldHMgb2YgU3RyZW5ndGgnXSxcbiAgfSxcbiAgW0hlcm9lc1snVGVjaGllcyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydXaW5kIExhY2UnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0VtYmVyIFNwaXJpdCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0VhcnRoIFNwaXJpdCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snVW5kZXJsb3JkJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVGVycm9yYmxhZGUnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydQaG9lbml4J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0Nyb3duJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snT3JhY2xlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snV2ludGVyIFd5dmVybiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydBcmMgV2FyZGVuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydNb25rZXkgS2luZyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnT3JiIG9mIFZlbm9tJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snRGFyayBXaWxsb3cnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snUGFuZ29saWVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydHcmltc3Ryb2tlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snSG9vZHdpbmsnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQmxpZ2h0IFN0b25lJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydWb2lkIFNwaXJpdCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydTbmFwZmlyZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0JsaWdodCBTdG9uZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTWFycyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydEYXduYnJlYWtlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydHYXVudGxldHMgb2YgU3RyZW5ndGgnXSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICcuL0NvbXBvbmVudHMvUm91dGVyJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuL0NvbXBvbmVudHMvVXRpbCc7XG5pbXBvcnQgeyBIZXJvZXMgfSBmcm9tICcuL0NvbXBvbmVudHMvSGVyb2VzJztcbmltcG9ydCB7IEl0ZW1zIH0gZnJvbSAnLi9Db21wb25lbnRzL0l0ZW1zJztcbmltcG9ydCB7IERhdGFDb250YWluZXIgfSBmcm9tICcuL0NvbXBvbmVudHMvRGF0YUNvbnRhaW5lcic7XG5cblJvdXRlci5sb2FkaW5nKCk7XG5leHBvcnQgY29uc3QgZGF0YUNvbnRhaW5lciA9IG5ldyBEYXRhQ29udGFpbmVyKCk7XG5cblV0aWwuZ2V0RGF0YSgnaHR0cHM6Ly9hcGkub3BlbmRvdGEuY29tL2FwaScsICcvY29uc3RhbnRzL2hlcm9lcycpXG4gIC50aGVuKChyZXMpID0+IHtcbiAgICBkYXRhQ29udGFpbmVyLmluaXRIZXJvTGlzdChyZXMpO1xuICAgIFJvdXRlci5zdGFydFZpZXcoKTtcbiAgfSlcbiAgLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcblxuVXRpbC5nZXREYXRhKCdodHRwczovL2FwaS5vcGVuZG90YS5jb20vYXBpJywgJy9jb25zdGFudHMvaXRlbXMnKVxuICAudGhlbigocmVzKSA9PiB7XG4gICAgZGF0YUNvbnRhaW5lci5pbml0SXRlbUxpc3QocmVzKTtcbiAgfSlcbiAgLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=