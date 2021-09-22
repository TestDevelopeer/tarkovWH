const fs = require('fs');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 5000;
const path = require('path');
const {machineId, machineIdSync} = require('node-machine-id');
const axios = require('axios');
const api = require('./config/api');
const Store = require('electron-store');
const store = new Store();

const instance = axios.create({
    baseURL: api.SERVER_URI,
    withCredentials: true,
    headers: {
        "User-Agent": "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion"
    }
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let configFile = path.resolve(__dirname + '/config/', 'config.json');
let config = fs.readFileSync(configFile);
config = JSON.parse(config);

const getFiles = (dir, files_) => {
    files_ = files_ || [];
    try {
        let files = fs.readdirSync(dir);
        for (let i in files) {
            if (files[i] === 'UnityCrashHandler64.exe' || files[i] === 'UnityPlayer.dll') {
                files_.push(files[i]);
            }
        }
        return files_;
    } catch (err) {
        return [];
    }
}

app.post('/init/', (request, response) => {
    let result;
    if (config.licKey.length === 16) {
        const userIdSync = machineIdSync({original: true});
        const pathCheat = path.resolve("./").replace(/\\/g, "/");
        instance.post(`/user/initialize/`, {
            licKey: config.licKey,
            pathCheat: pathCheat,
            userIdSync: userIdSync
        }).then(function (res) {
            if (res.data.resultCode === 1) {
                store.set('user', res.data.user);
                let user = store.get('user');
                if (user.user_gamePath.length > 0) {
                    if (getFiles(user.user_gamePath).length === 2) {
                        result = {success: 1, message: user.user_gamePath};
                    } else {
                        result = {
                            success: 0,
                            message: 'Неверный путь к игре',
                            yourPath: user.user_gamePath,
                            showButtons: true
                        };
                    }
                } else {
                    result = {success: 0, message: 'Не указан путь к игре', showButtons: true};
                }
                response.json(result);
            } else {
                result = {success: 0, message: res.data.message, showButtons: res.data.showButtons === false ? res.data.showButtons : true};
                response.json(result);
            }
        }).catch(function (err) {
            result = {success: 0, message: 'Ошибка при обращении к серверу', showButtons: false};
            response.json(result);
        });
    } else {
        result = {success: 0, message: 'Неверные данные', showButtons: false};
        response.json(result);
    }
});

app.post('/setgamepath/', (request, response) => {
    const {pathGame} = request.body;
    if (pathGame.length > 3) {
        let user = store.get('user');
        let result;
        let pathTarkov = pathGame.replace(/\\/g, "/");
        if (getFiles(pathTarkov).length === 2 && user.user_licKey.length === 16) {
            instance.post(`/user/setgamepath/`, {
                licKey: user.user_licKey,
                pathTarkov: pathTarkov,
                userIdSync: user.user_uniqueKey
            }).then(function (res) {
                if (res.data.resultCode === 1) {
                    store.set('user.user_gamePath', res.data.gamePath);
                    result = {success: 1};
                    console.log('Game path was added');
                    response.json(result);
                } else {
                    result = {success: 0, message: res.data.message, showButtons: res.data.showButtons === false ? res.data.showButtons : true};
                    response.json(result);
                }
            }).catch(function (err) {
                result = {success: 0, message: 'Ошибка при обращении к серверу', showButtons: false};
                response.json(result);
            });
        } else {
            result = {success: 0, message: 'Неверный путь к корневой папке игры', showButtons: true};
            response.json(result);
        }
    }
});

app.post('/checkuser/', (request, response) => {
    const {licKey} = request.body;
    const userIdSync = machineIdSync({original: true});
    const user = store.get('user');
    let result;
    if (licKey.length === 16 && config.licKey === user.user_licKey && user.user_licKey === licKey && user.user_uniqueKey === userIdSync) {
        instance.post(`/user/checkuser/`, {
            licKey: licKey,
            userIdSync: userIdSync
        }).then(function (res) {
            if (res.data.resultCode === 1) {
                result = {success: 1, userInfo: {name: user.user_nickname, endDate: user.user_endDate}};
                response.json(result);
            } else {
                result = {success: 0, message: res.data.message, showButtons: res.data.showButtons === false ? res.data.showButtons : true};
                response.json(result);
            }
        }).catch(function (err) {
            result = {success: 0, message: 'Ошибка при обращении к серверу', showButtons: false};
            response.json(result);
        });
    } else {
        result = {success: 0, message: 'Неверный ключ', showButtons: true};
        response.json(result);
    }
});

app.get('/setcheatfile/', (request, response) => {
    let result;
    let user = store.get('user');
    try {
        fs.copyFileSync(path.resolve(__dirname + '/config/', 'shaders'), user.user_gamePath + "/EscapeFromTarkov_Data/StreamingAssets/Windows/shaders");
        result = {success: 1};
    } catch (err) {

        result = {success: 0, message: 'Не удалось заменить файлы игры', showButtons: true};
    }
    response.json(result);
});

app.get('/backupfile/', (request, response) => {
    let result;
    let user = store.get('user');
    try {
        fs.copyFileSync(path.resolve(__dirname + '/back/', 'shaders'), user.user_gamePath + "/EscapeFromTarkov_Data/StreamingAssets/Windows/shaders");
        result = {success: 1};
    } catch (err) {
        result = {success: 0, message: 'Не удалось восстановить файлы игры', showButtons: true};
    }
    response.json(result);
});

server.listen(PORT, (error) => {
    if (error) {
        throw Error(error);
    } else {
        console.log('Server was start ' + PORT);
    }
});