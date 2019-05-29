import os
import requests
from datetime import datetime

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit
from classes import *

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channelList = {}


#@app.route("/")
#def index():

    #return render_template("index.html")

#channelList gets sent to client when channels.html is loaded
@app.route("/")
def channels():
    return render_template("channels.html")

@app.route("/channelList", methods=["POST"])
def getChannelList():
    values = channelList.values()
    data = []
    for channel in values:
        data.append(channel.name)
    print(jsonify(data))   
    return (jsonify(data))

#@app.route("/newChannel", methods=["POST"])
@socketio.on("add channel")
def newChannel(data):
    channelName = data["channel"]
    print(channelName)
    channelList[channelName] = Channel(channelName)
    print(channelList[channelName])
    emit("update channels", {"channel": channelName}, broadcast = True)

@socketio.on("select channel")
def getChannel(data):
    channelInfo = channelList[data["channelName"]]
    channelInfo.userlist.append(data["user"])
    print(channelInfo.userlist)
    test = channelInfo.userlist
    test2 = jsonify(test)
    print(test2)
    emit("update users", {"users": test})


@socketio.on("add message")
def newMessage(data):
    channelName = data["channel"]
    user = data["user"]
    message = data["message"]
    now = datetime.now()
    date_time = now.strftime("%m/%d/%Y, %H:%M:%S: ")	
    message = date_time + user + ": " + message
    channel = channelList[channelName]
    channel.messages.append(message)
    print(channel.messages)
    emit("update messages", {"message": message}, broadcast = True)
