// require('chromedriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const uuidV4 = require('uuid/v4');
const argv = require('yargs').argv;
const cinemaList = require('./configs/cinemaList');

let driver;

// eslint-disable-next-line prefer-const
let links = {};
const isTest = false;

let logsText = '';

let check = '';
let host = '';

if (argv.site == undefined) {
    console.log('Укажите id сайта');
    process.exit();
}

cinemaList.forEach((item) => {
    if (item.id == argv.site) {
        host = item.urls.prod.desktop;
        check = host.replace('https:', '').replace('http:', '').replace(/\//g, '');

        return false;
    }
});

const checkFile = 'logs/' + check + '.json';
const logsFile = 'logs/' + check + '.txt';

if (fs.existsSync(checkFile)) {
    links = JSON.parse(fs.readFileSync(checkFile, 'utf8'));
}

if (fs.existsSync(logsFile)) {
    logsText = fs.readFileSync(logsFile, 'utf8');
}

console.log(host);
console.log(check);

const linksParser = fs.readFileSync('scripts/linksParser.js', 'utf8');

const scriptRun = async (script) => {
    const data = driver.executeAsyncScript(script);

    return data;
};

const browserInit = () => {
    // eslint-disable-next-line spaced-comment
    // const screen = {
    //     width: 640,
    //     height: 480,
    // };

    driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options({
            perfLoggingPrefs: {
                traceCategories: 'performance',
            },
        }))
        // .headless()
        // .windowSize(screen)
        .build();

    driver.manage().setTimeouts({
        script: 10000000,
    });
};

const updateLink = (parent, link, info, visited) => {
    links[link].info = info;

    if (!links[link].visited) {
        links[link].visited = visited;
    }

    if (parent === null) return true;

    if (!links.hasOwnProperty(parent)) {
        addLink(null, parent, null, false);
    }

    links[parent].links.push(links[link].id);

    fs.writeFileSync(checkFile, JSON.stringify(links), 'utf8');
};

const addLink = (parent, link, info, visited) => {
    if (links.hasOwnProperty(link)) {
        return updateLink(parent, link, info, visited);
    };

    const id = uuidV4();

    links[link] = {
        id: id,
        visited: visited,
        links: [],
        info: info,
    };

    if (parent === null) return true;

    if (!links.hasOwnProperty(parent)) {
        addLink(null, parent, null, false);
    }

    links[parent].links.push(id);

    fs.writeFileSync(checkFile, JSON.stringify(links), 'utf8');
};

const init = () => {
    console.log('Init...');

    browserInit();

    addLink(null, host, null, false);

    bypass();
};

const has500 = (logs, link) => {
    let error = false;
    logs.forEach((item) => {
        if (isTest) {
            if (item.message.indexOf('/upload/') != -1) return false;
            if (item.message.indexOf('/hallplan_preview/') != -1) return false;
        }

        console.log(item.message);

        if (item.message.indexOf('status of 500') != -1) {
            error = true;
        }
    });

    return error;
};

const openPage = async (link) => {
    console.log(`Opening: ${link}`);

    await driver.get(link);

    const logs = await driver.manage().logs().get('browser');

    let result = [];

    logsText += link + '\n';
    logsText += JSON.stringify(logs) + '\n';
    fs.writeFileSync(logsFile, logsText, 'utf8');

    if (!has500(logs)) {
        result = await scriptRun(linksParser);
    }

    addLink(null, link, null, true);

    result.forEach((item) => {
        addLink(link, item, null, false);
    });
};

const bypass = async () => {
    console.log(Object.keys(links).length);

    let link = null;

    for (const key in links) {
        if (!links.hasOwnProperty(key)) continue;

        if (links[key].visited == true) continue;

        if (key.indexOf(check) == -1) {
            continue;
        }

        if (key.indexOf('odnoklassniki.ru') != -1 || 
        key.indexOf('twitter.com') != -1 
        || key.indexOf('vk.com') != -1 
        || key.indexOf('facebook.com') != -1 
        || key.indexOf('mail.ru') != -1 
        || key.indexOf('/admin-side') != -1 
        || key.indexOf('.jpg') != -1
        || key.indexOf('help/1003/galaktika-omsk.ru') != -1
        || key.indexOf('https://kinokaramel.net/users/extauth/') != -1
        || key.indexOf('http://fctomtomsk.ru/ru/news/content/bilety-na-match-tom-rotor-2019-08-05') != -1
        || key.indexOf('https://october-tomsk.ru/priglasitelnie/') != -1
        || key.indexOf('https://kinomax.tomsk.ru/news/549/spasibo.tabletka.tomsk.ru') != -1
        || key.indexOf('https://october-tomsk.ru/non-stop/') != -1
        || key.indexOf('https://kino-polis.ru/users/extauth/') != -1
        || key.indexOf('https://m.langal.ru/help/1003/') != -1
        || key.indexOf('plus.google.com') != -1
        || key.indexOf('https://kinomax.tomsk.ru/pdf/kinomax-cafe-menu.pdf') != -1
        || key.indexOf('https://kinomax.tomsk.ru/help/faq/') != -1
        || key.indexOf('https://m.klumba-cinema.ru/about/klumba-cinema.ru') != -1
        || key.indexOf('http://kinomax.tomsk.ru/pdf/kinomax-cafe-menu.pdf') != -1
        ) {
            continue;
        }

        link = key;
        break;
    }

    if (link === null) {
        console.log('End');

        process.exit(0);
    }

    await openPage(link);

    setTimeout(bypass, 1);
};


init();
