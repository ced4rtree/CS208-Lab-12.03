addEventListener("DOMContentLoaded", () => {
    const todoItems = document.querySelectorAll(".task-container");
    todoItems.forEach(todo => {
        enableEditingFor(todo);
        enableCompletionFor(todo);
        enableDeletionFor(todo);
    });

    // allow user to start typing a new task without having to select the actual
    // input field
    const taskInputField = document.querySelector("#task");
    taskInputField.focus();
});

function getTodoId(todo) {
    return todo.querySelector('.task-id').value;
}

function sendPost(url, body) {
    fetch(url, {
        method: 'POST',
        body: new URLSearchParams(body)
    }).then(res => {
        if (res.redirected) {
            window.location.href = res.url;
        }
    });
}

const enableDeletionFor = todo => {
    const taskId = getTodoId(todo);
    const deleteButton = todo.querySelector(".delete-btn");

    deleteButton.addEventListener("click", () => {
        sendPost("/delete", { id: taskId });
    });
}

const enableCompletionFor = todo => {
    const completionToggle = todo.querySelector(".completion-toggle");
    const taskNameElement = todo.querySelector(".task-name");
    const taskId = getTodoId(todo);

    completionToggle.addEventListener("change", event => {
        if (taskNameElement) {
            if (event.target.checked) {
                taskNameElement.classList.add("completed");
            } else {
                taskNameElement.classList.remove("completed");
            }
        }

        console.log(typeof event.target.checked);
        sendPost('/set-completion', {
            id: taskId,
            completed: event.target.checked
        });
    });
}

const enableEditingFor = todo => {
    const taskNameElement = todo.querySelector(".task-name");
    const editBtn = todo.querySelector(".edit-btn");

    const taskInputElement = document.createElement("input");
    taskInputElement.value = taskNameElement.innerText;

    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";

    const confirmBtn = document.createElement("button");
    confirmBtn.innerHTML = "Confirm";

    const taskId = getTodoId(todo);

    // cancel should return us to our original page, restore edit button
    // & non-input task name
    cancelBtn.addEventListener("click", () => {
        todo.insertBefore(editBtn, cancelBtn);
        cancelBtn.remove();
        confirmBtn.remove();

        todo.insertBefore(taskNameElement, taskInputElement);
        taskInputElement.remove();
    })

    // confirm should just update the database; this POST request
    // redirects us back to the main page so resetting page state is
    // handled smoothly
    const confirmNewTask = () => {
        if (taskInputElement.value !== "") {
            sendPost('/update-task', {
                newName: taskInputElement.value,
                id: taskId
            });
        }
    };
    confirmBtn.addEventListener("click", confirmNewTask)

    editBtn.addEventListener("click", () => {
        // enable the user to change the task name after hitting the edit button
        todo.insertBefore(taskInputElement, taskNameElement);
        taskNameElement.remove();

        // change the edit button to cancel/confirm buttons
        todo.insertBefore(confirmBtn, editBtn);
        todo.insertBefore(cancelBtn, editBtn);
        editBtn.remove();

        taskInputElement.focus();
    })

    taskInputElement.addEventListener("keydown", event => {
        if (event.key === 'Enter') {
            confirmNewTask();
        }
    })
}
