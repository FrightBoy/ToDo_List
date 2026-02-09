from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from app import db
from app.models import Task
from datetime import datetime

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
@login_required
def index():
    tasks = Task.query.filter_by(user_id=current_user.id).order_by(Task.created_at.desc()).all()
    return render_template('index.html', tasks=tasks)


@main_bp.route('/task/add', methods=['POST'])
@login_required
def add_task():
    title = request.form.get('title')
    description = request.form.get('description')
    priority = request.form.get('priority')
    due_date = request.form.get('due_date')

    if due_date:
        due_date = datetime.strptime(due_date, '%Y-%m-%d')

    new_task = Task(
        title=title,
        description=description,
        priority=priority,
        due_date=due_date,
        user_id=current_user.id
    )

    db.session.add(new_task)
    db.session.commit()

    flash('Task added successfully!')
    return redirect(url_for('main.index'))


@main_bp.route('/task/<int:task_id>/toggle', methods=['POST'])
@login_required
def toggle_task(task_id):
    task = Task.query.get_or_404(task_id)

    if task.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    task.completed = not task.completed
    db.session.commit()

    return jsonify({'success': True, 'completed': task.completed})


@main_bp.route('/task/<int:task_id>/delete', methods=['POST'])
@login_required
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)

    if task.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(task)
    db.session.commit()

    return jsonify({'success': True})


@main_bp.route('/task/<int:task_id>/update', methods=['POST'])
@login_required
def update_task(task_id):
    task = Task.query.get_or_404(task_id)

    if task.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    task.title = request.form.get('title')
    task.description = request.form.get('description')
    task.priority = request.form.get('priority')

    due_date = request.form.get('due_date')
    if due_date:
        task.due_date = datetime.strptime(due_date, '%Y-%m-%d')

    db.session.commit()

    return jsonify({'success': True})