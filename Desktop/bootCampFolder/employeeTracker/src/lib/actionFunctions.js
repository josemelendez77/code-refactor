// db connection
const connection = require('../config/config');
// query variables
const queries = require('./queries');
// prettify output
const consoleTable = require('console.table');
// inquirer
const inquirer = require("inquirer");
// require actionslist
const actionsList = require('./actionslist');
// bring this in to use promises for connection.query
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

// function to initialize the app
const start = () => {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: actionsList.actionsList
        })
        .then((answer) => {
            if (answer.action === 'Exit') {
                exitProgram();
            } else {
                switch (answer.action) {
                    // View all employees
                    case actionsList.actionsList[0]:
                        viewAllEmployeesQ();
                        break;

                    // View all Departments
                    case actionsList.actionsList[1]:
                        viewAllDeptsQ();
                        break;

                    // View all roles
                    case actionsList.actionsList[2]:
                        viewAllRolesQ();
                        break;

                    // Add an employee
                    case actionsList.actionsList[3]:
                        addEmployeeQ();
                        break;

                    // Add a department
                    case actionsList.actionsList[4]:
                        addDepartmentQ();
                        break;
                    
                    // Add a role
                    case actionsList.actionsList[5]:
                        addRoleQ();
                        break;
                    
                    // Update an employee's role
                    case actionsList.actionsList[6]:
                        updateEmployeeRoleQ();
                        break;
                    
                    // Update an employee's manager
                    case actionsList.actionsList[7]:
                        updateEmployeeMgrQ();
                        break;
                    
                    // View employees by manager
                    case actionsList.actionsList[8]:
                        viewEmployeesByManagerQ();
                        break;

                    // View utilized budget
                    case actionsList.actionsList[9]:
                        viewUtilizedBudgetQ();
                        break;

                    // Delete employee
                    case actionsList.actionsList[10]:
                        deleteEmployeeQ();
                        break;
                    
                    // Delete role
                    case actionsList.actionsList[11]:
                        deleteRoleQ();
                        break;
                    
                    // Delete department
                    case actionsList.actionsList[12]:
                        deleteDepartmentQ();
                        break;
                }
            }

        });
}

// GET FUNCTIONS
// roles
const getRoles = () => {
    return query(queries.viewAllRoles);
}
// employees
const getEmployees = () => {
    return query(queries.viewAllEmployees);
}
// departments
const getDepartments = () => {
    return query(queries.viewAllDepartments);
}

const getManagers = () => {
    return query(queries.viewAllManagers);
}

// VIEW FUNCTIONS
// View all employees function
const viewAllEmployeesQ = async () => {
    try {
        const rows = await getEmployees();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// View all depts function
const viewAllDeptsQ = async () => {
    try {
        const rows = await getDepartments();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// View all roles function
const viewAllRolesQ = async () => {
    try {
        const rows = await getRoles();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// View employess by manager
const viewEmployeesByManagerQ = async () => {
    try {
        const rows = await query(queries.viewEmployeesByManager);
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// View utilized budget by department
const viewUtilizedBudgetQ = async () => {
    try {
        const rows = await query(queries.viewUtilizedBudget);;
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// ADD FUNCTIONS
// Add an employee function
const addEmployeeQ = async () => {
    try {
        // define questions first
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empFirstName",
                        type: "input",
                        message: "Please enter a FIRST NAME for the new employee.",
                    },
                    {
                        name: "empLastName",
                        type: "input",
                        message: "Please enter a LAST NAME for the new employee.",
                    },
                    {
                        name: "empManagerYN",
                        type: "rawlist",
                        message: "Is the new employee a people manager? Select N for No or Y for Yes.",
                        choices: ["N", "Y"]
                    },
                    {
                        name: "empRoleId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            roles.forEach((role) => {
                                const roleObj = {
                                    name: role.title,
                                    value: role.id
                                }
                                choiceArray.push(roleObj)
                            })
                            return choiceArray;
                        },
                        message: "Select a role for the new employee."
                    },
                    {
                        name: "empManagerId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            managers.forEach((mgr) => {
                                const mgrObj = {
                                    name: mgr.name,
                                    value: mgr.id
                                }
                                choiceArray.push(mgrObj)
                            })
                            return choiceArray;
                        },
                        message: "Select a manager for the new employee."
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.addEmployee,
                        {
                            firstname: answer.empFirstName,
                            lastname: answer.empLastName,
                            role_id: answer.empRoleId,
                            manager_id: answer.empManagerId,
                            manageryn: answer.empManagerYN
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`The new employee ${answer.empFirstName} ${answer.empLastName} was added successfully!`);
                            start();
                        });
                });
        }

        // await functions 
        const roles = await getRoles();
        const managers = await getManagers();
        await promptUser();

    } catch (err) {
        console.log(err);
    }
}

// Add a department function
const addDepartmentQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "deptName",
                        type: "input",
                        message: "Please enter a NAME for the new department.",
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.addDepartment,
                        {
                            name: answer.deptName
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`The new department ${answer.deptName} was added successfully!`); 
                            start();                          
                        });
                });
        }

        //await functions
        await promptUser();

    } catch (err) {
        console.log(err);
    }
}

// Add a role function
const addRoleQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "roleTitle",
                        type: "input",
                        message: "Please enter a NAME for the new role.",
                    },
                    {
                        name: "roleSalary",
                        type: "input",
                        message: "Please enter a SALARY for the new role. E.G 10000.00",
                    },
                    {
                        name: "roleDeptId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            depts.forEach((dept) => {
                                const deptObj = {
                                    name: dept.department_name,
                                    value: dept.id
                                }
                                choiceArray.push(deptObj)
                            })
                            return choiceArray;
                        },
                        message: "Select a DEPARTMENT for the new role."

                    }
                ])
                .then((answer) => {                    
                    connection.query(
                        queries.addRole,
                        {
                            title: answer.roleTitle,
                            salary: answer.roleSalary,
                            department_id: answer.roleDeptId
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`The new role ${answer.roleTitle} was added successfully!`); 
                            start();                          
                        });
                });
        }

        //await functions
        const depts = await getDepartments();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// UPDATE FUNCTIONS
// Update an employee role
const updateEmployeeRoleQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            emps.forEach((emp) => {
                                const empObj = {
                                    name: `${emp.firstname} ${emp.lastname}`,
                                    value: emp.id
                                }
                                choiceArray.push(empObj)
                            })
                            return choiceArray;
                        },
                        message: "Please select an employee whose role you wish to update.",
                    },
                    {
                        name: "empRoleId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            roles.forEach((role) => {
                                const roleObj = {
                                    name: role.title,
                                    value: role.id
                                }
                                choiceArray.push(roleObj)
                            })
                            return choiceArray;
                        },
                        message: "Select a new role for the employee."
                    }
                ])
                .then((answer) => {                    
                    connection.query(
                        queries.updateEmployee,
                        [
                            {
                                // Goes in SET - field being updated with new value
                                role_id: answer.empRoleId
                            },
                            {
                                // Goes in WHERE - employee getting new role
                                id: answer.empID
                            }
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log(`The employee's role was updated successfully!`); 
                            start();                          
                        });
                });
        }

        //await functions
        const emps = await getEmployees();
        const roles = await getRoles();
        await promptUser();

    } catch (err) {
        console.log(err);
    }
}

// Update an employee manager
const updateEmployeeMgrQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            emps.forEach((emp) => {
                                const empObj = {
                                    name: `${emp.firstname} ${emp.lastname}`,
                                    value: emp.id
                                }
                                choiceArray.push(empObj)
                            })
                            return choiceArray;
                        },
                        message: "Please select an employee whose manager you wish to update.",
                    },
                    {
                        name: "empManagerId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            managers.forEach((mgr) => {
                                const mgrObj = {
                                    name: mgr.name,
                                    value: mgr.id
                                }
                                choiceArray.push(mgrObj)
                            })
                            return choiceArray;
                        },
                        message: "Select a new manager for the employee."
                    }
                ])
                .then((answer) => {                    
                    connection.query(
                        queries.updateEmployee,
                        [
                            {
                                // Goes in SET - field being updated with new value
                                manager_id: answer.empManagerId
                            },
                            {
                                // Goes in WHERE - employee getting new manager
                                id: answer.empID
                            }
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log(`The employee's manager was updated successfully!`); 
                            start();                          
                        });
                });
        }

        //await functions
        const emps = await getEmployees();
        const managers = await getManagers();
        await promptUser();

    } catch (err) {
        console.log(err);
    }
}

// DELETE FUNCTIONS
// Delete employee function
const deleteEmployeeQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            emps.forEach((emp) => {
                                const empObj = {
                                    name: `${emp.firstname} ${emp.lastname}`,
                                    value: emp.id
                                }
                                choiceArray.push(empObj)
                            })
                            return choiceArray;
                        },
                        message: "Please select an employee you would like to DELETE. Note: You may wish to update this manager's employees first; otherwise, existing employees will be set to a null manager.",
                    }
                ])
                .then((answer) => {                    
                    connection.query(
                        queries.deleteEmployee,
                        {
                            // Goes in WHERE - employee getting deleted
                            id: answer.empID
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`The employee was deleted successfully! Make sure to review and update employee managers as needed.`); 
                            start();                          
                        });
                });
        }

        //await functions
        const emps = await getEmployees();
        await promptUser();

    } catch (err) {
        console.log(err);
    }
}

// Delete roles function
const deleteRoleQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "roleID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            roles.forEach((role) => {
                                const roleObj = {
                                    name: role.title,
                                    value: role.id
                                }
                                choiceArray.push(roleObj)
                            })
                            return choiceArray;
                        },
                        message: "Please select role you would like to DELETE. Note: You may wish to update the affected employees' role first; otherwise, existing employees will be set to a null role.",
                    }
                ])
                .then((answer) => {                    
                    connection.query(
                        queries.deleteRole,
                        {
                            // Goes in WHERE - role getting deleted
                            id: answer.roleID
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`The role was deleted successfully! Make sure to review and update employee roles as needed.`); 
                            start();                          
                        });
                });
        }

        //await functions
        const roles = await getRoles();
        await promptUser();

    } catch (err) {
        console.log(err);
    }
}

// Delete department function
const deleteDepartmentQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "deptID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            depts.forEach((dept) => {
                                const deptObj = {
                                    name: dept.department_name,
                                    value: dept.id
                                }
                                choiceArray.push(deptObj)
                            })
                            return choiceArray;
                        },
                        message: "Please select role you would like to DELETE. Note: You may wish to update the affected employees' role first; otherwise, existing employees will be set to a null role.",
                    }
                ])
                .then((answer) => {                    
                    connection.query(
                        queries.deleteDepartment,
                        {
                            // Goes in WHERE - department getting deleted
                            id: answer.deptID
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`The department was deleted successfully! Make sure to review and update roles as needed.`); 
                            start();                          
                        });
                });
        }

        //await functions
        const depts = await getDepartments();
        await promptUser();

    } catch (err) {
        console.log(err);
    }
}

// EXIT the program
const exitProgram = () => {
    console.log("Hope you enjoyed using the Employee Tracker app!");
    return connection.end();
}

module.exports = { start }