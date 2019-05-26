/////////////////////////
////       PWA       ////
/////////////////////////

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(event) {
  event.preventDefault();
  deferredPrompt = event;
  console.log('beforeinstallprompt fired');
  document.querySelector('#addHomeScreen').style.display = 'block';
});
