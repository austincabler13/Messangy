from flask import Flask, render_template, redirect, url_for, request, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, send
from werkzeug.security import generate_password_hash, check_password_hash

## worky about this Later
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Cabler15@localhost/messaging_app'
app.config['SECRET_KEY'] = 'supersecretkey'
db = SQLAlchemy(app)
socketio = SocketIO(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100))
    bio = db.Column(db.String(200))
    photo = db.Column(db.String(100))  # Store the file path for profile photos

# Message model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User')

def create_tables():
    with app.app_context():
        db.create_all()

# Registration route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'], method='sha256')
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        flash('Registration successful! You are now logged in.')
        return redirect(url_for('chat'))
    return render_template('register.html')

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            flash('Login successful!')
            return redirect(url_for('chat'))
        else:
            flash('Login failed. Check your username and password.')
    return render_template('login.html')

# Profile update route
@app.route('/profile', methods=['GET', 'POST'])
def profile():
    user = User.query.get(session['user_id'])
    if request.method == 'POST':
        user.name = request.form['name']
        user.bio = request.form['bio']
        # Handle photo upload (assuming a form file upload)
        photo = request.files['photo']
        if photo:
            photo_path = f"static/uploads/{photo.filename}"
            photo.save(photo_path)
            user.photo = photo_path
        db.session.commit()
        flash('Profile updated successfully!')
    return render_template('profile.html', user=user)

# Chat route (main chat room)
@app.route('/chat')
def chat():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('chat.html')

@socketio.on('message')
def handle_message(msg):
    user = User.query.get(session['user_id'])
    message = Message(content=msg, user=user)
    db.session.add(message)
    db.session.commit()
    send({'message': msg, 'username': user.username, 'name': user.name, 'photo': user.photo}, broadcast=True)

if __name__ == '__main__':
    create_tables()
    socketio.run(app)
