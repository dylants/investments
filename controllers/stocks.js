var yahooFinance = require("yahoo-finance"),
    fields = require("../lib/yahoo-finance-helper").SNAPSHOT_FIELDS,
    moment = require("moment"),
    _ = require("underscore"),
    mongoose = require("mongoose"),
    Stock = mongoose.model("Stock");

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

        app.get("/snapshot", function(req, res) {
            Stock.find(function(err, stocks) {
                if (err) {
                    console.error(err);
                    res.send(500);
                    return;
                }

                if (stocks && stocks.length > 0) {
                    yahooFinance.snapshot({
                        symbols: _.pluck(stocks, "symbol"),
                        fields: [
                            fields.LAST_TRADE_PRICE_ONLY,
                            fields.PREVIOUS_CLOSE,
                            fields.OPEN,
                            fields.CHANGE_AND_PERCENT_CHANGE,
                            fields.DAYS_LOW,
                            fields.DAYS_HIGH,
                            fields.VOLUME,
                            fields.MARKET_CAPITALIZATION,
                            fields.REVENUE,
                            fields.EARNINGS_PER_SHARE,
                            fields.PRICE_PER_SALES,
                            fields.PE_RATIO
                        ]
                    }, function(err, data, url, symbol) {
                        if (err) {
                            console.error(err);
                            res.send(500);
                            return;
                        }

                        res.send(data);
                    });
                } else {
                    res.send({});
                }

            });
        });

    });
};
