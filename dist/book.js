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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* code used in each book */
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = __webpack_require__(0);
const swipe_1 = __webpack_require__(2);
const speech_1 = __webpack_require__(1);
window.addEventListener("load", () => {
    /* restore page and text color */
    document.documentElement.style.setProperty("--page-color", state_1.default.pageColor);
    document.documentElement.style.setProperty("--text-color", state_1.default.textColor);
    document.body.setAttribute("data-buttonsize", state_1.default.buttonSize);
    /* fix the links back to point to the find page.
     * should this be conditional on coming from there?
     */
    const bid = document.body.id;
    const backTo = (state_1.default.mode == "find" ? "../../find.html" : "../../choose.html") +
        "#" +
        bid;
    document
        .querySelectorAll("a[href^='./']")
        .forEach((link) => (link.href = backTo));
    /* make sure we have a page number so it isn't just blank */
    if (!location.hash) {
        location.hash = "#p1";
    }
    /* allow switch (keyboard) selection of links */
    function moveToNext() {
        // get the currently selected if any
        const selected = document.querySelector(".selected");
        // get all the items we can select
        const selectable = document.querySelectorAll("section:target a");
        // assume the first
        let next = 0;
        // if was selected, unselect it and compute the index of the next one
        if (selected) {
            selected.classList.remove("selected");
            next = ([].indexOf.call(selectable, selected) + 1) % selectable.length;
        }
        // mark the new one selected
        selectable[next].classList.add("selected");
    }
    /* click the currently selected link */
    function activateCurrent() {
        const selected = document.querySelector("a.selected");
        if (selected) {
            selected.click();
        }
    }
    /* Allow reading the book with switches */
    window.addEventListener("keydown", e => {
        if (e.key == "ArrowRight" || e.key == "Space") {
            // next page or next menu item
            e.preventDefault();
            const next = document.querySelector("section:target a.next");
            if (next) {
                next.click();
            }
            else {
                moveToNext();
            }
        }
        else if (e.key == "ArrowLeft" || e.key == "Enter") {
            // back one page or activate menu
            e.preventDefault();
            const back = document.querySelector("section:target a.back");
            if (back) {
                back.click();
            }
            else {
                activateCurrent();
            }
        }
    });
    /* allow paging through with swipes */
    swipe_1.default(direction => {
        const selector = direction == "right" ? "section:target a.back" : "section:target a.next";
        const link = document.querySelector(selector);
        if (link)
            link.click();
    });
    /* speak the text on the page */
    function read() {
        const node = document.querySelector("section:target h1, section:target p");
        console.log("node", node);
        if (node) {
            const text = node.innerText;
            console.log("text", text);
            speech_1.default(text);
        }
    }
    /* speak the text when the hash changes */
    window.addEventListener("hashchange", read);
    read();
});


/***/ })
/******/ ]);