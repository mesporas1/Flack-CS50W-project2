//Todo:
//  4-23-2019: Need to add channelList if uninitialized whenver the page is relaoded




// Set starting value of user if empty
if (!localStorage.getItem('user'))
localStorage.setItem('user', "Null");

// Displays user
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#user').innerHTML = localStorage.getItem('user');

    initChannelList();

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
        document.querySelector('#submit').onclick = () => {
            const channel = document.querySelector('#channel').value;
            socket.emit('add channel', {'channel': channel})
            document.querySelector('#channel').value = "";
        };
    });
            
    socket.on('update channels', data => {
            console.log("the initial data is " + data.channel)
            const channel = channel_template({'channelName': data.channel});
            //li.innerHTML = data.channel;
            console.log(channel);
            document.querySelector('#channels').innerHTML += channel;
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

const channel_template = Handlebars.compile(document.querySelector('#channel-item').innerHTML);
console.log(channel_template);
function add_channel(channelName) {
    //Create new channel
    const channel = channel_template({'channelName': channelName});
    console.log(channel);
    //Add channel to DOM
    document.querySelector('#channels').innerHTML += channel;
};
