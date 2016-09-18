var casper = require('casper').create({
    verbose: true,
    logLevel : 'debug',
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
var maxPrice = options.maxPrice || '';
var page = options.page || 1;
var type = options.type || 2; //rent or buy 1 buy 2 rent
var url = 'https://www.justproperty.com/en/';
var properties = [];
// console.log(loc);

// console.log(url);

casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');


casper.start(url, function() {
    
});
// console.log(beds);
casper.then(function() {
    
    this.evaluate(function(location,minPrice,maxPrice,beds,type) {
        
        if(beds){
            if(beds>6)
                beds=6;
            $("#id_bedrooms").val(beds);
        }
        if(minPrice){
            $('input.id_price_min').focus().val(minPrice).trigger('input').blur();
        }
        if(maxPrice){
            $('input.id_price_max').focus().val(maxPrice).trigger('input').blur();
        }
        if(type==1){
            // setting to buy
            $(".hybrid-tabs a:nth-child(2)").click();
        }
        $('.ui-autocomplete-input').val(location).trigger('input');
    },loc,minPrice,maxPrice,beds,type)
    this.waitUntilVisible(".ui-menu-item", function() {
        this.evaluate(function() {
            $('.ui-menu-item:first').click();
        })
    });

});
casper.then(function()
{
    this.capture('a.png');
});
casper.then(function() {
    this.evaluate(function() {
        $(".btn-ser-search-default").click();
    })
});
casper.then(function()
{ 
    this.evaluate(function()
    {
        $('.results_order_by').val("price__asc").change();
    })
});
casper.then(function() {
    properties = this.evaluate(function() {
        var elms = [];
        $('.item-result').each(function(index, elm) {
            elm = $(elm);
            var price=elm.find('.original').text().trim().split(' ');
            var address=elm.find('.item-location').text().trim().toLowerCase().replace('view map','').trim();
            var beds=elm.find('.icon-bed').parent().text();
            var area=elm.find('.icon-area_3').parent().text();
            elms.push({
                name: elm.find('.item-title').text(),
                img: elm.find('img').attr('src'),
       			value : price[1],
				currency : price[0],
				period : '',
				address : address,
				beds : beds,
				area : area
            });
        });
        return elms;
    });
});
casper.run(function() {
    this.echo(JSON.stringify(properties));
    casper.done();
});