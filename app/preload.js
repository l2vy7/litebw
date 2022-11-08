var { contextBridge, ipcRenderer } = require("electron");

var socketHooks = [];

ipcRenderer.on("event", (c) => {
  for (var x of socketHooks) if (c[0] === x[0]) x[1](c[1]);
});

var turtl = {
  uPassLogin: async (a) => {
    return await ipcRenderer.invoke("upLogin", a);
  },
  login: async (a) => {
    return await ipcRenderer.invoke("login", a);
  },
  emit: async (name, value) => {
    return await ipcRenderer.invoke("emit", [name, value]);
  },
  on: (name, cb) => socketHooks.push([name, cb]),
  logout: async (thing) => {
    return await ipcRenderer.invoke("logout");
  },
  send: async (message) => {
    return await ipcRenderer.invoke("send", message);
  },
  claimDaily: async () => {
    return await ipcRenderer.invoke("daily");
  },
  openBox: async (name) => {
    return await ipcRenderer.invoke("open", name);
  },
  sellBlook: async (name, quantity) => {
    return await ipcRenderer.invoke("sell", [name, quantity]);
  },
  setPfp: async (name) => {
    return await ipcRenderer.invoke("pfp", name);
  },
  setBanner: async (name) => {
    return await ipcRenderer.invoke("banner", name);
  },
  changeUsername: async (name, password) => {
    return await ipcRenderer.invoke("usernameSet", [name, password]);
  },
  changePassword: async (old, password) => {
    return await ipcRenderer.invoke("passwordSet", [old, password]);
  },
  getNews: async () => {
    return await ipcRenderer.invoke("news");
  },
  getPacks: async () => {
    return await ipcRenderer.invoke("packs");
  },
  getRarities: async () => {
    return await ipcRenderer.invoke("rarities");
  },
  getBlooks: async () => {
    return await ipcRenderer.invoke("blooks");
  },
  getConfig: async () => {
    return await ipcRenderer.invoke("config");
  },
  getLeaderboard: async () => {
    return await ipcRenderer.invoke("leaderboard");
  },
  getChatMessages: async () => {
    return await ipcRenderer.invoke("chatmessages", "0room");
  },
  getUser: async (name) => {
    return await ipcRenderer.invoke("user", name);
  },
  getData: async () => {
    return await ipcRenderer.invoke("load");
  },
  getInstance: async () => {
    return await ipcRenderer.invoke("instance");
  }
};

contextBridge.exposeInMainWorld("turtl", turtl);
