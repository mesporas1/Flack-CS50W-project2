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

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#form').onsubmit = () => {
            const channel = document.querySelector('#channel').value;
            socket.emit('add channel', {'channel': channel})
        };
    });
            
    socket.on('update channels', data => {
            console.log("the initial data is " + data.channel)
            const li = document.createElement('li');
            li.innerHTML = `test: ${data.channel}`;
            document.querySelector('#channels').append(li);
    });          
});



//End of onloaded function
