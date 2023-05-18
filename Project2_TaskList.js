// ============================ Global Variables =========//
let currentTaskList = "";
const taskList1 = new TaskList("taskList1", []);
currentTaskList = taskList1;

const priority = {
   1: "High",
   2: "Medium",
   3: "Low"
};

const status = {
   1: "New" ,
   2: "Pending" ,
   3: "PartialyCompleted" ,
   4: "Completed" 
};

// ====================================  Start of the code for Handling input and output to terminal ======================= //

const readline = require("readline");
// const keypress = require('keypress');

const rl = readline.createInterface({
  input: process.stdin,
  output: null,
  terminal: true
});

let chooseMode = true;
// keypress(process.stdin);

async function getInput(message) {
  return new Promise(resolve => {
    rl.question(message, input => {
      resolve(input);
    });
  });
}

// async function enterTaskInfo() {
//   await handleInput('Enter task name: ');
//   await handleInput('Enter task description: ');
// }

async function takeInput(message) {
  try {
    const input = await getInput(message);
    return input;
  } catch (error) {
    console.error("An error occurred:", error);
    // rl.close();
    // throw error;
  }
}

function handleKeyPress(_, key) {
  if (key && !isNaN(key.name) && key.name != "" && chooseMode != false) {
    switch (key.name) {
      case "1":
        console.log(`You Chosed the chooise to 'Add a new task:'`);
        enterTaskInfo();
        break;
      case "2":
        console.log(`You Chosed the chooise to 'List all tasks:'`);
        currentTaskList.listAllTasks();
        console.log("\nChoose what to do next ");
        break;
      case "3":
        console.log(`You Chosed the chooise to 'List completed tasks:'`);
        currentTaskList.listCompletedTasks(); 
        console.log("\nChoose what to do next ");
        break;
      case "4":
        console.log(`You Chosed the chooise to 'Mark the task as done:'`);
        currentTaskList.changeTaskStatus('complete');
        console.log("\nChoose what to do next "); 
        break;
      case "5":
        console.log(`You Chosed the chooise to 'Delete a task:'`);
        currentTaskList.deleteTask(); 
        console.log("\nChoose what to do next "); 
        break;
      case "6":
        console.log(`You Chosed the chooise to 'Sort tasks by the due date:'`);
        currentTaskList.sortTasks("dueDate","acs");
        console.log("\nChoose what to do next ");
        break;
      case "7": 
        console.log(`You Chosed the chooise to 'Sort tasks by priority:'`);
        currentTaskList.sortTasks("priority","acs");
        console.log("\nChoose what to do next ");
        break;
      case "8":
        console.log(`You Chosed the chooise to 'Clear all tasks:'`);
        currentTaskList.clearAllTasks();
        console.log("\nChoose what to do next ");
        break;
      case "9":
        console.log(`You Chosed the chooise to Quit: bye ..!`);
        rl.close();
        console.log("\nChoose what to do next ");
        break;
      default:
        console.log(
          `You have to choose a number (between 1 to 9) to do action as the List Above`
        );
        break;
    }
  } else if (chooseMode == true) {
    console.log(
      "You have to choose a number (between 1 to 9) to do action as the List Above"
    );
  } else if (chooseMode == false) {
    process.stdout.write(key.sequence);
  }
}

async function enterTaskInfo() {
  chooseMode = false;
  process.stdin.pause();
  console.log("Enter task name:");
  process.stdin.resume();
  const taskName = await takeInput("");
  console.log(taskName);
  // process.stdin.pause();
  // process.stdin.resume();
  console.log("Enter task Desc:");
  const taskDesc = await takeInput("");
  console.log(taskDesc);
  console.log("Enter task Date(in format dd/mm/yyyy):");
  let taskDate = "";
  do {
    taskDate = await takeInput("");
  } while (!isValidDate(taskDate));
  console.log(taskDate);
  console.log("Enter task Priority (1 for High , 2 for Meduim, 3 for Low) :");
  let taskPrio = "";
  do {
    taskPrio = await takeInput("");
  } while (![1, 2, 3].includes(Number(taskPrio)));

  console.log(taskPrio);

  //add task to the tasklist
  currentTaskList.addTask(taskName, taskDesc, taskDate, taskPrio, 1);
  console.log(`The Task : ${taskName} is Added `);

  //   process.stdin.resume();
  //   await enterTaskInfo();
  console.log("\nChoose what to do next ");
  chooseMode = true;
  //   rl.close();
}

// Start listening for 'keypress' events
process.stdin.on("keypress", handleKeyPress);

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
      .description}\nDue Date: ${this.dueDate}\nPriority: ${this.priority}`
  );
  console.log(
    "------------------------------------------------------------------"
  );
};

TaskList.prototype.addTask = function(name, desc, dueDate, priority) {
  if (this.tasks.length == 0) {
    const taskObj = new Task(1, name, desc, dueDate, priority);
    this.tasks.push(taskObj);
  } else {
    const taskObj = new Task(
      getLargestID(this.tasks).id + 1,
      name,
      desc,
      dueDate,
      priority
    );
    this.tasks.push(taskObj);
  }
};

TaskList.prototype.listAllTasks = function() {

  if (this.tasks.length>0)
    console.log(`   There are ${this.tasks.length} task(s), here is the list for them`);
  else
    console.log(`there are no taskes yet, you can press 1 to create a task`);

  this.tasks.forEach((element, ind) => {
    console.log(ind + 1 + ":");
    element.getTaskDetails();
  });
};

TaskList.prototype.deleteTask = async function( taskId ) {
  console.log(`Enter the id for the task you want to delete .`);
  let elInd='';
  const tid = await takeInput("");
  console.log(tid);
  do {
      this.tasks.forEach((element,ind) => {
    if(element.id==tid)
      elInd=ind;
     });
     if(elInd=='')
      console.log(` there is no task id with id: ${tid} please enter valid task id`);
  } while (elInd!=='');

  this.tasks.splice(elInd,1);
  
};


// funcType to specify if the function to change task statues to just to make task as complete (values for argument is: change or complete)
TaskList.prototype.changeTaskStatus = async function(funcType) {
  console.log(`Enter the id for the task which you want to change its statues ${funcType=='complete'?'to complete':''}.`);
  const tid = await takeInput("");
  console.log(tid);
  let el='';
  let elInd='';
  do {
    el=this.tasks.filter(element => element.id==tid);
    elInd=el.id;
   if(elInd=='')
    console.log(` there is no task id with id: ${tid} please enter valid task id`);
} while (elInd!=='');

if(funcType=='change'){
  console.log(`What new statues you want for it, choose ( 1 for Pending , 2 for Partialy Completed , 3 for Completed) `);
  const newStat = await takeInput("");
  console.log(newStat);
  let prevStat= this.tasks[elInd].status;
  this.tasks[elInd].status=newStat;
} 
 else
{
  this.tasks[elInd].status= 3;
  console.log(funcType=='complete'?`The statues for the task with ID: ${tid} (and with Name: ${this.tasks[elInd].name}) is Completed.` : `The statues for the task with ID: ${tid} (and with Name: ${this.tasks[elInd].name}) is now ${status[newStat]} instead of ${status[prevStat]} `);
}
};

TaskList.prototype.listCompletedTasks = async function() {
  
  let i=0;
  this.tasks.reduce((i,e)=>(e.status==status.Completed?i+1:i),0);

  console.log(i==0?`There are no taskes that are completed`:`There are ${i} tasks that they are completed. and here are the list of them :`);

  this.tasks.forEach((element, ind) => {
    if(element.status==status.Completed)
    {
      element.getTaskDetails();
    }
  });

};

TaskList.prototype.clearAllTasks = function() {
  let noOfTasks= this.tasks.length;
  this.tasks=[];
  console.log(noOfTasks==0?`There was no tasks to clear.`:`There was ${noOfTasks} number of tasks ,and now they are all deleted.`);
};

TaskList.prototype.sortTasks = function(sortType, sortingDirection) {
  
  if(sortType=='dueDate')
  {
    this.tasks=sortingDirectionacs=='acs'? this.tasks.sort((a,b)=>toDate(a.dueDate)<toDate(b.dueDate)):this.tasks.sort((a,b)=>toDate(a.dueDate)>toDate(b.dueDate)) ;
  } 
  else if(sortType=='priority')
  {
    this.tasks=sortingDirectionacs=='acs'? this.tasks.sort((a,b)=>a.priority>b.priority):this.tasks.sort((a,b)=>a.priority<b.priority) ;
  }
  
  console.log(`All taskes are sorted according the ${sortType=='dueDate'?'Due Date':'Priority'} , and by ${sortingDirectionacs=='acs'?'Ascending':'Descending'} direction`);
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
  let dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

  if (dateRegex.test(vr)) {
    return true;
  } else {
    return false;
  }
}

function toDate(dString) {
  const [day, month, year] = dString.split('/');
  return new Date(year, month - 1, day);
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
