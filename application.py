import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channelList = []


@app.route("/")
def index():
    return render_template("index.html")

#channelList gets sent to client when channels.html is loaded
@app.route("/channels")
def channels():
    return render_template("channels.html", channelList = channelList)

#@app.route("/newChannel", methods=["POST"])
@socketio.on("add channel")
def newChannel(data):
    channel = data["channel"]
    print(channel)
    channelList.append(channel)
    print(channelList)
    emit("update channels", {"channel": channel}, broadcast = True)
