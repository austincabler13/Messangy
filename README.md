# Real-time Messaging App (Deno + Flask)

This is a real-time messaging app built using Flask, Socket.IO, PostgreSQL, and Tailwind CSS, with Deno for frontend JavaScript management.

## Features

- Real-time chat with Socket.IO
- User accounts (registration, login)
- Customizable profiles (name, bio, profile photo)
- Emoji support in chat
- Responsive UI using Tailwind CSS
- Deno for frontend dependency management

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/your-repo/messaging-app.git
    cd messaging-app
    ```

2. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Set up PostgreSQL and configure the database URI in `config.py`.

4. Initialize the database:

    ```bash
    flask db init
    flask db migrate
    flask db upgrade
    ```

5. Install Deno (if not installed):

    ```bash
    curl -fsSL https://deno.land/install.sh | sh
    ```

6. Run the build task using Deno to compile Tailwind CSS:

    ```bash
    deno task build
    ```

7. Run the Flask app:

    ```bash
    deno task start
    ```

## Deployment

You can deploy this application to platforms like Heroku or use Deno's deploy platform.

## License

This project is licensed under the MIT License.
