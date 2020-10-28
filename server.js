var mysql = require("mysql");
var inquirer = require("inquirer");

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
        addRole();
      } else if(answer.selection === "View Roles") {
        viewRole();
      } else if(answer.selection === "Add Departments") {
        addDept();
      } else if(answer.selection === "View Departments") {
        viewDept();
      } else if(answer.selection === "Add Employees") {
        addEmployee();
      } else if(answer.selection === "View Employees") {
        viewEmployee();
      } else if(answer.selection === "Update Employees") {
        updateEmployee();
      } else if(answer.selection === "Remove Employees") {
        removeEmployee();
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
                console.log("Your department was created successfully!");
                // Re-prompt the user to select a function
                start();
            }
        )
    })
}
// Function to handle adding new roles.
function addRole() {
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
        type: "input",
        message: "What department does this role belong to?",
      }
    ])
    .then(function(answer) {
      // When finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO roles SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_name,
        },
        function(err) {
          if (err) throw err;
          console.log("Your role was created successfully!");
          // re-prompt the user to select a function
          start();
        }
      );
    });
}

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}
