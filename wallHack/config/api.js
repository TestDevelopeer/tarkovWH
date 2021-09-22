const configApi = {
    dev: {
        SERVER_URI: 'http://testdeveloper.ru/wallhackapi'
    },
    prod: {
        SERVER_URI: 'http://testdeveloper.ru/wallhackapi'
    }
};
if (process.env.NODE_ENV === 'dev') {module.exports = configApi['dev']}
else {module.exports = configApi['prod'];}