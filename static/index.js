// Set starting value of counter to 0
if (!localStorage.getItem('user'))
localStorage.setItem('user', "Null");

// Load current value of  counter
document.addEventListener('DOMContentLoaded', () => {
document.querySelector('#user').innerHTML = localStorage.getItem('user');

// Count every time button is clicked
document.querySelector('form').onsubmit = () => {
    
    const user = document.querySelector('#user').value;

    // Update counter
    document.querySelector('#user').innerHTML = user;
    localStorage.setItem('user', user);
    //alert(`Hello ${localStorage.getItem('user')}`)
}
});