//Todo:
//  4-23-2019: Need to add channelList if uninitialized whenver the page is relaoded




// Set starting value of user if empty
if (!localStorage.getItem('user'))
localStorage.setItem('user', "Null");

// Displays user
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#user').innerHTML = "Welcome, " + localStorage.getItem('user');
    if (localStorage.getItem('channelSelection') == null) {
        document.querySelector("#channelSelection").innerHTML += "Not Selected";
    }
    initChannelList();

    // By default, submit button is disabled
    document.querySelector('#submitChannel').disabled = true;

    // Enable button only if there is text in the input field
    document.querySelector('#channel').onkeyup = () => {
        if (document.querySelector('#channel').value.length > 0)
            document.querySelector('#submitChannel').disabled = false;
        else
            document.querySelector('#submitChannel').disabled = true;
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#submitChannel').onclick = () => {
            const channel = document.querySelector('#channel').value;
            socket.emit('add channel', {'channel': channel});
            document.querySelector('#channel').value = "";
        };

        /*document.querySelector('#submitMessage').onclick = () => {
            const message = document.querySelector('#message').value;
            const currentChannel = document.querySelector()
            socket.emit('add message', {'message': message})
            document.querySelector('#message').value = "";
        };*/

        document.querySelectorAll('.dropdown-item').forEach(button =>{
            button.onclick = () => {
                const channelName = button.innerHTML;
                const user = localStorage.getItem('user');
                socket.emit('select channel', {'channelName': channelName, 'user': user});
            }
        });
    });

            
    socket.on('update channels', data => {
            console.log("the initial data is " + data.channel)
            const channel = createChannelElement(data.channel);            
            console.log(channel);
            document.querySelector('#channels').append(channel)
	    document.location.reload();
    });

    socket.on('update users', data => {
            
    })
    
        
});

//End of onloaded function




function initChannelList() {

    const request = new XMLHttpRequest();
    request.open('POST', '/channelList');
    console.log(request);
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        console.log(data);
        data.forEach(add_channel);
    };

    const data = new FormData();

    request.send(data);

};

//const channel_template = Handlebars.compile(document.querySelector('#channel-item').innerHTML);
//console.log(channel_template);
function add_channel(channelName) {
    //Create new channel
    const channel = createChannelElement(channelName);
    console.log(channel);
    //Add channel to DOM
    document.querySelector('#channels').append(channel);
};

function createChannelElement(channelName) {
    const channel = document.createElement('button');
    channel.className = 'dropdown-item';
    //channel.type = 'button';
    channel.innerHTML = channelName;
    //channel.href = "/channel/" + channelName;
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    console.log("hello socket");
    /*socket.on('connect', () => {
        .onclick = () => {
            const user = localStorage.getItem('user');
            socket.emit('select channel', {'channelName': channelName, 'user': user});
        }
    });*/
    return channel;
};


