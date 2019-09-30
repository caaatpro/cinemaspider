let hallsC = [];
let halls = [];

$('.schedules .hall').each((i, item) => {
    const hallclass = $(item).data('hallclass');

    if (hallsC.indexOf(hallclass) == -1 && $(item).find('a').length) {
        hallsC.push(hallclass);

        halls.push($(item).find('a')[0].href);
    }

});

// return
arguments[arguments.length - 1](halls);