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


class GameState {
    constructor(heroId, gameMode) {
        this.gameMode = gameMode;
        // get hero
        this.heroObj = _index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.heroes.plainHeroObj(heroId);
        this.heroKeys = Object.keys(_index__WEBPACK_IMPORTED_MODULE_0__.dataContainer.heroes.list);
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
        hpRegenTemp: 85,
        hpRegenDuration: 1,
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
        hpRegenTemp: 7,
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
        hpRegenTemp: 7,
        hpRegenDuration: 32,
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
        relevantValues: true,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsRUFBRSxFQUFFO0lBQ1osYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7S0FDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7VUN4Qkw7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFZkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9pbWdzL25vaXRlbXMucG5nIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL0NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9EYXRhQ29udGFpbmVyLnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL0dhbWVTdGF0ZS50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9HYW1lVmlldy50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9IZXJvZXMudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvSXRlbXMudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvTG9hZGluZy50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9Sb3V0ZXIudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvU3RhcnRWaWV3LnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL1V0aWwudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0RlY29yYXRvcnMvYXV0b2JpbmQudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL01vZGVscy9oZXJvU3RhcnRJdGVtcy9fZW51bXMudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL01vZGVscy9oZXJvU3RhcnRJdGVtcy9zdGFydEl0ZW1zLnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCByZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSAndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcih0aW1lb3V0RXJyb3JNZXNzYWdlLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuYXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhheGlvcy5kZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcbn07XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0F4aW9zRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNcbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZVxuICAgIH07XG4gIH07XG4gIHJldHVybiBlcnJvcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG5cbiAgdmFyIHZhbHVlRnJvbUNvbmZpZzJLZXlzID0gWyd1cmwnLCAnbWV0aG9kJywgJ2RhdGEnXTtcbiAgdmFyIG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzID0gWydoZWFkZXJzJywgJ2F1dGgnLCAncHJveHknLCAncGFyYW1zJ107XG4gIHZhciBkZWZhdWx0VG9Db25maWcyS2V5cyA9IFtcbiAgICAnYmFzZVVSTCcsICd0cmFuc2Zvcm1SZXF1ZXN0JywgJ3RyYW5zZm9ybVJlc3BvbnNlJywgJ3BhcmFtc1NlcmlhbGl6ZXInLFxuICAgICd0aW1lb3V0JywgJ3RpbWVvdXRNZXNzYWdlJywgJ3dpdGhDcmVkZW50aWFscycsICdhZGFwdGVyJywgJ3Jlc3BvbnNlVHlwZScsICd4c3JmQ29va2llTmFtZScsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJywgJ29uVXBsb2FkUHJvZ3Jlc3MnLCAnb25Eb3dubG9hZFByb2dyZXNzJywgJ2RlY29tcHJlc3MnLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJywgJ21heEJvZHlMZW5ndGgnLCAnbWF4UmVkaXJlY3RzJywgJ3RyYW5zcG9ydCcsICdodHRwQWdlbnQnLFxuICAgICdodHRwc0FnZW50JywgJ2NhbmNlbFRva2VuJywgJ3NvY2tldFBhdGgnLCAncmVzcG9uc2VFbmNvZGluZydcbiAgXTtcbiAgdmFyIGRpcmVjdE1lcmdlS2V5cyA9IFsndmFsaWRhdGVTdGF0dXMnXTtcblxuICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UodGFyZ2V0LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoe30sIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIHV0aWxzLmZvckVhY2godmFsdWVGcm9tQ29uZmlnMktleXMsIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICB1dGlscy5mb3JFYWNoKGRlZmF1bHRUb0NvbmZpZzJLZXlzLCBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChkaXJlY3RNZXJnZUtleXMsIGZ1bmN0aW9uIG1lcmdlKHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBheGlvc0tleXMgPSB2YWx1ZUZyb21Db25maWcyS2V5c1xuICAgIC5jb25jYXQobWVyZ2VEZWVwUHJvcGVydGllc0tleXMpXG4gICAgLmNvbmNhdChkZWZhdWx0VG9Db25maWcyS2V5cylcbiAgICAuY29uY2F0KGRpcmVjdE1lcmdlS2V5cyk7XG5cbiAgdmFyIG90aGVyS2V5cyA9IE9iamVjdFxuICAgIC5rZXlzKGNvbmZpZzEpXG4gICAgLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSlcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIGZpbHRlckF4aW9zS2V5cyhrZXkpIHtcbiAgICAgIHJldHVybiBheGlvc0tleXMuaW5kZXhPZihrZXkpID09PSAtMTtcbiAgICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG90aGVyS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB2YXIgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuXG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgcmV0dXJuICh0eXBlb2YgcGF5bG9hZCA9PT0gJ29iamVjdCcpICYmIChwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwpICYmIHZhbC5jb25zdHJ1Y3RvciAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsLmNvbnN0cnVjdG9yKVxuICAgICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWwpIHtcbiAgaWYgKHRvU3RyaW5nLmNhbGwodmFsKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gIHJldHVybiBwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJlNWM3YTdkYTRjMTA1NTExMGE3ZGNjMzIxMjEwMGUxNS5wbmdcIjsiLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFxuICBUIGV4dGVuZHMgSFRNTEVsZW1lbnQsXG4gIFUgZXh0ZW5kcyBIVE1MRWxlbWVudFtdXG4+IHtcbiAgdGVtcGxhdGVFbGVtZW50OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xuICBob3N0RWxlbWVudDogVDtcbiAgZWxlbWVudDogVTtcblxuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZWRJZDogc3RyaW5nLCBob3N0RWxlbWVudElkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnRlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgdGVtcGxhdGVkSWRcbiAgICApISBhcyBIVE1MVGVtcGxhdGVFbGVtZW50O1xuICAgIHRoaXMuaG9zdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChob3N0RWxlbWVudElkKSEgYXMgVDtcblxuICAgIGNvbnN0IGltcG9ydGVkTm9kZSA9IGRvY3VtZW50LmltcG9ydE5vZGUoXG4gICAgICB0aGlzLnRlbXBsYXRlRWxlbWVudC5jb250ZW50LFxuICAgICAgdHJ1ZVxuICAgICk7XG4gICAgdGhpcy5lbGVtZW50ID0gQXJyYXkuZnJvbShpbXBvcnRlZE5vZGUuY2hpbGRyZW4pIGFzIFU7XG4gIH1cblxuICBhdHRhY2goYXRTdGFydDogYm9vbGVhbikge1xuICAgIHRoaXMuZWxlbWVudC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgdGhpcy5ob3N0RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXG4gICAgICAgIGF0U3RhcnQgPyAnYWZ0ZXJiZWdpbicgOiAnYmVmb3JlZW5kJyxcbiAgICAgICAgZWxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBkaXNwYXRjaCgpIHtcbiAgICBBcnJheS5mcm9tKHRoaXMuaG9zdEVsZW1lbnQuY2hpbGRyZW4pLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICBlbC5yZW1vdmUoKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSGVyb1ZhbHVlcywgSXRlbVZhbHVlcyB9IGZyb20gJy4uL01vZGVscy9yZXNwb25zZU1vZGVscyc7XG5pbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tICcuL0dhbWVTdGF0ZSc7XG5pbXBvcnQgeyBIZXJvZXMgfSBmcm9tICcuL0hlcm9lcyc7XG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vSXRlbXMnO1xuaW1wb3J0IHsgaGVyb1N0YXJ0SXRlbXMgfSBmcm9tICcuLi9Nb2RlbHMvaGVyb1N0YXJ0SXRlbXMvc3RhcnRJdGVtcyc7XG5cbmV4cG9ydCBjbGFzcyBEYXRhQ29udGFpbmVyIHtcbiAgaGVyb2VzITogSGVyb2VzO1xuICBpbml0SGVyb0xpc3QoYXBpUmVzcG9uc2U6IEhlcm9WYWx1ZXMpIHtcbiAgICBjb25zdCBoZXJvZXMgPSBuZXcgSGVyb2VzKGFwaVJlc3BvbnNlKTtcbiAgICByZXR1cm4gKHRoaXMuaGVyb2VzID0gaGVyb2VzKTtcbiAgfVxuXG4gIGl0ZW1zITogSXRlbXM7XG4gIGluaXRJdGVtTGlzdChhcGlSZXNwb25zZTogSXRlbVZhbHVlcykge1xuICAgIGNvbnN0IGl0ZW1zID0gbmV3IEl0ZW1zKGFwaVJlc3BvbnNlKTtcbiAgICByZXR1cm4gKHRoaXMuaXRlbXMgPSBpdGVtcyk7XG4gIH1cbiAgZ2FtZVN0YXRlITogR2FtZVN0YXRlO1xuICBpbml0R2FtZVN0YXRlKGhlcm9JZDogc3RyaW5nLCBnYW1lTW9kZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZ2FtZVN0YXRlID0gbmV3IEdhbWVTdGF0ZShoZXJvSWQsIGdhbWVNb2RlKTtcbiAgICByZXR1cm4gKHRoaXMuZ2FtZVN0YXRlID0gZ2FtZVN0YXRlKTtcbiAgfVxuICBoZXJvU3RhcnRJdGVtcyA9IGhlcm9TdGFydEl0ZW1zO1xufVxuIiwiaW1wb3J0IHsgZGF0YUNvbnRhaW5lciB9IGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7XG4gIEhlcm9WYWx1ZXMsXG4gIEhlcm9WYWx1ZXNDaGlsZCxcbiAgSXRlbVZhbHVlc0NoaWxkLFxufSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuaW1wb3J0IHsgaXRlbVN0YXRzIH0gZnJvbSAnLi4vTW9kZWxzL2hlcm9TdGFydEl0ZW1zL3N0YXJ0SXRlbXMnO1xuXG5leHBvcnQgY2xhc3MgR2FtZVN0YXRlIHtcbiAgaGVyb09iajogSGVyb1ZhbHVlc0NoaWxkO1xuICBoZXJvSXRlbXM6IEl0ZW1WYWx1ZXNDaGlsZFtdO1xuICBjdXJyZW50T3Bwb25lbnQhOiBIZXJvVmFsdWVzQ2hpbGQ7XG4gIG9wcG9uZW50SXRlbXMhOiBJdGVtVmFsdWVzQ2hpbGRbXTtcbiAgZ2FtZU1vZGU7XG4gIGhlcm9LZXlzO1xuICBzdGFydEl0ZW1zITogSXRlbVZhbHVlc0NoaWxkW107XG4gIGhlcm9Hb2xkITogbnVtYmVyO1xuICBvcHBvbmVudEdvbGQhOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoaGVyb0lkOiBzdHJpbmcsIGdhbWVNb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmdhbWVNb2RlID0gZ2FtZU1vZGU7XG5cbiAgICAvLyBnZXQgaGVyb1xuICAgIHRoaXMuaGVyb09iaiA9IGRhdGFDb250YWluZXIuaGVyb2VzLnBsYWluSGVyb09iaihoZXJvSWQpO1xuICAgIHRoaXMuaGVyb0tleXMgPSBPYmplY3Qua2V5cyhkYXRhQ29udGFpbmVyLmhlcm9lcy5saXN0IGFzIEhlcm9WYWx1ZXMpO1xuXG4gICAgLy8gZ2V0IGhlcm8gaXRlbXNcbiAgICBjb25zdCBpdGVtS2V5cyA9IE9iamVjdC52YWx1ZXMoXG4gICAgICBkYXRhQ29udGFpbmVyLmhlcm9TdGFydEl0ZW1zW3RoaXMuaGVyb09ialsnaWQnXV1cbiAgICApO1xuICAgIHRoaXMuaGVyb0l0ZW1zID0gZGF0YUNvbnRhaW5lci5pdGVtcy5wbGFpbkl0ZW1PYmooaXRlbUtleXMpO1xuICAgIHRoaXMuc2V0R29sZCh0aGlzLmhlcm9JdGVtcywgJ2hlcm9Hb2xkJyk7XG5cbiAgICB0aGlzLnNldEN1cnJlbnRPcHBvbmVudCgpO1xuICAgIHRoaXMuZ2V0T3Bwb25lbnRJdGVtcygpO1xuICAgIHRoaXMuZ2V0U3RhcnRJdGVtcygpO1xuICB9XG5cbiAgaW5pdENoYW5nZShuZXdJdGVtOiBzdHJpbmcsIG9sZEl0ZW06IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcpIHtcbiAgICBpZiAodGFyZ2V0ID09PSAnaGVybycpIHtcbiAgICAgIHRoaXMuc2V0SGVyb0l0ZW1zKG5ld0l0ZW0sIG9sZEl0ZW0pO1xuICAgICAgdGhpcy5zZXRHb2xkKHRoaXMuaGVyb0l0ZW1zLCAnaGVyb0dvbGQnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodGFyZ2V0ID09PSAnb3Bwb25lbnQnKSB7XG4gICAgICB0aGlzLnNldE9wcG9uZW50SXRlbXMobmV3SXRlbSwgb2xkSXRlbSk7XG4gICAgICB0aGlzLnNldEdvbGQodGhpcy5vcHBvbmVudEl0ZW1zLCAnb3Bwb25lbnRHb2xkJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBlbm91Z2hHb2xkKG5ld0l0ZW06IHN0cmluZywgb2xkSXRlbTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZykge1xuICAgIGNvbnN0IGdvbGRDb3VudCA9XG4gICAgICArdGhpc1t0YXJnZXQgYXMga2V5b2YgR2FtZVN0YXRlXSArXG4gICAgICBpdGVtU3RhdHNbbmV3SXRlbV0uZ29sZCAtXG4gICAgICBpdGVtU3RhdHNbb2xkSXRlbV0uZ29sZDtcbiAgICByZXR1cm4gZ29sZENvdW50IDwgNjAxO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHBvbmVudEl0ZW1zKG5ld0l0ZW06IHN0cmluZywgb2xkSXRlbTogc3RyaW5nKSB7XG4gICAgbGV0IGxpc3QgPSBbXTtcbiAgICB0aGlzLm9wcG9uZW50SXRlbXMubWFwKCh4KSA9PiB7XG4gICAgICBsaXN0LnB1c2goK3guaWQpO1xuICAgIH0pO1xuICAgIGxldCBpbmRleCA9IHRoaXMub3Bwb25lbnRJdGVtcy5maW5kSW5kZXgoKHgpID0+IHtcbiAgICAgIHJldHVybiB4LmlkID09PSArb2xkSXRlbTtcbiAgICB9KTtcblxuICAgIGxpc3RbaW5kZXhdID0gK25ld0l0ZW07XG4gICAgdGhpcy5vcHBvbmVudEl0ZW1zID0gZGF0YUNvbnRhaW5lci5pdGVtcy5wbGFpbkl0ZW1PYmoobGlzdCk7XG4gIH1cblxuICByZXNldChcbiAgICBnb2xkVGFyZ2V0OiAnaGVyb0dvbGQnIHwgJ29wcG9uZW50R29sZCcsXG4gICAgaXRlbXNUYXJnZXQ6ICdoZXJvSXRlbXMnIHwgJ29wcG9uZW50SXRlbXMnXG4gICkge1xuICAgIGNvbnN0IGFycmF5Rm9yUmVzZXQgPSBbOTk5LCA5OTksIDk5OSwgOTk5LCA5OTksIDk5OV07XG4gICAgdGhpc1tpdGVtc1RhcmdldF0gPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihhcnJheUZvclJlc2V0KTtcbiAgICB0aGlzLnNldEdvbGQodGhpc1tpdGVtc1RhcmdldF0sIGdvbGRUYXJnZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRIZXJvSXRlbXMobmV3SXRlbTogc3RyaW5nLCBvbGRJdGVtOiBzdHJpbmcpIHtcbiAgICBsZXQgbGlzdCA9IFtdO1xuICAgIHRoaXMuaGVyb0l0ZW1zLm1hcCgoeCkgPT4ge1xuICAgICAgbGlzdC5wdXNoKCt4LmlkKTtcbiAgICB9KTtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmhlcm9JdGVtcy5maW5kSW5kZXgoKHgpID0+IHtcbiAgICAgIHJldHVybiB4LmlkID09PSArb2xkSXRlbTtcbiAgICB9KTtcblxuICAgIGxpc3RbaW5kZXhdID0gK25ld0l0ZW07XG4gICAgdGhpcy5oZXJvSXRlbXMgPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihsaXN0KTtcbiAgfVxuXG4gIHNldEN1cnJlbnRPcHBvbmVudCgpIHtcbiAgICBpZiAodGhpcy5oZXJvS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBhbGVydCgnRmluaXNoJyk7XG4gICAgfVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5oZXJvS2V5cy5sZW5ndGgpO1xuICAgIHRoaXMuY3VycmVudE9wcG9uZW50ISA9IGRhdGFDb250YWluZXIuaGVyb2VzLnBsYWluSGVyb09iaihcbiAgICAgIHRoaXMuaGVyb0tleXNbcmFuZG9tSW5kZXhdLnRvU3RyaW5nKClcbiAgICApO1xuICAgIC8vIHJlbW92ZSBvcHAgZnJvbSBsaXN0IG9mIGtleXNcbiAgICB0aGlzLmhlcm9LZXlzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gIH1cblxuICBnZXRPcHBvbmVudEl0ZW1zKCkge1xuICAgIGNvbnN0IG9wcEl0ZW1LZXlzID0gT2JqZWN0LnZhbHVlcyhcbiAgICAgIGRhdGFDb250YWluZXIuaGVyb1N0YXJ0SXRlbXNbdGhpcy5jdXJyZW50T3Bwb25lbnRbJ2lkJ11dXG4gICAgKTtcbiAgICB0aGlzLm9wcG9uZW50SXRlbXMgPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihvcHBJdGVtS2V5cyk7XG4gICAgdGhpcy5zZXRHb2xkKHRoaXMub3Bwb25lbnRJdGVtcywgJ29wcG9uZW50R29sZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdGFydEl0ZW1zKCkge1xuICAgIGNvbnN0IGl0ZW1LZXlzID0gT2JqZWN0LmtleXMoaXRlbVN0YXRzKTtcbiAgICB0aGlzLnN0YXJ0SXRlbXMgPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihpdGVtS2V5cyk7XG4gIH1cblxuICBwcml2YXRlIHNldEdvbGQoXG4gICAgaXRlbXM6IEl0ZW1WYWx1ZXNDaGlsZFtdLFxuICAgIHRhcmdldDogJ2hlcm9Hb2xkJyB8ICdvcHBvbmVudEdvbGQnXG4gICkge1xuICAgIGxldCBnb2xkID0gMDtcbiAgICBpdGVtcy5tYXAoKHgpID0+IHtcbiAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZ29sZCArPSBpdGVtU3RhdHNbeFsnaWQnXV0uZ29sZDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXNbdGFyZ2V0XSA9IGdvbGQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IGRhdGFDb250YWluZXIgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBJdGVtVmFsdWVzQ2hpbGQgfSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuaW1wb3J0IHsgYXV0b2JpbmQgfSBmcm9tICcuLi9EZWNvcmF0b3JzL2F1dG9iaW5kJztcbmltcG9ydCB7IERyYWdnYWJsZSwgRHJhZ1RhcmdldCB9IGZyb20gJy4uL01vZGVscy9ldmVudGxpc3RlbmVycyc7XG5cbmV4cG9ydCBjbGFzcyBHYW1lVmlld1xuICBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgW0hUTUxEaXZFbGVtZW50XT5cbiAgaW1wbGVtZW50cyBEcmFnZ2FibGUsIERyYWdUYXJnZXRcbntcbiAgc3RhdGljIGluc3RhbmNlOiBHYW1lVmlldztcbiAgZ2FtZUNvbnRhaW5lciA9IHRoaXMuZWxlbWVudFswXS5maXJzdEVsZW1lbnRDaGlsZCEuY2hpbGRyZW47XG4gIHN0YXJ0SXRlbXNDb250YWluZXIgPSB0aGlzLmVsZW1lbnRbMF0uY2hpbGRyZW5bMl07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ3RtcGwtZ2FtZS12aWV3JywgJ2FwcCcpO1xuICAgIHRoaXMucmVuZGVySGVybygpO1xuICAgIHRoaXMucmVuZGVyT3Bwb25lbnQoKTtcbiAgICB0aGlzLnJlbmRlclN0YXJ0SXRlbXMoKTtcbiAgICB0aGlzLmRpc3BhdGNoKCk7XG4gICAgdGhpcy5hdHRhY2godHJ1ZSk7XG4gICAgdGhpcy5jb25maWd1cmVFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJJdGVtcyhcbiAgICBzb3VyY2U6IEl0ZW1WYWx1ZXNDaGlsZFtdLFxuICAgIHRhcmdldDogRWxlbWVudCxcbiAgICBjbGFzc05hbWU6IHN0cmluZ1xuICApIHtcbiAgICBjb25zdCBpdGVtcyA9IE9iamVjdC52YWx1ZXMoc291cmNlKTtcblxuICAgIHdoaWxlICh0YXJnZXQuZmlyc3RDaGlsZCkge1xuICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKDxIVE1MRWxlbWVudD50YXJnZXQubGFzdENoaWxkKTtcbiAgICB9XG5cbiAgICBpdGVtcy5tYXAoKHgpID0+IHtcbiAgICAgIGlmICh4KSB7XG4gICAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWcuc3JjID0geFsnaW1nJ107XG4gICAgICAgIGltZy5pZCA9IHhbJ2lkJ10udG9TdHJpbmcoKTtcbiAgICAgICAgaW1nLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3RhcnRJdGVtcygpIHtcbiAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuc3RhcnRJdGVtcyxcbiAgICAgIHRoaXMuc3RhcnRJdGVtc0NvbnRhaW5lcixcbiAgICAgICdhbGxJdGVtcydcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJHb2xkKHNvdXJjZTogbnVtYmVyLCB0YXJnZXQ6IEVsZW1lbnQpIHtcbiAgICB0YXJnZXQudGV4dENvbnRlbnQgPSAoNjAwIC0gc291cmNlKS50b1N0cmluZygpICsgJyBHb2xkIGxlZnQnO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJIZXJvKCkge1xuICAgIGNvbnN0IGhlcm9Db250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMF07XG4gICAgKDxIVE1MSW1hZ2VFbGVtZW50Pmhlcm9Db250YWluZXIuY2hpbGRyZW5bMF0pLnNyYyA9XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5oZXJvT2JqWydpbWcnXTtcbiAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0l0ZW1zLFxuICAgICAgaGVyb0NvbnRhaW5lci5jaGlsZHJlblsxXSxcbiAgICAgICdoZXJvJ1xuICAgICk7XG4gICAgdGhpcy5yZW5kZXJHb2xkKFxuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0dvbGQsXG4gICAgICBoZXJvQ29udGFpbmVyLmNoaWxkcmVuWzNdXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyT3Bwb25lbnQoKSB7XG4gICAgY29uc3Qgb3Bwb25lbnRDb250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMl07XG4gICAgKDxIVE1MSW1hZ2VFbGVtZW50Pm9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzBdKS5zcmMgPVxuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuY3VycmVudE9wcG9uZW50WydpbWcnXS50b1N0cmluZygpO1xuICAgIHRoaXMucmVuZGVySXRlbXMoXG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEl0ZW1zLFxuICAgICAgb3Bwb25lbnRDb250YWluZXIuY2hpbGRyZW5bMV0sXG4gICAgICAnb3Bwb25lbnQnXG4gICAgKTtcbiAgICB0aGlzLnJlbmRlckdvbGQoXG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEdvbGQsXG4gICAgICBvcHBvbmVudENvbnRhaW5lci5jaGlsZHJlblszXVxuICAgICk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5zZXREYXRhKCd0ZXh0L3BsYWluJywgKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQpLmlkKTtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIhLmVmZmVjdEFsbG93ZWQgPSAnY29weSc7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ0VuZEhhbmRsZXIoXzogRHJhZ0V2ZW50KSB7fVxuICBAYXV0b2JpbmRcbiAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge31cblxuICAvLyBkcm9waGFuZGxlciBvbmx5IGZvciBoZXJvXG4gIEBhdXRvYmluZFxuICBkcm9wSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBuZXdJdGVtID0gZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgaWYgKCErbmV3SXRlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvbGRJdGVtID0gKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQhKS5pZDtcbiAgICBjb25zdCB0YXJnZXQgPSAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCEpLmNsYXNzTmFtZTtcblxuICAgIGlmIChkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5lbm91Z2hHb2xkKG5ld0l0ZW0sIG9sZEl0ZW0sICdoZXJvR29sZCcpKSB7XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5pbml0Q2hhbmdlKG5ld0l0ZW0sIG9sZEl0ZW0sIHRhcmdldCk7XG4gICAgICBjb25zdCBoZXJvQ29udGFpbmVyID0gdGhpcy5nYW1lQ29udGFpbmVyWzBdO1xuICAgICAgdGhpcy5yZW5kZXJJdGVtcyhcbiAgICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0l0ZW1zLFxuICAgICAgICBoZXJvQ29udGFpbmVyLmNoaWxkcmVuWzFdLFxuICAgICAgICAnaGVybydcbiAgICAgICk7XG4gICAgICB0aGlzLnJlbmRlckdvbGQoXG4gICAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLmhlcm9Hb2xkLFxuICAgICAgICBoZXJvQ29udGFpbmVyLmNoaWxkcmVuWzNdXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIGRyb3BoYW5kbGVyIG9wcG9uZW50XG4gIEBhdXRvYmluZFxuICBkcm9wT3Bwb25lbnQoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgbmV3SXRlbSA9IGV2ZW50LmRhdGFUcmFuc2ZlciEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgIGNvbnN0IG9sZEl0ZW0gPSAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCEpLmlkO1xuICAgIGNvbnN0IHRhcmdldCA9ICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0ISkuY2xhc3NOYW1lO1xuICAgIGlmIChkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5lbm91Z2hHb2xkKG5ld0l0ZW0sIG9sZEl0ZW0sICdvcHBvbmVudEdvbGQnKSkge1xuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaW5pdENoYW5nZShuZXdJdGVtLCBvbGRJdGVtLCB0YXJnZXQpO1xuICAgICAgY29uc3Qgb3Bwb25lbnRDb250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMl07XG4gICAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEl0ZW1zLFxuICAgICAgICBvcHBvbmVudENvbnRhaW5lci5jaGlsZHJlblsxXSxcbiAgICAgICAgJ29wcG9uZW50J1xuICAgICAgKTtcbiAgICAgIHRoaXMucmVuZGVyR29sZChcbiAgICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUub3Bwb25lbnRHb2xkLFxuICAgICAgICBvcHBvbmVudENvbnRhaW5lci5jaGlsZHJlblszXVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgcHJpdmF0ZSByZXNldEl0ZW1zKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgaWQgPSAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCkuaWQ7XG4gICAgaWYgKGlkID09PSAncmVzZXQtaGVybycpIHtcbiAgICAgIGNvbnN0IGhlcm9Db250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMF07XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5yZXNldCgnaGVyb0dvbGQnLCAnaGVyb0l0ZW1zJyk7XG4gICAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5oZXJvSXRlbXMsXG4gICAgICAgIGhlcm9Db250YWluZXIuY2hpbGRyZW5bMV0sXG4gICAgICAgICdoZXJvJ1xuICAgICAgKTtcbiAgICAgIHRoaXMucmVuZGVyR29sZChcbiAgICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0dvbGQsXG4gICAgICAgIGhlcm9Db250YWluZXIuY2hpbGRyZW5bM11cbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpZCA9PT0gJ3Jlc2V0LW9wcG9uZW50Jykge1xuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUucmVzZXQoJ29wcG9uZW50R29sZCcsICdvcHBvbmVudEl0ZW1zJyk7XG4gICAgICBjb25zdCBvcHBvbmVudENvbnRhaW5lciA9IHRoaXMuZ2FtZUNvbnRhaW5lclsyXTtcbiAgICAgIHRoaXMucmVuZGVySXRlbXMoXG4gICAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLm9wcG9uZW50SXRlbXMsXG4gICAgICAgIG9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzFdLFxuICAgICAgICAnb3Bwb25lbnQnXG4gICAgICApO1xuICAgICAgdGhpcy5yZW5kZXJHb2xkKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEdvbGQsXG4gICAgICAgIG9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzNdXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZFxuICBwcml2YXRlIGNhbGxOZXh0T3Bwb25lbnQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5zZXRDdXJyZW50T3Bwb25lbnQoKTtcbiAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5nZXRPcHBvbmVudEl0ZW1zKCk7XG4gICAgY29uc3Qgb3Bwb25lbnRDb250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMl07XG4gICAgdGhpcy5yZW5kZXJPcHBvbmVudCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVFdmVudExpc3RlbmVycygpIHtcbiAgICBjb25zdCByZXNldEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVzZXQtYnRucycpO1xuICAgIHJlc2V0QnRucy5mb3JFYWNoKChidG4pID0+XG4gICAgICAoPEhUTUxFbGVtZW50PmJ0bikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnJlc2V0SXRlbXMpXG4gICAgKTtcblxuICAgIGNvbnN0IG5leHRPcHBvbmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXh0Jyk7XG4gICAgKDxIVE1MRWxlbWVudD5uZXh0T3Bwb25lbnQpLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2xpY2snLFxuICAgICAgdGhpcy5jYWxsTmV4dE9wcG9uZW50XG4gICAgKTtcblxuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnN0YXJ0SXRlbXNDb250YWluZXIpLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ3N0YXJ0JyxcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0SGFuZGxlclxuICAgICk7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuc3RhcnRJdGVtc0NvbnRhaW5lcikuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcmFnZW5kJyxcbiAgICAgIHRoaXMuZHJhZ0VuZEhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmdhbWVDb250YWluZXJbMF0uY2hpbGRyZW5bMV0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ292ZXInLFxuICAgICAgdGhpcy5kcmFnT3ZlckhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmdhbWVDb250YWluZXJbMF0uY2hpbGRyZW5bMV0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ2xlYXZlJyxcbiAgICAgIHRoaXMuZHJhZ0xlYXZlSGFuZGxlclxuICAgICk7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZ2FtZUNvbnRhaW5lclswXS5jaGlsZHJlblsxXSkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcm9wJyxcbiAgICAgIHRoaXMuZHJvcEhhbmRsZXJcbiAgICApO1xuXG4gICAgLy8gb3Bwb25lbnRcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5nYW1lQ29udGFpbmVyWzJdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdvdmVyJyxcbiAgICAgIHRoaXMuZHJhZ092ZXJIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5nYW1lQ29udGFpbmVyWzJdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdsZWF2ZScsXG4gICAgICB0aGlzLmRyYWdMZWF2ZUhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmdhbWVDb250YWluZXJbMl0uY2hpbGRyZW5bMV0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJvcCcsXG4gICAgICB0aGlzLmRyb3BPcHBvbmVudFxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbiAgICB0aGlzLmluc3RhbmNlID0gbmV3IEdhbWVWaWV3KCk7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IEhlcm9WYWx1ZXMgfSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuZXhwb3J0IGNsYXNzIEhlcm9lcyB7XG4gIGxpc3Q6IEhlcm9WYWx1ZXM7XG5cbiAgY29uc3RydWN0b3IoYXBpUmVzcG9uc2U6IEhlcm9WYWx1ZXMpIHtcbiAgICB0aGlzLmxpc3QgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcGlSZXNwb25zZSkge1xuICAgICAgdGhpcy5saXN0W2FwaVJlc3BvbnNlW2tleV1bJ2lkJ11dID0ge1xuICAgICAgICBpbWc6ICdodHRwczovL2FwaS5vcGVuZG90YS5jb20nICsgYXBpUmVzcG9uc2Vba2V5XVsnaW1nJ10sXG4gICAgICAgIGFnaV9nYWluOiBhcGlSZXNwb25zZVtrZXldWydhZ2lfZ2FpbiddLFxuICAgICAgICBhdHRhY2tfcmFuZ2U6IGFwaVJlc3BvbnNlW2tleV1bJ2F0dGFja19yYW5nZSddLFxuICAgICAgICBhdHRhY2tfcmF0ZTogYXBpUmVzcG9uc2Vba2V5XVsnYXR0YWNrX3JhdGUnXSxcbiAgICAgICAgYXR0YWNrX3R5cGU6IGFwaVJlc3BvbnNlW2tleV1bJ2F0dGFja190eXBlJ10sXG4gICAgICAgIGJhc2VfYWdpOiBhcGlSZXNwb25zZVtrZXldWydiYXNlX2FnaSddLFxuICAgICAgICBiYXNlX2FybW9yOiBhcGlSZXNwb25zZVtrZXldWydiYXNlX2FybW9yJ10sXG4gICAgICAgIGJhc2VfYXR0YWNrX21heDogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9hdHRhY2tfbWF4J10sXG4gICAgICAgIGJhc2VfYXR0YWNrX21pbjogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9hdHRhY2tfbWluJ10sXG4gICAgICAgIGJhc2VfaGVhbHRoOiBhcGlSZXNwb25zZVtrZXldWydiYXNlX2hlYWx0aCddLFxuICAgICAgICBiYXNlX2hlYWx0aF9yZWdlbjogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9oZWFsdGhfcmVnZW4nXSxcbiAgICAgICAgYmFzZV9pbnQ6IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfaW50J10sXG4gICAgICAgIGJhc2VfbWFuYTogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9tYW5hJ10sXG4gICAgICAgIGJhc2VfbWFuYV9yZWdlbjogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9tYW5hX3JlZ2VuJ10sXG4gICAgICAgIGJhc2VfbXI6IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfbXInXSxcbiAgICAgICAgYmFzZV9zdHI6IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2Vfc3RyJ10sXG4gICAgICAgIGludF9nYWluOiBhcGlSZXNwb25zZVtrZXldWydpbnRfZ2FpbiddLFxuICAgICAgICBsb2NhbGl6ZWRfbmFtZTogYXBpUmVzcG9uc2Vba2V5XVsnbG9jYWxpemVkX25hbWUnXSxcbiAgICAgICAgbW92ZV9zcGVlZDogYXBpUmVzcG9uc2Vba2V5XVsnbW92ZV9zcGVlZCddLFxuICAgICAgICBwcmltYXJ5X2F0dHI6IGFwaVJlc3BvbnNlW2tleV1bJ3ByaW1hcnlfYXR0ciddLFxuICAgICAgICBwcm9qZWN0aWxlX3NwZWVkOiBhcGlSZXNwb25zZVtrZXldWydwcm9qZWN0aWxlX3NwZWVkJ10sXG4gICAgICAgIHN0cl9nYWluOiBhcGlSZXNwb25zZVtrZXldWydzdHJfZ2FpbiddLFxuICAgICAgICBpZDogYXBpUmVzcG9uc2Vba2V5XVsnaWQnXSxcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHBsYWluSGVyb09iaihpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFtpZF07XG4gIH1cbiAgZ2V0T3Bwb25lbnRzKGdhbWVNb2RlOiBzdHJpbmcsIGhlcm9JZDogc3RyaW5nKSB7XG4gICAgaWYgKGdhbWVNb2RlID09PSAncmFuZG9tJykge1xuICAgICAgY29uc3QgbGlzdENsb25lID0geyAuLi50aGlzLmxpc3QgfTtcbiAgICAgIGRlbGV0ZSBsaXN0Q2xvbmVbK2hlcm9JZF07XG4gICAgICByZXR1cm4gbGlzdENsb25lO1xuICAgIH1cbiAgICBpZiAoZ2FtZU1vZGUgPT09ICdjaG9pY2UnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBJdGVtVmFsdWVzLCBJdGVtVmFsdWVzQ2hpbGQgfSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuY29uc3QgaW1nID0gcmVxdWlyZSgnLi4vaW1ncy9ub2l0ZW1zLnBuZycpO1xuXG5leHBvcnQgY2xhc3MgSXRlbXMge1xuICBsaXN0OiBJdGVtVmFsdWVzO1xuICBjb25zdHJ1Y3RvcihhcGlSZXNwb25zZTogSXRlbVZhbHVlcykge1xuICAgIHRoaXMubGlzdCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXBpUmVzcG9uc2UpIHtcbiAgICAgIHRoaXMubGlzdFthcGlSZXNwb25zZVtrZXldWydpZCddXSA9IHtcbiAgICAgICAgaW1nOiAnaHR0cHM6Ly9hcGkub3BlbmRvdGEuY29tJyArIGFwaVJlc3BvbnNlW2tleV1bJ2ltZyddLFxuICAgICAgICBkbmFtZTogYXBpUmVzcG9uc2Vba2V5XVsnZG5hbWUnXSxcbiAgICAgICAgaWQ6IGFwaVJlc3BvbnNlW2tleV1bJ2lkJ10sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBwbGFpbkl0ZW1PYmooaXRlbXNBcnI6IG51bWJlcltdIHwgc3RyaW5nW10pIHtcbiAgICBsZXQgaXRlbVByb3BlcnRpZXM6IEl0ZW1WYWx1ZXNDaGlsZFtdID0gW107XG4gICAgaXRlbXNBcnIubWFwKCh4KSA9PiB7XG4gICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkIHx8IHggPT09IDk5OSkge1xuICAgICAgICBpdGVtUHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgICBkbmFtZTogJ25vIGl0ZW0nLFxuICAgICAgICAgIGlkOiA5OTksXG4gICAgICAgICAgaW1nOiBpbWcsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoeCkge1xuICAgICAgICBpdGVtUHJvcGVydGllcy5wdXNoKHRoaXMubGlzdFt4XSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtUHJvcGVydGllcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG5leHBvcnQgY2xhc3MgTG9hZGluZyBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgSFRNTERpdkVsZW1lbnRbXT4ge1xuICBzdGF0aWMgaW5zdGFuY2U6IExvYWRpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ3RtcGwtbG9hZGluZy1zY3JlZW4nLCAnYXBwJyk7XG4gICAgdGhpcy5hdHRhY2godHJ1ZSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbiAgICB0aGlzLmluc3RhbmNlID0gbmV3IExvYWRpbmcoKTtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTG9hZGluZyB9IGZyb20gJy4vTG9hZGluZyc7XG5pbXBvcnQgeyBTdGFydFZpZXcgfSBmcm9tICcuL1N0YXJ0Vmlldyc7XG5pbXBvcnQgeyBHYW1lVmlldyB9IGZyb20gJy4vR2FtZVZpZXcnO1xuXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgc3RhdGljIGxvYWRpbmcoKSB7XG4gICAgTG9hZGluZy5nZXRJbnN0YW5jZSgpO1xuICB9XG4gIHN0YXRpYyBzdGFydFZpZXcoKSB7XG4gICAgU3RhcnRWaWV3LmdldEluc3RhbmNlKCk7XG4gIH1cbiAgc3RhdGljIGdhbWVWaWV3KCkge1xuICAgIEdhbWVWaWV3LmdldEluc3RhbmNlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGRhdGFDb250YWluZXIgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBIZXJvVmFsdWVzIH0gZnJvbSAnLi4vTW9kZWxzL3Jlc3BvbnNlTW9kZWxzJztcblxuaW1wb3J0IHsgQ2xpY2thYmxlLCBEcmFnZ2FibGUsIERyYWdUYXJnZXQgfSBmcm9tICcuLi9Nb2RlbHMvZXZlbnRsaXN0ZW5lcnMnO1xuaW1wb3J0IHsgYXV0b2JpbmQgfSBmcm9tICcuLi9EZWNvcmF0b3JzL2F1dG9iaW5kJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJy4vUm91dGVyJztcblxuZXhwb3J0IGNsYXNzIFN0YXJ0Vmlld1xuICBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgSFRNTERpdkVsZW1lbnRbXT5cbiAgaW1wbGVtZW50cyBEcmFnZ2FibGUsIERyYWdUYXJnZXQsIENsaWNrYWJsZVxue1xuICBzdGF0aWMgaW5zdGFuY2U6IFN0YXJ0VmlldztcbiAgaW1hZ2VzTG9hZGVkOiBudW1iZXIgPSAwO1xuICBzZWxlY3RlZEhlcm9JZDogc3RyaW5nID0gJyc7XG4gIGhlcm9MaXN0OiBIZXJvVmFsdWVzID0gZGF0YUNvbnRhaW5lci5oZXJvZXMubGlzdDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigndG1wbC1oZXJvLW92ZXJ2aWV3JywgJ2FwcCcpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5oZXJvTGlzdCkge1xuICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICBpbWcuaWQgPSB0aGlzLmhlcm9MaXN0W2tleV0uaWQudG9TdHJpbmcoKTtcbiAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdoZXJvLXBvcnRyYWl0Jyk7XG4gICAgICBpbWcub25lcnJvciA9ICgpID0+IHRoaXMudXBkYXRlRE9NKCk7XG4gICAgICBpbWcub25sb2FkID0gKCkgPT4gdGhpcy51cGRhdGVET00oKTtcbiAgICAgIGltZy5zcmMgPSB0aGlzLmhlcm9MaXN0W2tleV0uaW1nO1xuICAgICAgdGhpcy5lbGVtZW50WzBdLmFwcGVuZENoaWxkKGltZyk7XG4gICAgfVxuICAgIHRoaXMuY29uZmlndXJlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRE9NKCkge1xuICAgIHRoaXMuaW1hZ2VzTG9hZGVkICs9IDE7XG4gICAgaWYgKHRoaXMuaW1hZ2VzTG9hZGVkID09PSAxMjEpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2goKTtcbiAgICAgIHRoaXMuYXR0YWNoKGZhbHNlKTtcbiAgICAgIHRoaXMuaW1hZ2VzTG9hZGVkID0gMDtcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5zZXREYXRhKCd0ZXh0L3BsYWluJywgKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQpLmlkKTtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIhLmVmZmVjdEFsbG93ZWQgPSAnY29weSc7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ0VuZEhhbmRsZXIoXzogRHJhZ0V2ZW50KSB7fVxuICBAYXV0b2JpbmRcbiAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS5jbGFzc0xpc3QuYWRkKCdkcm9wcGFibGUnKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBkcmFnTGVhdmVIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCkuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBhYmxlJyk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJvcEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgaGVyb0lkID0gZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgdHJhbnNmZXJEYXRhID1cbiAgICAgIHRoaXMuaGVyb0xpc3RbZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKCd0ZXh0L3BsYWluJyldO1xuICAgIGNvbnN0IGZpcnN0Q2hpbGQgPSB0aGlzLmVsZW1lbnRbMV0uZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICBpbWcuaWQgPSB0cmFuc2ZlckRhdGFbJ2lkJ107XG4gICAgaW1nLnNyYyA9IHRyYW5zZmVyRGF0YVsnaW1nJ107XG5cbiAgICBpZiAoZmlyc3RDaGlsZD8uZmlyc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgIGZpcnN0Q2hpbGQ/LmZpcnN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgIH1cbiAgICBmaXJzdENoaWxkIS5hcHBlbmRDaGlsZChpbWcpO1xuICAgIHRoaXMuc2VsZWN0ZWRIZXJvSWQgPSB0cmFuc2ZlckRhdGFbJ2lkJ107XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgY2xpY2tIYW5kbGVyKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRIZXJvSWQpIHRoaXMuY2FsbEdhbWVWaWV3KHRoaXMuc2VsZWN0ZWRIZXJvSWQpO1xuICB9XG5cbiAgYXN5bmMgY2FsbEdhbWVWaWV3KGhlcm9JZDogc3RyaW5nKSB7XG4gICAgbGV0IGluaXQ7XG4gICAgdHJ5IHtcbiAgICAgIGluaXQgPSBkYXRhQ29udGFpbmVyLmluaXRHYW1lU3RhdGUoaGVyb0lkLCAncmFuZG9tJyk7XG4gICAgICBhd2FpdCBSb3V0ZXIuZ2FtZVZpZXcoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVFdmVudExpc3RlbmVycygpIHtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzBdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdzdGFydCcsXG4gICAgICB0aGlzLmRyYWdTdGFydEhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmVsZW1lbnRbMF0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ2VuZCcsXG4gICAgICB0aGlzLmRyYWdFbmRIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzFdLmNoaWxkcmVuWzBdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdvdmVyJyxcbiAgICAgIHRoaXMuZHJhZ092ZXJIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzFdLmNoaWxkcmVuWzBdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdsZWF2ZScsXG4gICAgICB0aGlzLmRyYWdMZWF2ZUhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmVsZW1lbnRbMV0uY2hpbGRyZW5bMF0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJvcCcsXG4gICAgICB0aGlzLmRyb3BIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzFdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIHRoaXMuY2xpY2tIYW5kbGVyXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgU3RhcnRWaWV3KCk7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cbn1cbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5leHBvcnQgY2xhc3MgVXRpbCB7XG4gIHN0YXRpYyBhc3luYyBnZXREYXRhKGJhc2VVcmw6IHN0cmluZywgdXJsRXh0ZW5zaW9uOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zKGJhc2VVcmwgKyB1cmxFeHRlbnNpb24pO1xuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYXV0b2JpbmQoXzogYW55LCBfMjogc3RyaW5nLCBkZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IpIHtcbiAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xuICBjb25zdCBhZGpEZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldCgpIHtcbiAgICAgIGNvbnN0IGJvdW5kRm4gPSBvcmlnaW5hbE1ldGhvZC5iaW5kKHRoaXMpO1xuICAgICAgcmV0dXJuIGJvdW5kRm47XG4gICAgfSxcbiAgfTtcbiAgcmV0dXJuIGFkakRlc2NyaXB0b3I7XG59XG4iLCJleHBvcnQgZW51bSBIZXJvZXMge1xuICAnQW50aS1NYWdlJyA9IDEsXG4gICdBeGUnLFxuICAnQmFuZScsXG4gICdCbG9vZHNlZWtlcicsXG4gICdDcnlzdGFsIE1haWRlbicsXG4gICdEcm93IFJhbmdlcicsXG4gICdFYXJ0aHNoYWtlcicsXG4gICdKdWdnZXJuYXV0JyxcbiAgJ01pcmFuYScsXG4gICdNb3JwaGxpbmcnLCAvLyBpZDogMTBcbiAgJ1NoYWRvdyBGaWVuZCcsXG4gICdQaGFudG9tIExhbmNlcicsXG4gICdQdWNrJyxcbiAgJ1B1ZGdlJyxcbiAgJ1Jhem9yJyxcbiAgJ1NhbmQgS2luZycsXG4gICdTdG9ybSBTcGlyaXQnLFxuICAnU3ZlbicsXG4gICdUaW55JyxcbiAgJ1ZlbmdlZnVsIFNwaXJpdCcsIC8vIGlkOiAyMFxuICAnV2luZHJhbmdlcicsXG4gICdaZXVzJyxcbiAgJ0t1bmtrYScsXG4gICdMaW5hJyA9IDI1LFxuICAnTGlvbicsXG4gICdTaGFkb3cgU2hhbWFuJyxcbiAgJ1NsYXJkYXInLFxuICAnVGlkZWh1bnRlcicsXG4gICdXaXRjaCBEb2N0b3InLCAvLyBpZDogMzAgKFNraXAgYXQgS3Vua2EvTGluYSBieSAxKVxuICAnTGljaCcsXG4gICdSaWtpJyxcbiAgJ0VuaWdtYScsXG4gICdUaW5rZXInLFxuICAnU25pcGVyJyxcbiAgJ05lY3JvcGhvcycsXG4gICdXYXJsb2NrJyxcbiAgJ0JlYXN0bWFzdGVyJyxcbiAgJ1F1ZWVuIG9mIFBhaW4nLFxuICAnVmVub21hbmNlcicsIC8vIGlkOiA0MFxuICAnRmFjZWxlc3MgVm9pZCcsXG4gICdXcmFpdGggS2luZycsXG4gICdEZWF0aCBQcm9waGV0JyxcbiAgJ1BoYW50b20gQXNzYXNzaW4nLFxuICAnUHVnbmEnLFxuICAnVGVtcGxhciBBc3Nhc3NpbicsXG4gICdWaXBlcicsXG4gICdMdW5hJyxcbiAgJ0RyYWdvbiBLbmlnaHQnLFxuICAnRGF6emxlJywgLy8gaWQ6IDUwXG4gICdDbG9ja3dlcmsnLFxuICAnTGVzaHJhYycsXG4gIFwiTmF0dXJlJ3MgUHJvcGhldFwiLFxuICAnTGlmZXN0ZWFsZXInLFxuICAnRGFyayBTZWVyJyxcbiAgJ0NsaW5reicsXG4gICdPbW5pa25pZ2h0JyxcbiAgJ0VuY2hhbnRyZXNzJyxcbiAgJ0h1c2thcicsXG4gICdOaWdodCBTdGFsa2VyJywgLy8gaWQ6IDYwXG4gICdCcm9vZG1vdGhlcicsXG4gICdCb3VudHkgSHVudGVyJyxcbiAgJ1dlYXZlcicsXG4gICdKYWtpcm8nLFxuICAnQmF0cmlkZXInLFxuICAnQ2hlbicsXG4gICdTcGVjdHJlJyxcbiAgJ0FuY2llbnQgQXBwYXJpdGlvbicsXG4gICdEb29tJyxcbiAgJ1Vyc2EnLCAvLyBpZDogNzBcbiAgJ1NwaXJpdCBCcmVha2VyJyxcbiAgJ0d5cm9jb3B0ZXInLFxuICAnQWxjaGVtaXN0JyxcbiAgJ0ludm9rZXInLFxuICAnU2lsZW5jZXInLFxuICAnT3V0d29ybGQgRGV2b3VyZXInLFxuICAnTHljYW4nLFxuICAnQnJld21hc3RlcicsXG4gICdTaGFkb3cgRGVtb24nLFxuICAnTG9uZSBEcnVpZCcsIC8vIGlkOiA4MFxuICAnQ2hhb3MgS25pZ2h0JyxcbiAgJ01lZXBvJyxcbiAgJ1RyZWFudCBQcm90ZWN0b3InLFxuICAnT2dyZSBNYWdpJyxcbiAgJ1VuZHlpbmcnLFxuICAnUnViaWNrJyxcbiAgJ0Rpc3J1cHRvcicsXG4gICdOeXggQXNzYXNzaW4nLFxuICAnTmFnYSBTaXJlbicsXG4gICdLZWVwZXIgb2YgdGhlIExpZ2h0JywgLy8gaWQ6IDkwXG4gICdXaXNwJyxcbiAgJ1Zpc2FnZScsXG4gICdTbGFyaycsXG4gICdNZWR1c2EnLFxuICAnVHJvbGwgV2FybG9yZCcsXG4gICdDZW50YXVyIFdhcnJ1bm5lcicsXG4gICdNYWdudXMnLFxuICAnVGltYmVyc2F3JyxcbiAgJ0JyaXN0bGViYWNrJyxcbiAgJ1R1c2snLCAvLyBpZDogMTAwXG4gICdTa3l3cmF0aCBNYWdlJyxcbiAgJ0FiYWRkb24nLFxuICAnRWxkZXIgVGl0YW4nLFxuICAnTGVnaW9uIENvbW1hbmRlcicsXG4gICdUZWNoaWVzJyxcbiAgJ0VtYmVyIFNwaXJpdCcsXG4gICdFYXJ0aCBTcGlyaXQnLFxuICAnVW5kZXJsb3JkJyxcbiAgJ1RlcnJvcmJsYWRlJyxcbiAgJ1Bob2VuaXgnLCAvL2lkOiAxMTBcbiAgJ09yYWNsZScsXG4gICdXaW50ZXIgV3l2ZXJuJyxcbiAgJ0FyYyBXYXJkZW4nLFxuICAnTW9ua2V5IEtpbmcnLFxuICAnRGFyayBXaWxsb3cnID0gMTE5LFxuICAnUGFuZ29saWVyJywgLy8gaWQ6IDEyMCAoc2tpcCBhdCBNb25rZXkgS2luZy9EYXJrIFdpbGxvdyBieSA2KVxuICAnR3JpbXN0cm9rZScsXG4gICdIb29kd2luaycgPSAxMjMsXG4gICdWb2lkIFNwaXJpdCcgPSAxMjYsXG4gICdTbmFwZmlyZScgPSAxMjgsXG4gICdNYXJzJyxcbiAgJ0Rhd25icmVha2VyJyA9IDEzNSwgLy8gbXVsdGlwbGUgc2tpcHMgYmV0d2VlbiAxMjAgYW5kIDEzNVxufVxuXG5leHBvcnQgZW51bSBJdGVtc0VudW0ge1xuICAnQmxhZGVzIG9mIEF0dGFjaycgPSAyLFxuICAnQ2hhaW5tYWlsJyA9IDQsXG4gICdRdWVsbGluZyBCbGFkZScgPSAxMSxcbiAgJ1Jpbmcgb2YgUHJvdGVjdGlvbicgPSAxMixcbiAgJ0dhdW50bGV0cyBvZiBTdHJlbmd0aCcgPSAxMyxcbiAgJ1NsaXBwZXJzIG9mIEFnaWxpdHknID0gMTQsXG4gICdNYW50bGUgb2YgSW50ZWxsaWdlbmNlJyA9IDE1LFxuICAnSXJvbiBCcmFuY2gnID0gMTYsXG4gICdCZWx0IG9mIFN0cmVuZ3RoJyA9IDE3LFxuICAnQmFuZCBvZiBFbHZlbnNraW4nID0gMTgsXG4gICdSb2JlIG9mIHRoZSBNYWdpJyA9IDE5LFxuICAnQ2lyY2xldCcgPSAyMCxcbiAgJ0dsb3ZlcyBvZiBIYXN0ZScgPSAyNSxcbiAgJ1Jpbmcgb2YgUmVnZW4nID0gMjcsXG4gIFwiU2FnZSdzIE1hc2tcIiA9IDI4LFxuICAnQm9vdHMgb2YgU3BlZWQnID0gMjksXG4gICdDbG9haycgPSAzMSxcbiAgJ01hZ2ljIFN0aWNrJyA9IDM0LFxuICAnTWFnaWMgV2FuZCcgPSAzNixcbiAgJ0NsYXJpdHknID0gMzgsXG4gICdIZWFsaW5nIFNhbHZlJyA9IDM5LFxuICAnRHVzdCBvZiBBcHBlYXJhbmNlJyA9IDQwLFxuICAnT2JzZXJ2ZXIgV2FyZCcgPSA0MixcbiAgJ1NlbnRyeSBXYXJkJyA9IDQzLFxuICAnVGFuZ28nID0gNDQsXG4gICdCcmFjZXInID0gNzMsXG4gICdXcmFpdGggQmFuZCcgPSA3NSxcbiAgJ051bGwgVGFsaXNtYW4nID0gNzcsXG4gICdCdWNrbGVyJyA9IDg2LFxuICAnUmluZyBvZiBCYXNpbGl1cycgPSA4OCxcbiAgJ0hlYWRkcmVzcycgPSA5NCxcbiAgJ09yYiBvZiBWZW5vbScgPSAxODEsXG4gICdTbW9rZSBvZiBEZWNlaXQnID0gMTg4LFxuICAnRW5jaGFudGVkIE1hbmdvJyA9IDIxNixcbiAgJ0ZhZXJpZSBGaXJlJyA9IDIzNyxcbiAgJ0JsaWdodCBTdG9uZScgPSAyNDAsXG4gICdXaW5kIExhY2UnID0gMjQ0LFxuICAnQ3Jvd24nID0gMjYxLFxuICAnUmFpbmRyb3BzJyA9IDI2NSxcbiAgJ0ZsdWZmeSBIYXQnID0gNTkzLFxuICAnbm8gaXRlbScgPSA5OTksXG59XG4iLCJpbXBvcnQgeyBIZXJvZXMsIEl0ZW1zRW51bSB9IGZyb20gJy4vX2VudW1zJztcbmltcG9ydCB7IGhlcm9JdGVtU2xvdHMsIEl0ZW1MaXN0U3RhdGljIH0gZnJvbSAnLi9faW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjb25zdCBpdGVtU3RhdHM6IEl0ZW1MaXN0U3RhdGljID0ge1xuICBbSXRlbXNFbnVtWydDbGFyaXR5J11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNTAsXG4gICAgbWFuYVJlZ2VuVGVtcDogNixcbiAgICBtYW5hUmVnZW5EdXJhdGlvbjogMjUsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0R1c3Qgb2YgQXBwZWFyYW5jZSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiA4MCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNzAsXG4gICAgaHBSZWdlblBlcm1hbmVudDogMC42LFxuICAgIG1hbmFSZWdlblRlbXA6IDEwMCxcbiAgICBtYW5hUmVnZW5EdXJhdGlvbjogMSxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnRmFlcmllIEZpcmUnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA3MCxcbiAgICBocFJlZ2VuVGVtcDogODUsXG4gICAgaHBSZWdlbkR1cmF0aW9uOiAxLFxuICAgIGRtZ1JhdzogMixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiAxMTAsXG4gICAgaHBSZWdlblRlbXA6IDQwLFxuICAgIGhwUmVnZW5EdXJhdGlvbjogMTAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1NlbnRyeSBXYXJkJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDUwLFxuICB9LFxuICBbSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1Ntb2tlIG9mIERlY2VpdCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiA1MCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnVGFuZ28nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA5MCxcbiAgICBocFJlZ2VuVGVtcDogNyxcbiAgICBocFJlZ2VuRHVyYXRpb246IDE2LFxuICB9LFxuICBbSXRlbXNFbnVtWydCYW5kIG9mIEVsdmVuc2tpbiddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQ1MCxcbiAgICBhZ2lCb251czogNixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQmVsdCBvZiBTdHJlbmd0aCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQ1MCxcbiAgICBzdHJCb251czogNixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQ2lyY2xldCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDE1NSxcbiAgICBzdHJCb251czogMixcbiAgICBhZ2lCb251czogMixcbiAgICBpbnRCb251czogMixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQ3Jvd24nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0NTAsXG4gICAgc3RyQm9udXM6IDQsXG4gICAgYWdpQm9udXM6IDQsXG4gICAgaW50Qm9udXM6IDQsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0dhdW50bGV0cyBvZiBTdHJlbmd0aCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDE0MCxcbiAgICBzdHJCb251czogMyxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA1MCxcbiAgICBzdHJCb251czogMSxcbiAgICBhZ2lCb251czogMSxcbiAgICBpbnRCb251czogMSxcbiAgICBocFJlZ2VuVGVtcDogNyxcbiAgICBocFJlZ2VuRHVyYXRpb246IDMyLFxuICB9LFxuICBbSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogMTQwLFxuICAgIGludEJvbnVzOiAzLFxuICB9LFxuICBbSXRlbXNFbnVtWydSb2JlIG9mIHRoZSBNYWdpJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNDUwLFxuICAgIGludEJvbnVzOiA2LFxuICB9LFxuICBbSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogMTQwLFxuICAgIGFnaUJvbnVzOiAzLFxuICB9LFxuICBbSXRlbXNFbnVtWydCbGFkZXMgb2YgQXR0YWNrJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNDUwLFxuICAgIGRtZ1JhdzogOSxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQmxpZ2h0IFN0b25lJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogMzAwLFxuICAgIGFybW9yRGVidWZmOiAyLFxuICAgIGFybW9yRGVidWZmRHVyYXRpb246IDgsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0NoYWlubWFpbCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDU1MCxcbiAgICBhcm1vclJhdzogNCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnR2xvdmVzIG9mIEhhc3RlJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNDUwLFxuICAgIGF0dFNwZWVkUmF3OiAyMCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnUmFpbmRyb3BzJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDIyNSxcbiAgICBtYW5hUmVnZW5QZXJtYW5lbnQ6IDAuOCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnT3JiIG9mIFZlbm9tJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogMjc1LFxuICAgIGRtZ1RlbXBWYWx1ZTogMixcbiAgICBkbWdUZW1wRHVyYXRpb246IDIsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDEzMCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogMTc1LFxuICAgIGFybW9yUmF3OiAyLFxuICB9LFxuICBbSXRlbXNFbnVtWydCb290cyBvZiBTcGVlZCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiA1MDAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0Nsb2FrJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDUwMCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnRmx1ZmZ5IEhhdCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDI1MCxcbiAgICBocFJhdzogMTI1LFxuICB9LFxuICBbSXRlbXNFbnVtWydNYWdpYyBTdGljayddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiAyMDAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1Jpbmcgb2YgUmVnZW4nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAxNzUsXG4gICAgaHBSZWdlblBlcm1hbmVudDogMS4yNSxcbiAgfSxcbiAgW0l0ZW1zRW51bVtcIlNhZ2UncyBNYXNrXCJdXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiAxNzUsXG4gICAgbWFuYVJlZ2VuUGVybWFuZW50OiAwLjcsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1dpbmQgTGFjZSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiBmYWxzZSxcbiAgICBnb2xkOiAyNTAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0JyYWNlciddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDUwNSxcbiAgICBzdHJCb251czogNSxcbiAgICBhZ2lCb251czogMixcbiAgICBpbnRCb251czogMixcbiAgICBocFJlZ2VuUGVybWFuZW50OiAxLFxuICAgIGRtZ1JhdzogMyxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnTWFnaWMgV2FuZCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQ1MCxcbiAgICBzdHJCb251czogMyxcbiAgICBhZ2lCb251czogMyxcbiAgICBpbnRCb251czogMyxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnTnVsbCBUYWxpc21hbiddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDUwNSxcbiAgICBzdHJCb251czogMixcbiAgICBhZ2lCb251czogMixcbiAgICBpbnRCb251czogNSxcbiAgICBtYW5hUmVnZW5QZXJtYW5lbnQ6IDAuNixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnV3JhaXRoIEJhbmQnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA1MDUsXG4gICAgc3RyQm9udXM6IDIsXG4gICAgYWdpQm9udXM6IDUsXG4gICAgaW50Qm9udXM6IDIsXG4gICAgYXJtb3JSYXc6IDEuNSxcbiAgICBhdHRTcGVlZFJhdzogNSxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQnVja2xlciddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQyNSxcbiAgICBhcm1vclJhdzogMyxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnSGVhZGRyZXNzJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNDI1LFxuICAgIGhwUmVnZW5QZXJtYW5lbnQ6IDIuNSxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnUmluZyBvZiBCYXNpbGl1cyddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDQyNSxcbiAgICBtYW5hUmVnZW5QZXJtYW5lbnQ6IDEuNSxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnbm8gaXRlbSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDAsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgaGVyb1N0YXJ0SXRlbXM6IGhlcm9JdGVtU2xvdHMgPSB7XG4gIFtIZXJvZXNbJ0FudGktTWFnZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snQXhlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snQmFuZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0Jsb29kc2Vla2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydDcnlzdGFsIE1haWRlbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0Ryb3cgUmFuZ2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydFYXJ0aHNoYWtlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTQ6IHVuZGVmaW5lZCxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0p1Z2dlcm5hdXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydNaXJhbmEnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bXCJTYWdlJ3MgTWFza1wiXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ01vcnBobGluZyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snU2hhZG93IEZpZW5kJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1BoYW50b20gTGFuY2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydQdWNrJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydQdWRnZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1Jhem9yJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydTYW5kIEtpbmcnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snU3Rvcm0gU3Bpcml0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydTdmVuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1RpbnknXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydWZW5nZWZ1bCBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snV2luZHJhbmdlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snWmV1cyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snS3Vua2thJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydMaW5hJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydMaW9uJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydXaW5kIExhY2UnXSxcbiAgfSxcbiAgW0hlcm9lc1snU2hhZG93IFNoYW1hbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NsYXJkYXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVGlkZWh1bnRlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dpdGNoIERvY3RvciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snTGljaCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1Jpa2knXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09yYiBvZiBWZW5vbSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0VuaWdtYSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnTnVsbCBUYWxpc21hbiddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNDogdW5kZWZpbmVkLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snVGlua2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snU25pcGVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTmVjcm9waG9zJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydXYXJsb2NrJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVtcIlNhZ2UncyBNYXNrXCJdLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snQmVhc3RtYXN0ZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICB9LFxuICBbSGVyb2VzWydRdWVlbiBvZiBQYWluJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1Zlbm9tYW5jZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0ZhY2VsZXNzIFZvaWQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dyYWl0aCBLaW5nJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snRGVhdGggUHJvcGhldCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgfSxcbiAgW0hlcm9lc1snUGhhbnRvbSBBc3Nhc3NpbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snUHVnbmEnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ1RlbXBsYXIgQXNzYXNzaW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVmlwZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydMdW5hJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snRHJhZ29uIEtuaWdodCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgfSxcbiAgW0hlcm9lc1snRGF6emxlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtW1wiU2FnZSdzIE1hc2tcIl0sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydDbG9ja3dlcmsnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydXaW5kIExhY2UnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snTGVzaHJhYyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1tcIk5hdHVyZSdzIFByb3BoZXRcIl1dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydCbGlnaHQgU3RvbmUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0xpZmVzdGVhbGVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0RhcmsgU2VlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0NsaW5reiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snT21uaWtuaWdodCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0dhdW50bGV0cyBvZiBTdHJlbmd0aCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snRW5jaGFudHJlc3MnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydCbGlnaHQgU3RvbmUnXSxcbiAgfSxcbiAgW0hlcm9lc1snSHVza2FyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTmlnaHQgU3RhbGtlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snQnJvb2Rtb3RoZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0JvdW50eSBIdW50ZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0Jvb3RzIG9mIFNwZWVkJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW00OiB1bmRlZmluZWQsXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydXZWF2ZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snSmFraXJvJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snQmF0cmlkZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydDaGVuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bXCJTYWdlJ3MgTWFza1wiXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NwZWN0cmUnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydBbmNpZW50IEFwcGFyaXRpb24nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDbGFyaXR5J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydEb29tJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVXJzYSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NwaXJpdCBCcmVha2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydCb290cyBvZiBTcGVlZCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNDogdW5kZWZpbmVkLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snR3lyb2NvcHRlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bXCJTYWdlJ3MgTWFza1wiXSxcbiAgfSxcbiAgW0hlcm9lc1snQWxjaGVtaXN0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snSW52b2tlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydTaWxlbmNlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICB9LFxuICBbSGVyb2VzWydPdXR3b3JsZCBEZXZvdXJlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDcm93biddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0x5Y2FuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0JyZXdtYXN0ZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydTaGFkb3cgRGVtb24nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDbGFyaXR5J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydMb25lIERydWlkJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydPcmIgb2YgVmVub20nXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydDaGFvcyBLbmlnaHQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snTWVlcG8nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVHJlYW50IFByb3RlY3RvciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ09yYiBvZiBWZW5vbSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ09ncmUgTWFnaSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVW5keWluZyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1J1YmljayddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTQ6IHVuZGVmaW5lZCxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0Rpc3J1cHRvciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydOeXggQXNzYXNzaW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0Jvb3RzIG9mIFNwZWVkJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW00OiB1bmRlZmluZWQsXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydOYWdhIFNpcmVuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydLZWVwZXIgb2YgdGhlIExpZ2h0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dpc3AnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSGVhZGRyZXNzJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snVmlzYWdlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snU2xhcmsnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ01lZHVzYSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ1Ryb2xsIFdhcmxvcmQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0NlbnRhdXIgV2FycnVubmVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTWFnbnVzJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVGltYmVyc2F3J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snQnJpc3RsZWJhY2snXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snVHVzayddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXSxcbiAgICBpdGVtMzogdW5kZWZpbmVkLFxuICAgIGl0ZW00OiB1bmRlZmluZWQsXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydTa3l3cmF0aCBNYWdlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICAvLyBsYXN0IHJvdW5kXG4gIFtIZXJvZXNbJ0FiYWRkb24nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVtcIlNhZ2UncyBNYXNrXCJdLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snRWxkZXIgVGl0YW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1dpbmQgTGFjZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTGVnaW9uIENvbW1hbmRlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1RlY2hpZXMnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnV2luZCBMYWNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydFbWJlciBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydFYXJ0aCBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ1VuZGVybG9yZCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1RlcnJvcmJsYWRlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snUGhvZW5peCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDcm93biddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ09yYWNsZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dpbnRlciBXeXZlcm4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snQXJjIFdhcmRlbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snTW9ua2V5IEtpbmcnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09yYiBvZiBWZW5vbSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0RhcmsgV2lsbG93J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1BhbmdvbGllciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snR3JpbXN0cm9rZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0hvb2R3aW5rJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0JsaWdodCBTdG9uZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVm9pZCBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snU25hcGZpcmUnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDbGFyaXR5J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydCbGlnaHQgU3RvbmUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ01hcnMnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snRGF3bmJyZWFrZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnLi9Db21wb25lbnRzL1JvdXRlcic7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi9Db21wb25lbnRzL1V0aWwnO1xuaW1wb3J0IHsgSGVyb2VzIH0gZnJvbSAnLi9Db21wb25lbnRzL0hlcm9lcyc7XG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vQ29tcG9uZW50cy9JdGVtcyc7XG5pbXBvcnQgeyBEYXRhQ29udGFpbmVyIH0gZnJvbSAnLi9Db21wb25lbnRzL0RhdGFDb250YWluZXInO1xuXG5Sb3V0ZXIubG9hZGluZygpO1xuZXhwb3J0IGNvbnN0IGRhdGFDb250YWluZXIgPSBuZXcgRGF0YUNvbnRhaW5lcigpO1xuXG5VdGlsLmdldERhdGEoJ2h0dHBzOi8vYXBpLm9wZW5kb3RhLmNvbS9hcGknLCAnL2NvbnN0YW50cy9oZXJvZXMnKVxuICAudGhlbigocmVzKSA9PiB7XG4gICAgZGF0YUNvbnRhaW5lci5pbml0SGVyb0xpc3QocmVzKTtcbiAgICBSb3V0ZXIuc3RhcnRWaWV3KCk7XG4gIH0pXG4gIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG5cblV0aWwuZ2V0RGF0YSgnaHR0cHM6Ly9hcGkub3BlbmRvdGEuY29tL2FwaScsICcvY29uc3RhbnRzL2l0ZW1zJylcbiAgLnRoZW4oKHJlcykgPT4ge1xuICAgIGRhdGFDb250YWluZXIuaW5pdEl0ZW1MaXN0KHJlcyk7XG4gIH0pXG4gIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9