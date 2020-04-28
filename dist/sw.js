/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 9:
/***/ (function(module, exports) {

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
workbox.loadModule("workbox-strategies");
workbox.loadModule("workbox-precaching"); //load precaching module
workbox.routing.registerRoute(/.jpg|.png/, new workbox.strategies.CacheFirst({
    cacheName: "img-cache",
    plugins: [
        new workbox.expiration.Plugin({
            maxAgeSeconds: 30 * 24 * 60 * 60
        })
    ]
}));
//dynamic data
workbox.routing.registerRoute(/.html|.css|.js|.json/, new workbox.strategies.CacheFirst({
    cacheName: "html-cache",
    plugins: [
        new workbox.expiration.Plugin({
            maxAgeSeconds: 30 * 24 * 60 * 60
        })
    ]
}));
workbox.precaching.precacheAndRoute([]);
workbox.routing.registerRoute(/.\/content\/index\/AllAvailable$/, async () => {
    let ids = getAllAvailableIDs();
    return new Response(await ids);
});
workbox.routing.registerRoute(/.\/content\/index/, new workbox.strategies.CacheFirst({
    cacheName: "index-cache",
    plugins: [
        new workbox.expiration.Plugin({
            maxAgeSeconds: 30 * 24 * 60 * 60
        })
    ]
}));
// Fetches the available IDs.
async function getAllAvailableIDs() {
    if (navigator.onLine) {
        let id_req = await fetch("./content/index/AllAvailable");
        if (id_req.ok) {
            return id_req.text();
        }
    }
    // Offline case.
    let ids = "";
    let cache = await caches.open("html-cache");
    let keys = await cache.keys();
    if (keys.length == 0) {
        return "";
    }
    keys.forEach((request, index, array) => {
        let url = request.url;
        if (!url.includes("content")) {
            return;
        }
        let tokens = url
            .substring(url.search("content") + "content".length)
            .split("/");
        if (!tokens[tokens.length - 1].match(/\d.html/)) {
            return;
        }
        let id = tokens.join("");
        id = id.substring(0, id.length - 5);
        ids += id;
    });
    return ids;
}


/***/ })

/******/ });