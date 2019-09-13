var links = [];
var ignore = [
];

$('a').each((i, item) => {
    var link = item.toString();

    if (link == '') return true;
    if (ignore.indexOf(link) != -1) return true;
    
    if (link.indexOf('/2019-') != -1) return true;
    if (link.indexOf('/upload/') != -1) return true;

    link = link.replace(item.hash, '');
    link = link.replace('#', '');

    if (links.indexOf(link) != -1) return true;

    links.push(link);
});

// return
arguments[arguments.length - 1](links);