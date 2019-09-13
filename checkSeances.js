require('chromedriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const uuidV4 = require('uuid/v4');

var driver;

var links = {};

var checkSeances = fs.readFileSync('scripts/checkSeances.js', 'utf8');

const scriptRun = async (script) => {
    let data = driver.executeAsyncScript(script);

    return data;
};

const browserInit = () => {
    const screen = {
        width: 640,
        height: 480
    };

    driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options({
            perfLoggingPrefs: {
                traceCategories: 'performance'
            }
        }))
        // .headless()
        // .windowSize(screen))
        .build();

    driver.manage().setTimeouts({
        script: 10000000
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
};

const addLink = (parent, link, info, visited) => {
    if (links.hasOwnProperty(link)) {
        return updateLink(parent, link, info, visited);
    };

    let id = uuidV4();

    links[link] = {
        id: id,
        visited: visited,
        links: [],
        info: info
    };

    if (parent === null) return true;

    if (!links.hasOwnProperty(parent)) {
        addLink(null, parent, null, false);
    }

    links[parent].links.push(id);
};

const init = () => {
    console.log('Init...');

    browserInit();

    let cinemaListFile = fs.readFileSync('configs/cinemaList.json', 'utf8');
    let cinemaList = JSON.parse(cinemaListFile);

    cinemaList.forEach((item) => {
        if (item.urls.prod.desktop == '') {
            return true;
        }

        addLink(null, item.urls.prod.desktop + 'schedule/', null, false);
    });

    bypass();
};

const openPage = async (link) => {
    console.log(`Opening: ${link}`);

    await driver.get(link);

    let result = await scriptRun(checkSeances);

    let logs = await driver.manage().logs().get("browser");

    console.log(logs);

    addLink(null, link, null, true);

    console.log(result);
};

const bypass = async () => {
    console.log(Object.keys(links).length);

    let link = null;

    for (const key in links) {
        if (!links.hasOwnProperty(key)) continue;

        if (links[key].visited == true) continue;

        link = key;
        break;
    }

    if (link === null) {
        console.log('End');

        process.exit(0);
    }

    await openPage(link);

    setTimeout(bypass, 1);
}


init();