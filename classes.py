import collections

#Creates a channel class that includes a queue of messages and a user list
class Channel:
    def __init__(self):
        self.messages = collections.deque(maxlen=100)
        self.userlist = {}