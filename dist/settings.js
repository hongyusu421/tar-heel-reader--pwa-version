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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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

/***/ 1:
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

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = __webpack_require__(0);
const speech_1 = __webpack_require__(1);
function initControl(selector, value, update) {
    const node = document.querySelector(selector);
    if (node) {
        node.value = value;
        node.addEventListener("change", e => {
            update(e.target.value);
            state_1.default.persist();
        });
    }
}
async function populateVoiceList() {
    const voices = await speech_1.getVoices();
    const voiceSelect = document.querySelector("select[name=voices]");
    for (var i = 0; i < voices.length; i++) {
        var option = document.createElement("option");
        option.textContent = voices[i].name + " (" + voices[i].lang + ")";
        if (voices[i].default) {
            option.textContent += " -- DEFAULT";
        }
        option.setAttribute("value", voices[i].name);
        option.setAttribute("data-lang", voices[i].lang);
        option.setAttribute("data-name", voices[i].name);
        voiceSelect.appendChild(option);
    }
}
window.addEventListener("load", () => {
    /* link the controls to the state */
    initControl("input[name=bpp]", "" + state_1.default.booksPerPage, v => {
        const newbpp = parseInt(v);
        state_1.default.booksPerPage = newbpp;
    });
    initControl("select[name=page]", state_1.default.pageColor, v => (state_1.default.pageColor = v));
    initControl("select[name=text]", state_1.default.textColor, v => (state_1.default.textColor = v));
    initControl("select[name=buttons]", state_1.default.buttonSize, v => (state_1.default.buttonSize = v));
    /* setup the voices selector */
    populateVoiceList().then(() => initControl("select[name=voices]", state_1.default.speech.voice, v => (state_1.default.speech.voice = v)));
    /* go back to where we came from */
    document.querySelector("#close").addEventListener("click", () => {
        const backTo = state_1.default.mode == "find" ? "find.html" : "choose.html";
        window.location.href = backTo;
    });
});


/***/ })

/******/ });