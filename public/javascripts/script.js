addEventListener("DOMContentLoaded", () => {
    const todoItems = document.querySelectorAll("li");
    todoItems.forEach(todo => {
        enableEditingFor(todo);
    });
});

const enableEditingFor = todo => {
    const taskNameElement = todo.querySelector(".task-name");
    const editBtn = todo.querySelector(".edit-btn");

    const taskInputElement = document.createElement("input");
    taskInputElement.value = taskNameElement.innerText;

    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";

    const confirmBtn = document.createElement("button");
    confirmBtn.innerHTML = "Confirm";

    const taskId = todo.querySelector('.task-id').value;

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
    let confirmNewTask = () => {
        fetch("/update-task", {
            method: "POST",
            body: new URLSearchParams({
                newName: taskInputElement.value,
                id: taskId
            })
        }).then(res => {
            if (res.redirected) {
                window.location.href = res.url;
            }
        });
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
