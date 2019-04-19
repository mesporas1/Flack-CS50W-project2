#import os
import requests

from flask import Flask, jsonify, render_template, request
#from flask_socketio import SocketIO, emit

app = Flask(__name__)
#app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
#socketio = SocketIO(app)

channelList = []


@app.route("/")
def index():
    return render_template("index.html")

    
@app.route("/channels")
def channels():
    return render_template("channels.html")

@app.route("/newChannel", methods=["POST"])
def newChannel():
    channel = request.form.get("channel")
    print(channel)
    channelList.append(channel)
    print(channelList)
    return jsonify(channelList)