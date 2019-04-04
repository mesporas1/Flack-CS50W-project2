if (!localStorage.getItem('user'))
    localStorage.setItem('user', "");

// Load current value of  counter
document.addEventListener('DOMContentLoaded', () => {
document.querySelector('#form').innterHTML = localStorage.getItem('user');

// Count every time button is clicked
    document.querySelector('form').onsubmit = () => {
    let user = localStorage.getItem('user')
    localStorage.setItem('user', user)
    alert(`Hello ${user}!`)
    }
});