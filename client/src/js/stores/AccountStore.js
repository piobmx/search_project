import EventEmitter from 'events';
import Helpers from '../utils/Helpers'

let state = {
    userId: localStorage.getItem("user-id") || '',
    sessionId: localStorage.getItem("session-id") || '',
    groupId: localStorage.getItem("group-id") || '',
    task: {
        id: localStorage.getItem("task-id") || '',
        data: JSON.parse(localStorage.getItem("task-data") === undefined ? "{}" : localStorage.getItem("task-data")) || '',
    }
};

const AccountStore = Object.assign(EventEmitter.prototype, {
    getUserId() {
        return state.userId;
    },
    getSessionId() {
        return state.sessionId;
    },
    getGroupId() {
        return state.groupId;
    },
    getUserTopic() {
        return state.topic;
    },
    getTask() {
        return state.task;
    },
    getTaskId() {
        return state.task.id;
    },
    getTaskData() {
        return state.task.data;
    },

    // WARNING: using the setter methods below violates flux architecture, and will not cause components to be updated
    // If changes need to be propagated from this store, event dispatch methods need to be added, and actions with a
    // dispatcher need to be used instead of setter methods.
    setUserTopic(topic) {
        state.topic = topic;
        localStorage.setItem("user-topic", topic);
        console.log('userID SET');
    },
    setUserId(userId) {
        state.userId = userId;
        localStorage.setItem("user-id", userId);
        console.log('userID SET');
    },

    setSessionId(sessionId) {
        state.sessionId = sessionId;
        localStorage.setItem("session-id", sessionId);
    },

    setGroupId(groupId) {
        state.groupId = groupId;
        localStorage.setItem("group-id", groupId);
    },


    setTask(id, data) {
        state.task.id = id;
        state.task.data = data;
        localStorage.setItem("task-id", id);
        localStorage.setItem("task-data", JSON.stringify(data));
    },

    clearTask() {
        state.task = '';
        localStorage.removeItem("task-id");
        localStorage.removeItem("task-data");
    },

    clearUserData() {
        state.userId = '';
        state.sessionId = '';
        localStorage.clear();
    }
});

// set userId and groupId if specified by url parameter
const urlGroupId = Helpers.getURLParameter("groupId");
if (urlGroupId) {
    console.log('urlGroupID:', urlGroupId);
    if (urlGroupId !== state.groupId) {
        AccountStore.setUserId(Helpers.generateId());
    }
    AccountStore.setSessionId(urlGroupId);
    AccountStore.setGroupId(urlGroupId);
}

const urlUserId = Helpers.getURLParameter("userId");
if (urlUserId) {
    AccountStore.setUserId(urlUserId);
    console.log('urlUserId set:', this.state.userId);
}

// initialize random userId, sessionId, and groupId if they are not set by localstorage or url parameter
if (!state.userId) {
    AccountStore.setUserId(Helpers.generateId());
    console.log('userId Generated:', this.state.userId);
}
if (!state.sessionId) {
    const id = Helpers.generateId();
    AccountStore.setSessionId(id);
    AccountStore.setGroupId(id);
}

export default AccountStore;