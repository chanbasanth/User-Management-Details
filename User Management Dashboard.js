const userTableBody = document.querySelector('#userTable tbody');
const addUserButton = document.getElementById('addUserButton');
const userModal = document.getElementById('userModal');
const closeModal = document.getElementById('closeModal');
const userForm = document.getElementById('userForm');
const pagination = document.getElementById('pagination');

let users = [];
let currentPage = 1;
const rowsPerPage = 5;
let isEditing = false;
let editingUserId = null;

//fetch user 
async function fetchUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        users = await response.json();
        displayUsers();
        displayPagination();
    } catch (error) {
        alert('Error fetching users!');
    }
}

// Display users
function displayUsers() {
    userTableBody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const visibleUsers = users.slice(start, end);
    visibleUsers.forEach(user => {
        const row = `<tr>
      <td>${user.id}</td>
      <td>${user.name.split(' ')[0]}</td>
      <td>${user.name.split(' ')[1]}</td>
      <td>${user.email}</td>
      <td>${user.company ? user.company.name : 'N/A'}</td>
      <td>
        <button onclick="openEditModal(${user.id})" class="btn btn-edit">Edit</button>
        <button onclick="deleteUser(${user.id})" class="btn btn-delete">Delete</button>
      </td>
    </tr>`;
        userTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Open the Add/Edit User 
function openEditModal(id) {
    const user = users.find(u => u.id === id);
    userForm.firstName.value = user.name.split(' ')[0];
    userForm.lastName.value = user.name.split(' ')[1];
    userForm.email.value = user.email;
    userForm.department.value = user.company?.name || '';

    isEditing = true;
    editingUserId = id;
    userModal.style.display = 'flex';
}

addUserButton.addEventListener('click', () => {
    isEditing = false;
    userForm.reset();
    userModal.style.display = 'flex';
});


closeModal.addEventListener('click', () => {
    userModal.style.display = 'none';
});

// Handle form submission
userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userData = {
        id: isEditing ? editingUserId : users.length + 1,
        name: `${userForm.firstName.value} ${userForm.lastName.value}`,
        email: userForm.email.value,
        company: {
            name: userForm.department.value
        },
    };

    if (isEditing) {
        const index = users.findIndex(user => user.id === editingUserId);
        users[index] = userData;
    } else {
        users.push(userData);
    }

    userModal.style.display = 'none';
    displayUsers();
    displayPagination();
});

// Delete a user
function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    displayUsers();
    displayPagination();
}

// Pagination
function displayPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(users.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `<button onclick="changePage(${i})">${i}</button>`;
    }
}

function changePage(page) {
    currentPage = page;
    displayUsers();
}

// Create by Inilizing
fetchUsers();