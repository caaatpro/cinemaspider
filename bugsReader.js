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


const logsFile = 'logs/' + check + '.txt';

const logsText = fs.readFileSync(logsFile, 'utf8');

const checkObj = logsText.split('\n');

checkObj.forEach((item) => {
    if (item == '[]') return true;
    // if (item.indexOf('Uncaught TypeError: grecaptcha.render is not a function') != -1) return true;
    if (item.indexOf('Uncaught Error: reCAPTCHA has already been rendered') != -1) return true;
    if (item.indexOf('grecaptcha.render') != -1) return true;
    if (item.indexOf('https://surgutgalaktika.ru/about/') != -1) return true;
    if (item.indexOf('https://special.surgutgalaktika.ru/about/') != -1) return true;
    if (item.indexOf('https://m.surgutgalaktika.ru/about/') != -1) return true;
    if (item.indexOf('Access-Control-Allow-Origin') != -1) return true;
    if (item.indexOf('https://galaktika-omsk.ru/club_vip/') != -1) return true;
    if (item.indexOf('https://kino-mall.ru/news/?id=68') != -1) return true;
    if (item.indexOf('https://kino-mall.ru/news/?id=62') != -1) return true;
    if (item.indexOf('https://kino-mall.ru/news/?id=60') != -1) return true;
    if (item.indexOf('https://kino-mall.ru/news/?id=38') != -1) return true;
    if (item.indexOf('https://kino-mall.ru/news/?id=53') != -1) return true;
    if (item.indexOf('https://kino-mall.ru/news/?id=55') != -1) return true;
    if (item.indexOf('https://kino-mall.ru/news/?id=64') != -1) return true;
    if (item.indexOf('https://kino-mall.ru/news/?id=56') != -1) return true;
    if (item.indexOf('/hallplan_preview') != -1) return true;
    if (item.indexOf('/news/') != -1) return true;
    if (item.indexOf('https://m.october-tomsk.ru/faq/?page=155') != -1) return true;
    if (item.indexOf('https://m.october-tomsk.ru/faq/?page=164') != -1) return true;
    if (item.indexOf('https://m.october-tomsk.ru/faq/?page=165') != -1) return true;
    if (item.indexOf('https://m.langal.ru/img/FaqArrow.png') != -1) return true;
    if (item.indexOf('/seances/') != -1) return true;

    console.log(item);
});
