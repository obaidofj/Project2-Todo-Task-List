// ============================ Global Variables =========//
let currentTaskList = "";
const taskList1 = new TaskList("taskList1", []);
currentTaskList = taskList1;
let chooseMode = true;

const priority = {
  "High" :1 ,
  "Medium" :2 ,
  "Low" :3 ,
};

const status = {
  "New":1,
  "Pending":2,
  "PartialyCompleted":3,
  "Completed":4,
};

const prioRM = ["High","Medium","Low"];
const statRM = ["New",  "Pending",  "PartialyCompleted",  "Completed"];

// ====================================  Start of the code for Handling input and output to terminal ======================= //

const readline = require("readline");
// const keypress = require('keypress');

const rl = readline.createInterface({
  input: process.stdin,
  output: null,
  terminal: true
});

// keypress(process.stdin);

function overrideInput() {
  // Move the cursor to the beginning of the line
  rl.write(null, { ctrl: true, name: "u" });
}

async function takeInput(message) {
  let input = "";
  // rl.write('');
  // rl.resume();
  // rl.write('');
  overrideInput();
  try {
    input = await new Promise(resolve => {
      rl.question(message, userInput => {
        //rl.write(" abc ");

        resolve(userInput.trim());
      });
    });
  } catch (error) {
    console.error(error);
  } finally {
    //input = '';
    
  }

  return input;
}

async function handleKeyPress(_, key) {
  (async () => {
    if (!isNaN(key.name) && key.name != "" && chooseMode != false) {
      chooseMode = false;
      switch (key.name) {
        case "1":
          console.log(`You Chosed the choice to 'Add a new task:'\n# > > `);
          // rl.resume();
          // rl.write("  ");
          (async () => {
            await enterTaskInfoAndSave();
            chooseMode = true;
          })();
          break;
        case "2":
          console.log(`You Chosed the choice to 'List all tasks:'\n# > > `);
          currentTaskList.listAllTasks();
          console.log("\nChoose what to do next ");
          chooseMode = true;
          break;
        case "3":
          console.log(`You Chosed the choice to 'List completed tasks:'\n# > > `);

          (async () => {
            await currentTaskList.listCompletedTasks();
            console.log("\nChoose what to do next ");
            chooseMode = true;
          })();
          break;
        case "4":
          console.log(`You Chosed the choice to 'Mark the task as done:'\n# > > `);
          rl.resume();
          rl.write("  ");
          (async () => {
            await currentTaskList.changeTaskStatus("complete");
            console.log("\nChoose what to do next ");
            chooseMode = true;
          })();
            
          break;
        case "5":
          console.log(`You Chosed the choice to 'Delete a task:'\n# > > `);
          (async () => {
            await currentTaskList.deleteTask();
            console.log("\nChoose what to do next ");
            chooseMode = true;
          })();
          break;
        case "6":
          console.log(
            `You Chosed the choice to 'Sort tasks by the due date:'\n# > > ` );
          (async () => {
            await currentTaskList.sortTasks("dueDate", "acs");
            console.log("\nChoose what to do next ");
            chooseMode = true;
          })();
          break;
        case "7":
          console.log(`You Chosed the choice to 'Sort tasks by priority:'\n# > > `);
          (async () => {
            await currentTaskList.sortTasks("priority", "acs");
            console.log("\nChoose what to do next ");
            chooseMode = true;
          })();
          break;
        case "8":
          console.log(`You Chosed the choice to 'Clear all tasks:'\n# > > `);
          (async () => {
            await currentTaskList.clearAllTasks();
            console.log("\nChoose what to do next ");
            chooseMode = true;
          })();
          break;
        case "9":
          console.log(`You Chosed the choice to Quit: bye ..! `);
          rl.close();
          break;
          
        default:
          console.log(
            `You have to choose a number (between 1 to 9) to do action as the List Above`
          );
          chooseMode = true;
          break;
      }
    } else if (key && key.name === "enter") {
      //&& chooseMode !== true
      // Handle Enter key press separately
      console.log("");
    } else if (chooseMode == true) {
      console.log(
        "You have to choose a number (between 1 to 9) to do action as the List Above"
      );
    } else if (chooseMode == false) {
      process.stdout.write(key.sequence);
    }
  })();
}

// Start listening for 'keypress' events
(async () => {
  process.stdin.on("keypress", handleKeyPress);
})();

process.stdin.setRawMode(true);
process.stdin.resume();

// ====================================  End of the code for Handling input and output to terminal ======================= //

// ====================================  code for Task and TaskList Prototypies ======================= //

function Task(id, name, description, dueDate, priority, status) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.dueDate = dueDate;
  this.priority = priority;
  this.status = status;
}

function TaskList(name, tasks = []) {
  this.name = name;
  this.tasks = tasks;
}

Task.prototype.getTaskDetails = function() {
  console.log(
    "------------------------------------------------------------------"
  );
  console.log(
    `TaskID:${this.id}, Task Name: ${this.name}\nDescription: ${this
      .description}\nStatus: ${statRM[(this
      .status-1)]}\nDue Date: ${this.dueDate}\nPriority: ${prioRM[(this.priority-1)]}`
  );
  console.log(
    "------------------------------------------------------------------"
  );
};

TaskList.prototype.addTask = function(name, desc, dueDate, priority, stat) {
  if (this.tasks.length == 0) {
    const taskObj = new Task(1, name, desc, dueDate, priority, stat);
    this.tasks.push(taskObj);
  } else {
    const taskObj = new Task(
      getLargestID(this.tasks).id + 1,
      name,
      desc,
      dueDate,
      priority,
      stat
    );
    this.tasks.push(taskObj);
  }
};

async function enterTaskInfoAndSave() {
  chooseMode = false;
  let taskName = "";
  let taskDesc = "";
  // process.stdin.pause();
  // process.stdin.resume();
  console.log("Enter task name (minimum one 3 chars word):");
  //
  while (true) {
  taskName = await takeInput("");
  if (isValidInput(taskName)) break;
}
  console.log(taskName);
  // process.stdin.pause();
  // process.stdin.resume();
  console.log("Enter task Desc (minimum one 3 chars word):");
  while (true) {
  taskDesc = await takeInput("");
  if (isValidInput(taskDesc)) break;
}
  console.log(taskDesc);
  console.log("Enter task Date(in format dd/mm/yyyy):");
  let taskDate = "";

  while (true) {
    taskDate = await takeInput("");
    if (isValidDate(taskDate)) break;
  }

  console.log(taskDate);
  console.log("Enter task Priority (1 for High , 2 for Meduim, 3 for Low) :");
  let taskPrio = "";
  while (true) {
    taskPrio = await takeInput("");
    if ([1, 2, 3].includes(Number(taskPrio))) break;
  }

  console.log(taskPrio);

  //add task to the tasklist
  currentTaskList.addTask(taskName, taskDesc, taskDate, taskPrio, 1, status[1]);
  console.log(`The Task : ${taskName} is Added `);

  //   process.stdin.resume();
  //   await enterTaskInfo();
  console.log("\nChoose what to do next ");
  chooseMode = true;
  //   rl.close();
}

TaskList.prototype.listAllTasks = function() {
  if (this.tasks.length > 0)
    console.log(
      `   There are ${this.tasks.length} task(s), here is the list for them`
    );
  else console.log(`there are no any taskes saved, you can press 1 to create a task`);

  this.tasks.forEach((element, ind) => {
    console.log(ind + 1 + ":");
    element.getTaskDetails();
  });
};


TaskList.prototype.listCompletedTasks = async function() {
  
  let i = this.tasks.reduce((i, e) => (e.status == status.Completed ? i + 1 : i), 0);

  console.log(
    i === 0
      ? `There are no taskes that are completed`
      : `There are ${i} tasks that they are completed. and here are the list of them :`
  );

  this.tasks.forEach((element, ind) => {
    if (element.status == status.Completed) {
      element.getTaskDetails();
    }
  });
};


// funcType to specify if the function to change task statues to just to make task as complete (values for argument is: change or complete)
TaskList.prototype.changeTaskStatus = async function(funcType) {
  chooseMode = false;
  console.log(
    `Enter the id for the task which you want to change its statues ${funcType ==
    "complete"
      ? "to complete"
      : ""}.`
  );

  let el = "";
  let elInd = "";

 
  elInd =  await enterValidID(this.tasks);


  if (funcType == "change") {
    console.log(
      `What new statues you want for it, choose ( 1 for Pending , 2 for Partialy Completed , 3 for Completed) `
    );
    const newStat = await takeInput("");
 
    let prevStat = this.tasks[elInd].status;
    this.tasks[elInd].status = newStat;
  } else {
    var vr = this.tasks;

    this.tasks[elInd].status = 4;
    console.log(
      funcType == "complete"
        ? `The statues for the task with ID: ${this
          .tasks[elInd].id} and which Name is: ${this
            .tasks[elInd].name} now the statues is Completed.`
        : `The statues for the task with ID: ${tid} and which Name is ${this
            .tasks[elInd].name} the statues now is ${status[newStat]} instead of ${status[
            prevStat
          ]} `
    );
  }
  chooseMode = true;
};

TaskList.prototype.deleteTask = async function(taskId) {
  chooseMode = false;
  console.log(`Enter the id for the task you want to delete .`);
  let elInd = "";

  elInd = await enterValidID(this.tasks);
  if(elInd!=='')
  {
    let id=this.tasks[elInd].id;
    let name=this.tasks[elInd].name;
    this.tasks.splice(elInd, 1);
    console.log(`
    the task with ID: ${id} and which Name is: ${name} now is deleted`);
  }
  chooseMode = true;
};


TaskList.prototype.clearAllTasks = function() {
  let noOfTasks = this.tasks.length;
  this.tasks = [];
  console.log(
    noOfTasks == 0
      ? `There was no tasks to clear.`
      : `There was ${noOfTasks} number of tasks ,and now they are all deleted now.`
  );
};

TaskList.prototype.sortTasks = function(sortType, sortingDirection) {
  if (sortType == "dueDate") {
    this.tasks =
    sortingDirection == "acs"
        ? this.tasks.sort((a, b) => toDate(a.dueDate) - toDate(b.dueDate))
        : this.tasks.sort((a, b) => toDate(b.dueDate) - toDate(a.dueDate));
  } else if (sortType == "priority") {
    this.tasks =
    sortingDirection == "acs"
        ? this.tasks.sort((a, b) => parseInt(b.priority) - parseInt(a.priority))
        : this.tasks.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
  }

  console.log(
    `All taskes are sorted according the ${sortType == "dueDate"
      ? "Due Date"
      : "Priority"} , and by ${sortingDirection == "acs"
      ? "Ascending (from low to high)"
      : "Descending (from high to low)"} direction`
  );
};

// ====================================  End Code of Task and TaskList Prototypies ======================= //

// ====================================  Helper Code  =================++++====== //

function getLargestID(objects) {
  if (objects.length === 0) {
    return null;
  }

  const largestIDObj = objects.reduce((prev, curr) => {
    return curr.id > prev.id ? curr : prev;
  });

  return largestIDObj;
}

function isValidDate(vr) {
  // as any date between 1-1-2000 to 31-12-2099
  let dateRegex = /^\d{1,2}\/\d{1,2}\/(20[0-9]{2}|2099)$/;

  if (dateRegex.test(vr)) {
    return true;
  } else {
    return false;
  }
}

function isValidInput (inp) {
  let wrdRegex = /\w{3,}/;

  if (wrdRegex.test(inp)) {
    return true;
  } else {
    return false;
  }
}

function toDate(dString) {
  const [day, month, year] = dString.split("/");
  return new Date(`${year}-${month}-${day}`).getTime();
}

async function  enterValidID(arOfObjects){
  let elInd='';

  
  while (true) {
    let tid = -1;
    let elInd = '';
  
   
      tid = await takeInput();
   
  
      arOfObjects.forEach((element, ind) => {
        if (element["id"] === parseInt(tid)) {
          elInd = ind;
          return;
        }
      });
  

  
      if (elInd === '') {
        console.log(`There is no task with ID: ${tid}. Please enter a valid task ID.`);
      } else 
      return elInd;
  } 


}
// ====================================  End  of Helper Codes ======================= //

// ====================================  Code that start the programe ======================= //
function printSelection() {
  console.log(`***************************
    Welcome to JS TODO-APP
    ***************************
    Select an action:
    1) Add a new task
    2) List all tasks
    3) List completed tasks
    4) Mark the task as done
    5) Delete a task
    6) Sort tasks by the due date
    7) Sort tasks by priority
    8) Clear all tasks
    9) Quite
    ***************************
    What's your choice?
    `);
}

printSelection();

// (async () => {
//   await  handleInput('');
//   // await enterTaskInfo();
// })();
// ====================================  End of programe starting code ======================= //
