document.addEventListener('DOMContentLoaded', function() {
  let qs = (...args) => document.querySelector(...args);
  let addBtn = qs('.add-button');
  let todoUL = qs('.todos');
  let todos = [];
  let addDialog = qs('.add-dialog');
  let delIndex = -1;
  let delDialog = qs('.del-dialog');
  let editIndex = -1;
  let editDialog = qs('.edit-dialog');

  if (!addDialog.showModal) {
    dialogPolyfill.registerDialog(addDialog);
  }

  if (!delDialog.showModal) {
    dialogPolyfill.registerDialog(delDialog);
  }

  if (!editDialog.showModal) {
    dialogPolyfill.registerDialog(editDialog);
  }

  delDialog.querySelector('.no').addEventListener('click', function() {
    delIndex = -1;
    delDialog.close();
  });


  delDialog.querySelector('.yes').addEventListener('click', function() {
    let li = qs('li[data-index="' + delIndex + '"]');
    li.parentElement.removeChild(li);
    todos.splice(delIndex, 1);
    store();

    delIndex = -1;
    delDialog.close();
  });

  editDialog.querySelector('.cancel').addEventListener('click', function() {
    editIndex = -1;
    editDialog.close();
  });

  editDialog.querySelector('.ok').addEventListener('click', function() {
    let val = editDialog.querySelector('input').value;
    let li = qs('li[data-index="' + editIndex + '"]');
    li.querySelector('.mdl-list__item-primary-content').innerText = val;
    todos[editIndex].val = val;
    store();
    editDialog.querySelector('input').value = '';
    editDialog.close();
  });

  let todoHTML = () => {
    let rand = Math.random();
    return `<span class="mdl-list__item-secondary-action">
  <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-${rand}">
    <input type="checkbox" id="list-checkbox-${rand}" class="mdl-checkbox__input" />
  </label>
</span>
<span class="mdl-list__item-primary-content">
  Todo 1
</span>
<span class="mdl-list__item-secondary-action">
  <button class="mdl-button mdl-js-button mdl-button--icon pom-btn">
    <i class="material-icons">timer</i>
  </button>
</span>
<span class="mdl-list__item-secondary-action">
  <button class="mdl-button mdl-js-button mdl-button--icon del-btn">
    <i class="material-icons">delete</i>
  </button>
</span>
<span class="mdl-list__item-secondary-action">
  <button class="mdl-button mdl-js-button mdl-button--icon edit-btn">
    <i class="material-icons">edit</i>
  </button>
</span>`;
  };

  addBtn.addEventListener('click', function() {
    addDialog.showModal();
  });

  addDialog.querySelector('.cancel').addEventListener('click', function() {
    addDialog.querySelector('input').value = '';
    addDialog.close();
  });

  function makeLi(obj) {
    let li = document.createElement('li');
    li.className = 'mdl-list__item';
    li.innerHTML = todoHTML();
    componentHandler.upgradeElement(li.querySelector('.mdl-checkbox'));
    let checkbox = li.querySelector('[type="checkbox"]');
    checkbox.addEventListener('click', function() {
      todos[+li.dataset.index].done = checkbox.checked;
      store();
    });
    li.querySelector('.mdl-list__item-primary-content').innerText = obj.val;
    li.dataset.index = todos.indexOf(obj);
    li.querySelector('.del-btn').addEventListener('click', function() {
      delIndex = li.dataset.index;
      delDialog.showModal();
    });
    li.querySelector('.edit-btn').addEventListener('click', function() {
      editIndex = li.dataset.index;
      editDialog.querySelector('input').value = obj.val;
      editDialog.showModal();
    });
    li.querySelector('.pom-btn').addEventListener('click', function() {
      location.href = 'index.html?pomo=' + encodeURIComponent(obj.val);
    });
    todoUL.appendChild(li);
    if (obj.done) {
      checkbox.click();
    }
  }

  function store() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  addDialog.querySelector('.add').addEventListener('click', function() {
    let val = addDialog.querySelector('input').value;
    let obj = {val: val, done: false};
    todos.push(obj);
    makeLi(obj);
    store();
    addDialog.querySelector('input').value = '';
    addDialog.close();
  });

  if (localStorage.getItem('todos')) {
    todos = JSON.parse(localStorage.getItem('todos'));
    for (let i = 0; i < todos.length; i++) {
      makeLi(todos[i]);
    }
  }
});
