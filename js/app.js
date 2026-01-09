const addBtn = document.getElementById("addEmployeeBtn");
const modal = document.getElementById("employeeModal");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("employeeForm");
const tableBody = document.querySelector("#employeeTable tbody");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const searchInput = document.getElementById("searchInput");

let selectedEmployee = null;
let isEditing = false;
let employees = JSON.parse(localStorage.getItem("employees")) || [];

// Show modal
addBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Hide modal
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  form.reset();
});

// Save employee
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (isEditing) {
    selectedEmployee.name = document.getElementById("name").value;
    selectedEmployee.age = document.getElementById("age").value;
    selectedEmployee.position = document.getElementById("position").value;
    selectedEmployee.department = document.getElementById("department").value;
    selectedEmployee.dateHired = document.getElementById("dateHired").value;

    isEditing = false;
    selectedEmployee = null;
  } else {
    const employee = {
      id: Date.now(),
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      position: document.getElementById("position").value,
      department: document.getElementById("department").value,
      dateHired: document.getElementById("dateHired").value
    };
    employees.push(employee);
  }
  
  localStorage.setItem("employees", JSON.stringify(employees));
  renderTable();
  modal.classList.add("hidden");
  form.reset();
});

// Render table
const profileView = document.getElementById("profileView");
const backBtn = document.getElementById("backBtn");

function renderTable() {
  tableBody.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  employees
    .filter(emp => 
      emp.name.toLowerCase().includes(searchText) ||
      emp.position.toLowerCase().includes(searchText) ||
      emp.department.toLowerCase().includes(searchText)
    )
    .forEach(emp => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${emp.name}</td>
        <td>${emp.position}</td>
        <td>${emp.department}</td>
      `;

      row.addEventListener("click", () => {
        showProfile(emp);
      });

      tableBody.appendChild(row);
    });
}

function showProfile(emp) {
  selectedEmployee = emp;

  document.getElementById("pName").textContent = emp.name;
  document.getElementById("pAge").textContent = emp.age;
  document.getElementById("pPosition").textContent = emp.position;
  document.getElementById("pDepartment").textContent = emp.department;
  document.getElementById("pDateHired").textContent = emp.dateHired;

  profileView.classList.remove("hidden");
}

editBtn.addEventListener("click", () => {
  isEditing = true;

  document.getElementById("name").value = selectedEmployee.name;
  document.getElementById("age").value = selectedEmployee.age;
  document.getElementById("position").value = selectedEmployee.position;
  document.getElementById("department").value = selectedEmployee.department;
  document.getElementById("dateHired").value = selectedEmployee.dateHired;

  profileView.classList.add("hidden");
  modal.classList.remove("hidden");
});

deleteBtn.addEventListener("click", () => {
  if(confirm("Are you sure you want to delete this employee?")) {
    employees = employees.filter(emp => emp.id !== selectedEmployee.id);
    localStorage.setItem("employees", JSON.stringify(employees));
    profileView.classList.add("hidden");
    renderTable();
  }
});

backBtn.addEventListener("click", () => {
  profileView.classList.add("hidden");
});

searchInput.addEventListener("input", () => {
  renderTable();
});

// Load employees on start
renderTable();
