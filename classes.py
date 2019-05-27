import collections


#Creates a channel class that includes a queue of messages and a user list
class Channel:
    def __init__(self, name):
        self.messages = collections.deque(maxlen=100)
        self.userlist = []
        self.name = name
class User:
    def __init__(self,name,lastChannel):
        self.username = name
        self.lastChannel = ""


channel1 = Channel("channel1")
channel2 = Channel("channel2")
channel1.messages.append("Hello there")
channel2.messages.append("Goodbye there")
channelList = {}
#channelList["test"] = Channel("test")
#channelList["test1"] = Channel("test1")
#channelList["test2"] = Channel("test2")
values = channelList.values()
for channel in values:
    print(channel.name)
