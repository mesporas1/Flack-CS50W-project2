import os
import requests


from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit
from classes import *

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channelList = {}


@app.route("/")
def index():

    return render_template("index.html")

#channelList gets sent to client when channels.html is loaded
@app.route("/channels")
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

@app.route("/channel/<string:channelName>")
def getChannel(channelName):
    print("testing123")
    