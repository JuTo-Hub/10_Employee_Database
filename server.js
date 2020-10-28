var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "ShadowZer0!",
  database: "employees_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "selection",
      type: "list",
      message: "Please select the area you would like to view?",
      choices: ["Add Departments", "View Departments", "Add Roles", "View Roles", "Add Employees", "View Employees", "Update Employees", "Remove Employee"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.selection === "Add Roles") {
        addRoles();
      } else if(answer.selection === "View Roles") {
        viewRoles();
      } else if(answer.selection === "Add Departments") {
        addDept();
      } else if(answer.selection === "View Departments") {
        viewDept();
      } else if(answer.selection === "Add Employees") {
        addEmployees();
      } else if(answer.selection === "View Employees") {
        viewEmployees();
      } else if(answer.selection === "Update Employees") {
        updateEmployees();
      } else if(answer.selection === "Remove Employees") {
        removeEmployees();
      } else{
        connection.end();
      }
    });
}
// Function to handle adding new departments.
function addDept() {
    // Prompt for add department function.
    inquirer.prompt([
        {
            name: "dept_name",
            type: "input",
            message: "What is the name of the new department?"
        },
    ]).then(function(answer){
        // Insert new department into the department database.
        connection.query(
            "INSERT INTO departments SET ?",
            {
                dept_name: answer.dept_name,
            },
            function(err) {
                if (err) throw err;
                console.log("New department was created successfully!");
                // Re-prompt the user to select a function
                start();
            }
        )
    })
}
function viewDept() {
  connection.query("SELECT * FROM departments", function(err, data){
    if (err) throw err;
    console.table(data);
    start();
  })
}
// Function to handle adding new roles.
function addRoles() { 
  connection.query("SELECT * FROM departments", function(err, departments){
  // Prompt for add role function.
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What role would you like to add?"
      },
      {
        name: "salary",
        type: "number",
        message: "What is the salary of this role?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
      },
      {
        name: "department_name",
        type: "list",
        message: "What department does this role belong to?",
        choices: departments.map((d)=>d.dept_name)
      }
    ])
    .then(function(answer) {
      // When finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO roles SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: departments.filter((d)=>d.dept_name == answer.department_name)[0].id,
        },
        function(err) {
          if (err) throw err;
          console.log("New role was created successfully!");
          // re-prompt the user to select a function
          start();
        }
      );
    });
})}
function viewRoles() {
  connection.query("SELECT r.id, r.title, r.salary, d.dept_name, r.department_id FROM roles r INNER JOIN departments d ON r.department_id = d.id", function(err, data){
    if (err) throw err;
    console.table(data);
    start();
  })
}
function viewEmployees() {
  connection.query("SELECT * FROM employees", function(err, data){
    if (err) throw err;
    console.table(data);
    start();
  })
}
function addEmployees() {
  // Prompt for add role function.
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "empRole",
        type: "list",
        message: "What is this employee's role?",
        choices: []
      },
      {
        name: "managerName",
        type: "list",
        message: "Who is this employee's manager?",
        choices:[]
      }
    ])
    .then(function(answer) {
      // When finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO roles SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role: answer.empRole,
          manager_id: answer.managerName,
        },
        function(err) {
          if (err) throw err;
          console.log("New employee was added successfully!");
          // re-prompt the user to select a function
          start();
        }
      );
    });
}
function updateEmployees() {
  // Prompt for add role function.
  inquirer
    .prompt([
      {
        name: "empSelect",
        type: "list",
        message: "Please select the employee to update.",
        choices: []
      },
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "empRole",
        type: "list",
        message: "What is this employee's new role?",
        choices: []
      },
      {
        name: "managerName",
        type: "list",
        message: "Who is this employee's new manager?",
        choices:[]
      }
    ])
    .then(function(answer) {
      // When finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role: answer.empRole,
          manager_id: answer.managerName,
        },
        function(err) {
          if (err) throw err;
          console.log("The employee profile has been updated successfully!");
          // re-prompt the user to select a function
          start();
        }
      );
    });
}