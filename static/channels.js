//Todo:
//  4-23-2019: Need to add channelList if uninitialized whenver the page is relaoded


//Prompt user for a username if empty. Set starting value of user if empty


// Displays user
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('user') || localStorage.getItem('user') == null || localStorage.getItem('user') == "null"){
        //localStorage.setItem('user', "Null");
        user = window.prompt("Please enter a username", "Enter username");
        localStorage.setItem('user', user);
        document.location.reload();   
    }
    else {
        document.querySelector('#user').innerHTML = "Welcome, " + localStorage.getItem('user');
    }
    //document.querySelector('#user').innerHTML = "Welcome, " + localStorage.getItem('user');
    if (!localStorage.getItem('currentChannel')) {
        document.querySelector("#channelSelection").innerHTML += "Not Selected";
    }
    else {
	document.querySelector("#channelSelection").innerHTML += localStorage.getItem('currentChannel');
    };
	

    // By default, submit button is disabled
    document.querySelector('#submitChannel').disabled = true;

    // Enable button only if there is text in the input field
    document.querySelector('#channel').onkeyup = () => {
        if (document.querySelector('#channel').value.length > 0)
            document.querySelector('#submitChannel').disabled = false;
        else
            document.querySelector('#submitChannel').disabled = true;
    };

    initChannelList();

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#submitChannel').onclick = () => {
            const channel = document.querySelector('#channel').value;
            socket.emit('add channel', {'channel': channel});
            document.querySelector('#channel').value = "";
        };

        document.querySelector('#submitMessage').onclick = () => {
            const message = document.querySelector('#message').value;
            socket.emit('add message', {'message': message, 'user':localStorage.getItem('user'), 'channel':localStorage.getItem('currentChannel')});
            document.querySelector('#message').value = "";
        };

        document.querySelectorAll('.dropdown-item').forEach(button =>{
            button.onclick = () => {
                const channelName = button.innerHTML;
                localStorage.setItem('currentChannel', channelName);
                const user = localStorage.getItem('user');
                socket.emit('select channel', {'channelName': channelName, 'user': user});
                document.location.reload();
            }
        });
    });

            
    socket.on('update channels', data => {
            console.log("the initial data is " + data.channel)
            const channel = createChannelElement(data.channel);            
            console.log(channel);
            document.querySelector('#channels').append(channel);
	        document.location.reload();
    });

    socket.on('update messages', data => {
        console.log(data.message);
        const message = document.createElement('li');
        message.innerHTML = data.message;
        document.querySelector('#messages').append(message);
    });
    
        
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
    //var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    //console.log("hello socket");
    /*socket.on('connect', () => {
        .onclick = () => {
            const user = localStorage.getItem('user');
            socket.emit('select channel', {'channelName': channelName, 'user': user});
        }
    });*/
    return channel;
};


