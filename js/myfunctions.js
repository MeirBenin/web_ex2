'use strict';
document.addEventListener('DOMContentLoaded', function () {


    //Database management
    const dataBase = (() => {
        const taskList = [];
        let publicData = {};

        publicData.task = class task {
            constructor(title, description, priority) {
                this.title = title;
                this.description = description;
                this.priority = priority;
            }

            //We get the HTML text
            getHTMLString() {
                let bg = (this.priority) ? "bg-warning" : "bg-info";
                return `<div class=" m-2 card ${bg} bg-opacity-10 ">
                             <div class="d-flex justify-content-between card-header">
                                 <h5  id="title">${this.title}</h5>
                                  <a href="#" class=" btn btn-danger rounded-circle" id = "deleteButton">&#x2715</a>                       
                             </div>   
                             <div class="card-body">
                                 <p class="card-text">${this.description}</p>
                             </div>
                         </div>`;
            }
        }


        //Adding task into the taskList array
        publicData.addTask = function (task) {
            taskList.push(task);
        }

        //Deleting task from taskList array
        publicData.deleteTask = function (task) {
            taskList.splice(taskList.findIndex((element) =>
                element.title.valueOf() === task.title), 1);
        }

        //Sorting the taskList array
        publicData.sortList = function () {
            taskList.sort((a, b) => {
                if (a.title < b.title) return -1
                return a.title > b.title ? 1 : 0
            });
        }

        //Putting the HTML string of the database into an array of HTML in order to display it
        let TaskListHTMLString = function (taskList) {
            let HTMLTaskListString = [];
            for (const element of taskList) {
                HTMLTaskListString.push(element.getHTMLString());
            }
            return HTMLTaskListString;
        }

        //Get HTML of all tasks
        publicData.getTaskListHTMLString = function () {
            return TaskListHTMLString(taskList);
        }

        //Get HTML of "High priority" tasks only
        publicData.getPriorityTaskListHTMLString = function () {
            return TaskListHTMLString(taskList.filter((element) => element.priority));
        }

        publicData.getHTMLTaskString = function (task) {
            return task.getHTMLString();
        }


        //Check if the task we want to add already exists
        publicData.alreadyExists = function (title) {
            // return taskList.includes((element) => element.title.valueOf() === title);
            for (const element of taskList) {
                if (element.title.valueOf() === title)
                    return true;
            }
            return false;
        }
        return publicData;
    })();


    //Adding new task
    const createNewElement = function (fatherElement, className, htmlString) {
        let newElement = document.createElement("div");
        newElement.className = className;
        newElement.innerHTML += htmlString;
        fatherElement.appendChild(newElement);
        newElement.addEventListener(`click`, function () {
            this.remove();
            dataBase.deleteTask(newElement);
        });
    }

    //Empty input validator
    const isEmptyInput = function (input, inputName) {
        if (input === "") {
            createNewElement(document.getElementById(`error`),
                "bg-danger bg-opacity-10",
                `${inputName} cen not be empty`);
            return true
        }
        return false;
    }

    //Clear the board in order to display the tasks after a new action (adding task, sorting tasks, showing high priority tasks,...)
    const removeNodeChildren = function (parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    //Display the HTML task string we got.
    const displayTaskList = function (taskListHtmlString){
        for (const element of taskListHtmlString) {
            createNewElement(document.getElementById(`taskList`), `col-sm-6 col-md-4`, element);
        }
    }

    //remove error msg when user type or delete input
    for (const inputElement of document.querySelectorAll(`input`)) {
        inputElement.addEventListener(`input`, function (){
            removeNodeChildren(document.getElementById(`error`))
        });
    }

    document.getElementById(`add`).addEventListener(`click`, function () {
        //remove error msg
        removeNodeChildren(document.getElementById(`error`));



        //get input
        let titleInput = document.getElementById(`titleInput`);
        let descriptionInput = document.getElementById(`descriptionInput`);
        let priorityInput = document.getElementById(`priorityInput`);

        // validation
        if (isEmptyInput(titleInput.value.trim(), `title`)) return;
        if (dataBase.alreadyExists(titleInput.value.trim())) {
            createNewElement(document.getElementById(`error`),
                "bg-danger bg-opacity-10",
                `task already exist`);
            return ;
        }
        if (isEmptyInput(descriptionInput.value.trim(), `description`))return;

        this.parentElement.parentElement.classList.add("d-none");
        document.getElementById(`newTask`).classList.remove(`d-none`);


        //create new task
        let newTask = new dataBase.task(titleInput.value.trim(), descriptionInput.value.trim(), priorityInput.checked);
        dataBase.addTask(newTask);
        createNewElement(document.getElementById(`taskList`), `col-sm-6 col-md-4`, newTask.getHTMLString());

        //clear the input box
        titleInput.value ="";
        descriptionInput.value ="";
        priorityInput.checked = false;

    });

    //High Priority filter handler - When we press "High priority" button
    document.getElementById(`highPriority`).addEventListener(`click`, function () {
        this.classList.add(`d-none`);
        document.getElementById(`showAll`).classList.remove(`d-none`);
        removeNodeChildren(document.getElementById(`taskList`));
        displayTaskList(dataBase.getPriorityTaskListHTMLString());
    });

    //ShowAll filter handler - When we press "ShowAll" after we wanted to display "high priority tasks"
    document.getElementById(`showAll`).addEventListener(`click`, function () {
        this.classList.add(`d-none`);
        document.getElementById(`highPriority`).classList.remove(`d-none`);
        removeNodeChildren(document.getElementById(`taskList`));
        displayTaskList(dataBase.getTaskListHTMLString());
    });

    //Task sorting handler - When we press "sort" button
    document.getElementById(`short`).addEventListener(`click`, function () {
        dataBase.sortList();
        removeNodeChildren(document.getElementById(`taskList`));
        displayTaskList(dataBase.getTaskListHTMLString());
    });

    //New task handler - When we press "new task" button
    document.getElementById(`newTask`).addEventListener(`click`, function () {
        this.classList.add(`d-none`);
        document.getElementById(`inputArea`).classList.remove(`d-none`);
    });

    //Back handler - When we want to hide the input area
    document.getElementById(`back`).addEventListener(`click`, function () {
        document.getElementById(`inputArea`).classList.add(`d-none`);
        document.getElementById(`newTask`).classList.remove(`d-none`);
    });
});












