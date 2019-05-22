import collections
from flask import jsonify

#Creates a channel class that includes a queue of messages and a user list
class Channel:
    def __init__(self, name):
        self.messages = collections.deque(maxlen=100)
        self.userlist = {}
        self.name = name

channel1 = Channel("channel1")
print(channel1.name)
channel1.messages.append("Hello there")
channelList = {}
channelList["test"] = Channel("test")
print(channelList["test"].name)


print(jsonify(channelList))