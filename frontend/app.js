const api = "http://localhost:3000/api/todos";
const list = document.querySelector(".todo-list");
const addBtn = document.querySelector(".add span");

/**
 * Get TODOs List
 */
const getList = () => {
  fetch(api)
    .then((data) => data.json())
    .then((data) => {
      data.forEach((li) => createListElements(li));
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Create the List Elements and add the Click Event
 *
 * @param {*} todo Get the Todo from the Server
 */
const createListElements = (todo) => {
  let li = document.createElement("li");
  let textArea = document.createElement("textarea");
  let span = document.createElement("span");
  let i = document.createElement("i");

  i.classList.add("fas");

  if (todo.isDone) {
    textArea.classList.add("todo-done-text");
    textArea.disabled = true;
    i.classList.add("fa-trash");
    span.classList.add("todo-remove");
  } else {
    i.classList.add("fa-check");
    span.classList.add("todo-done");
  }

  textArea.addEventListener("input", editTodo);

  li.appendChild(textArea);
  span.appendChild(i);
  li.appendChild(span);

  span.setAttribute("id", todo._id);
  textArea.textContent = todo.desc;

  span.addEventListener("click", handleSpanEvents);

  list.appendChild(li);
};

/**
 * Get the target ID and the span for we know if is to remove or not
 *
 * @param {*} e Element Span or I
 * @returns Object with the ID and Span Class
 */
const getTargetObject = (e) => {
  const { tagName } = e.target;

  if (tagName === "SPAN") {
    return { id: e.target.getAttribute("id"), class: e.target.classList[0] };
  } else if (tagName === "I") {
    return {
      id: e.target.parentElement.getAttribute("id"),
      class: e.target.parentElement.classList[0],
    };
  }
};

/**
 * Function to delete, set TODO as done or Edit
 *
 * @param {*} e Element TODO
 */
const handleSpanEvents = (e) => {
  const obj = getTargetObject(e);

  // Mark as Done
  if (obj.class === "todo-done") {
    fetch(`${api}/isDone/${obj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((resp) => {
        if (resp.message) {
          console.log(resp.message);
        }
        reload();
      })
      .catch((err) => console.log(err));
  }
  // Delete
  else if (obj.class === "todo-remove") {
    fetch(`${api}/${obj.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((resp) => {
        if (resp.message) {
          console.log(resp.message);
        }
        reload();
      })
      .catch((err) => console.log(err));
  }
  // Edit
  else if (obj.class === "todo-edit") {
    // Verify the element
    if (e.target.parentElement.tagName === "LI") {
      obj.desc = e.target.parentElement.childNodes[0].value;
    } else if (e.target.parentElement.tagName === "SPAN") {
      obj.desc = e.target.parentElement.parentElement.childNodes[0].value;
    }

    fetch(`${api}/${obj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ desc: obj.desc }),
    })
      .then((data) => data.json())
      .then((resp) => {
        if (resp.message) {
          console.log(resp.message);
        }
        reload();
      })
      .catch((err) => console.log(err));
  }
};

/**
 * Function to reload the Lists without refresh the page
 */
const reload = () => {
  list.innerHTML = "";
  getList();
};

/**
 * Function to change the styles on the button when a textarea is edited
 *
 * @param {*} e
 */
const editTodo = (e) => {
  e.target.parentElement.childNodes[1].classList.remove("todo-done");
  e.target.parentElement.childNodes[1].classList.add("todo-edit");

  e.target.parentElement.childNodes[1].childNodes[0].classList.remove(
    "fa-check"
  );
  e.target.parentElement.childNodes[1].childNodes[0].classList.add(
    "fa-pencil-alt"
  );
};

const addTodo = (e) => {
  const obj = { desc: "" };

  if (e.target.tagName === "SPAN") {
    obj.desc = e.target.parentElement.childNodes[1].value;
  } else if (e.target.tagName === "I") {
    obj.desc = e.target.parentElement.parentElement.childNodes[1].value;
  }

  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ desc: obj.desc }),
  })
    .then((data) => data.json())
    .then((resp) => {
      if (resp.message) {
        console.log(resp.message);
      }
      reload();
    })
    .catch((err) => console.log(err.message));
};

/**
 * Function to call functions on the start
 */
const run = () => {
  getList();

  addBtn.addEventListener("click", addTodo);
};

run();
