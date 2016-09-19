var casper = require('casper').create({
    verbose: true,
    viewportSize: {
        width: 1300,
        height: 1600
    },
    onResourceRequested: function(casper, requestData, request) {
        var skip = [
            'google.com',
            'googleads.g.doubleclick.net',
            'cm.g.doubleclick.net',
            'www.googleadservices.com',
            'dis.eu.criteo.com'
        ];

        skip.forEach(function(needle) {
            if (requestData.url.indexOf(needle) > 0) {
                request.abort();
            }
        });
    }
});
var options = casper.cli.options;
var loc = options.loc || '';
var beds = options.beds || '';
var minPrice = options.minPrice || '';
var order = options.order || 'price__asc';
var perPage = options.perPage || '30';
var maxPrice = options.maxPrice || '';
var page = options.page || 1;
var type = options.type || 2; //rent or buy 1 buy 2 rent
var url = 'https://www.justproperty.com/en/';
var properties = [];
var URI='';
casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');


casper.start(url, function() {

});
casper.then(function() {
    this.evaluate(function(location, beds, type) {
        if (beds) {
            if (beds > 6)
                beds = 6;
            $("#id_bedrooms").val(beds);
        }
        if (type == 1) {
            // setting to buy
            $(".hybrid-tabs a:nth-child(2)").click();
        }
        $('.ui-autocomplete-input').val(location).trigger('input');
    }, loc, beds, type)
    this.waitUntilVisible(".ui-menu-item", function() {
        this.evaluate(function() {
            $('.ui-menu-item:first').click();
        })
    }, function() {
        casper.echo(JSON.stringify([]));
        casper.exit();

    });

});

casper.then(function() {
    this.evaluate(function() {
        $(".btn-ser-search-default").click();
    })
});

casper.then(function() {
    properties = this.evaluate(function(order,minPrice,maxPrice,perPage) {
        perPage=perPage || 30;
        order=order || 'price__asc';

        var query='?sort='+order;
        query+="&per_page="+perPage;
        if(minPrice)
        query+='&price_min='+minPrice;
        if(maxPrice)
        query+='&price_max='+maxPrice;

        var elms = {
            'uri' : encodeURIComponent(document.location.href+query)
        };
        return elms;
    },order,minPrice,maxPrice,perPage);
});

casper.run(function() {
    this.echo(JSON.stringify(properties));
    casper.done();
});