var yahooFinance = require("yahoo-finance"),
    moment = require("moment");

module.exports = function(app) {
    app.namespace("/api/stocks", function() {

        app.get("/historical/:stock", function(req, res) {
            yahooFinance.historical({
                symbol: req.params.stock,
                from: moment().startOf("month").format("YYYY-MM-DD"),
                to: moment().format("YYYY-MM-DD")
            }, function(err, quotes, url, symbol) {
                if (err) {
                    console.error(err);
                    res.send(500);
                    return;
                }

                res.send({
                    quotes: quotes,
                    url: url,
                    symbol: symbol
                });
            });
        });

        app.get("/snapshot/:stock", function(req, res) {
            yahooFinance.snapshot({
                symbols: [req.params.stock],
                fields: ["s", "l1", "p", "o", "c", "g", "h", "v", "j1", "e", "p5", "r", "s6"]
            }, function(err, data, url, symbol) {
                if (err) {
                    console.error(err);
                    res.send(500);
                    return;
                }

                res.send(data);
            });
        });

    });
};
