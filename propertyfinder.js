var casper = require('casper').create({
    verbose: true,
    viewportSize: {
        width: 1300,
        height: 1600
    }
    /*
    logLevel : 'debug'*/
});

var options = casper.cli.options;
var loc = options.loc || '';
var beds = options.beds || '';
var minPrice = options.minPrice || '';
var maxPrice = options.maxPrice || '';
var page = options.page || 1;
var type = options.type || 2; //rent or buy 1 buy 2 rent
var URI = options.uri || '';
var url = 'https://www.propertyfinder.ae/search?l=' + loc + '&q=&c=' + type + '&t=&rp=y&pf=' + minPrice + '&pt=' + maxPrice + '&bf=' + beds + '&page=' + page + '&ob=pa' //ob=pd for price des;
var properties = [];
casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');

function getLinks() {
    function clean(text) {
        return text.replace("\n", "").trim();
    }
    var elms = [];

    $('.serp-result > li').each(function(index, elm) {
        var elm = $(elm);
        var name = elm.find('bdi').html();
        var img = elm.find('img').attr('src');
        var beds = elm.find('.property-details span:nth-child(2)').text();
        var area = elm.find('.property-details span:nth-child(4)').text().replace("\n", "").trim();
        if (!name)
            return;
        elms.push({
            name: elm.find('bdi').html(),
            value: elm.find('span.val').html(),
            currency: elm.find('span.currency').html(),
            period: elm.find('span.period').html(),
            address: elm.find('.location-tree').text().replace("\n", "").trim(),
            beds: beds.replace("\n", "").trim(),
            link: 'https://www.propertyfinder.ae' + elm.find('a').attr('href'),
            img: 'https:' + img,
            area: area
        });
    });
    var total = $('.page-numbers a:last').text().trim();
    var current = $('.page-numbers span').text().trim();
    var next = $('#pagination').find('.next a').attr('href');

    var pages = {
        'total': '',
        'current': '',
        'next': ''
    }
    if (total)
        pages.total = total;
    if (current)
        pages.current = current;
    if (next)
        pages.next = 'https://www.propertyfinder.ae' + next;
    return {
        'uri': document.location.href,
        'pages': pages,
        data: elms
    };;
}
casper.start(URI || url, function() {
    properties = this.evaluate(getLinks)
});
casper.then(function() {
    casper.capture('fimder.png');
})
casper.run(function() {
    this.echo(JSON.stringify(properties));
    casper.done();
});