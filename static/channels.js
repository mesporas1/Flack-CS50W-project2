//Todo:
//  4-23-2019: Need to add channelList if uninitialized whenver the page is relaoded


//Prompt user for a username if empty. Set starting value of user if empty


// Displays user
document.addEventListener('DOMContentLoaded', () => {
    console.log(userList);
    if (!localStorage.getItem('user') || localStorage.getItem('user') == null || localStorage.getItem('user') == "null"){
        //localStorage.setItem('user', "Null");
        user = window.prompt("Please enter a username", "Enter username");
        console.log(userList.indexOf(user));
        if (userList.indexOf(user) >= 0){
            //console.log('hello');
            alert("User exists!");
            document.location.reload();
        }
        else{
        localStorage.setItem('user', user);
        updateUserList();
        document.location.reload();   
        };
    }
    else {
        document.querySelector('#user').innerHTML = "Welcome, " + localStorage.getItem('user');
    }
    //document.querySelector('#user').innerHTML = "Welcome, " + localStorage.getItem('user');
    if (!localStorage.getItem('currentChannel')) {
        document.querySelector("#channelSelection").innerHTML += "Not Selected";
        localStorage.setItem('prevChannel', null);
    }
    else {
    document.querySelector("#channelSelection").innerHTML += localStorage.getItem('currentChannel');
    initMessageList();
    initChannelUserList();
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
            var channelExists = false;
            document.querySelectorAll('.dropdown-item').forEach(function(existingChannel){
                if (existingChannel.innerHTML == channel){
                    channelExists = true;
                }
            });
            if (channelExists == true){
                alert("Channel exists! Please enter a channel that does not exist!");
            }
            else{
            socket.emit('add channel', {'channel': channel});
            document.querySelector('#channel').value = "";
            }    
        };

        document.querySelector('#submitMessage').onclick = () => {
            const message = document.querySelector('#message').value;
            socket.emit('add message', {'message': message, 'user':localStorage.getItem('user'), 'channel':localStorage.getItem('currentChannel')});
            document.querySelector('#message').value = "";
        };

        /*document.querySelectorAll('.dropdown-item').forEach(button =>{
            button.onclick = () => {
                const prevChannelName = localStorage.getItem('currentChannel');
                localStorage.setItem('prevChannel', prevChannelName);
                const channelName = button.innerHTML;
                localStorage.setItem('currentChannel', channelName);
                const user = localStorage.getItem('user');
                socket.emit('select channel', {'prevChannelName' : prevChannelName,'channelName': channelName, 'user': user});
                document.location.reload();
            }
        });*/
    });

            
    socket.on('update channels', data => {
            const channel = createChannelElement(data.channel);            
            document.querySelector('#channels').append(channel);
	        //document.location.reload();
    });

    socket.on('update messages', data => {
        const message = document.createElement('li');
        message.innerHTML = data.message;
        if (localStorage.getItem('currentChannel') == data.channelName){
        document.querySelector('#messages').append(message);
        }
    });
    
    socket.on('update users', data => {
        const user = document.createElement('li');
        user.innerHTML = data.user;
        user.setAttribute("id", data.user);
        if (localStorage.getItem('currentChannel') == data.channelName){
            document.querySelector('.online-users').append(user);
            }
        if (localStorage.getItem('currentChannel') == data.prevChannelName){
            var element = document.getElementById(data.user);
            element.parentNode.removeChild(element);
	    console.log("The old user was removed from this channel!");
        }
    });
        
});

//End of onloaded function

function updateUserList() {
    const request = new XMLHttpRequest();
    request.open('POST', '/updateUserList');
    if (localStorage.getItem('currentChannel')){
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        data.forEach(function(onlineUser){
            const user = document.createElement('li');
            user.innerHTML = onlineUser;
            document.querySelector('.online-users').append(user);
        });
    }
    };   
    const data = new FormData();
    data.append('user', localStorage.getItem('user'));
    if (localStorage.getItem('currentChannel')){
        data.append('currentChannel', localStorage.getItem('currentChannel'));
    }
    request.send(data);
};

function initMessageList() {
    const request = new XMLHttpRequest();
    request.open('POST', '/messageList');
    request.onload = () => {
    	const data = JSON.parse(request.responseText);
        data.forEach(add_message);
    };

    const data = new FormData();
    data.append('channelName', localStorage.getItem('currentChannel'));
    request.send(data);
};

function add_message(messageText) {
    const message = document.createElement('li');
    message.innerHTML = messageText;
    document.querySelector('#messages').append(message);
};

function initChannelList() {

    const request = new XMLHttpRequest();
    request.open('POST', '/channelList');
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        data.forEach(add_channel);
    };

    const data = new FormData();

    request.send(data);

};

function initChannelUserList() {
    const request = new XMLHttpRequest();
    request.open('POST', '/channelUsers');
    request.onload = () => {
    	const data = JSON.parse(request.responseText);
        data.forEach(add_user);
    };

    const data = new FormData();
    data.append('channelName', localStorage.getItem('currentChannel'));
    request.send(data);
};

function add_user(username) {
    const user = document.createElement('li');
    user.innerHTML = username;
    user.id = username;
    document.querySelector('.online-users').append(user);
};

//const channel_template = Handlebars.compile(document.querySelector('#channel-item').innerHTML);
//console.log(channel_template);
function add_channel(channelName) {
    //Create new channel
    const channel = createChannelElement(channelName);
    //Add channel to DOM
    document.querySelector('#channels').append(channel);
};

function createChannelElement(channelName) {
    const channel = document.createElement('button');
    channel.className = 'dropdown-item';
    //channel.type = 'button';
    channel.innerHTML = channelName;
    channel.onclick = () => {
        const request = new XMLHttpRequest();
        request.open('POST', '/updateChannelList');
        
        request.onload = () => {
	    const prevChannelName = localStorage.getItem('currentChannel');
            localStorage.setItem('prevChannel', prevChannelName);
            localStorage.setItem('currentChannel', channelName);
	    document.location.reload();  
        };
        
        const data = new FormData();
        data.append('user', localStorage.getItem('user'));
        data.append('currentChannel', channelName);
        data.append('prevChannel', localStorage.getItem('prevChannel'));
        console.log("user is " + localStorage.getItem('user'));
        console.log("currentChannel is " + channelName);
        console.log("prev channel is " + localStorage.getItem('prevChannel'));
        
        request.send(data);
    };
    return channel;
};

function channelButtonFunction(channelName){
    
    
    
};
