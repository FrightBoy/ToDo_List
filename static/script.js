function toggleTask(taskId) {
    fetch(`/task/${taskId}/toggle`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`/task/${taskId}/delete`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function editTask(taskId) {
    const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
    const title = taskCard.querySelector('.task-title h3').textContent;
    const description = taskCard.querySelector('.task-description')?.textContent || '';
    const priority = taskCard.querySelector('.task-priority').textContent.toLowerCase();
    const dueDate = taskCard.querySelector('.due-date')?.textContent.split('Due: ')[1] || '';

    document.getElementById('editTaskId').value = taskId;
    document.getElementById('editTitle').value = title;
    document.getElementById('editDescription').value = description;
    document.getElementById('editPriority').value = priority;
    document.getElementById('editDueDate').value = dueDate;

    document.getElementById('editModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const taskId = document.getElementById('editTaskId').value;
    const formData = new FormData(this);

    fetch(`/task/${taskId}/update`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeModal();
            location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
});

function getCSRFToken() {
    const tokenElement = document.querySelector('meta[name="csrf-token"]');
    return tokenElement ? tokenElement.content : '';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
}