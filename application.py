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
userList = []

#@app.route("/")
#def index():

    #return render_template("index.html")

#channelList gets sent to client when channels.html is loaded

@app.route("/")
def channels():
    return render_template("channels.html", userList = userList)

@app.route("/updateUserList", methods = ["POST"])
def updateUserList():
    user = request.form.get("user")
    userList.append(user)
    channelName = request.form.get("currentChannel")
    if channelName is not None:
        channelInfo = channelList[channelName]
        channelUserList = channelInfo.userlist
        return (jsonify(channelUserList))
    return "true"

@app.route("/updateChannelList", methods=["POST"])
def updateChannelList():
    user = request.form.get("user")
    print("the user is " + user)
    channelName = request.form.get("currentChannel")
    print("the new channel is " + channelName)
    prevChannelName = request.form.get("prevChannel")
    print(type(prevChannelName))
    print("the prevchannel is " + prevChannelName)
    if prevChannelName != 'null':
        print(prevChannelName)
        prevChannelInfo = channelList[prevChannelName]
        prevChannelInfo.userlist.remove(user)
        print(prevChannelInfo.userlist)
    channelInfo = channelList[channelName]
    channelInfo.userlist.append(user)
    print(channelInfo.userlist)
    print("channel has been selected")
    socketio.emit("update users", {"user": user, "channelName": channelName, "prevChannelName": prevChannelName}, broadcast = True)


@app.route("/channelUsers", methods=["POST"])
def getChannelUserList():
    channelName = request.form.get("channelName")
    channel = channelList[channelName]
    data = []
    for users in channel.userlist:
        data.append(users)
    return (jsonify(data))

@app.route("/channelList", methods=["POST"])
def getChannelList():
    values = channelList.values()
    data = []
    for channel in values:
        data.append(channel.name)  
    return (jsonify(data))

@app.route("/messageList", methods=["POST"])
def getMessageList():
    channelName = request.form.get("channelName")
    channel = channelList[channelName]
    data = []
    for messages in channel.messages:
        data.append(messages)
    return (jsonify(data))

#@app.route("/newChannel", methods=["POST"])
@socketio.on("add channel")
def newChannel(data):
    channelName = data["channel"]
    channelList[channelName] = Channel(channelName)
    emit("update channels", {"channel": channelName}, broadcast = True)

@socketio.on("select channel")
def getChannel(data):
    user = data["user"]
    channelName = data["channelName"]
    prevChannelName = data["prevChannelName"]
    if data["prevChannelName"] is not None:
        prevChannelName = data["prevChannelName"]
        prevChannelInfo = channelList[prevChannelName]
        prevChannelInfo.userlist.remove(user)
    channelInfo = channelList[channelName]
    channelInfo.userlist.append(user)
    emit("update users", {"user": user, "channelName": channelName, "prevChannelName": prevChannelName}, broadcast = True)


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
    emit("update messages", {"message": message, "channelName":channelName}, broadcast = True)

