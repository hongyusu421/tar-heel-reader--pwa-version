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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Collect state together and allow it to persist */
Object.defineProperty(exports, "__esModule", { value: true });
const version = 6; /* version of the persistent data */
class State {
    constructor() {
        this.search = "";
        this.reviewed = true;
        this.category = "";
        this.audience = "E";
        this.booksPerPage = 9;
        this.pageColor = "#fff";
        this.textColor = "#000";
        this.buttonSize = "small";
        /* favorites related values */
        this.fav = {
            id: 1,
            name: "Favorites",
            bookIds: []
        };
        /* speech related values */
        this.speech = {
            voice: "silent",
            rate: 1,
            pitch: 1,
            lang: "en-US"
        };
        const s = localStorage.getItem("state");
        const o = (s && JSON.parse(s)) || {};
        if (o && o.version === version) {
            Object.assign(this, o);
        }
        this.persist();
    }
    persist() {
        const o = Object.assign({}, this, { version });
        const s = JSON.stringify(o);
        localStorage.setItem("state", s);
    }
}
const state = new State();
exports.default = state;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = __webpack_require__(0);
let voices = [];
function getVoices() {
    return new Promise((resolve, reject) => {
        if (voices.length > 0) {
            resolve(voices);
        }
        else {
            voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                resolve(voices);
            }
            else {
                speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
            }
        }
    });
}
exports.getVoices = getVoices;
async function speak(text) {
    if (state_1.default.speech.voice === "silent") {
        return;
    }
    const voices = (await getVoices()).filter(v => v.name === state_1.default.speech.voice);
    if (voices.length) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices[0];
        utterance.rate = state_1.default.speech.rate;
        utterance.pitch = state_1.default.speech.pitch;
        utterance.lang = state_1.default.speech.lang;
        speechSynthesis.speak(utterance);
    }
}
exports.default = speak;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Implement simple swipe capability for turning pages */
Object.defineProperty(exports, "__esModule", { value: true });
function swipe(callback) {
    let start = [0, 0];
    let end = [0, 0];
    document.addEventListener('touchstart', e => {
        start = [e.changedTouches[0].screenX, e.changedTouches[0].screenY];
    });
    document.addEventListener('touchend', e => {
        end = [e.changedTouches[0].screenX, e.changedTouches[0].screenY];
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const ww = window.innerWidth;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 0.1 * ww) {
            callback(dx < 0 ? 'left' : 'right');
        }
    });
}
exports.default = swipe;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/idb/build/esm/chunk.js
const instanceOfAny = (object, constructors) => constructors.some(c => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return idbProxyableTypes ||
        (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
        IDBCursor.prototype.advance,
        IDBCursor.prototype.continue,
        IDBCursor.prototype.continuePrimaryKey,
    ]);
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    promise.then((value) => {
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) {
            cursorRequestMap.set(value, request);
        }
        // Catching to avoid "Uncaught Promise exceptions"
    }).catch(() => { });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error);
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Polyfill for objectStoreNames because of Edge.
            if (prop === 'objectStoreNames') {
                return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1] ?
                    undefined : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    has(target, prop) {
        if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store'))
            return true;
        return prop in target;
    },
};
function addTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction &&
        !('objectStoreNames' in IDBTransaction.prototype)) {
        return function (storeNames, ...args) {
            const tx = func.call(unwrap(this), storeNames, ...args);
            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
            return wrap(tx);
        };
    }
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(cursorRequestMap.get(this));
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);



// CONCATENATED MODULE: ./node_modules/idb/build/esm/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openDB", function() { return openDB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteDB", function() { return deleteDB; });
/* concated harmony reexport unwrap */__webpack_require__.d(__webpack_exports__, "unwrap", function() { return unwrap; });
/* concated harmony reexport wrap */__webpack_require__.d(__webpack_exports__, "wrap", function() { return wrap; });



/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction));
        });
    }
    if (blocked)
        request.addEventListener('blocked', () => blocked());
    if (blocking)
        openPromise.then(db => db.addEventListener('versionchange', blocking));
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked)
        request.addEventListener('blocked', () => blocked());
    return wrap(request).then(() => undefined);
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string'))
        return;
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName)))
        return;
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        const returnVal = target[targetFuncName](...args);
        if (isWrite)
            await tx.done;
        return returnVal;
    };
    cachedMethods.set(prop, method);
    return method;
}
addTraps(oldTraps => ({
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));




/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * get the string from the search box
 * split it into words
 * stem them and toss any we should ignore
 * for each word
 *   fetch the index and split it into ids
 * intersect the arrays of ids
 * for each id in the intersection
 *   get the index entry
 *   add it to the page
 *   quit and remember where we are if we have enough
 */
Object.defineProperty(exports, "__esModule", { value: true });
// load this down below in init
let config;
// persistant state
const state_1 = __webpack_require__(0);
// porter2 stemmer
const stemr_1 = __webpack_require__(5);
const swipe_1 = __webpack_require__(2);
function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("sw.js")
            .then(function () {
            console.log("Service worker registered!");
        })
            .catch(err => {
            console.log("Service worker registration failed: " + err);
        });
    }
}
const BookSet_1 = __webpack_require__(6);
const speech_1 = __webpack_require__(1);
const idb_1 = __webpack_require__(3);
function getQueryTerms() {
    const searchBox = document.querySelector("#search");
    const query = searchBox.value;
    if (query.length) {
        const pattern = /[a-z]{3,}/gi;
        return query.match(pattern).map(stemr_1.stem);
    }
    else {
        return [];
    }
}
async function getIndexForTerm(term) {
    const resp = await fetch("content/index/" + term);
    let result;
    if (resp.ok) {
        const text = await resp.text();
        if (text.indexOf("-") > 0) {
            const parts = text.split("-");
            result = new BookSet_1.RangeSet(parts[0], parts[1], config.digits, config.base);
        }
        else {
            result = new BookSet_1.StringSet(text, config.digits);
        }
    }
    return result;
}
async function getBookCover(bid) {
    // get the prefix of the path for this index
    const prefix = "content/" +
        bid
            .split("")
            .slice(0, -1)
            .join("/") +
        "/";
    const db = await idb_1.openDB("Covers", 1, {
        upgrade(db) {
            const store = db.createObjectStore("covers", {
                keyPath: "id"
            });
        }
    });
    // see if we have it in the db
    const itemEntry = await db.get("covers", bid);
    let item = null;
    if (!itemEntry) {
        // fetch the index
        const resp = await fetch(prefix + "index.html");
        // get the html
        const html = await resp.text();
        // parse it
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        // cache all the items from this page
        const tx = db.transaction("covers", "readwrite");
        for (const li of doc.querySelectorAll("li")) {
            if (li.id === bid) {
                item = li;
            }
            tx.store.add({ id: li.id, html: li.outerHTML });
        }
        await tx.done;
    }
    else {
        const parser = new DOMParser();
        const doc = parser.parseFromString(itemEntry.html, "text/html");
        item = doc.getElementById(bid);
    }
    if (item) {
        // fix the image URL
        const img = item.querySelector("img");
        img.setAttribute("src", prefix + img.getAttribute("src"));
        // fix the link URL
        const link = item.querySelector("a");
        link.setAttribute("href", prefix + link.getAttribute("href"));
        // add the favorites indicator
        if (state_1.default.fav.bookIds.indexOf(bid) >= 0) {
            item.classList.add("F");
        }
    }
    return item;
}
let ids;
// keep track of the ids we have shown
const displayedIds = [];
let page = 0;
async function find() {
    if (state_1.default.mode === "choose" || state_1.default.mode === "edit") {
        ids = new BookSet_1.ArraySet(state_1.default.fav.bookIds);
    }
    else {
        const terms = getQueryTerms();
        terms.push("AllAvailable");
        if (state_1.default.category) {
            terms.push(state_1.default.category);
        }
        if (state_1.default.audience == "C") {
            terms.push("CAUTION");
        }
        let tsets = await Promise.all(terms.map(getIndexForTerm));
        ids = tsets.reduce((p, c) => {
            if (!p) {
                return c;
            }
            else if (!c) {
                return p;
            }
            return new BookSet_1.Intersection(p, c);
        });
        if (state_1.default.reviewed) {
            ids = new BookSet_1.Limit(ids, config.lastReviewed);
        }
        if (state_1.default.audience == "E") {
            const caution = await getIndexForTerm("CAUTION");
            ids = new BookSet_1.Difference(ids, caution);
        }
    }
    displayedIds.length = 0;
    if (location.hash) {
        const backFrom = location.hash.slice(1);
        console.log("skipping to", backFrom);
        // configure things so we're on the page with the current book
        while (1) {
            let id = "";
            for (let i = 0; i < state_1.default.booksPerPage; i++) {
                id = ids.next();
                if (!id) {
                    break;
                }
                displayedIds.push(id);
            }
            if (displayedIds[displayedIds.length - 1] >= backFrom)
                break;
        }
        page = Math.max(0, Math.floor(displayedIds.length / state_1.default.booksPerPage) - 1);
    }
    return render();
}
async function render() {
    // clear the old ones from the page
    const list = document.querySelector("ul");
    let last;
    while ((last = list.lastChild))
        list.removeChild(last);
    // determine where to start
    let offset = page * state_1.default.booksPerPage;
    for (let i = 0; i < state_1.default.booksPerPage + 1; i++) {
        const o = i + offset;
        const bid = displayedIds[o] || ids.next();
        if (!bid) {
            break;
        }
        displayedIds[o] = bid;
        if (i >= state_1.default.booksPerPage) {
            break;
        }
        const book = await getBookCover(bid);
        list.appendChild(book);
    }
    state_1.default.persist();
    // visibility of back and next buttons
    document.querySelector("#back").classList.toggle("hidden", page <= 0);
    document
        .querySelector("#next")
        .classList.toggle("hidden", !displayedIds[(page + 1) * state_1.default.booksPerPage]);
}
function updateState() {
    const form = document.querySelector("form");
    state_1.default.search = form.search.value;
    state_1.default.reviewed = form.reviewed.value == "R";
    state_1.default.category = form.category.value;
    state_1.default.audience = form.audience.value;
}
function updateControls(form) { }
/* allow switch (keyboard) selection of books */
function moveToNext() {
    // get the currently selected if any
    let selected = document.querySelector(".selected");
    // get all the items we can select
    const selectable = document.querySelectorAll("li, a#back:not(.hidden), a#next:not(.hidden)");
    // assume the first
    let next = 0;
    // if was selected, unselect it and compute the index of the next one
    if (selected) {
        selected.classList.remove("selected");
        next = ([].indexOf.call(selectable, selected) + 1) % selectable.length;
    }
    selected = selectable[next];
    // mark the new one selected
    selected.classList.add("selected");
    // make sure it is visible
    selected.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
    });
    const h1 = selected.querySelector("h1");
    if (h1) {
        speech_1.default(h1.innerText);
    }
    else {
        speech_1.default(selected.innerText);
    }
}
/* click the currently selected link */
function activateCurrent(e) {
    const selected = document.querySelector(".selected a, a.selected");
    if (selected) {
        e.preventDefault();
        selected.click();
    }
}
/* toggle favorite on currently selected book */
function toggleFavorite(selected) {
    if (selected) {
        const bid = selected.id;
        const ndx = state_1.default.fav.bookIds.indexOf(bid);
        if (ndx >= 0) {
            state_1.default.fav.bookIds.splice(ndx, 1);
            selected.classList.remove("F");
        }
        else {
            state_1.default.fav.bookIds.push(bid);
            state_1.default.fav.bookIds.sort();
            selected.classList.add("F");
        }
        state_1.default.persist();
    }
}
async function init() {
    /* restore page and text color */
    document.documentElement.style.setProperty("--page-color", state_1.default.pageColor);
    document.documentElement.style.setProperty("--text-color", state_1.default.textColor);
    document.body.setAttribute("data-buttonsize", state_1.default.buttonSize);
    /* fetch configuration for the content */
    config = await (await fetch("content/config.json")).json();
    /* register service worker. */
    registerServiceWorker();
    const form = document.querySelector("form");
    if (form) {
        if (state_1.default.mode !== "edit")
            state_1.default.mode = "find";
        /* handle searches */
        form.addEventListener("submit", e => {
            e.preventDefault();
            updateState();
            state_1.default.mode = "find";
            state_1.default.persist();
            find();
        });
        /* restore the search form values */
        form.search.value = state_1.default.search;
        form.reviewed.value = state_1.default.reviewed ? "R" : "";
        form.category.value = state_1.default.category;
        form.audience.value = state_1.default.audience;
    }
    else {
        state_1.default.mode = "choose";
        document.querySelector("h1.title").innerHTML = state_1.default.fav.name;
    }
    /* enable stepping through pages of results */
    document.querySelector("#next").addEventListener("click", e => {
        e.preventDefault();
        e.target.classList.remove("selected");
        page += 1;
        render();
    });
    document.querySelector("#back").addEventListener("click", e => {
        e.preventDefault();
        e.target.classList.remove("selected");
        page -= 1;
        render();
    });
    /* enable swiping through results */
    swipe_1.default(direction => {
        const selector = direction == "right" ? "a.back:not(.hidden)" : "a.next:not(.hidden)";
        const link = document.querySelector(selector);
        if (link)
            link.click();
    });
    /* switch control based on keys */
    window.addEventListener("keydown", e => {
        const t = e.target;
        if (t.matches("input,select,button")) {
            return;
        }
        if (e.key == "ArrowRight" || e.key == "Space") {
            e.preventDefault();
            moveToNext();
        }
        else if (e.key == "ArrowLeft" || e.key == "Enter") {
            activateCurrent(e);
        }
        else if (e.key == "f" && state_1.default.mode == "find") {
            const selected = document.querySelector("li.selected");
            toggleFavorite(selected);
        }
    });
    /* toggle favorite using the mouse in favorite selection mode */
    document.querySelector("#list").addEventListener("click", e => {
        const t = e.target;
        if (t.matches("#list li")) {
            toggleFavorite(t);
        }
    });
    /* toggle favorite selection mode */
    const heart = document.querySelector("#heart");
    if (heart) {
        heart.addEventListener("click", e => {
            document.body.classList.toggle("hearts");
        });
    }
    find();
}
window.addEventListener("load", init);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stem", function() { return stem; });
/**
 * Snowball (Porter2) stemming algorithm.
 *
 * http://snowball.tartarus.org/algorithms/english/stemmer.html
 */
// Exceptional forms
var EXCEPTIONAL_FORMS4 = {
    "skis": "ski",
    "idly": "idl",
    "ugly": "ugli",
    "only": "onli",
    "news": "news",
    "howe": "howe",
    "bias": "bias",
};
var EXCEPTIONAL_FORMS5 = {
    "skies": "sky",
    "dying": "die",
    "lying": "lie",
    "tying": "tie",
    "early": "earli",
    "atlas": "atlas",
    "andes": "andes",
};
var EXCEPTIONAL_FORMS6 = {
    "gently": "gentl",
    "singly": "singl",
    "cosmos": "cosmos",
};
// Exceptional forms post 1a step
var EXCEPTIONAL_FORMS_POST_1A = {
    "inning": 0,
    "outing": 0,
    "canning": 0,
    "herring": 0,
    "earring": 0,
    "proceed": 0,
    "exceed": 0,
    "succeed": 0,
};
var RANGE_RE = /[^aeiouy]*[aeiouy]+[^aeiouy](\w*)/;
var EWSS1_RE = /^[aeiouy][^aeiouy]$/;
var EWSS2_RE = /.*[^aeiouy][aeiouy][^aeiouywxY]$/;
function isEndsWithShortSyllable(word) {
    if (word.length === 2) {
        return EWSS1_RE.test(word);
    }
    return EWSS2_RE.test(word);
}
// Capitalize consonant regexp
var CCY_RE = /([aeiouy])y/g;
var S1A_RE = /[aeiouy]./;
function step1bHelper(word, r1) {
    if (word.endsWith("at") || word.endsWith("bl") || word.endsWith("iz")) {
        return word + "e";
    }
    // double ending
    var l0 = word.charCodeAt(word.length - 1);
    // /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/
    if (l0 === word.charCodeAt(word.length - 2) &&
        (l0 === 98 ||
            l0 === 100 || l0 === 102 ||
            l0 === 103 || l0 === 109 ||
            l0 === 110 || l0 === 112 ||
            l0 === 114 || l0 === 116)) {
        return word.slice(0, -1);
    }
    // is short word
    if (r1 === word.length && isEndsWithShortSyllable(word)) {
        return word + "e";
    }
    return word;
}
var S1BSUFFIXES_RE = /(ed|edly|ing|ingly)$/;
var S1B_RE = /[aeiouy]/;
function step1b(word, r1) {
    if (word.endsWith("eedly")) {
        if (word.length - 5 >= r1) {
            return word.slice(0, -3);
        }
        return word;
    }
    if (word.endsWith("eed")) {
        if (word.length - 3 >= r1) {
            return word.slice(0, -1);
        }
        return word;
    }
    var match = S1BSUFFIXES_RE.exec(word);
    if (match) {
        var preceding = word.slice(0, -match[0].length);
        if (word.length > 1 && S1B_RE.test(preceding)) {
            return step1bHelper(preceding, r1);
        }
    }
    return word;
}
function step2Helper(word, r1, end, repl, prev) {
    if (word.endsWith(end)) {
        if ((word.length - end.length) >= r1) {
            var w = word.slice(0, -end.length);
            if (prev === null) {
                return w + repl;
            }
            for (var i = 0; i < prev.length; i++) {
                var p = prev[i];
                if (w.endsWith(p)) {
                    return w + repl;
                }
            }
        }
        return word;
    }
    return null;
}
var S2_TRIPLES = [
    ["enci", "ence", null],
    ["anci", "ance", null],
    ["abli", "able", null],
    ["izer", "ize", null],
    ["ator", "ate", null],
    ["alli", "al", null],
    ["bli", "ble", null],
    ["ogi", "og", ["l"]],
    ["li", "", ["c", "d", "e", "g", "h", "k", "m", "n", "r", "t"]],
];
var S2_TRIPLES5 = [
    ["ization", "ize", null],
    ["ational", "ate", null],
    ["fulness", "ful", null],
    ["ousness", "ous", null],
    ["iveness", "ive", null],
    ["tional", "tion", null],
    ["biliti", "ble", null],
    ["lessli", "less", null],
    ["entli", "ent", null],
    ["ation", "ate", null],
    ["alism", "al", null],
    ["aliti", "al", null],
    ["ousli", "ous", null],
    ["iviti", "ive", null],
    ["fulli", "ful", null],
].concat(S2_TRIPLES);
function step2(word, r1) {
    var triples = (word.length > 6) ? S2_TRIPLES5 : S2_TRIPLES;
    for (var i = 0; i < triples.length; i++) {
        var trip = triples[i];
        var attempt = step2Helper(word, r1, trip[0], trip[1], trip[2]);
        if (attempt !== null) {
            return attempt;
        }
    }
    return word;
}
function step3Helper(word, r1, r2, end, repl, r2_necessary) {
    if (word.endsWith(end)) {
        if (word.length - end.length >= r1) {
            if (!r2_necessary) {
                return word.slice(0, -end.length) + repl;
            }
            else if (word.length - end.length >= r2) {
                return word.slice(0, -end.length) + repl;
            }
        }
        return word;
    }
    return null;
}
var S3_TRIPLES = [
    { a: "ational", b: "ate", c: false },
    { a: "tional", b: "tion", c: false },
    { a: "alize", b: "al", c: false },
    { a: "icate", b: "ic", c: false },
    { a: "iciti", b: "ic", c: false },
    { a: "ative", b: "", c: true },
    { a: "ical", b: "ic", c: false },
    { a: "ness", b: "", c: false },
    { a: "ful", b: "", c: false },
];
function step3(word, r1, r2) {
    for (var i = 0; i < S3_TRIPLES.length; i++) {
        var trip = S3_TRIPLES[i];
        var attempt = step3Helper(word, r1, r2, trip.a, trip.b, trip.c);
        if (attempt !== null) {
            return attempt;
        }
    }
    return word;
}
var S4_DELETE_LIST = ["al", "ance", "ence", "er", "ic", "able", "ible", "ant", "ement", "ment", "ent", "ism", "ate",
    "iti", "ous", "ive", "ize"];
function step4(word, r2) {
    for (var i = 0; i < S4_DELETE_LIST.length; i++) {
        var end = S4_DELETE_LIST[i];
        if (word.endsWith(end)) {
            if (word.length - end.length >= r2) {
                return word.slice(0, -end.length);
            }
            return word;
        }
    }
    if ((word.length - 3) >= r2) {
        var l = word.charCodeAt(word.length - 4);
        if ((l === 115 || l === 116) && word.endsWith("ion")) { // s === 115 , t === 116
            return word.slice(0, -3);
        }
    }
    return word;
}
var NORMALIZE_YS_RE = /Y/g;
function stem(word) {
    var l;
    var match;
    var r1;
    var r2;
    if (word.length < 3) {
        return word;
    }
    // remove initial apostrophe
    if (word.charCodeAt(0) === 39) { // "'" === 39
        word = word.slice(1);
    }
    // handle exceptional forms
    if (word === "sky") {
        return word;
    }
    else if (word.length < 7) {
        if (word.length === 4) {
            if (EXCEPTIONAL_FORMS4.hasOwnProperty(word)) {
                return EXCEPTIONAL_FORMS4[word];
            }
        }
        else if (word.length === 5) {
            if (EXCEPTIONAL_FORMS5.hasOwnProperty(word)) {
                return EXCEPTIONAL_FORMS5[word];
            }
        }
        else if (word.length === 6) {
            if (EXCEPTIONAL_FORMS6.hasOwnProperty(word)) {
                return EXCEPTIONAL_FORMS6[word];
            }
        }
    }
    // capitalize consonant ys
    if (word.charCodeAt(0) === 121) { // "y" === 121
        word = "Y" + word.slice(1);
    }
    word = word.replace(CCY_RE, "$1Y");
    // r1
    if (word.length > 4 && (word.startsWith("gener") || word.startsWith("arsen"))) {
        r1 = 5;
    }
    else if (word.startsWith("commun")) {
        r1 = 6;
    }
    else {
        match = RANGE_RE.exec(word);
        r1 = (match) ? word.length - match[1].length : word.length;
    }
    // r2
    match = RANGE_RE.exec(word.slice(r1));
    r2 = match ? word.length - match[1].length : word.length;
    // step 0
    if (word.charCodeAt(word.length - 1) === 39) { // "'" === 39
        if (word.endsWith("'s'")) {
            word = word.slice(0, -3);
        }
        else {
            word = word.slice(0, -1);
        }
    }
    else if (word.endsWith("'s")) {
        word = word.slice(0, -2);
    }
    // step 1a
    if (word.endsWith("sses")) {
        word = word.slice(0, -4) + "ss";
    }
    else if (word.endsWith("ied") || word.endsWith("ies")) {
        word = word.slice(0, -3) + ((word.length > 4) ? "i" : "ie");
    }
    else if (word.endsWith("us") || word.endsWith("ss")) {
        word = word;
    }
    else if (word.charCodeAt(word.length - 1) === 115) { // "s" == 115
        var preceding = word.slice(0, -1);
        if (S1A_RE.test(preceding)) {
            word = preceding;
        }
    }
    // handle exceptional forms post 1a
    if ((word.length === 6 || word.length === 7) && EXCEPTIONAL_FORMS_POST_1A.hasOwnProperty(word)) {
        return word;
    }
    word = step1b(word, r1);
    // step 1c
    if (word.length > 2) {
        l = word.charCodeAt(word.length - 1);
        if (l === 121 || l === 89) {
            l = word.charCodeAt(word.length - 2);
            // "a|e|i|o|u|y"
            if (l < 97 || l > 121 || (l !== 97 && l !== 101 && l !== 105 && l !== 111 && l !== 117 && l !== 121)) {
                word = word.slice(0, -1) + "i";
            }
        }
    }
    word = step2(word, r1);
    word = step3(word, r1, r2);
    word = step4(word, r2);
    // step 5
    l = word.charCodeAt(word.length - 1);
    if (l === 108) { // l = 108
        if (word.length - 1 >= r2 && word.charCodeAt(word.length - 2) === 108) { // l === 108
            word = word.slice(0, -1);
        }
    }
    else if (l === 101) { // e = 101
        if (word.length - 1 >= r2) {
            word = word.slice(0, -1);
        }
        else if (word.length - 1 >= r1 && !isEndsWithShortSyllable(word.slice(0, -1))) {
            word = word.slice(0, -1);
        }
    }
    // normalize Ys
    word = word.replace(NORMALIZE_YS_RE, "y");
    return word;
}
//# sourceMappingURL=index.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Experiment with a class to represent sets of books */
Object.defineProperty(exports, "__esModule", { value: true });
/* incrementally computes the intersection of two sets */
class Intersection {
    constructor(A, B) {
        this.A = A;
        this.B = B;
    }
    /* a helper to advance both sequences until they match */
    align(a, b) {
        while (a && b && a != b) {
            if (a < b) {
                a = this.A.skipTo(b);
            }
            else {
                b = this.B.skipTo(a);
            }
        }
        return (a && b) || '';
    }
    next() {
        /* we know we can call next on both because they must have matched
         * last time */
        let a = this.A.next();
        let b = this.B.next();
        return this.align(a, b);
    }
    skipTo(v) {
        let a = this.A.skipTo(v);
        let b = this.B.skipTo(a);
        return this.align(a, b);
    }
}
exports.Intersection = Intersection;
/* incrementally computes the values in A that are not in B */
class Difference {
    constructor(A, B) {
        this.A = A;
        this.B = B;
    }
    next() {
        let a = this.A.next();
        let b = this.B.skipTo(a);
        while (a && b && a == b) {
            a = this.A.next();
            b = this.B.skipTo(a);
        }
        return a;
    }
    skipTo(v) {
        let a = this.A.skipTo(v);
        let b = this.B.skipTo(a);
        while (a && b && a == b) {
            a = this.A.next();
            b = this.B.skipTo(a);
        }
        return a;
    }
}
exports.Difference = Difference;
class Limit {
    constructor(A, limit) {
        this.A = A;
        this.limit = limit;
    }
    next() {
        const r = this.A.next();
        return r <= this.limit ? r : "";
    }
    skipTo(v) {
        const r = this.A.skipTo(v);
        return r <= this.limit ? r : "";
    }
}
exports.Limit = Limit;
const code = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
class RangeSet {
    constructor(start, stop, digits, base) {
        this.start = start;
        this.stop = stop;
        this.digits = digits;
        this.base = base;
    }
    next() {
        if (!this.current) {
            this.current = this.start;
            return this.current;
        }
        this.current = this.encode(this.decode(this.current) + 1);
        if (this.current > this.stop) {
            return '';
        }
        return this.current;
    }
    skipTo(v) {
        if (v < this.start) {
            v = this.start;
        }
        this.current = v;
        if (v > this.stop) {
            return '';
        }
        return v;
    }
    encode(n) {
        let r = new Array(this.digits);
        for (let i = 0; i < this.digits; i++) {
            r[2 - i] = code[n % this.base];
            n = (n / this.base) | 0;
        }
        return r.join('');
    }
    decode(s) {
        let r = 0;
        for (let i = 0; i < this.digits; i++) {
            r = r * this.base + code.indexOf(s[i]);
        }
        return r;
    }
}
exports.RangeSet = RangeSet;
class StringSet {
    constructor(values, digits) {
        this.values = values;
        this.digits = digits;
        this.index = -digits;
    }
    next() {
        this.index += this.digits;
        return this.values.slice(this.index, this.index + this.digits);
    }
    skipTo(t) {
        let c, i = Math.max(0, this.index), v = this.values, d = this.digits;
        while ((c = v.slice(i, i + d)) && c < t) {
            i += d;
        }
        this.index = i;
        return c;
    }
}
exports.StringSet = StringSet;
class ArraySet {
    constructor(values) {
        this.values = values;
        this.index = -1;
    }
    next() {
        this.index += 1;
        return this.values[this.index];
    }
    skipTo(t) {
        let c, i = Math.max(0, this.index), v = this.values;
        while ((c = v[i]) && c < t) {
            i += 1;
        }
        this.index = i;
        return c;
    }
}
exports.ArraySet = ArraySet;


/***/ })
/******/ ]);