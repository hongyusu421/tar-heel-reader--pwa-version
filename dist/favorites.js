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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
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

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* implement choosing favorites */
Object.defineProperty(exports, "__esModule", { value: true });
const idb_1 = __webpack_require__(3);
const state_1 = __webpack_require__(0);
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
/* a helper for generating html */
function html(tagName, attributes, ...children) {
    // create the element
    const r = document.createElement(tagName);
    // add the attributes
    for (const key in attributes) {
        // special case for booleans
        if (typeof attributes[key] === "boolean") {
            if (attributes[key]) {
                r.setAttribute(key, "");
            }
        }
        else {
            r.setAttribute(key, attributes[key]);
        }
    }
    // add the children
    children.forEach(child => {
        // special case for strings
        if (typeof child === "string") {
            r.appendChild(document.createTextNode(child));
        }
        else {
            r.appendChild(child);
        }
    });
    return r;
}
/* encapsulate opening the db */
async function openFavorites() {
    return idb_1.openDB("Favorites", 2, {
        upgrade(db) {
            console.log("upgrade");
            const store = db.createObjectStore("favorites", {
                keyPath: "id",
                autoIncrement: true
            });
            store.createIndex("by-name", "name");
        }
    });
}
/* add a favorite to the UL */
function addToList(fav) {
    const list = document.querySelector("#list");
    const checked = fav.id == state_1.default.fav.id;
    const node = html("li", {}, 
    // radio button
    html("input", {
        type: "radio",
        name: "active",
        value: fav.id,
        id: fav.id,
        checked
    }), 
    // list name
    html("label", { for: fav.id }, fav.name), 
    // hidden until renaming
    html("input", {
        type: "text",
        name: "name",
        value: fav.name
    }), 
    // number of books in the set
    ` (${fav.bookIds.length} books)`);
    // move the tools to the active set
    if (checked) {
        node.appendChild(document.querySelector("#tools"));
    }
    list.appendChild(node);
}
/* persist values into the state */
function updateState(fav) {
    state_1.default.fav.id = fav.id;
    state_1.default.fav.bookIds = fav.bookIds;
    state_1.default.fav.name = fav.name;
    state_1.default.persist();
}
/* initialize the page */
async function init() {
    registerServiceWorker();
    const db = await openFavorites();
    // update the favorites from the state
    db.put("favorites", state_1.default.fav);
    // display the favorites
    let cursor = await db.transaction("favorites").store.openCursor();
    while (cursor) {
        const fav = cursor.value;
        addToList(fav);
        cursor = await cursor.continue();
    }
    // move the tools on select
    document.querySelector("#list").addEventListener("change", async (e) => {
        // get the target element
        const t = e.target;
        // get its parent
        const li = t.closest("li");
        // move the tools
        li.appendChild(document.querySelector("#tools"));
        // get the id from the button control
        const input = li.querySelector("input[name=active]");
        const id = parseInt(input.value, 10);
        // get the database
        const db = await openFavorites();
        let fav;
        if (t.matches("input[name=name]")) {
            /* changing the name */
            const tx = db.transaction("favorites", "readwrite");
            fav = await tx.store.get(id);
            fav.name = t.value;
            tx.store.put(fav);
            const label = li.querySelector("label");
            label.innerText = fav.name;
        }
        else {
            /* changing the active set */
            fav = await db.get("favorites", id);
        }
        updateState(fav);
    });
    /* clear renaming if the name input loses focus */
    document.querySelector("#list").addEventListener("focusout", e => {
        const t = e.target;
        if (t.matches("input[name=name]")) {
            for (const node of [...document.querySelectorAll("li.renaming")]) {
                node.classList.remove("renaming");
            }
        }
    });
    /* trigger change in name field if the user hits enter */
    window.addEventListener("keydown", e => {
        if (e.code != "Enter") {
            return;
        }
        const t = e.target;
        if (t.matches("input[name=name]")) {
            t.blur();
        }
    });
    /* read button */
    document.querySelector("#read").addEventListener("click", async (e) => {
        const t = e.target;
        const li = t.closest("li");
        const input = li.querySelector("input[name=active]");
        const id = parseInt(input.value, 10);
        const db = await openFavorites();
        const fav = await db.get("favorites", id);
        updateState(fav);
        location.href = "choose.html";
    });
    /* edit button allows us to add and remove favorites */
    document.querySelector("#edit").addEventListener("click", async (e) => {
        const t = e.target;
        const li = t.closest("li");
        const input = li.querySelector("input[name=active]");
        const id = parseInt(input.value, 10);
        const db = await openFavorites();
        const fav = await db.get("favorites", id);
        updateState(fav);
        state_1.default.mode = "edit";
        state_1.default.persist();
        location.href = "find.html";
    });
    /* new button */
    document.querySelector("#new").addEventListener("click", async (e) => {
        const db = await openFavorites();
        const fav = { name: "New Favorites", bookIds: [] };
        const t = await db.put("favorites", fav);
        fav.id = t;
        updateState(fav);
        addToList(fav);
    });
    /* rename button */
    document.querySelector("#rename").addEventListener("click", e => {
        const t = e.target;
        const li = t.closest("li");
        const input = li.querySelector("input[name=active]");
        const id = parseInt(input.value, 10);
        // show the text input for the new name
        li.classList.add("renaming");
        const name = li.querySelector("input[name=name]");
        // focus it and select the current value
        name.focus();
        name.select();
    });
    /* delete button */
    document.querySelector("#delete").addEventListener("click", async (e) => {
        const t = e.target;
        const li = t.closest("li");
        const input = li.querySelector("input[name=active]");
        const id = parseInt(input.value, 10);
        // delete the set from the db
        const db = await openFavorites();
        await db.delete("favorites", id);
        // move the tools to a safe place
        document.body.appendChild(document.querySelector("#tools"));
        // remove the item from the list
        li.remove();
    });
}
window.addEventListener("load", init);


/***/ }),

/***/ 3:
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




/***/ })

/******/ });