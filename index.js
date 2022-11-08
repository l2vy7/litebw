const { app, BrowserWindow, ipcMain, webContents } = require("electron");
var path = require("path");
var { TurtleClient } = require("blacket-turtle");
var { request } = require("blacket-turtle/dist/trtl/util/request.js");
var fs = require("fs");

var window;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "app", "preload.js"),
      contextIsolation: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
    },
    icon: path.join(__dirname, "static", "icon.ico"),
  });

  win.loadFile("index.html");

  ipcMain.handle("close", (event) => win.close());
  ipcMain.handle("min", (event) => win.minimize());
  ipcMain.handle("max", (event) => win.maximize());

  window = win;
};

var client;

ipcMain.handle("load", (event) => {
  if (fs.existsSync("./data/data.json"))
    return JSON.parse(fs.readFileSync("./data/data.json").toString());
  else {
    fs.writeFileSync(
      "./data/data.json",
      JSON.stringify({
        alts: [],
      })
    );
    return { alts: [] };
  }
});

var inst;

ipcMain.handle("upLogin", async (event, s) => {
  var dat = JSON.parse(fs.readFileSync("./data/data.json").toString());
  var ret = true;
  try {
    inst = s[2];
    var resp = await request.post(
      "https://v2.blacket.org/worker/login",
      {
        username: s[0],
        password: s[1],
      },
      {
        headers: {
          Cookie: "",
        },
      }
    );
    var cook = resp.headers
      .get("set-cookie")[0]
      .split("; ")[0]
      .replace("connect.sid=", "");
    client = new TurtleClient(cook, s[2]);
    client.socketOn("chat", async (data) => {
      window.webContents.send("event", ["rmes", data]);
    });
    if (dat.alts.filter((x) => x[0] == s[0]).length == 0)
      dat.alts.push([s[0], s[1], s[2]]);
    fs.writeFileSync("./data/data.json", JSON.stringify(dat));
  } catch (e) {
    console.log(e);
    ret = false;
  }
  return ret;
});

ipcMain.handle("login", (event, s) => {
  var ret = true;
  try {
    client = new TurtleClient(s[0], s[1]);
    client.socketOn("chat", async (data) => {
      window.webContents.send("event", ["rmes", data]);
    });
    inst = s[1];
  } catch (e) {
    console.log(e);
    ret = false;
  }
  return ret;
});

ipcMain.handle("user", async (event, s) => {
  try {
    var x = (await client.getUser(s)).data;
    return x;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("config", async (event, s) => {
  try {
    var x = (await client.getConfig()).data;
    if (x.error) throw ":(";
    else return x;
  } catch (e) {
    console.log(e);
    return false;
  }
});

ipcMain.handle("instance", async (event, s) => inst);

ipcMain.handle("emit", async (event, s) => await client.socketEmit(s[0], s[1]));

ipcMain.handle("daily", async (event) => (await client.claim()).data);

ipcMain.handle("open", async (event, n) => (await client.openBox(n)).data);

ipcMain.handle("blooks", async (event) => (await client.getBlooks()).data);

ipcMain.handle("packs", async (event) => (await client.getPacks()).data);

ipcMain.handle("rarities", async (event) => (await client.getRarities()).data);

ipcMain.handle("chatmessages", async (event, r) => (await client.getExistingMessages(r)).data.message.msgs);

const redact = require('@princedev/redact');
var swearjar = require('swearjar');
var Filter = require('bad-words'),
    filter = new Filter();



ipcMain.handle("censor", async (event, t) => redact(swearjar.censor(filter.clean(t))))

app.on("ready", createWindow);
