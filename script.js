let myInt;
let myInt2;
let inPlay = false;
const qs = (...args) => document.querySelector(...args);

function playSound() {
  qs('audio').play();
}

function toTime(m) {
  let mins = Math.floor(m);
  let secs = (m - mins) * 60;
  if (mins < 10) mins = "0" + mins.toString();
  if (secs < 10) secs = "0" + secs.toString();
  return mins + ":" + secs;
}

function pause() {
  inPlay = false;
  playSound();
}

function resume() {
  inPlay = true;
  playSound();
}

function subTime(time) {
  const arr = time.split(":");
  let seconds = arr[1];
  let mins = arr[0];
  seconds--;
  if (seconds < 0) {
    seconds = 59;
    mins--;
  }
  if (seconds < 10) seconds = "0" + seconds;
  let ntime = mins.toString() + ":" + seconds.toString();
  if (ntime == "-1:59") ntime = "00:00";
  return ntime;
}

const bl = qs("#bl");
const sl = qs("#sl");
const p = qs("#progress");

function ce(event) {
  if (event.keyCode == 13) go();
}

function go() {
  clean();
  playSound();
  p.innerHTML =
    `<p><i class="material-icons">work</i> Session:</p>
    <div class="mdl-progress mdl-js-progress" id="prog"></div>
    <p class="mt-3">
      <span id="time">${toTime(sl.value)}</span> 
      time left
    </p>`;
  componentHandler.upgradeElement(qs("#prog"));
  let secs = 1;
  myInt = setInterval(function() {
    if (inPlay) {
      qs("#time").innerHTML = subTime(qs("#time").innerHTML);
      qs("#prog").MaterialProgress.setProgress((secs / (sl.value * 60)) * 100);
      if (secs <= sl.value * 60) {
        secs++;
      } else {
        secs = 1;
        qs("#prog").MaterialProgress.setProgress(0);
        clearInterval(myInt);
        doBreak();
      }
    }
  }, 1000);
}

function clean() {
  clearInterval(myInt);
  clearInterval(myInt2);
  qs("#sl").disabled = true;
  qs("#bl").disabled = true;
  resume();
}

function doBreak() {
  clean();
  playSound();
  p.innerHTML =
    `<p><i class="material-icons">free_breakfast</i> Break!</p>
    <div class="mdl-progress mdl-js-progress" id="prog"></div>
    <p class="mt-3">
      <span id="time">${toTime(bl.value)}</span> 
      time left
    </p>`;
  componentHandler.upgradeElement(qs("#prog"));
  let secs = 1;
  myInt2 = setInterval(function() {
    if (inPlay) {
      qs("#time").innerHTML = subTime(qs("#time").innerHTML);
      qs("#prog").MaterialProgress.setProgress((secs / (bl.value * 60)) * 100);
      if (secs <= bl.value * 60) {
        secs++;
      } else {
        secs = 1;
        qs("#prog").MaterialProgress.setProgress(0);
        clearInterval(myInt2);
        go();
      }
    }
  }, 1000);
};

function stop() {
  playSound();
  clearInterval(myInt);
  clearInterval(myInt2);
  qs("#sl").disabled = false;
  qs("#bl").disabled = false;
  qs('#progress').innerHTML = '';
  inPlay = false;
}

let settingsBtn = qs('.settings-button');
let dialog = qs('dialog');

if (!dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}

settingsBtn.addEventListener('click', function() {
  dialog.showModal();
});

if (localStorage.getItem('session-length')) {
  qs('#sl').value = localStorage.getItem('session-length');
}

if (localStorage.getItem('break-length')) {
  qs('#bl').value = localStorage.getItem('break-length');
}

dialog.querySelector('button').addEventListener('click', function() {
  localStorage.setItem('session-length', qs('#sl').value);
  localStorage.setItem('break-length', qs('#bl').value);
  dialog.close();
});

document.addEventListener('DOMContentLoaded', function() {
  let searchParams = new URLSearchParams(location.search);

  if (searchParams.get('pomo')) {
    qs('h3').innerText = searchParams.get('pomo');
    go();
  }
});