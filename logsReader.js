const fs = require('fs');
const argv = require('yargs').argv;
const cinemaList = require('./configs/cinemaList');

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

const checkText = fs.readFileSync(checkFile, 'utf8');
const logsText = fs.readFileSync(logsFile, 'utf8');

const checkObj = JSON.parse(checkText);

if (argv.parent != undefined) {
    var parrent = [];
    for (const link in checkObj) {
        if (!checkObj.hasOwnProperty(link)) {
            continue;
        }

        const item = checkObj[link];

        if (item.links.indexOf(argv.parent) != -1) {
            parrent.push(link);

            console.log(link);
        }
    }
    
    process.exit();
}

for (const link in checkObj) {
    if (!checkObj.hasOwnProperty(link)) {
        continue;
    }

    const item = checkObj[link];
    
    if (
        link.indexOf('http://www.odnoklassniki.ru') == 0 ||
        link.indexOf('http://connect.mail.ru') == 0 ||
        link.indexOf('http://www.facebook.com') == 0 ||
        link.indexOf('https://www.facebook.com') == 0 ||
        link.indexOf('https://vk.com') == 0 ||
        link.indexOf('http://www.instagram.com') == 0 ||
        link.indexOf('https://www.instagram.com') == 0 ||
        link.indexOf('http://www.afisha.ru') == 0 ||
        link.indexOf('http://www.livejournal.com') == 0 ||
        link.indexOf('https://www.kinopoisk.ru') == 0 ||
        link.indexOf('http://www.kinopoisk.ru') == 0 ||
        link.indexOf('http://energye.ru') == 0 ||
        link.indexOf('mailto:') == 0 ||
        link.indexOf('tg://') == 0 ||
        link.indexOf('https://twitter.com') == 0 ||
        link.indexOf('http://twitter.com') == 0 ||
        link.indexOf('tel:') == 0 ||
        link.indexOf('http://www.consultant.ru') == 0 ||
        link.indexOf('https://nikolas.ru/') == 0
    ) {
        continue;
    }

    if (item.visited == false) {
        console.log(link);
        console.log(item);
    }
}