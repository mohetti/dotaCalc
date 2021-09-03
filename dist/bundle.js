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
    const valuesForCalculation = {
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
        time: 0,
    };
    return valuesForCalculation;
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
    calcCycle(ownStats, enemyStats) {
        if (enemyStats.health <= 0) {
            return enemyStats;
        }
        let enemyDmgBlock;
        let _enemyArmor = enemyStats.armor - ownStats.armorDebuff;
        let _dmgBlock = (0.052 * _enemyArmor) / (0.9 + 0.048 * _enemyArmor);
        _enemyArmor < 0
            ? (enemyDmgBlock = 1 + _dmgBlock)
            : (enemyDmgBlock = 1 - _dmgBlock);
        let dmgPerHit;
        enemyStats.isMelee
            ? (dmgPerHit = ownStats.damage * enemyDmgBlock - 8)
            : (dmgPerHit = ownStats.damage * enemyDmgBlock);
        // first damage cycle
        let attacksNeeded = enemyStats.health / dmgPerHit < 1
            ? 1
            : Math.floor(enemyStats.health / dmgPerHit);
        let hpLeft = enemyStats.health - dmgPerHit * attacksNeeded;
        let timeItTakes = ownStats.atkPerSec * attacksNeeded;
        console.log(timeItTakes);
        hpLeft = hpLeft - Math.floor(timeItTakes) * ownStats.damageTemp;
        // health regen
        let hpNew;
        if (enemyStats.tempHealthRegenDuration === 0) {
            let healthRegened = timeItTakes * enemyStats.healthRegen;
            hpNew = hpLeft + healthRegened;
        }
        if (timeItTakes <= enemyStats.tempHealthRegenDuration) {
            let healthRegened = timeItTakes * enemyStats.healthRegen;
            hpNew = hpLeft + healthRegened;
            enemyStats.tempHealthRegenDuration += -Math.floor(timeItTakes);
        }
        if (timeItTakes > enemyStats.tempHealthRegenDuration &&
            enemyStats.tempHealthRegenDuration !== 0) {
            let healthRegened;
            let restRegen = enemyStats.tempHealthRegenDuration * 7.1875;
            enemyStats.tempHealthRegenDuration = 0;
            enemyStats.healthRegen += -7.1875;
            healthRegened = restRegen + enemyStats.healthRegen * timeItTakes;
            hpNew = hpLeft + healthRegened;
        }
        if (hpNew < enemyStats.health * 0.15) {
            if (enemyStats.heal > 0) {
                hpNew += 85;
                enemyStats.heal += -85;
                enemyStats.damage += -2;
            }
        }
        enemyStats.health = hpNew;
        enemyStats.time += timeItTakes;
        return enemyStats;
    }
    timeTillWin(ownStats, enemyStats) {
        let enemy = this.calcCycle(ownStats, enemyStats);
        let own = this.calcCycle(enemyStats, ownStats);
        if (own.health > 0 && enemy.health > 0) {
            return this.timeTillWin(own, enemy);
        }
        if (own.health < 0 && enemy.health > 0 && own.time < enemy.time) {
            console.log(own.health + ' hero health');
            console.log(own.time + ' hero time');
            console.log(enemy.health + ' enemy health');
            console.log(enemy.time + ' enemy time');
            return alert('You lost!');
        }
        if (own.health > 0 && enemy.health < 0 && own.time > enemy.time) {
            console.log(own.health + ' hero health');
            console.log(own.time + ' hero time');
            console.log(enemy.health + ' enemy health');
            console.log(enemy.time + ' enemy time');
            return alert('You won!');
        }
        if (own.health < 0 && enemy.health > 0 && own.time > enemy.time) {
            return this.timeTillWin(own, enemy);
        }
        if (own.health > 0 && enemy.health < 0 && own.time < enemy.time) {
            return this.timeTillWin(own, enemy);
        }
        if (own.health < 0 && enemyStats.health < 0) {
            console.log(own.health + ' hero health');
            console.log(own.time + ' hero time');
            console.log(enemy.health + ' enemy health');
            console.log(enemy.time + ' enemy time');
            return own.time < enemy.time ? alert('You won!') : alert('You lost!');
        }
        // if ownStats hp < 0 && enemyStats hp > 0 && timeItTakes > timeItTakes return enemy Winner
        // if ownStats hp > 0 && enemyStats hp < 0 && timeItTakes < timeItTakes return own Winner
        // if ownStats hp < 0 && enemStats hp > 0 && timeItTakes < timeItTakes calc timeTillEnemyDies keep timeTillOwnDies
        // if ownStats hp > 0 && enemyStats hp < 0 && timeItTakes > timeItTakes calc timeTillOwnDies keep timeTillEnemyDies
        // if ownStats hp < 0 && enemyStats hp < 0
        // heal > 0 - 2 dmg when used
        // dmgTemp => for each sec deal 2 dmg ontop
    }
    performCalculation() {
        const heroStats = (0,_Calculation__WEBPACK_IMPORTED_MODULE_2__.HeroStatsForCalculation)(this.heroObj, this.heroItems);
        const opponentStats = (0,_Calculation__WEBPACK_IMPORTED_MODULE_2__.HeroStatsForCalculation)(this.currentOpponent, this.opponentItems);
        this.timeTillWin(heroStats, opponentStats);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFTCwwREFBWSxDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDO0tBQzdELElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ1osYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7S0FDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7VUN4Qkw7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFZkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL2NsaWVudC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9pbWdzL25vaXRlbXMucG5nIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL0NhbGN1bGF0aW9uLnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL0NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9EYXRhQ29udGFpbmVyLnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL0dhbWVTdGF0ZS50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9HYW1lVmlldy50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9IZXJvZXMudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvSXRlbXMudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvTG9hZGluZy50cyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvQ29tcG9uZW50cy9Sb3V0ZXIudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0NvbXBvbmVudHMvU3RhcnRWaWV3LnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9Db21wb25lbnRzL1V0aWwudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL0RlY29yYXRvcnMvYXV0b2JpbmQudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL01vZGVscy9oZXJvU3RhcnRJdGVtcy9fZW51bXMudHMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL01vZGVscy9oZXJvU3RhcnRJdGVtcy9zdGFydEl0ZW1zLnRzIiwid2VicGFjazovL2NsaWVudC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCByZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSAndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcih0aW1lb3V0RXJyb3JNZXNzYWdlLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuYXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhheGlvcy5kZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcbn07XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0F4aW9zRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNcbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZVxuICAgIH07XG4gIH07XG4gIHJldHVybiBlcnJvcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG5cbiAgdmFyIHZhbHVlRnJvbUNvbmZpZzJLZXlzID0gWyd1cmwnLCAnbWV0aG9kJywgJ2RhdGEnXTtcbiAgdmFyIG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzID0gWydoZWFkZXJzJywgJ2F1dGgnLCAncHJveHknLCAncGFyYW1zJ107XG4gIHZhciBkZWZhdWx0VG9Db25maWcyS2V5cyA9IFtcbiAgICAnYmFzZVVSTCcsICd0cmFuc2Zvcm1SZXF1ZXN0JywgJ3RyYW5zZm9ybVJlc3BvbnNlJywgJ3BhcmFtc1NlcmlhbGl6ZXInLFxuICAgICd0aW1lb3V0JywgJ3RpbWVvdXRNZXNzYWdlJywgJ3dpdGhDcmVkZW50aWFscycsICdhZGFwdGVyJywgJ3Jlc3BvbnNlVHlwZScsICd4c3JmQ29va2llTmFtZScsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJywgJ29uVXBsb2FkUHJvZ3Jlc3MnLCAnb25Eb3dubG9hZFByb2dyZXNzJywgJ2RlY29tcHJlc3MnLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJywgJ21heEJvZHlMZW5ndGgnLCAnbWF4UmVkaXJlY3RzJywgJ3RyYW5zcG9ydCcsICdodHRwQWdlbnQnLFxuICAgICdodHRwc0FnZW50JywgJ2NhbmNlbFRva2VuJywgJ3NvY2tldFBhdGgnLCAncmVzcG9uc2VFbmNvZGluZydcbiAgXTtcbiAgdmFyIGRpcmVjdE1lcmdlS2V5cyA9IFsndmFsaWRhdGVTdGF0dXMnXTtcblxuICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UodGFyZ2V0LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoe30sIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIHV0aWxzLmZvckVhY2godmFsdWVGcm9tQ29uZmlnMktleXMsIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICB1dGlscy5mb3JFYWNoKGRlZmF1bHRUb0NvbmZpZzJLZXlzLCBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChkaXJlY3RNZXJnZUtleXMsIGZ1bmN0aW9uIG1lcmdlKHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBheGlvc0tleXMgPSB2YWx1ZUZyb21Db25maWcyS2V5c1xuICAgIC5jb25jYXQobWVyZ2VEZWVwUHJvcGVydGllc0tleXMpXG4gICAgLmNvbmNhdChkZWZhdWx0VG9Db25maWcyS2V5cylcbiAgICAuY29uY2F0KGRpcmVjdE1lcmdlS2V5cyk7XG5cbiAgdmFyIG90aGVyS2V5cyA9IE9iamVjdFxuICAgIC5rZXlzKGNvbmZpZzEpXG4gICAgLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSlcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIGZpbHRlckF4aW9zS2V5cyhrZXkpIHtcbiAgICAgIHJldHVybiBheGlvc0tleXMuaW5kZXhPZihrZXkpID09PSAtMTtcbiAgICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG90aGVyS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB2YXIgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuXG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgcmV0dXJuICh0eXBlb2YgcGF5bG9hZCA9PT0gJ29iamVjdCcpICYmIChwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwpICYmIHZhbC5jb25zdHJ1Y3RvciAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsLmNvbnN0cnVjdG9yKVxuICAgICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWwpIHtcbiAgaWYgKHRvU3RyaW5nLmNhbGwodmFsKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gIHJldHVybiBwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJlNWM3YTdkYTRjMTA1NTExMGE3ZGNjMzIxMjEwMGUxNS5wbmdcIjsiLCJpbXBvcnQgeyBIZXJvVmFsdWVzQ2hpbGQsIEl0ZW1WYWx1ZXNDaGlsZCB9IGZyb20gJy4uL01vZGVscy9yZXNwb25zZU1vZGVscyc7XG5pbXBvcnQgeyBpdGVtU3RhdHMgfSBmcm9tICcuLi9Nb2RlbHMvaGVyb1N0YXJ0SXRlbXMvc3RhcnRJdGVtcyc7XG5pbXBvcnQgeyBJdGVtTGlzdFN0YXRpY0NoaWxkcyB9IGZyb20gJy4uL01vZGVscy9oZXJvU3RhcnRJdGVtcy9faW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVzRm9yQ2FsY3VsYXRpb24ge1xuICBoZWFsdGg6IG51bWJlcjtcbiAgaGVhbHRoUmVnZW46IG51bWJlcjtcbiAgdGVtcEhlYWx0aFJlZ2VuRHVyYXRpb246IG51bWJlcjtcbiAgaGVhbDogbnVtYmVyO1xuICBhcm1vcjogbnVtYmVyO1xuICBkYW1hZ2U6IG51bWJlcjtcbiAgZGFtYWdlVGVtcDogbnVtYmVyO1xuICBhcm1vckRlYnVmZjogbnVtYmVyO1xuICBhdGtQZXJTZWM6IG51bWJlcjtcbiAgaXNNZWxlZTogYm9vbGVhbjtcbiAgdGltZTogbnVtYmVyO1xufVxuXG5jb25zdCBhdGtTcGVlZDkwID0gW1xuICAnQ2VudGF1ciBXYXJydW5uZXInLFxuICAnU2hhZG93IFNoYW1hbicsXG4gICdTcGVjdHJlJyxcbiAgJ1RlY2hpZXMnLFxuICAnVGlueScsXG5dO1xuXG5jb25zdCBhdGtTcGVlZDExMCA9IFsnSnVnZ2VybmF1dCcsICdTYW5kIEtpbmcnLCAnU3Rvcm0gU3Bpcml0JywgJ1Zpc2FnZSddO1xuY29uc3QgYXRrU3BlZWQxMTUgPSBbJ0RhcmsgV2lsbG93JywgJ0xpb24nLCAnTWlyYW5hJywgJ1NsYXJrJywgJ1Zlbm9tYW5jZXInXTtcbmNvbnN0IGF0a1NwZWVkMTIwID0gWydBYmFkZG9uJywgJ0xpZmVzdGVhbGVyJywgJ1ZpcGVyJywgJ1dlYXZlciddO1xuY29uc3QgYXRrU3BlZWQxMjUgPSBbJ0Jyb29kbW90aGVyJywgJ0d5cm9jb3B0ZXInXTtcblxuZnVuY3Rpb24gY2FsY3VsYXRlSXRlbVN0YXRzKHJlbGV2YW50SXRlbXM6IEl0ZW1MaXN0U3RhdGljQ2hpbGRzW10pIHtcbiAgbGV0IHN0ciA9IDA7XG4gIGxldCBhZ2kgPSAwO1xuICBsZXQgaW50ID0gMDtcbiAgbGV0IGJvbnVzSGVhbHRoID0gMDtcbiAgbGV0IGJvbnVzSGVhbHRoUmVnZW5QZXJtYW5lbnQgPSAwO1xuICBsZXQgYm9udXNIZWFsdGhSZWdlblRlbXAgPSAwO1xuICBsZXQgaGVhbHRoUmVnZW5UZW1wRHVyYXRpb24gPSAwO1xuICBsZXQgYm9udXNBcm1vciA9IDA7XG4gIGxldCBkbWdSYXcgPSAwO1xuICBsZXQgZG1nVGVtcFZhbHVlID0gMDtcbiAgbGV0IGF0a1NwZWVkUmF3ID0gMDtcbiAgbGV0IGFybW9yRGVidWZmID0gMDtcbiAgbGV0IGhlYWwgPSAwO1xuXG4gIHJlbGV2YW50SXRlbXMubWFwKCh4KSA9PiB7XG4gICAgaWYgKHguc3RyQm9udXMpIHtcbiAgICAgIHN0ciArPSB4LnN0ckJvbnVzO1xuICAgIH1cbiAgICBpZiAoeC5hZ2lCb251cykge1xuICAgICAgYWdpICs9IHguYWdpQm9udXM7XG4gICAgfVxuICAgIGlmICh4LmludEJvbnVzKSB7XG4gICAgICBpbnQgKz0geC5pbnRCb251cztcbiAgICB9XG4gICAgaWYgKHguaHBSYXcpIHtcbiAgICAgIGJvbnVzSGVhbHRoICs9IHguaHBSYXc7XG4gICAgfVxuICAgIGlmICh4LmhwUmVnZW5QZXJtYW5lbnQpIHtcbiAgICAgIGJvbnVzSGVhbHRoUmVnZW5QZXJtYW5lbnQgKz0geC5ocFJlZ2VuUGVybWFuZW50O1xuICAgIH1cbiAgICBpZiAoeC5ocFJlZ2VuVGVtcCkge1xuICAgICAgaWYgKGJvbnVzSGVhbHRoUmVnZW5UZW1wID09PSAwKSB7XG4gICAgICAgIGJvbnVzSGVhbHRoUmVnZW5UZW1wICs9IHguaHBSZWdlblRlbXA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh4LmhwUmVnZW5EdXJhdGlvbikge1xuICAgICAgaGVhbHRoUmVnZW5UZW1wRHVyYXRpb24gKz0geC5ocFJlZ2VuRHVyYXRpb24gKiAzO1xuICAgIH1cbiAgICBpZiAoeC5hcm1vclJhdykge1xuICAgICAgYm9udXNBcm1vciArPSB4LmFybW9yUmF3O1xuICAgIH1cbiAgICBpZiAoeC5kbWdSYXcpIHtcbiAgICAgIGRtZ1JhdyArPSB4LmRtZ1JhdztcbiAgICB9XG4gICAgaWYgKHguZG1nVGVtcFZhbHVlKSB7XG4gICAgICBpZiAoZG1nVGVtcFZhbHVlID09PSAwKSB7XG4gICAgICAgIGRtZ1RlbXBWYWx1ZSArPSB4LmRtZ1RlbXBWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHguYXR0U3BlZWRSYXcpIHtcbiAgICAgIGF0a1NwZWVkUmF3ICs9IHguYXR0U3BlZWRSYXc7XG4gICAgfVxuICAgIGlmICh4LmFybW9yRGVidWZmKSB7XG4gICAgICBpZiAoYXJtb3JEZWJ1ZmYgPT09IDApIHtcbiAgICAgICAgYXJtb3JEZWJ1ZmYgKz0geC5hcm1vckRlYnVmZjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHguaGVhbCkge1xuICAgICAgaGVhbCArPSB4LmhlYWw7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHN0cixcbiAgICBhZ2ksXG4gICAgaW50LFxuICAgIGJvbnVzSGVhbHRoLFxuICAgIGJvbnVzSGVhbHRoUmVnZW5QZXJtYW5lbnQsXG4gICAgYm9udXNIZWFsdGhSZWdlblRlbXAsXG4gICAgaGVhbHRoUmVnZW5UZW1wRHVyYXRpb24sXG4gICAgYm9udXNBcm1vcixcbiAgICBkbWdSYXcsXG4gICAgZG1nVGVtcFZhbHVlLFxuICAgIGF0a1NwZWVkUmF3LFxuICAgIGFybW9yRGVidWZmLFxuICAgIGhlYWwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldEF0a1NwZWVkKG1pbmlvbk5hbWU6IHN0cmluZykge1xuICBsZXQgYXRrU3BlZWQgPSAxMDA7XG4gIGlmIChhdGtTcGVlZDkwLmluZGV4T2YobWluaW9uTmFtZSkgIT09IC0xKSB7XG4gICAgcmV0dXJuIChhdGtTcGVlZCA9IDkwKTtcbiAgfVxuICBpZiAoYXRrU3BlZWQxMTAuaW5kZXhPZihtaW5pb25OYW1lKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gKGF0a1NwZWVkID0gMTEwKTtcbiAgfVxuICBpZiAoYXRrU3BlZWQxMTUuaW5kZXhPZihtaW5pb25OYW1lKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gKGF0a1NwZWVkID0gMTE1KTtcbiAgfVxuICBpZiAoYXRrU3BlZWQxMjAuaW5kZXhPZihtaW5pb25OYW1lKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gKGF0a1NwZWVkID0gMTIwKTtcbiAgfVxuICBpZiAoYXRrU3BlZWQxMjUuaW5kZXhPZihtaW5pb25OYW1lKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gKGF0a1NwZWVkID0gMTI1KTtcbiAgfVxuICByZXR1cm4gYXRrU3BlZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZXJvU3RhdHNGb3JDYWxjdWxhdGlvbihcbiAgbWluaW9uT2JqOiBIZXJvVmFsdWVzQ2hpbGQsXG4gIG1pbmlvbkl0ZW1zOiBJdGVtVmFsdWVzQ2hpbGRbXVxuKSB7XG4gIGxldCByZWxldmFudEl0ZW1zOiBJdGVtTGlzdFN0YXRpY0NoaWxkc1tdID0gW107XG4gIG1pbmlvbkl0ZW1zLm1hcCgoeCkgPT4ge1xuICAgIGlmIChpdGVtU3RhdHNbeFsnaWQnXV1bJ3JlbGV2YW50VmFsdWVzJ10pIHtcbiAgICAgIHJldHVybiByZWxldmFudEl0ZW1zLnB1c2goaXRlbVN0YXRzW3hbJ2lkJ11dKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBleHRyYUl0ZW1TdGF0cyA9IGNhbGN1bGF0ZUl0ZW1TdGF0cyhyZWxldmFudEl0ZW1zKTtcblxuICBsZXQgX3N0clRvdGFsID0gbWluaW9uT2JqLmJhc2Vfc3RyICsgZXh0cmFJdGVtU3RhdHMuc3RyO1xuICBsZXQgaGVhbHRoID1cbiAgICBtaW5pb25PYmouYmFzZV9oZWFsdGggKyBfc3RyVG90YWwgKiAyMCArIGV4dHJhSXRlbVN0YXRzLmJvbnVzSGVhbHRoO1xuICBsZXQgaGVhbHRoUmVnZW4gPVxuICAgIG1pbmlvbk9iai5iYXNlX2hlYWx0aF9yZWdlbiArXG4gICAgX3N0clRvdGFsICogMC4xICtcbiAgICBleHRyYUl0ZW1TdGF0cy5ib251c0hlYWx0aFJlZ2VuUGVybWFuZW50ICtcbiAgICBleHRyYUl0ZW1TdGF0cy5ib251c0hlYWx0aFJlZ2VuVGVtcDtcbiAgbGV0IHRlbXBIZWFsdGhSZWdlbkR1cmF0aW9uID0gZXh0cmFJdGVtU3RhdHMuaGVhbHRoUmVnZW5UZW1wRHVyYXRpb247XG4gIGxldCBoZWFsID0gZXh0cmFJdGVtU3RhdHMuaGVhbDtcblxuICBsZXQgX2FnaVRvdGFsID0gbWluaW9uT2JqLmJhc2VfYWdpICsgZXh0cmFJdGVtU3RhdHMuYWdpO1xuICBsZXQgX3Jhd0FybW9yVG90YWwgPSBtaW5pb25PYmouYmFzZV9hcm1vciArIGV4dHJhSXRlbVN0YXRzLmJvbnVzQXJtb3I7XG4gIGxldCBhcm1vciA9IChfYWdpVG90YWwgKiAxKSAvIDYgKyBfcmF3QXJtb3JUb3RhbDtcblxuICBsZXQgX2V4dHJhRGFtYWdlSXRlbXMgPVxuICAgIGV4dHJhSXRlbVN0YXRzLmRtZ1JhdyArIGV4dHJhSXRlbVN0YXRzW21pbmlvbk9ialsncHJpbWFyeV9hdHRyJ11dO1xuICBsZXQgX2RhbWFnZUZyb21IZXJvU3RhdHM7XG4gIG1pbmlvbk9iai5wcmltYXJ5X2F0dHIgPT09ICdzdHInXG4gICAgPyAoX2RhbWFnZUZyb21IZXJvU3RhdHMgPSBtaW5pb25PYmouYmFzZV9zdHIpXG4gICAgOiBtaW5pb25PYmoucHJpbWFyeV9hdHRyID09PSAnYWdpJ1xuICAgID8gKF9kYW1hZ2VGcm9tSGVyb1N0YXRzID0gbWluaW9uT2JqLmJhc2VfYWdpKVxuICAgIDogKF9kYW1hZ2VGcm9tSGVyb1N0YXRzID0gbWluaW9uT2JqLmJhc2VfaW50KTtcbiAgbGV0IGRhbWFnZSA9XG4gICAgKG1pbmlvbk9iai5iYXNlX2F0dGFja19tYXggKyBtaW5pb25PYmouYmFzZV9hdHRhY2tfbWluKSAvIDIgK1xuICAgIF9kYW1hZ2VGcm9tSGVyb1N0YXRzICtcbiAgICBfZXh0cmFEYW1hZ2VJdGVtcztcblxuICBsZXQgZGFtYWdlVGVtcCA9IGV4dHJhSXRlbVN0YXRzLmRtZ1RlbXBWYWx1ZTtcbiAgbGV0IGFybW9yRGVidWZmID0gZXh0cmFJdGVtU3RhdHMuYXJtb3JEZWJ1ZmY7XG5cbiAgbGV0IF9nZXRBdGtTcGVlZCA9IGdldEF0a1NwZWVkKG1pbmlvbk9iai5sb2NhbGl6ZWRfbmFtZSk7XG5cbiAgbGV0IGF0a1BlclNlYyA9IChfZ2V0QXRrU3BlZWQgKyBfYWdpVG90YWwpIC8gKDEwMCAqIG1pbmlvbk9iai5hdHRhY2tfcmF0ZSk7XG5cbiAgbGV0IGlzTWVsZWUgPSBtaW5pb25PYmouYXR0YWNrX3R5cGUgPT09ICdNZWxlZSc7XG5cbiAgY29uc3QgdmFsdWVzRm9yQ2FsY3VsYXRpb246IFZhbHVlc0ZvckNhbGN1bGF0aW9uID0ge1xuICAgIGhlYWx0aCxcbiAgICBoZWFsdGhSZWdlbixcbiAgICB0ZW1wSGVhbHRoUmVnZW5EdXJhdGlvbixcbiAgICBoZWFsLFxuICAgIGFybW9yLFxuICAgIGRhbWFnZSxcbiAgICBkYW1hZ2VUZW1wLFxuICAgIGFybW9yRGVidWZmLFxuICAgIGF0a1BlclNlYyxcbiAgICBpc01lbGVlLFxuICAgIHRpbWU6IDAsXG4gIH07XG4gIHJldHVybiB2YWx1ZXNGb3JDYWxjdWxhdGlvbjtcbn1cblxuLy8gZm9yIHRoZSByZXR1cm5lZCBvYmplY3Q6XG4vLyBkYW1hZ2UgVGVtcCBjb21lcyBvbnRvcCB3aXRob3V0IGNhbGN1bGF0aW9uc1xuLy8gYXJtb3JEZWJ1ZmYgaXMgbmVlZGVkIGluIGNhbGN1bGF0aW9uIG9mIG9wcG9uZW50cyBkYW1hZ2UgcmVkdWN0aW9uXG4vLyB3aGVuIGhlYWwgaXMgYWN0aXZhdGVkID0+IHJlbW92ZSAyIGRhbWFnZSBmcm9tIHZhcmlhYmxlIGRhbWFnZSBhbmQgcmVjYWxjdWxhdGUgZGFtYWdlIHJlZHVjdGlvblxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxcbiAgVCBleHRlbmRzIEhUTUxFbGVtZW50LFxuICBVIGV4dGVuZHMgSFRNTEVsZW1lbnRbXVxuPiB7XG4gIHRlbXBsYXRlRWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgaG9zdEVsZW1lbnQ6IFQ7XG4gIGVsZW1lbnQ6IFU7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGVkSWQ6IHN0cmluZywgaG9zdEVsZW1lbnRJZDogc3RyaW5nKSB7XG4gICAgdGhpcy50ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgIHRlbXBsYXRlZElkXG4gICAgKSEgYXMgSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgICB0aGlzLmhvc3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaG9zdEVsZW1lbnRJZCkhIGFzIFQ7XG5cbiAgICBjb25zdCBpbXBvcnRlZE5vZGUgPSBkb2N1bWVudC5pbXBvcnROb2RlKFxuICAgICAgdGhpcy50ZW1wbGF0ZUVsZW1lbnQuY29udGVudCxcbiAgICAgIHRydWVcbiAgICApO1xuICAgIHRoaXMuZWxlbWVudCA9IEFycmF5LmZyb20oaW1wb3J0ZWROb2RlLmNoaWxkcmVuKSBhcyBVO1xuICB9XG5cbiAgYXR0YWNoKGF0U3RhcnQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmVsZW1lbnQuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIHRoaXMuaG9zdEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFxuICAgICAgICBhdFN0YXJ0ID8gJ2FmdGVyYmVnaW4nIDogJ2JlZm9yZWVuZCcsXG4gICAgICAgIGVsXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzcGF0Y2goKSB7XG4gICAgQXJyYXkuZnJvbSh0aGlzLmhvc3RFbGVtZW50LmNoaWxkcmVuKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgZWwucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEhlcm9WYWx1ZXMsIEl0ZW1WYWx1ZXMgfSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuaW1wb3J0IHsgR2FtZVN0YXRlIH0gZnJvbSAnLi9HYW1lU3RhdGUnO1xuaW1wb3J0IHsgSGVyb2VzIH0gZnJvbSAnLi9IZXJvZXMnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL0l0ZW1zJztcbmltcG9ydCB7IGhlcm9TdGFydEl0ZW1zIH0gZnJvbSAnLi4vTW9kZWxzL2hlcm9TdGFydEl0ZW1zL3N0YXJ0SXRlbXMnO1xuXG5leHBvcnQgY2xhc3MgRGF0YUNvbnRhaW5lciB7XG4gIGhlcm9lcyE6IEhlcm9lcztcbiAgaW5pdEhlcm9MaXN0KGFwaVJlc3BvbnNlOiBIZXJvVmFsdWVzKSB7XG4gICAgY29uc3QgaGVyb2VzID0gbmV3IEhlcm9lcyhhcGlSZXNwb25zZSk7XG4gICAgcmV0dXJuICh0aGlzLmhlcm9lcyA9IGhlcm9lcyk7XG4gIH1cblxuICBpdGVtcyE6IEl0ZW1zO1xuICBpbml0SXRlbUxpc3QoYXBpUmVzcG9uc2U6IEl0ZW1WYWx1ZXMpIHtcbiAgICBjb25zdCBpdGVtcyA9IG5ldyBJdGVtcyhhcGlSZXNwb25zZSk7XG4gICAgcmV0dXJuICh0aGlzLml0ZW1zID0gaXRlbXMpO1xuICB9XG4gIGdhbWVTdGF0ZSE6IEdhbWVTdGF0ZTtcbiAgaW5pdEdhbWVTdGF0ZShoZXJvSWQ6IHN0cmluZywgZ2FtZU1vZGU6IHN0cmluZykge1xuICAgIGNvbnN0IGdhbWVTdGF0ZSA9IG5ldyBHYW1lU3RhdGUoaGVyb0lkLCBnYW1lTW9kZSk7XG4gICAgcmV0dXJuICh0aGlzLmdhbWVTdGF0ZSA9IGdhbWVTdGF0ZSk7XG4gIH1cbiAgaGVyb1N0YXJ0SXRlbXMgPSBoZXJvU3RhcnRJdGVtcztcbn1cbiIsImltcG9ydCB7IGRhdGFDb250YWluZXIgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQge1xuICBIZXJvVmFsdWVzLFxuICBIZXJvVmFsdWVzQ2hpbGQsXG4gIEl0ZW1WYWx1ZXNDaGlsZCxcbn0gZnJvbSAnLi4vTW9kZWxzL3Jlc3BvbnNlTW9kZWxzJztcbmltcG9ydCB7IGl0ZW1TdGF0cyB9IGZyb20gJy4uL01vZGVscy9oZXJvU3RhcnRJdGVtcy9zdGFydEl0ZW1zJztcbmltcG9ydCB7IEhlcm9TdGF0c0ZvckNhbGN1bGF0aW9uIH0gZnJvbSAnLi9DYWxjdWxhdGlvbic7XG5pbXBvcnQgeyBWYWx1ZXNGb3JDYWxjdWxhdGlvbiB9IGZyb20gJy4vQ2FsY3VsYXRpb24nO1xuXG5leHBvcnQgY2xhc3MgR2FtZVN0YXRlIHtcbiAgaGVyb09iajogSGVyb1ZhbHVlc0NoaWxkO1xuICBoZXJvSXRlbXM6IEl0ZW1WYWx1ZXNDaGlsZFtdO1xuICBjdXJyZW50T3Bwb25lbnQhOiBIZXJvVmFsdWVzQ2hpbGQ7XG4gIG9wcG9uZW50SXRlbXMhOiBJdGVtVmFsdWVzQ2hpbGRbXTtcbiAgZ2FtZU1vZGU7XG4gIGhlcm9LZXlzO1xuICBzdGFydEl0ZW1zITogSXRlbVZhbHVlc0NoaWxkW107XG4gIGhlcm9Hb2xkITogbnVtYmVyO1xuICBvcHBvbmVudEdvbGQhOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoaGVyb0lkOiBzdHJpbmcsIGdhbWVNb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmdhbWVNb2RlID0gZ2FtZU1vZGU7XG5cbiAgICAvLyBnZXQgaGVyb1xuICAgIHRoaXMuaGVyb09iaiA9IGRhdGFDb250YWluZXIuaGVyb2VzLnBsYWluSGVyb09iaihoZXJvSWQpO1xuICAgIHRoaXMuaGVyb0tleXMgPSBPYmplY3Qua2V5cyhkYXRhQ29udGFpbmVyLmhlcm9lcy5saXN0IGFzIEhlcm9WYWx1ZXMpO1xuXG4gICAgY29uc3QgaGVyb0luZGV4ID0gdGhpcy5oZXJvS2V5cy5pbmRleE9mKHRoaXMuaGVyb09ialsnaWQnXS50b1N0cmluZygpKTtcbiAgICB0aGlzLmhlcm9LZXlzLnNwbGljZShoZXJvSW5kZXgsIDEpO1xuXG4gICAgLy8gZ2V0IGhlcm8gaXRlbXNcbiAgICBjb25zdCBpdGVtS2V5cyA9IE9iamVjdC52YWx1ZXMoXG4gICAgICBkYXRhQ29udGFpbmVyLmhlcm9TdGFydEl0ZW1zW3RoaXMuaGVyb09ialsnaWQnXV1cbiAgICApO1xuICAgIHRoaXMuaGVyb0l0ZW1zID0gZGF0YUNvbnRhaW5lci5pdGVtcy5wbGFpbkl0ZW1PYmooaXRlbUtleXMpO1xuICAgIHRoaXMuc2V0R29sZCh0aGlzLmhlcm9JdGVtcywgJ2hlcm9Hb2xkJyk7XG5cbiAgICB0aGlzLnNldEN1cnJlbnRPcHBvbmVudCgpO1xuICAgIHRoaXMuZ2V0T3Bwb25lbnRJdGVtcygpO1xuICAgIHRoaXMuZ2V0U3RhcnRJdGVtcygpO1xuICB9XG5cbiAgaW5pdENoYW5nZShuZXdJdGVtOiBzdHJpbmcsIG9sZEl0ZW06IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcpIHtcbiAgICBpZiAodGFyZ2V0ID09PSAnaGVybycpIHtcbiAgICAgIHRoaXMuc2V0SGVyb0l0ZW1zKG5ld0l0ZW0sIG9sZEl0ZW0pO1xuICAgICAgdGhpcy5zZXRHb2xkKHRoaXMuaGVyb0l0ZW1zLCAnaGVyb0dvbGQnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodGFyZ2V0ID09PSAnb3Bwb25lbnQnKSB7XG4gICAgICB0aGlzLnNldE9wcG9uZW50SXRlbXMobmV3SXRlbSwgb2xkSXRlbSk7XG4gICAgICB0aGlzLnNldEdvbGQodGhpcy5vcHBvbmVudEl0ZW1zLCAnb3Bwb25lbnRHb2xkJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBlbm91Z2hHb2xkKG5ld0l0ZW06IHN0cmluZywgb2xkSXRlbTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZykge1xuICAgIGNvbnN0IGdvbGRDb3VudCA9XG4gICAgICArdGhpc1t0YXJnZXQgYXMga2V5b2YgR2FtZVN0YXRlXSArXG4gICAgICBpdGVtU3RhdHNbbmV3SXRlbV0uZ29sZCAtXG4gICAgICBpdGVtU3RhdHNbb2xkSXRlbV0uZ29sZDtcbiAgICByZXR1cm4gZ29sZENvdW50IDwgNjAxO1xuICB9XG5cbiAgY2FsY0N5Y2xlKG93blN0YXRzOiBWYWx1ZXNGb3JDYWxjdWxhdGlvbiwgZW5lbXlTdGF0czogVmFsdWVzRm9yQ2FsY3VsYXRpb24pIHtcbiAgICBpZiAoZW5lbXlTdGF0cy5oZWFsdGggPD0gMCkge1xuICAgICAgcmV0dXJuIGVuZW15U3RhdHM7XG4gICAgfVxuICAgIGxldCBlbmVteURtZ0Jsb2NrO1xuICAgIGxldCBfZW5lbXlBcm1vciA9IGVuZW15U3RhdHMuYXJtb3IgLSBvd25TdGF0cy5hcm1vckRlYnVmZjtcbiAgICBsZXQgX2RtZ0Jsb2NrID0gKDAuMDUyICogX2VuZW15QXJtb3IpIC8gKDAuOSArIDAuMDQ4ICogX2VuZW15QXJtb3IpO1xuICAgIF9lbmVteUFybW9yIDwgMFxuICAgICAgPyAoZW5lbXlEbWdCbG9jayA9IDEgKyBfZG1nQmxvY2spXG4gICAgICA6IChlbmVteURtZ0Jsb2NrID0gMSAtIF9kbWdCbG9jayk7XG5cbiAgICBsZXQgZG1nUGVySGl0O1xuICAgIGVuZW15U3RhdHMuaXNNZWxlZVxuICAgICAgPyAoZG1nUGVySGl0ID0gb3duU3RhdHMuZGFtYWdlICogZW5lbXlEbWdCbG9jayAtIDgpXG4gICAgICA6IChkbWdQZXJIaXQgPSBvd25TdGF0cy5kYW1hZ2UgKiBlbmVteURtZ0Jsb2NrKTtcblxuICAgIC8vIGZpcnN0IGRhbWFnZSBjeWNsZVxuICAgIGxldCBhdHRhY2tzTmVlZGVkID1cbiAgICAgIGVuZW15U3RhdHMuaGVhbHRoIC8gZG1nUGVySGl0IDwgMVxuICAgICAgICA/IDFcbiAgICAgICAgOiBNYXRoLmZsb29yKGVuZW15U3RhdHMuaGVhbHRoIC8gZG1nUGVySGl0KTtcbiAgICBsZXQgaHBMZWZ0ID0gZW5lbXlTdGF0cy5oZWFsdGggLSBkbWdQZXJIaXQgKiBhdHRhY2tzTmVlZGVkO1xuICAgIGxldCB0aW1lSXRUYWtlcyA9IG93blN0YXRzLmF0a1BlclNlYyAqIGF0dGFja3NOZWVkZWQ7XG4gICAgY29uc29sZS5sb2codGltZUl0VGFrZXMpO1xuXG4gICAgaHBMZWZ0ID0gaHBMZWZ0IC0gTWF0aC5mbG9vcih0aW1lSXRUYWtlcykgKiBvd25TdGF0cy5kYW1hZ2VUZW1wO1xuXG4gICAgLy8gaGVhbHRoIHJlZ2VuXG4gICAgbGV0IGhwTmV3ITogbnVtYmVyO1xuICAgIGlmIChlbmVteVN0YXRzLnRlbXBIZWFsdGhSZWdlbkR1cmF0aW9uID09PSAwKSB7XG4gICAgICBsZXQgaGVhbHRoUmVnZW5lZCA9IHRpbWVJdFRha2VzICogZW5lbXlTdGF0cy5oZWFsdGhSZWdlbjtcbiAgICAgIGhwTmV3ID0gaHBMZWZ0ICsgaGVhbHRoUmVnZW5lZDtcbiAgICB9XG4gICAgaWYgKHRpbWVJdFRha2VzIDw9IGVuZW15U3RhdHMudGVtcEhlYWx0aFJlZ2VuRHVyYXRpb24pIHtcbiAgICAgIGxldCBoZWFsdGhSZWdlbmVkID0gdGltZUl0VGFrZXMgKiBlbmVteVN0YXRzLmhlYWx0aFJlZ2VuO1xuICAgICAgaHBOZXcgPSBocExlZnQgKyBoZWFsdGhSZWdlbmVkO1xuICAgICAgZW5lbXlTdGF0cy50ZW1wSGVhbHRoUmVnZW5EdXJhdGlvbiArPSAtTWF0aC5mbG9vcih0aW1lSXRUYWtlcyk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGltZUl0VGFrZXMgPiBlbmVteVN0YXRzLnRlbXBIZWFsdGhSZWdlbkR1cmF0aW9uICYmXG4gICAgICBlbmVteVN0YXRzLnRlbXBIZWFsdGhSZWdlbkR1cmF0aW9uICE9PSAwXG4gICAgKSB7XG4gICAgICBsZXQgaGVhbHRoUmVnZW5lZDtcbiAgICAgIGxldCByZXN0UmVnZW4gPSBlbmVteVN0YXRzLnRlbXBIZWFsdGhSZWdlbkR1cmF0aW9uICogNy4xODc1O1xuICAgICAgZW5lbXlTdGF0cy50ZW1wSGVhbHRoUmVnZW5EdXJhdGlvbiA9IDA7XG4gICAgICBlbmVteVN0YXRzLmhlYWx0aFJlZ2VuICs9IC03LjE4NzU7XG4gICAgICBoZWFsdGhSZWdlbmVkID0gcmVzdFJlZ2VuICsgZW5lbXlTdGF0cy5oZWFsdGhSZWdlbiAqIHRpbWVJdFRha2VzO1xuICAgICAgaHBOZXcgPSBocExlZnQgKyBoZWFsdGhSZWdlbmVkO1xuICAgIH1cblxuICAgIGlmIChocE5ldyA8IGVuZW15U3RhdHMuaGVhbHRoICogMC4xNSkge1xuICAgICAgaWYgKGVuZW15U3RhdHMuaGVhbCA+IDApIHtcbiAgICAgICAgaHBOZXcgKz0gODU7XG4gICAgICAgIGVuZW15U3RhdHMuaGVhbCArPSAtODU7XG4gICAgICAgIGVuZW15U3RhdHMuZGFtYWdlICs9IC0yO1xuICAgICAgfVxuICAgIH1cbiAgICBlbmVteVN0YXRzLmhlYWx0aCA9IGhwTmV3O1xuICAgIGVuZW15U3RhdHMudGltZSArPSB0aW1lSXRUYWtlcztcblxuICAgIHJldHVybiBlbmVteVN0YXRzO1xuICB9XG5cbiAgdGltZVRpbGxXaW4oXG4gICAgb3duU3RhdHM6IFZhbHVlc0ZvckNhbGN1bGF0aW9uLFxuICAgIGVuZW15U3RhdHM6IFZhbHVlc0ZvckNhbGN1bGF0aW9uXG4gICk6IGFueSB7XG4gICAgbGV0IGVuZW15ID0gdGhpcy5jYWxjQ3ljbGUob3duU3RhdHMsIGVuZW15U3RhdHMpO1xuICAgIGxldCBvd24gPSB0aGlzLmNhbGNDeWNsZShlbmVteVN0YXRzLCBvd25TdGF0cyk7XG5cbiAgICBpZiAob3duLmhlYWx0aCA+IDAgJiYgZW5lbXkuaGVhbHRoID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudGltZVRpbGxXaW4ob3duLCBlbmVteSk7XG4gICAgfVxuXG4gICAgaWYgKG93bi5oZWFsdGggPCAwICYmIGVuZW15LmhlYWx0aCA+IDAgJiYgb3duLnRpbWUgPCBlbmVteS50aW1lKSB7XG4gICAgICBjb25zb2xlLmxvZyhvd24uaGVhbHRoICsgJyBoZXJvIGhlYWx0aCcpO1xuICAgICAgY29uc29sZS5sb2cob3duLnRpbWUgKyAnIGhlcm8gdGltZScpO1xuICAgICAgY29uc29sZS5sb2coZW5lbXkuaGVhbHRoICsgJyBlbmVteSBoZWFsdGgnKTtcbiAgICAgIGNvbnNvbGUubG9nKGVuZW15LnRpbWUgKyAnIGVuZW15IHRpbWUnKTtcbiAgICAgIHJldHVybiBhbGVydCgnWW91IGxvc3QhJyk7XG4gICAgfVxuXG4gICAgaWYgKG93bi5oZWFsdGggPiAwICYmIGVuZW15LmhlYWx0aCA8IDAgJiYgb3duLnRpbWUgPiBlbmVteS50aW1lKSB7XG4gICAgICBjb25zb2xlLmxvZyhvd24uaGVhbHRoICsgJyBoZXJvIGhlYWx0aCcpO1xuICAgICAgY29uc29sZS5sb2cob3duLnRpbWUgKyAnIGhlcm8gdGltZScpO1xuICAgICAgY29uc29sZS5sb2coZW5lbXkuaGVhbHRoICsgJyBlbmVteSBoZWFsdGgnKTtcbiAgICAgIGNvbnNvbGUubG9nKGVuZW15LnRpbWUgKyAnIGVuZW15IHRpbWUnKTtcbiAgICAgIHJldHVybiBhbGVydCgnWW91IHdvbiEnKTtcbiAgICB9XG5cbiAgICBpZiAob3duLmhlYWx0aCA8IDAgJiYgZW5lbXkuaGVhbHRoID4gMCAmJiBvd24udGltZSA+IGVuZW15LnRpbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnRpbWVUaWxsV2luKG93biwgZW5lbXkpO1xuICAgIH1cblxuICAgIGlmIChvd24uaGVhbHRoID4gMCAmJiBlbmVteS5oZWFsdGggPCAwICYmIG93bi50aW1lIDwgZW5lbXkudGltZSkge1xuICAgICAgcmV0dXJuIHRoaXMudGltZVRpbGxXaW4ob3duLCBlbmVteSk7XG4gICAgfVxuXG4gICAgaWYgKG93bi5oZWFsdGggPCAwICYmIGVuZW15U3RhdHMuaGVhbHRoIDwgMCkge1xuICAgICAgY29uc29sZS5sb2cob3duLmhlYWx0aCArICcgaGVybyBoZWFsdGgnKTtcbiAgICAgIGNvbnNvbGUubG9nKG93bi50aW1lICsgJyBoZXJvIHRpbWUnKTtcbiAgICAgIGNvbnNvbGUubG9nKGVuZW15LmhlYWx0aCArICcgZW5lbXkgaGVhbHRoJyk7XG4gICAgICBjb25zb2xlLmxvZyhlbmVteS50aW1lICsgJyBlbmVteSB0aW1lJyk7XG4gICAgICByZXR1cm4gb3duLnRpbWUgPCBlbmVteS50aW1lID8gYWxlcnQoJ1lvdSB3b24hJykgOiBhbGVydCgnWW91IGxvc3QhJyk7XG4gICAgfVxuXG4gICAgLy8gaWYgb3duU3RhdHMgaHAgPCAwICYmIGVuZW15U3RhdHMgaHAgPiAwICYmIHRpbWVJdFRha2VzID4gdGltZUl0VGFrZXMgcmV0dXJuIGVuZW15IFdpbm5lclxuXG4gICAgLy8gaWYgb3duU3RhdHMgaHAgPiAwICYmIGVuZW15U3RhdHMgaHAgPCAwICYmIHRpbWVJdFRha2VzIDwgdGltZUl0VGFrZXMgcmV0dXJuIG93biBXaW5uZXJcblxuICAgIC8vIGlmIG93blN0YXRzIGhwIDwgMCAmJiBlbmVtU3RhdHMgaHAgPiAwICYmIHRpbWVJdFRha2VzIDwgdGltZUl0VGFrZXMgY2FsYyB0aW1lVGlsbEVuZW15RGllcyBrZWVwIHRpbWVUaWxsT3duRGllc1xuXG4gICAgLy8gaWYgb3duU3RhdHMgaHAgPiAwICYmIGVuZW15U3RhdHMgaHAgPCAwICYmIHRpbWVJdFRha2VzID4gdGltZUl0VGFrZXMgY2FsYyB0aW1lVGlsbE93bkRpZXMga2VlcCB0aW1lVGlsbEVuZW15RGllc1xuXG4gICAgLy8gaWYgb3duU3RhdHMgaHAgPCAwICYmIGVuZW15U3RhdHMgaHAgPCAwXG5cbiAgICAvLyBoZWFsID4gMCAtIDIgZG1nIHdoZW4gdXNlZFxuICAgIC8vIGRtZ1RlbXAgPT4gZm9yIGVhY2ggc2VjIGRlYWwgMiBkbWcgb250b3BcbiAgfVxuXG4gIHBlcmZvcm1DYWxjdWxhdGlvbigpIHtcbiAgICBjb25zdCBoZXJvU3RhdHMgPSBIZXJvU3RhdHNGb3JDYWxjdWxhdGlvbih0aGlzLmhlcm9PYmosIHRoaXMuaGVyb0l0ZW1zKTtcbiAgICBjb25zdCBvcHBvbmVudFN0YXRzID0gSGVyb1N0YXRzRm9yQ2FsY3VsYXRpb24oXG4gICAgICB0aGlzLmN1cnJlbnRPcHBvbmVudCxcbiAgICAgIHRoaXMub3Bwb25lbnRJdGVtc1xuICAgICk7XG4gICAgdGhpcy50aW1lVGlsbFdpbihoZXJvU3RhdHMsIG9wcG9uZW50U3RhdHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHBvbmVudEl0ZW1zKG5ld0l0ZW06IHN0cmluZywgb2xkSXRlbTogc3RyaW5nKSB7XG4gICAgbGV0IGxpc3QgPSBbXTtcbiAgICB0aGlzLm9wcG9uZW50SXRlbXMubWFwKCh4KSA9PiB7XG4gICAgICBsaXN0LnB1c2goK3guaWQpO1xuICAgIH0pO1xuICAgIGxldCBpbmRleCA9IHRoaXMub3Bwb25lbnRJdGVtcy5maW5kSW5kZXgoKHgpID0+IHtcbiAgICAgIHJldHVybiB4LmlkID09PSArb2xkSXRlbTtcbiAgICB9KTtcblxuICAgIGxpc3RbaW5kZXhdID0gK25ld0l0ZW07XG4gICAgdGhpcy5vcHBvbmVudEl0ZW1zID0gZGF0YUNvbnRhaW5lci5pdGVtcy5wbGFpbkl0ZW1PYmoobGlzdCk7XG4gIH1cblxuICByZXNldChcbiAgICBnb2xkVGFyZ2V0OiAnaGVyb0dvbGQnIHwgJ29wcG9uZW50R29sZCcsXG4gICAgaXRlbXNUYXJnZXQ6ICdoZXJvSXRlbXMnIHwgJ29wcG9uZW50SXRlbXMnXG4gICkge1xuICAgIGNvbnN0IGFycmF5Rm9yUmVzZXQgPSBbOTk5LCA5OTksIDk5OSwgOTk5LCA5OTksIDk5OV07XG4gICAgdGhpc1tpdGVtc1RhcmdldF0gPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihhcnJheUZvclJlc2V0KTtcbiAgICB0aGlzLnNldEdvbGQodGhpc1tpdGVtc1RhcmdldF0sIGdvbGRUYXJnZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRIZXJvSXRlbXMobmV3SXRlbTogc3RyaW5nLCBvbGRJdGVtOiBzdHJpbmcpIHtcbiAgICBsZXQgbGlzdCA9IFtdO1xuICAgIHRoaXMuaGVyb0l0ZW1zLm1hcCgoeCkgPT4ge1xuICAgICAgbGlzdC5wdXNoKCt4LmlkKTtcbiAgICB9KTtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmhlcm9JdGVtcy5maW5kSW5kZXgoKHgpID0+IHtcbiAgICAgIHJldHVybiB4LmlkID09PSArb2xkSXRlbTtcbiAgICB9KTtcblxuICAgIGxpc3RbaW5kZXhdID0gK25ld0l0ZW07XG4gICAgdGhpcy5oZXJvSXRlbXMgPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihsaXN0KTtcbiAgfVxuXG4gIHNldEN1cnJlbnRPcHBvbmVudCgpIHtcbiAgICBpZiAodGhpcy5oZXJvS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBhbGVydCgnRmluaXNoJyk7XG4gICAgfVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5oZXJvS2V5cy5sZW5ndGgpO1xuICAgIHRoaXMuY3VycmVudE9wcG9uZW50ISA9IGRhdGFDb250YWluZXIuaGVyb2VzLnBsYWluSGVyb09iaihcbiAgICAgIHRoaXMuaGVyb0tleXNbcmFuZG9tSW5kZXhdLnRvU3RyaW5nKClcbiAgICApO1xuICAgIC8vIHJlbW92ZSBvcHAgZnJvbSBsaXN0IG9mIGtleXNcbiAgICB0aGlzLmhlcm9LZXlzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gIH1cblxuICBnZXRPcHBvbmVudEl0ZW1zKCkge1xuICAgIGNvbnN0IG9wcEl0ZW1LZXlzID0gT2JqZWN0LnZhbHVlcyhcbiAgICAgIGRhdGFDb250YWluZXIuaGVyb1N0YXJ0SXRlbXNbdGhpcy5jdXJyZW50T3Bwb25lbnRbJ2lkJ11dXG4gICAgKTtcbiAgICB0aGlzLm9wcG9uZW50SXRlbXMgPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihvcHBJdGVtS2V5cyk7XG4gICAgdGhpcy5zZXRHb2xkKHRoaXMub3Bwb25lbnRJdGVtcywgJ29wcG9uZW50R29sZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdGFydEl0ZW1zKCkge1xuICAgIGNvbnN0IGl0ZW1LZXlzID0gT2JqZWN0LmtleXMoaXRlbVN0YXRzKTtcbiAgICB0aGlzLnN0YXJ0SXRlbXMgPSBkYXRhQ29udGFpbmVyLml0ZW1zLnBsYWluSXRlbU9iaihpdGVtS2V5cyk7XG4gIH1cblxuICBwcml2YXRlIHNldEdvbGQoXG4gICAgaXRlbXM6IEl0ZW1WYWx1ZXNDaGlsZFtdLFxuICAgIHRhcmdldDogJ2hlcm9Hb2xkJyB8ICdvcHBvbmVudEdvbGQnXG4gICkge1xuICAgIGxldCBnb2xkID0gMDtcbiAgICBpdGVtcy5tYXAoKHgpID0+IHtcbiAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZ29sZCArPSBpdGVtU3RhdHNbeFsnaWQnXV0uZ29sZDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXNbdGFyZ2V0XSA9IGdvbGQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IGRhdGFDb250YWluZXIgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBJdGVtVmFsdWVzQ2hpbGQgfSBmcm9tICcuLi9Nb2RlbHMvcmVzcG9uc2VNb2RlbHMnO1xuaW1wb3J0IHsgYXV0b2JpbmQgfSBmcm9tICcuLi9EZWNvcmF0b3JzL2F1dG9iaW5kJztcbmltcG9ydCB7IERyYWdnYWJsZSwgRHJhZ1RhcmdldCB9IGZyb20gJy4uL01vZGVscy9ldmVudGxpc3RlbmVycyc7XG5cbmV4cG9ydCBjbGFzcyBHYW1lVmlld1xuICBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgW0hUTUxEaXZFbGVtZW50XT5cbiAgaW1wbGVtZW50cyBEcmFnZ2FibGUsIERyYWdUYXJnZXRcbntcbiAgc3RhdGljIGluc3RhbmNlOiBHYW1lVmlldztcbiAgZ2FtZUNvbnRhaW5lciA9IHRoaXMuZWxlbWVudFswXS5maXJzdEVsZW1lbnRDaGlsZCEuY2hpbGRyZW47XG4gIHN0YXJ0SXRlbXNDb250YWluZXIgPSB0aGlzLmVsZW1lbnRbMF0uY2hpbGRyZW5bMl07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ3RtcGwtZ2FtZS12aWV3JywgJ2FwcCcpO1xuICAgIHRoaXMucmVuZGVySGVybygpO1xuICAgIHRoaXMucmVuZGVyT3Bwb25lbnQoKTtcbiAgICB0aGlzLnJlbmRlclN0YXJ0SXRlbXMoKTtcbiAgICB0aGlzLmRpc3BhdGNoKCk7XG4gICAgdGhpcy5hdHRhY2godHJ1ZSk7XG4gICAgdGhpcy5jb25maWd1cmVFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJJdGVtcyhcbiAgICBzb3VyY2U6IEl0ZW1WYWx1ZXNDaGlsZFtdLFxuICAgIHRhcmdldDogRWxlbWVudCxcbiAgICBjbGFzc05hbWU6IHN0cmluZ1xuICApIHtcbiAgICBjb25zdCBpdGVtcyA9IE9iamVjdC52YWx1ZXMoc291cmNlKTtcblxuICAgIHdoaWxlICh0YXJnZXQuZmlyc3RDaGlsZCkge1xuICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKDxIVE1MRWxlbWVudD50YXJnZXQubGFzdENoaWxkKTtcbiAgICB9XG5cbiAgICBpdGVtcy5tYXAoKHgpID0+IHtcbiAgICAgIGlmICh4KSB7XG4gICAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWcuc3JjID0geFsnaW1nJ107XG4gICAgICAgIGltZy5pZCA9IHhbJ2lkJ10udG9TdHJpbmcoKTtcbiAgICAgICAgaW1nLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3RhcnRJdGVtcygpIHtcbiAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuc3RhcnRJdGVtcyxcbiAgICAgIHRoaXMuc3RhcnRJdGVtc0NvbnRhaW5lcixcbiAgICAgICdhbGxJdGVtcydcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJHb2xkKHNvdXJjZTogbnVtYmVyLCB0YXJnZXQ6IEVsZW1lbnQpIHtcbiAgICB0YXJnZXQudGV4dENvbnRlbnQgPSAoNjAwIC0gc291cmNlKS50b1N0cmluZygpICsgJyBHb2xkIGxlZnQnO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJIZXJvKCkge1xuICAgIGNvbnN0IGhlcm9Db250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMF07XG4gICAgKDxIVE1MSW1hZ2VFbGVtZW50Pmhlcm9Db250YWluZXIuY2hpbGRyZW5bMF0pLnNyYyA9XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5oZXJvT2JqWydpbWcnXTtcbiAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0l0ZW1zLFxuICAgICAgaGVyb0NvbnRhaW5lci5jaGlsZHJlblsxXSxcbiAgICAgICdoZXJvJ1xuICAgICk7XG4gICAgdGhpcy5yZW5kZXJHb2xkKFxuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0dvbGQsXG4gICAgICBoZXJvQ29udGFpbmVyLmNoaWxkcmVuWzNdXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyT3Bwb25lbnQoKSB7XG4gICAgY29uc3Qgb3Bwb25lbnRDb250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMl07XG4gICAgKDxIVE1MSW1hZ2VFbGVtZW50Pm9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzBdKS5zcmMgPVxuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuY3VycmVudE9wcG9uZW50WydpbWcnXS50b1N0cmluZygpO1xuICAgIHRoaXMucmVuZGVySXRlbXMoXG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEl0ZW1zLFxuICAgICAgb3Bwb25lbnRDb250YWluZXIuY2hpbGRyZW5bMV0sXG4gICAgICAnb3Bwb25lbnQnXG4gICAgKTtcbiAgICB0aGlzLnJlbmRlckdvbGQoXG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEdvbGQsXG4gICAgICBvcHBvbmVudENvbnRhaW5lci5jaGlsZHJlblszXVxuICAgICk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5zZXREYXRhKCd0ZXh0L3BsYWluJywgKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQpLmlkKTtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIhLmVmZmVjdEFsbG93ZWQgPSAnY29weSc7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ0VuZEhhbmRsZXIoXzogRHJhZ0V2ZW50KSB7fVxuICBAYXV0b2JpbmRcbiAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge31cblxuICAvLyBkcm9waGFuZGxlciBvbmx5IGZvciBoZXJvXG4gIEBhdXRvYmluZFxuICBkcm9wSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBuZXdJdGVtID0gZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgaWYgKCErbmV3SXRlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvbGRJdGVtID0gKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQhKS5pZDtcbiAgICBjb25zdCB0YXJnZXQgPSAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCEpLmNsYXNzTmFtZTtcblxuICAgIGlmIChkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5lbm91Z2hHb2xkKG5ld0l0ZW0sIG9sZEl0ZW0sICdoZXJvR29sZCcpKSB7XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5pbml0Q2hhbmdlKG5ld0l0ZW0sIG9sZEl0ZW0sIHRhcmdldCk7XG4gICAgICBjb25zdCBoZXJvQ29udGFpbmVyID0gdGhpcy5nYW1lQ29udGFpbmVyWzBdO1xuICAgICAgdGhpcy5yZW5kZXJJdGVtcyhcbiAgICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0l0ZW1zLFxuICAgICAgICBoZXJvQ29udGFpbmVyLmNoaWxkcmVuWzFdLFxuICAgICAgICAnaGVybydcbiAgICAgICk7XG4gICAgICB0aGlzLnJlbmRlckdvbGQoXG4gICAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLmhlcm9Hb2xkLFxuICAgICAgICBoZXJvQ29udGFpbmVyLmNoaWxkcmVuWzNdXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIGRyb3BoYW5kbGVyIG9wcG9uZW50XG4gIEBhdXRvYmluZFxuICBkcm9wT3Bwb25lbnQoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgbmV3SXRlbSA9IGV2ZW50LmRhdGFUcmFuc2ZlciEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgIGNvbnN0IG9sZEl0ZW0gPSAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCEpLmlkO1xuICAgIGNvbnN0IHRhcmdldCA9ICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0ISkuY2xhc3NOYW1lO1xuICAgIGlmIChkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5lbm91Z2hHb2xkKG5ld0l0ZW0sIG9sZEl0ZW0sICdvcHBvbmVudEdvbGQnKSkge1xuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaW5pdENoYW5nZShuZXdJdGVtLCBvbGRJdGVtLCB0YXJnZXQpO1xuICAgICAgY29uc3Qgb3Bwb25lbnRDb250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMl07XG4gICAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEl0ZW1zLFxuICAgICAgICBvcHBvbmVudENvbnRhaW5lci5jaGlsZHJlblsxXSxcbiAgICAgICAgJ29wcG9uZW50J1xuICAgICAgKTtcbiAgICAgIHRoaXMucmVuZGVyR29sZChcbiAgICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUub3Bwb25lbnRHb2xkLFxuICAgICAgICBvcHBvbmVudENvbnRhaW5lci5jaGlsZHJlblszXVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgcHJpdmF0ZSByZXNldEl0ZW1zKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgaWQgPSAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCkuaWQ7XG4gICAgaWYgKGlkID09PSAncmVzZXQtaGVybycpIHtcbiAgICAgIGNvbnN0IGhlcm9Db250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMF07XG4gICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5yZXNldCgnaGVyb0dvbGQnLCAnaGVyb0l0ZW1zJyk7XG4gICAgICB0aGlzLnJlbmRlckl0ZW1zKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5oZXJvSXRlbXMsXG4gICAgICAgIGhlcm9Db250YWluZXIuY2hpbGRyZW5bMV0sXG4gICAgICAgICdoZXJvJ1xuICAgICAgKTtcbiAgICAgIHRoaXMucmVuZGVyR29sZChcbiAgICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUuaGVyb0dvbGQsXG4gICAgICAgIGhlcm9Db250YWluZXIuY2hpbGRyZW5bM11cbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpZCA9PT0gJ3Jlc2V0LW9wcG9uZW50Jykge1xuICAgICAgZGF0YUNvbnRhaW5lci5nYW1lU3RhdGUucmVzZXQoJ29wcG9uZW50R29sZCcsICdvcHBvbmVudEl0ZW1zJyk7XG4gICAgICBjb25zdCBvcHBvbmVudENvbnRhaW5lciA9IHRoaXMuZ2FtZUNvbnRhaW5lclsyXTtcbiAgICAgIHRoaXMucmVuZGVySXRlbXMoXG4gICAgICAgIGRhdGFDb250YWluZXIuZ2FtZVN0YXRlLm9wcG9uZW50SXRlbXMsXG4gICAgICAgIG9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzFdLFxuICAgICAgICAnb3Bwb25lbnQnXG4gICAgICApO1xuICAgICAgdGhpcy5yZW5kZXJHb2xkKFxuICAgICAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5vcHBvbmVudEdvbGQsXG4gICAgICAgIG9wcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuWzNdXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZFxuICBwcml2YXRlIGNhbGN1bGF0ZVdpbm5lcigpIHtcbiAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5wZXJmb3JtQ2FsY3VsYXRpb24oKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBwcml2YXRlIGNhbGxOZXh0T3Bwb25lbnQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5zZXRDdXJyZW50T3Bwb25lbnQoKTtcbiAgICBkYXRhQ29udGFpbmVyLmdhbWVTdGF0ZS5nZXRPcHBvbmVudEl0ZW1zKCk7XG4gICAgY29uc3Qgb3Bwb25lbnRDb250YWluZXIgPSB0aGlzLmdhbWVDb250YWluZXJbMl07XG4gICAgdGhpcy5yZW5kZXJPcHBvbmVudCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVFdmVudExpc3RlbmVycygpIHtcbiAgICBjb25zdCByZXNldEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVzZXQtYnRucycpO1xuICAgIHJlc2V0QnRucy5mb3JFYWNoKChidG4pID0+XG4gICAgICAoPEhUTUxFbGVtZW50PmJ0bikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnJlc2V0SXRlbXMpXG4gICAgKTtcblxuICAgIGNvbnN0IG5leHRPcHBvbmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXh0Jyk7XG4gICAgKDxIVE1MRWxlbWVudD5uZXh0T3Bwb25lbnQpLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2xpY2snLFxuICAgICAgdGhpcy5jYWxsTmV4dE9wcG9uZW50XG4gICAgKTtcblxuICAgIGNvbnN0IGNhbGN1bGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYWxjdWxhdGUnKTtcbiAgICAoPEhUTUxFbGVtZW50PmNhbGN1bGF0ZUJ0bikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNhbGN1bGF0ZVdpbm5lcik7XG5cbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5zdGFydEl0ZW1zQ29udGFpbmVyKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdzdGFydCcsXG4gICAgICB0aGlzLmRyYWdTdGFydEhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnN0YXJ0SXRlbXNDb250YWluZXIpLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ2VuZCcsXG4gICAgICB0aGlzLmRyYWdFbmRIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5nYW1lQ29udGFpbmVyWzBdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdvdmVyJyxcbiAgICAgIHRoaXMuZHJhZ092ZXJIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5nYW1lQ29udGFpbmVyWzBdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdsZWF2ZScsXG4gICAgICB0aGlzLmRyYWdMZWF2ZUhhbmRsZXJcbiAgICApO1xuICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLmdhbWVDb250YWluZXJbMF0uY2hpbGRyZW5bMV0pLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJvcCcsXG4gICAgICB0aGlzLmRyb3BIYW5kbGVyXG4gICAgKTtcblxuICAgIC8vIG9wcG9uZW50XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZ2FtZUNvbnRhaW5lclsyXS5jaGlsZHJlblsxXSkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcmFnb3ZlcicsXG4gICAgICB0aGlzLmRyYWdPdmVySGFuZGxlclxuICAgICk7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZ2FtZUNvbnRhaW5lclsyXS5jaGlsZHJlblsxXSkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcmFnbGVhdmUnLFxuICAgICAgdGhpcy5kcmFnTGVhdmVIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5nYW1lQ29udGFpbmVyWzJdLmNoaWxkcmVuWzFdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2Ryb3AnLFxuICAgICAgdGhpcy5kcm9wT3Bwb25lbnRcbiAgICApO1xuICB9XG5cbiAgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG4gICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBHYW1lVmlldygpO1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBIZXJvVmFsdWVzIH0gZnJvbSAnLi4vTW9kZWxzL3Jlc3BvbnNlTW9kZWxzJztcbmV4cG9ydCBjbGFzcyBIZXJvZXMge1xuICBsaXN0OiBIZXJvVmFsdWVzO1xuXG4gIGNvbnN0cnVjdG9yKGFwaVJlc3BvbnNlOiBIZXJvVmFsdWVzKSB7XG4gICAgdGhpcy5saXN0ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXBpUmVzcG9uc2UpIHtcbiAgICAgIHRoaXMubGlzdFthcGlSZXNwb25zZVtrZXldWydpZCddXSA9IHtcbiAgICAgICAgaW1nOiAnaHR0cHM6Ly9hcGkub3BlbmRvdGEuY29tJyArIGFwaVJlc3BvbnNlW2tleV1bJ2ltZyddLFxuICAgICAgICBhZ2lfZ2FpbjogYXBpUmVzcG9uc2Vba2V5XVsnYWdpX2dhaW4nXSxcbiAgICAgICAgYXR0YWNrX3JhbmdlOiBhcGlSZXNwb25zZVtrZXldWydhdHRhY2tfcmFuZ2UnXSxcbiAgICAgICAgYXR0YWNrX3JhdGU6IGFwaVJlc3BvbnNlW2tleV1bJ2F0dGFja19yYXRlJ10sXG4gICAgICAgIGF0dGFja190eXBlOiBhcGlSZXNwb25zZVtrZXldWydhdHRhY2tfdHlwZSddLFxuICAgICAgICBiYXNlX2FnaTogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9hZ2knXSxcbiAgICAgICAgYmFzZV9hcm1vcjogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9hcm1vciddLFxuICAgICAgICBiYXNlX2F0dGFja19tYXg6IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfYXR0YWNrX21heCddLFxuICAgICAgICBiYXNlX2F0dGFja19taW46IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfYXR0YWNrX21pbiddLFxuICAgICAgICBiYXNlX2hlYWx0aDogYXBpUmVzcG9uc2Vba2V5XVsnYmFzZV9oZWFsdGgnXSxcbiAgICAgICAgYmFzZV9oZWFsdGhfcmVnZW46IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfaGVhbHRoX3JlZ2VuJ10sXG4gICAgICAgIGJhc2VfaW50OiBhcGlSZXNwb25zZVtrZXldWydiYXNlX2ludCddLFxuICAgICAgICBiYXNlX21hbmE6IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfbWFuYSddLFxuICAgICAgICBiYXNlX21hbmFfcmVnZW46IGFwaVJlc3BvbnNlW2tleV1bJ2Jhc2VfbWFuYV9yZWdlbiddLFxuICAgICAgICBiYXNlX21yOiBhcGlSZXNwb25zZVtrZXldWydiYXNlX21yJ10sXG4gICAgICAgIGJhc2Vfc3RyOiBhcGlSZXNwb25zZVtrZXldWydiYXNlX3N0ciddLFxuICAgICAgICBpbnRfZ2FpbjogYXBpUmVzcG9uc2Vba2V5XVsnaW50X2dhaW4nXSxcbiAgICAgICAgbG9jYWxpemVkX25hbWU6IGFwaVJlc3BvbnNlW2tleV1bJ2xvY2FsaXplZF9uYW1lJ10sXG4gICAgICAgIG1vdmVfc3BlZWQ6IGFwaVJlc3BvbnNlW2tleV1bJ21vdmVfc3BlZWQnXSxcbiAgICAgICAgcHJpbWFyeV9hdHRyOiBhcGlSZXNwb25zZVtrZXldWydwcmltYXJ5X2F0dHInXSxcbiAgICAgICAgcHJvamVjdGlsZV9zcGVlZDogYXBpUmVzcG9uc2Vba2V5XVsncHJvamVjdGlsZV9zcGVlZCddLFxuICAgICAgICBzdHJfZ2FpbjogYXBpUmVzcG9uc2Vba2V5XVsnc3RyX2dhaW4nXSxcbiAgICAgICAgaWQ6IGFwaVJlc3BvbnNlW2tleV1bJ2lkJ10sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBwbGFpbkhlcm9PYmooaWQ6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmxpc3RbaWRdO1xuICB9XG4gIGdldE9wcG9uZW50cyhnYW1lTW9kZTogc3RyaW5nLCBoZXJvSWQ6IHN0cmluZykge1xuICAgIGlmIChnYW1lTW9kZSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgIGNvbnN0IGxpc3RDbG9uZSA9IHsgLi4udGhpcy5saXN0IH07XG4gICAgICBkZWxldGUgbGlzdENsb25lWytoZXJvSWRdO1xuICAgICAgcmV0dXJuIGxpc3RDbG9uZTtcbiAgICB9XG4gICAgaWYgKGdhbWVNb2RlID09PSAnY2hvaWNlJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgSXRlbVZhbHVlcywgSXRlbVZhbHVlc0NoaWxkIH0gZnJvbSAnLi4vTW9kZWxzL3Jlc3BvbnNlTW9kZWxzJztcbmNvbnN0IGltZyA9IHJlcXVpcmUoJy4uL2ltZ3Mvbm9pdGVtcy5wbmcnKTtcblxuZXhwb3J0IGNsYXNzIEl0ZW1zIHtcbiAgbGlzdDogSXRlbVZhbHVlcztcbiAgY29uc3RydWN0b3IoYXBpUmVzcG9uc2U6IEl0ZW1WYWx1ZXMpIHtcbiAgICB0aGlzLmxpc3QgPSB7fTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIGFwaVJlc3BvbnNlKSB7XG4gICAgICB0aGlzLmxpc3RbYXBpUmVzcG9uc2Vba2V5XVsnaWQnXV0gPSB7XG4gICAgICAgIGltZzogJ2h0dHBzOi8vYXBpLm9wZW5kb3RhLmNvbScgKyBhcGlSZXNwb25zZVtrZXldWydpbWcnXSxcbiAgICAgICAgZG5hbWU6IGFwaVJlc3BvbnNlW2tleV1bJ2RuYW1lJ10sXG4gICAgICAgIGlkOiBhcGlSZXNwb25zZVtrZXldWydpZCddLFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgcGxhaW5JdGVtT2JqKGl0ZW1zQXJyOiBudW1iZXJbXSB8IHN0cmluZ1tdKSB7XG4gICAgbGV0IGl0ZW1Qcm9wZXJ0aWVzOiBJdGVtVmFsdWVzQ2hpbGRbXSA9IFtdO1xuICAgIGl0ZW1zQXJyLm1hcCgoeCkgPT4ge1xuICAgICAgaWYgKHggPT09IHVuZGVmaW5lZCB8fCB4ID09PSA5OTkpIHtcbiAgICAgICAgaXRlbVByb3BlcnRpZXMucHVzaCh7XG4gICAgICAgICAgZG5hbWU6ICdubyBpdGVtJyxcbiAgICAgICAgICBpZDogOTk5LFxuICAgICAgICAgIGltZzogaW1nLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHgpIHtcbiAgICAgICAgaXRlbVByb3BlcnRpZXMucHVzaCh0aGlzLmxpc3RbeF0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbVByb3BlcnRpZXM7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuZXhwb3J0IGNsYXNzIExvYWRpbmcgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTERpdkVsZW1lbnQsIEhUTUxEaXZFbGVtZW50W10+IHtcbiAgc3RhdGljIGluc3RhbmNlOiBMb2FkaW5nO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCd0bXBsLWxvYWRpbmctc2NyZWVuJywgJ2FwcCcpO1xuICAgIHRoaXMuYXR0YWNoKHRydWUpO1xuICB9XG5cbiAgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG4gICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBMb2FkaW5nKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IExvYWRpbmcgfSBmcm9tICcuL0xvYWRpbmcnO1xuaW1wb3J0IHsgU3RhcnRWaWV3IH0gZnJvbSAnLi9TdGFydFZpZXcnO1xuaW1wb3J0IHsgR2FtZVZpZXcgfSBmcm9tICcuL0dhbWVWaWV3JztcblxuZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gIHN0YXRpYyBsb2FkaW5nKCkge1xuICAgIExvYWRpbmcuZ2V0SW5zdGFuY2UoKTtcbiAgfVxuICBzdGF0aWMgc3RhcnRWaWV3KCkge1xuICAgIFN0YXJ0Vmlldy5nZXRJbnN0YW5jZSgpO1xuICB9XG4gIHN0YXRpYyBnYW1lVmlldygpIHtcbiAgICBHYW1lVmlldy5nZXRJbnN0YW5jZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBkYXRhQ29udGFpbmVyIH0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgSGVyb1ZhbHVlcyB9IGZyb20gJy4uL01vZGVscy9yZXNwb25zZU1vZGVscyc7XG5cbmltcG9ydCB7IENsaWNrYWJsZSwgRHJhZ2dhYmxlLCBEcmFnVGFyZ2V0IH0gZnJvbSAnLi4vTW9kZWxzL2V2ZW50bGlzdGVuZXJzJztcbmltcG9ydCB7IGF1dG9iaW5kIH0gZnJvbSAnLi4vRGVjb3JhdG9ycy9hdXRvYmluZCc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcic7XG5cbmV4cG9ydCBjbGFzcyBTdGFydFZpZXdcbiAgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTERpdkVsZW1lbnQsIEhUTUxEaXZFbGVtZW50W10+XG4gIGltcGxlbWVudHMgRHJhZ2dhYmxlLCBEcmFnVGFyZ2V0LCBDbGlja2FibGVcbntcbiAgc3RhdGljIGluc3RhbmNlOiBTdGFydFZpZXc7XG4gIGltYWdlc0xvYWRlZDogbnVtYmVyID0gMDtcbiAgc2VsZWN0ZWRIZXJvSWQ6IHN0cmluZyA9ICcnO1xuICBoZXJvTGlzdDogSGVyb1ZhbHVlcyA9IGRhdGFDb250YWluZXIuaGVyb2VzLmxpc3Q7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ3RtcGwtaGVyby1vdmVydmlldycsICdhcHAnKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuaGVyb0xpc3QpIHtcbiAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgaW1nLmlkID0gdGhpcy5oZXJvTGlzdFtrZXldLmlkLnRvU3RyaW5nKCk7XG4gICAgICBpbWcuY2xhc3NMaXN0LmFkZCgnaGVyby1wb3J0cmFpdCcpO1xuICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiB0aGlzLnVwZGF0ZURPTSgpO1xuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHRoaXMudXBkYXRlRE9NKCk7XG4gICAgICBpbWcuc3JjID0gdGhpcy5oZXJvTGlzdFtrZXldLmltZztcbiAgICAgIHRoaXMuZWxlbWVudFswXS5hcHBlbmRDaGlsZChpbWcpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ3VyZUV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURPTSgpIHtcbiAgICB0aGlzLmltYWdlc0xvYWRlZCArPSAxO1xuICAgIGlmICh0aGlzLmltYWdlc0xvYWRlZCA9PT0gMTIxKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoKCk7XG4gICAgICB0aGlzLmF0dGFjaChmYWxzZSk7XG4gICAgICB0aGlzLmltYWdlc0xvYWRlZCA9IDA7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIGRyYWdTdGFydEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RGF0YSgndGV4dC9wbGFpbicsICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS5pZCk7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5lZmZlY3RBbGxvd2VkID0gJ2NvcHknO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIGRyYWdFbmRIYW5kbGVyKF86IERyYWdFdmVudCkge31cbiAgQGF1dG9iaW5kXG4gIGRyYWdPdmVySGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCkuY2xhc3NMaXN0LmFkZCgnZHJvcHBhYmxlJyk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgZHJhZ0xlYXZlSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQpLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwYWJsZScpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIGRyb3BIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGhlcm9JZCA9IGV2ZW50LmRhdGFUcmFuc2ZlciEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IHRyYW5zZmVyRGF0YSA9XG4gICAgICB0aGlzLmhlcm9MaXN0W2V2ZW50LmRhdGFUcmFuc2ZlciEuZ2V0RGF0YSgndGV4dC9wbGFpbicpXTtcbiAgICBjb25zdCBmaXJzdENoaWxkID0gdGhpcy5lbGVtZW50WzFdLmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgaW1nLmlkID0gdHJhbnNmZXJEYXRhWydpZCddO1xuICAgIGltZy5zcmMgPSB0cmFuc2ZlckRhdGFbJ2ltZyddO1xuXG4gICAgaWYgKGZpcnN0Q2hpbGQ/LmZpcnN0RWxlbWVudENoaWxkKSB7XG4gICAgICBmaXJzdENoaWxkPy5maXJzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gICAgZmlyc3RDaGlsZCEuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICB0aGlzLnNlbGVjdGVkSGVyb0lkID0gdHJhbnNmZXJEYXRhWydpZCddO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIGNsaWNrSGFuZGxlcihldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkSGVyb0lkKSB0aGlzLmNhbGxHYW1lVmlldyh0aGlzLnNlbGVjdGVkSGVyb0lkKTtcbiAgfVxuXG4gIGFzeW5jIGNhbGxHYW1lVmlldyhoZXJvSWQ6IHN0cmluZykge1xuICAgIGxldCBpbml0O1xuICAgIHRyeSB7XG4gICAgICBpbml0ID0gZGF0YUNvbnRhaW5lci5pbml0R2FtZVN0YXRlKGhlcm9JZCwgJ3JhbmRvbScpO1xuICAgICAgYXdhaXQgUm91dGVyLmdhbWVWaWV3KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudFswXSkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcmFnc3RhcnQnLFxuICAgICAgdGhpcy5kcmFnU3RhcnRIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzBdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RyYWdlbmQnLFxuICAgICAgdGhpcy5kcmFnRW5kSGFuZGxlclxuICAgICk7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudFsxXS5jaGlsZHJlblswXSkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcmFnb3ZlcicsXG4gICAgICB0aGlzLmRyYWdPdmVySGFuZGxlclxuICAgICk7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudFsxXS5jaGlsZHJlblswXSkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkcmFnbGVhdmUnLFxuICAgICAgdGhpcy5kcmFnTGVhdmVIYW5kbGVyXG4gICAgKTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50WzFdLmNoaWxkcmVuWzBdKS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2Ryb3AnLFxuICAgICAgdGhpcy5kcm9wSGFuZGxlclxuICAgICk7XG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudFsxXS5jaGlsZHJlblsxXSkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjbGljaycsXG4gICAgICB0aGlzLmNsaWNrSGFuZGxlclxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbiAgICB0aGlzLmluc3RhbmNlID0gbmV3IFN0YXJ0VmlldygpO1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICB9XG59XG4iLCJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuZXhwb3J0IGNsYXNzIFV0aWwge1xuICBzdGF0aWMgYXN5bmMgZ2V0RGF0YShiYXNlVXJsOiBzdHJpbmcsIHVybEV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcyhiYXNlVXJsICsgdXJsRXh0ZW5zaW9uKTtcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGF1dG9iaW5kKF86IGFueSwgXzI6IHN0cmluZywgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgY29uc3QgYWRqRGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yID0ge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQoKSB7XG4gICAgICBjb25zdCBib3VuZEZuID0gb3JpZ2luYWxNZXRob2QuYmluZCh0aGlzKTtcbiAgICAgIHJldHVybiBib3VuZEZuO1xuICAgIH0sXG4gIH07XG4gIHJldHVybiBhZGpEZXNjcmlwdG9yO1xufVxuIiwiZXhwb3J0IGVudW0gSGVyb2VzIHtcbiAgJ0FudGktTWFnZScgPSAxLFxuICAnQXhlJyxcbiAgJ0JhbmUnLFxuICAnQmxvb2RzZWVrZXInLFxuICAnQ3J5c3RhbCBNYWlkZW4nLFxuICAnRHJvdyBSYW5nZXInLFxuICAnRWFydGhzaGFrZXInLFxuICAnSnVnZ2VybmF1dCcsXG4gICdNaXJhbmEnLFxuICAnTW9ycGhsaW5nJywgLy8gaWQ6IDEwXG4gICdTaGFkb3cgRmllbmQnLFxuICAnUGhhbnRvbSBMYW5jZXInLFxuICAnUHVjaycsXG4gICdQdWRnZScsXG4gICdSYXpvcicsXG4gICdTYW5kIEtpbmcnLFxuICAnU3Rvcm0gU3Bpcml0JyxcbiAgJ1N2ZW4nLFxuICAnVGlueScsXG4gICdWZW5nZWZ1bCBTcGlyaXQnLCAvLyBpZDogMjBcbiAgJ1dpbmRyYW5nZXInLFxuICAnWmV1cycsXG4gICdLdW5ra2EnLFxuICAnTGluYScgPSAyNSxcbiAgJ0xpb24nLFxuICAnU2hhZG93IFNoYW1hbicsXG4gICdTbGFyZGFyJyxcbiAgJ1RpZGVodW50ZXInLFxuICAnV2l0Y2ggRG9jdG9yJywgLy8gaWQ6IDMwIChTa2lwIGF0IEt1bmthL0xpbmEgYnkgMSlcbiAgJ0xpY2gnLFxuICAnUmlraScsXG4gICdFbmlnbWEnLFxuICAnVGlua2VyJyxcbiAgJ1NuaXBlcicsXG4gICdOZWNyb3Bob3MnLFxuICAnV2FybG9jaycsXG4gICdCZWFzdG1hc3RlcicsXG4gICdRdWVlbiBvZiBQYWluJyxcbiAgJ1Zlbm9tYW5jZXInLCAvLyBpZDogNDBcbiAgJ0ZhY2VsZXNzIFZvaWQnLFxuICAnV3JhaXRoIEtpbmcnLFxuICAnRGVhdGggUHJvcGhldCcsXG4gICdQaGFudG9tIEFzc2Fzc2luJyxcbiAgJ1B1Z25hJyxcbiAgJ1RlbXBsYXIgQXNzYXNzaW4nLFxuICAnVmlwZXInLFxuICAnTHVuYScsXG4gICdEcmFnb24gS25pZ2h0JyxcbiAgJ0RhenpsZScsIC8vIGlkOiA1MFxuICAnQ2xvY2t3ZXJrJyxcbiAgJ0xlc2hyYWMnLFxuICBcIk5hdHVyZSdzIFByb3BoZXRcIixcbiAgJ0xpZmVzdGVhbGVyJyxcbiAgJ0RhcmsgU2VlcicsXG4gICdDbGlua3onLFxuICAnT21uaWtuaWdodCcsXG4gICdFbmNoYW50cmVzcycsXG4gICdIdXNrYXInLFxuICAnTmlnaHQgU3RhbGtlcicsIC8vIGlkOiA2MFxuICAnQnJvb2Rtb3RoZXInLFxuICAnQm91bnR5IEh1bnRlcicsXG4gICdXZWF2ZXInLFxuICAnSmFraXJvJyxcbiAgJ0JhdHJpZGVyJyxcbiAgJ0NoZW4nLFxuICAnU3BlY3RyZScsXG4gICdBbmNpZW50IEFwcGFyaXRpb24nLFxuICAnRG9vbScsXG4gICdVcnNhJywgLy8gaWQ6IDcwXG4gICdTcGlyaXQgQnJlYWtlcicsXG4gICdHeXJvY29wdGVyJyxcbiAgJ0FsY2hlbWlzdCcsXG4gICdJbnZva2VyJyxcbiAgJ1NpbGVuY2VyJyxcbiAgJ091dHdvcmxkIERldm91cmVyJyxcbiAgJ0x5Y2FuJyxcbiAgJ0JyZXdtYXN0ZXInLFxuICAnU2hhZG93IERlbW9uJyxcbiAgJ0xvbmUgRHJ1aWQnLCAvLyBpZDogODBcbiAgJ0NoYW9zIEtuaWdodCcsXG4gICdNZWVwbycsXG4gICdUcmVhbnQgUHJvdGVjdG9yJyxcbiAgJ09ncmUgTWFnaScsXG4gICdVbmR5aW5nJyxcbiAgJ1J1YmljaycsXG4gICdEaXNydXB0b3InLFxuICAnTnl4IEFzc2Fzc2luJyxcbiAgJ05hZ2EgU2lyZW4nLFxuICAnS2VlcGVyIG9mIHRoZSBMaWdodCcsIC8vIGlkOiA5MFxuICAnV2lzcCcsXG4gICdWaXNhZ2UnLFxuICAnU2xhcmsnLFxuICAnTWVkdXNhJyxcbiAgJ1Ryb2xsIFdhcmxvcmQnLFxuICAnQ2VudGF1ciBXYXJydW5uZXInLFxuICAnTWFnbnVzJyxcbiAgJ1RpbWJlcnNhdycsXG4gICdCcmlzdGxlYmFjaycsXG4gICdUdXNrJywgLy8gaWQ6IDEwMFxuICAnU2t5d3JhdGggTWFnZScsXG4gICdBYmFkZG9uJyxcbiAgJ0VsZGVyIFRpdGFuJyxcbiAgJ0xlZ2lvbiBDb21tYW5kZXInLFxuICAnVGVjaGllcycsXG4gICdFbWJlciBTcGlyaXQnLFxuICAnRWFydGggU3Bpcml0JyxcbiAgJ1VuZGVybG9yZCcsXG4gICdUZXJyb3JibGFkZScsXG4gICdQaG9lbml4JywgLy9pZDogMTEwXG4gICdPcmFjbGUnLFxuICAnV2ludGVyIFd5dmVybicsXG4gICdBcmMgV2FyZGVuJyxcbiAgJ01vbmtleSBLaW5nJyxcbiAgJ0RhcmsgV2lsbG93JyA9IDExOSxcbiAgJ1BhbmdvbGllcicsIC8vIGlkOiAxMjAgKHNraXAgYXQgTW9ua2V5IEtpbmcvRGFyayBXaWxsb3cgYnkgNilcbiAgJ0dyaW1zdHJva2UnLFxuICAnSG9vZHdpbmsnID0gMTIzLFxuICAnVm9pZCBTcGlyaXQnID0gMTI2LFxuICAnU25hcGZpcmUnID0gMTI4LFxuICAnTWFycycsXG4gICdEYXduYnJlYWtlcicgPSAxMzUsIC8vIG11bHRpcGxlIHNraXBzIGJldHdlZW4gMTIwIGFuZCAxMzVcbn1cblxuZXhwb3J0IGVudW0gSXRlbXNFbnVtIHtcbiAgJ0JsYWRlcyBvZiBBdHRhY2snID0gMixcbiAgJ0NoYWlubWFpbCcgPSA0LFxuICAnUXVlbGxpbmcgQmxhZGUnID0gMTEsXG4gICdSaW5nIG9mIFByb3RlY3Rpb24nID0gMTIsXG4gICdHYXVudGxldHMgb2YgU3RyZW5ndGgnID0gMTMsXG4gICdTbGlwcGVycyBvZiBBZ2lsaXR5JyA9IDE0LFxuICAnTWFudGxlIG9mIEludGVsbGlnZW5jZScgPSAxNSxcbiAgJ0lyb24gQnJhbmNoJyA9IDE2LFxuICAnQmVsdCBvZiBTdHJlbmd0aCcgPSAxNyxcbiAgJ0JhbmQgb2YgRWx2ZW5za2luJyA9IDE4LFxuICAnUm9iZSBvZiB0aGUgTWFnaScgPSAxOSxcbiAgJ0NpcmNsZXQnID0gMjAsXG4gICdHbG92ZXMgb2YgSGFzdGUnID0gMjUsXG4gICdSaW5nIG9mIFJlZ2VuJyA9IDI3LFxuICBcIlNhZ2UncyBNYXNrXCIgPSAyOCxcbiAgJ0Jvb3RzIG9mIFNwZWVkJyA9IDI5LFxuICAnQ2xvYWsnID0gMzEsXG4gICdNYWdpYyBTdGljaycgPSAzNCxcbiAgJ01hZ2ljIFdhbmQnID0gMzYsXG4gICdDbGFyaXR5JyA9IDM4LFxuICAnSGVhbGluZyBTYWx2ZScgPSAzOSxcbiAgJ0R1c3Qgb2YgQXBwZWFyYW5jZScgPSA0MCxcbiAgJ09ic2VydmVyIFdhcmQnID0gNDIsXG4gICdTZW50cnkgV2FyZCcgPSA0MyxcbiAgJ1RhbmdvJyA9IDQ0LFxuICAnQnJhY2VyJyA9IDczLFxuICAnV3JhaXRoIEJhbmQnID0gNzUsXG4gICdOdWxsIFRhbGlzbWFuJyA9IDc3LFxuICAnQnVja2xlcicgPSA4NixcbiAgJ1Jpbmcgb2YgQmFzaWxpdXMnID0gODgsXG4gICdIZWFkZHJlc3MnID0gOTQsXG4gICdPcmIgb2YgVmVub20nID0gMTgxLFxuICAnU21va2Ugb2YgRGVjZWl0JyA9IDE4OCxcbiAgJ0VuY2hhbnRlZCBNYW5nbycgPSAyMTYsXG4gICdGYWVyaWUgRmlyZScgPSAyMzcsXG4gICdCbGlnaHQgU3RvbmUnID0gMjQwLFxuICAnV2luZCBMYWNlJyA9IDI0NCxcbiAgJ0Nyb3duJyA9IDI2MSxcbiAgJ1JhaW5kcm9wcycgPSAyNjUsXG4gICdGbHVmZnkgSGF0JyA9IDU5MyxcbiAgJ25vIGl0ZW0nID0gOTk5LFxufVxuIiwiaW1wb3J0IHsgSGVyb2VzLCBJdGVtc0VudW0gfSBmcm9tICcuL19lbnVtcyc7XG5pbXBvcnQgeyBoZXJvSXRlbVNsb3RzLCBJdGVtTGlzdFN0YXRpYyB9IGZyb20gJy4vX2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY29uc3QgaXRlbVN0YXRzOiBJdGVtTGlzdFN0YXRpYyA9IHtcbiAgW0l0ZW1zRW51bVsnQ2xhcml0eSddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDUwLFxuICAgIG1hbmFSZWdlblRlbXA6IDYsXG4gICAgbWFuYVJlZ2VuRHVyYXRpb246IDI1LFxuICB9LFxuICBbSXRlbXNFbnVtWydEdXN0IG9mIEFwcGVhcmFuY2UnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogODAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDcwLFxuICAgIGhwUmVnZW5QZXJtYW5lbnQ6IDAuNixcbiAgICBtYW5hUmVnZW5UZW1wOiAxMDAsXG4gICAgbWFuYVJlZ2VuRHVyYXRpb246IDEsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNzAsXG4gICAgaGVhbDogODUsXG4gICAgZG1nUmF3OiAyLFxuICB9LFxuICBbSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDExMCxcbiAgICBocFJlZ2VuVGVtcDogNDAsXG4gICAgaHBSZWdlbkR1cmF0aW9uOiAxMCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnU2VudHJ5IFdhcmQnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogNTAsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogMCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnU21va2Ugb2YgRGVjZWl0J11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDUwLFxuICB9LFxuICBbSXRlbXNFbnVtWydUYW5nbyddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDkwLFxuICAgIGhwUmVnZW5UZW1wOiA3LjE4NzUsXG4gICAgaHBSZWdlbkR1cmF0aW9uOiAxNixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQmFuZCBvZiBFbHZlbnNraW4nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0NTAsXG4gICAgYWdpQm9udXM6IDYsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0JlbHQgb2YgU3RyZW5ndGgnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0NTAsXG4gICAgc3RyQm9udXM6IDYsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0NpcmNsZXQnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAxNTUsXG4gICAgc3RyQm9udXM6IDIsXG4gICAgYWdpQm9udXM6IDIsXG4gICAgaW50Qm9udXM6IDIsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0Nyb3duJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNDUwLFxuICAgIHN0ckJvbnVzOiA0LFxuICAgIGFnaUJvbnVzOiA0LFxuICAgIGludEJvbnVzOiA0LFxuICB9LFxuICBbSXRlbXNFbnVtWydHYXVudGxldHMgb2YgU3RyZW5ndGgnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAxNDAsXG4gICAgc3RyQm9udXM6IDMsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNTAsXG4gICAgc3RyQm9udXM6IDEsXG4gICAgYWdpQm9udXM6IDEsXG4gICAgaW50Qm9udXM6IDEsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAxNDAsXG4gICAgaW50Qm9udXM6IDMsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1JvYmUgb2YgdGhlIE1hZ2knXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0NTAsXG4gICAgaW50Qm9udXM6IDYsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAxNDAsXG4gICAgYWdpQm9udXM6IDMsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0JsYWRlcyBvZiBBdHRhY2snXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0NTAsXG4gICAgZG1nUmF3OiA5LFxuICB9LFxuICBbSXRlbXNFbnVtWydCbGlnaHQgU3RvbmUnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAzMDAsXG4gICAgYXJtb3JEZWJ1ZmY6IDIsXG4gICAgYXJtb3JEZWJ1ZmZEdXJhdGlvbjogOCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQ2hhaW5tYWlsJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNTUwLFxuICAgIGFybW9yUmF3OiA0LFxuICB9LFxuICBbSXRlbXNFbnVtWydHbG92ZXMgb2YgSGFzdGUnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0NTAsXG4gICAgYXR0U3BlZWRSYXc6IDIwLFxuICB9LFxuICBbSXRlbXNFbnVtWydSYWluZHJvcHMnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogMjI1LFxuICAgIG1hbmFSZWdlblBlcm1hbmVudDogMC44LFxuICB9LFxuICBbSXRlbXNFbnVtWydPcmIgb2YgVmVub20nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAyNzUsXG4gICAgZG1nVGVtcFZhbHVlOiAyLFxuICAgIGRtZ1RlbXBEdXJhdGlvbjogMixcbiAgfSxcbiAgW0l0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogMTMwLFxuICB9LFxuICBbSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiAxNzUsXG4gICAgYXJtb3JSYXc6IDIsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ0Jvb3RzIG9mIFNwZWVkJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDUwMCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQ2xvYWsnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogZmFsc2UsXG4gICAgZ29sZDogNTAwLFxuICB9LFxuICBbSXRlbXNFbnVtWydGbHVmZnkgSGF0J11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogMjUwLFxuICAgIGhwUmF3OiAxMjUsXG4gIH0sXG4gIFtJdGVtc0VudW1bJ01hZ2ljIFN0aWNrJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDIwMCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnUmluZyBvZiBSZWdlbiddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDE3NSxcbiAgICBocFJlZ2VuUGVybWFuZW50OiAxLjI1LFxuICB9LFxuICBbSXRlbXNFbnVtW1wiU2FnZSdzIE1hc2tcIl1dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDE3NSxcbiAgICBtYW5hUmVnZW5QZXJtYW5lbnQ6IDAuNyxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnV2luZCBMYWNlJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDI1MCxcbiAgfSxcbiAgW0l0ZW1zRW51bVsnQnJhY2VyJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNTA1LFxuICAgIHN0ckJvbnVzOiA1LFxuICAgIGFnaUJvbnVzOiAyLFxuICAgIGludEJvbnVzOiAyLFxuICAgIGhwUmVnZW5QZXJtYW5lbnQ6IDEsXG4gICAgZG1nUmF3OiAzLFxuICB9LFxuICBbSXRlbXNFbnVtWydNYWdpYyBXYW5kJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNDUwLFxuICAgIHN0ckJvbnVzOiAzLFxuICAgIGFnaUJvbnVzOiAzLFxuICAgIGludEJvbnVzOiAzLFxuICB9LFxuICBbSXRlbXNFbnVtWydOdWxsIFRhbGlzbWFuJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNTA1LFxuICAgIHN0ckJvbnVzOiAyLFxuICAgIGFnaUJvbnVzOiAyLFxuICAgIGludEJvbnVzOiA1LFxuICAgIG1hbmFSZWdlblBlcm1hbmVudDogMC42LFxuICB9LFxuICBbSXRlbXNFbnVtWydXcmFpdGggQmFuZCddXToge1xuICAgIHJlbGV2YW50VmFsdWVzOiB0cnVlLFxuICAgIGdvbGQ6IDUwNSxcbiAgICBzdHJCb251czogMixcbiAgICBhZ2lCb251czogNSxcbiAgICBpbnRCb251czogMixcbiAgICBhcm1vclJhdzogMS41LFxuICAgIGF0dFNwZWVkUmF3OiA1LFxuICB9LFxuICBbSXRlbXNFbnVtWydCdWNrbGVyJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNDI1LFxuICAgIGFybW9yUmF3OiAzLFxuICB9LFxuICBbSXRlbXNFbnVtWydIZWFkZHJlc3MnXV06IHtcbiAgICByZWxldmFudFZhbHVlczogdHJ1ZSxcbiAgICBnb2xkOiA0MjUsXG4gICAgaHBSZWdlblBlcm1hbmVudDogMi41LFxuICB9LFxuICBbSXRlbXNFbnVtWydSaW5nIG9mIEJhc2lsaXVzJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IHRydWUsXG4gICAgZ29sZDogNDI1LFxuICAgIG1hbmFSZWdlblBlcm1hbmVudDogMS41LFxuICB9LFxuICBbSXRlbXNFbnVtWydubyBpdGVtJ11dOiB7XG4gICAgcmVsZXZhbnRWYWx1ZXM6IGZhbHNlLFxuICAgIGdvbGQ6IDAsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgaGVyb1N0YXJ0SXRlbXM6IGhlcm9JdGVtU2xvdHMgPSB7XG4gIFtIZXJvZXNbJ0FudGktTWFnZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snQXhlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snQmFuZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0Jsb29kc2Vla2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydDcnlzdGFsIE1haWRlbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0Ryb3cgUmFuZ2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydFYXJ0aHNoYWtlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTQ6IHVuZGVmaW5lZCxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0p1Z2dlcm5hdXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydNaXJhbmEnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bXCJTYWdlJ3MgTWFza1wiXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ01vcnBobGluZyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snU2hhZG93IEZpZW5kJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1BoYW50b20gTGFuY2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydQdWNrJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydQdWRnZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1Jhem9yJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydTYW5kIEtpbmcnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snU3Rvcm0gU3Bpcml0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydTdmVuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1RpbnknXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydWZW5nZWZ1bCBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snV2luZHJhbmdlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snWmV1cyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snS3Vua2thJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydMaW5hJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydMaW9uJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydXaW5kIExhY2UnXSxcbiAgfSxcbiAgW0hlcm9lc1snU2hhZG93IFNoYW1hbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NsYXJkYXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVGlkZWh1bnRlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dpdGNoIERvY3RvciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snTGljaCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1Jpa2knXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09yYiBvZiBWZW5vbSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0VuaWdtYSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnTnVsbCBUYWxpc21hbiddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNDogdW5kZWZpbmVkLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snVGlua2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snU25pcGVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTmVjcm9waG9zJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICB9LFxuICBbSGVyb2VzWydXYXJsb2NrJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVtcIlNhZ2UncyBNYXNrXCJdLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snQmVhc3RtYXN0ZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICB9LFxuICBbSGVyb2VzWydRdWVlbiBvZiBQYWluJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1Zlbm9tYW5jZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0ZhY2VsZXNzIFZvaWQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dyYWl0aCBLaW5nJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snRGVhdGggUHJvcGhldCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgfSxcbiAgW0hlcm9lc1snUGhhbnRvbSBBc3Nhc3NpbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snUHVnbmEnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ1RlbXBsYXIgQXNzYXNzaW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVmlwZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydMdW5hJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snRHJhZ29uIEtuaWdodCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgfSxcbiAgW0hlcm9lc1snRGF6emxlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtW1wiU2FnZSdzIE1hc2tcIl0sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydDbG9ja3dlcmsnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydXaW5kIExhY2UnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snTGVzaHJhYyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnTWFudGxlIG9mIEludGVsbGlnZW5jZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1tcIk5hdHVyZSdzIFByb3BoZXRcIl1dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydCbGlnaHQgU3RvbmUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0xpZmVzdGVhbGVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0RhcmsgU2VlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0NsaW5reiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snT21uaWtuaWdodCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0dhdW50bGV0cyBvZiBTdHJlbmd0aCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snRW5jaGFudHJlc3MnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydCbGlnaHQgU3RvbmUnXSxcbiAgfSxcbiAgW0hlcm9lc1snSHVza2FyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTmlnaHQgU3RhbGtlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snQnJvb2Rtb3RoZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0JvdW50eSBIdW50ZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0Jvb3RzIG9mIFNwZWVkJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW00OiB1bmRlZmluZWQsXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydXZWF2ZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0NpcmNsZXQnXSxcbiAgfSxcbiAgW0hlcm9lc1snSmFraXJvJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnQ2xhcml0eSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgfSxcbiAgW0hlcm9lc1snQmF0cmlkZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydDaGVuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bXCJTYWdlJ3MgTWFza1wiXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NwZWN0cmUnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydBbmNpZW50IEFwcGFyaXRpb24nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDbGFyaXR5J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydEb29tJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVXJzYSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1NwaXJpdCBCcmVha2VyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydCb290cyBvZiBTcGVlZCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNDogdW5kZWZpbmVkLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snR3lyb2NvcHRlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bXCJTYWdlJ3MgTWFza1wiXSxcbiAgfSxcbiAgW0hlcm9lc1snQWxjaGVtaXN0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snSW52b2tlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ01hbnRsZSBvZiBJbnRlbGxpZ2VuY2UnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydTaWxlbmNlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICB9LFxuICBbSGVyb2VzWydPdXR3b3JsZCBEZXZvdXJlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDcm93biddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0x5Y2FuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0JyZXdtYXN0ZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydTaGFkb3cgRGVtb24nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDbGFyaXR5J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydMb25lIERydWlkJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydPcmIgb2YgVmVub20nXSxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydDaGFvcyBLbmlnaHQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snTWVlcG8nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVHJlYW50IFByb3RlY3RvciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ09yYiBvZiBWZW5vbSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ09ncmUgTWFnaSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVW5keWluZyddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1J1YmljayddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gICAgaXRlbTQ6IHVuZGVmaW5lZCxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0Rpc3J1cHRvciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICB9LFxuICBbSGVyb2VzWydOeXggQXNzYXNzaW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0Jvb3RzIG9mIFNwZWVkJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW00OiB1bmRlZmluZWQsXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydOYWdhIFNpcmVuJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydTbGlwcGVycyBvZiBBZ2lsaXR5J10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICB9LFxuICBbSGVyb2VzWydLZWVwZXIgb2YgdGhlIExpZ2h0J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRW5jaGFudGVkIE1hbmdvJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dpc3AnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSGVhZGRyZXNzJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snVmlzYWdlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW01OiB1bmRlZmluZWQsXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snU2xhcmsnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ01lZHVzYSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ1Ryb2xsIFdhcmxvcmQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gIH0sXG4gIFtIZXJvZXNbJ0NlbnRhdXIgV2FycnVubmVyJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTWFnbnVzJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVGltYmVyc2F3J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1Jpbmcgb2YgUHJvdGVjdGlvbiddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snQnJpc3RsZWJhY2snXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgfSxcbiAgW0hlcm9lc1snVHVzayddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnQm9vdHMgb2YgU3BlZWQnXSxcbiAgICBpdGVtMzogdW5kZWZpbmVkLFxuICAgIGl0ZW00OiB1bmRlZmluZWQsXG4gICAgaXRlbTU6IHVuZGVmaW5lZCxcbiAgICBpdGVtNjogdW5kZWZpbmVkLFxuICB9LFxuICBbSGVyb2VzWydTa3l3cmF0aCBNYWdlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICAvLyBsYXN0IHJvdW5kXG4gIFtIZXJvZXNbJ0FiYWRkb24nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVtcIlNhZ2UncyBNYXNrXCJdLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snRWxkZXIgVGl0YW4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1dpbmQgTGFjZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snTGVnaW9uIENvbW1hbmRlciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1RlY2hpZXMnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnV2luZCBMYWNlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydFbWJlciBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICB9LFxuICBbSGVyb2VzWydFYXJ0aCBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDaXJjbGV0J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUmluZyBvZiBQcm90ZWN0aW9uJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnT2JzZXJ2ZXIgV2FyZCddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ1VuZGVybG9yZCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydSaW5nIG9mIFByb3RlY3Rpb24nXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1RlcnJvcmJsYWRlJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snUGhvZW5peCddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDcm93biddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgICBpdGVtNTogdW5kZWZpbmVkLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ09yYWNsZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1dpbnRlciBXeXZlcm4nXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTY6IHVuZGVmaW5lZCxcbiAgfSxcbiAgW0hlcm9lc1snQXJjIFdhcmRlbiddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnU2xpcHBlcnMgb2YgQWdpbGl0eSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ1NsaXBwZXJzIG9mIEFnaWxpdHknXSxcbiAgfSxcbiAgW0hlcm9lc1snTW9ua2V5IEtpbmcnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ09yYiBvZiBWZW5vbSddLFxuICAgIGl0ZW02OiB1bmRlZmluZWQsXG4gIH0sXG4gIFtIZXJvZXNbJ0RhcmsgV2lsbG93J11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnRmFlcmllIEZpcmUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydFbmNoYW50ZWQgTWFuZ28nXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ1BhbmdvbGllciddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydRdWVsbGluZyBCbGFkZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snR3JpbXN0cm9rZSddXToge1xuICAgIGl0ZW0xOiBJdGVtc0VudW1bJ1RhbmdvJ10sXG4gICAgaXRlbTI6IEl0ZW1zRW51bVsnSGVhbGluZyBTYWx2ZSddLFxuICAgIGl0ZW0zOiBJdGVtc0VudW1bJ0VuY2hhbnRlZCBNYW5nbyddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ0NsYXJpdHknXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ0lyb24gQnJhbmNoJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ0hvb2R3aW5rJ11dOiB7XG4gICAgaXRlbTE6IEl0ZW1zRW51bVsnVGFuZ28nXSxcbiAgICBpdGVtMjogSXRlbXNFbnVtWydIZWFsaW5nIFNhbHZlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ0JsaWdodCBTdG9uZSddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snVm9pZCBTcGlyaXQnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnUXVlbGxpbmcgQmxhZGUnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydNYW50bGUgb2YgSW50ZWxsaWdlbmNlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snU25hcGZpcmUnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydDbGFyaXR5J10sXG4gICAgaXRlbTQ6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNTogSXRlbXNFbnVtWydCbGlnaHQgU3RvbmUnXSxcbiAgICBpdGVtNjogSXRlbXNFbnVtWydPYnNlcnZlciBXYXJkJ10sXG4gIH0sXG4gIFtIZXJvZXNbJ01hcnMnXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0hlYWxpbmcgU2FsdmUnXSxcbiAgICBpdGVtMzogSXRlbXNFbnVtWydGYWVyaWUgRmlyZSddLFxuICAgIGl0ZW00OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTU6IEl0ZW1zRW51bVsnQ2lyY2xldCddLFxuICAgIGl0ZW02OiBJdGVtc0VudW1bJ09ic2VydmVyIFdhcmQnXSxcbiAgfSxcbiAgW0hlcm9lc1snRGF3bmJyZWFrZXInXV06IHtcbiAgICBpdGVtMTogSXRlbXNFbnVtWydUYW5nbyddLFxuICAgIGl0ZW0yOiBJdGVtc0VudW1bJ0ZhZXJpZSBGaXJlJ10sXG4gICAgaXRlbTM6IEl0ZW1zRW51bVsnSXJvbiBCcmFuY2gnXSxcbiAgICBpdGVtNDogSXRlbXNFbnVtWydJcm9uIEJyYW5jaCddLFxuICAgIGl0ZW01OiBJdGVtc0VudW1bJ1F1ZWxsaW5nIEJsYWRlJ10sXG4gICAgaXRlbTY6IEl0ZW1zRW51bVsnR2F1bnRsZXRzIG9mIFN0cmVuZ3RoJ10sXG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnLi9Db21wb25lbnRzL1JvdXRlcic7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi9Db21wb25lbnRzL1V0aWwnO1xuaW1wb3J0IHsgSGVyb2VzIH0gZnJvbSAnLi9Db21wb25lbnRzL0hlcm9lcyc7XG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vQ29tcG9uZW50cy9JdGVtcyc7XG5pbXBvcnQgeyBEYXRhQ29udGFpbmVyIH0gZnJvbSAnLi9Db21wb25lbnRzL0RhdGFDb250YWluZXInO1xuXG5Sb3V0ZXIubG9hZGluZygpO1xuZXhwb3J0IGNvbnN0IGRhdGFDb250YWluZXIgPSBuZXcgRGF0YUNvbnRhaW5lcigpO1xuXG5VdGlsLmdldERhdGEoJ2h0dHBzOi8vYXBpLm9wZW5kb3RhLmNvbS9hcGknLCAnL2NvbnN0YW50cy9oZXJvZXMnKVxuICAudGhlbigocmVzKSA9PiB7XG4gICAgZGF0YUNvbnRhaW5lci5pbml0SGVyb0xpc3QocmVzKTtcbiAgICBSb3V0ZXIuc3RhcnRWaWV3KCk7XG4gIH0pXG4gIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG5cblV0aWwuZ2V0RGF0YSgnaHR0cHM6Ly9hcGkub3BlbmRvdGEuY29tL2FwaScsICcvY29uc3RhbnRzL2l0ZW1zJylcbiAgLnRoZW4oKHJlcykgPT4ge1xuICAgIGRhdGFDb250YWluZXIuaW5pdEl0ZW1MaXN0KHJlcyk7XG4gIH0pXG4gIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9