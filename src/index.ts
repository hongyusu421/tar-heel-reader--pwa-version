//register sw
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
      navigator.serviceWorker
      .register("sw.js")
      .then(function() {
        console.log("Service worker registered!");
      })
      .catch(err => {
        console.log("Service worker registration failed: " + err);
      });
  }
}

async function init() {
  document.body.classList.add("has-js");
  registerServiceWorker();
}

window.addEventListener("load", init);
