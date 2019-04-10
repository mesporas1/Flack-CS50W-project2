// Set starting value of user if empty
if (!localStorage.getItem('user'))
localStorage.setItem('user', "Null");

// Displays user
document.addEventListener('DOMContentLoaded', () => {
document.querySelector('#user').innerHTML = localStorage.getItem('user');

// By default, submit button is disabled
document.querySelector('#submit').disabled = true;

// Enable button only if there is text in the input field
document.querySelector('#channel').onkeyup = () => {
    if (document.querySelector('#channel').value.length > 0)
        document.querySelector('#submit').disabled = false;
    else
        document.querySelector('#submit').disabled = true;
};

document.querySelector('#new-channel').onsubmit = () => {

    // Create new item for list
    const li = document.createElement('li');
    li.innerHTML = document.querySelector('#channel').value;

    // Add new item to task list
    document.querySelector('#channels').append(li);

    // Clear input field and disable button again
    document.querySelector('#channel').value = '';
    document.querySelector('#submit').disabled = true;

    // Stop form from submitting
    return false;
    };    

});