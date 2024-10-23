// Establish socket connection
const socket = io();

// DOM elements
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatWindow = document.getElementById('chat-window');
const emojiButton = document.getElementById('emoji-button');
const emojiPicker = document.getElementById('emoji-picker');
const profileForm = document.getElementById('profile-form');

// Load and show emojis
const emojiList = ['😀', '😂', '😍', '😎', '👍', '🔥', '🎉', '💯', '❤️', '🤣'];
emojiList.forEach(emoji => {
    const emojiElement = document.createElement('button');
    emojiElement.textContent = emoji;
    emojiElement.classList.add('emoji-btn');
    emojiPicker.appendChild(emojiElement);

    // Handle emoji selection
    emojiElement.addEventListener('click', () => {
        messageInput.value += emoji;
        emojiPicker.classList.toggle('hidden');
    });
});

// Show/Hide emoji picker
emojiButton.addEventListener('click', () => {
    emojiPicker.classList.toggle('hidden');
});

// Send message event
messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message !== '') {
        socket.emit('message', message);  // Send message to server
        messageInput.value = '';  // Clear input
    }
});

// Receive message event
socket.on('message', function (data) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', 'items-center', 'mb-2');

    // User's profile photo or default avatar
    const profilePic = document.createElement('img');
    profilePic.src = data.photo ? data.photo : '/static/default-avatar.png';
    profilePic.classList.add('w-8', 'h-8', 'rounded-full', 'mr-2');

    // Message content (with user's name)
    const messageContent = document.createElement('div');
    messageContent.classList.add('bg-gray-200', 'p-2', 'rounded-lg', 'shadow-sm');
    messageContent.innerHTML = `<strong>${data.name || data.username}:</strong> ${data.message}`;

    // Append to chat window
    messageElement.appendChild(profilePic);
    messageElement.appendChild(messageContent);
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;  // Scroll to bottom
});

// Handle profile form submission (for profile customization)
if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const formData = new FormData(profileForm);
        
        fetch('/profile', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Profile updated successfully!');
                location.reload();  // Reload the page to apply changes
            } else {
                alert('Failed to update profile.');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}
