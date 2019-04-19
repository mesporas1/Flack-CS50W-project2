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

    document.querySelector('#form').onsubmit = () => {

        //Below code adds a channel to the list but also stores the information on the server
        const request = new XMLHttpRequest();
        const channel = document.querySelector('#channel').value;
        console.log(channel);
        console.log(request);
        request.open('POST', '/newChannel');

        request.onload = () => {
            const channels = JSON.parse(request.responseText);
            const li = document.createElement('li');
            li.innerHTML = channels[channels.length - 1];
            document.querySelector("#channels").append(li);

            console.log(channels)
        }

        //Add data to send with request
        const data = new FormData();
        data.append('channel', channel)

        //Send Request
        request.send(data);
        return false;
        };    




//End of onloaded function
});