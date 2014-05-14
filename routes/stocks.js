"use strict";

var Hapi = require("hapi"),
    yahooFinance = require("yahoo-finance"),
    fields = require("../lib/yahoo-finance-helper").SNAPSHOT_FIELDS,
    moment = require("moment"),
    _ = require("lodash"),
    mongoose = require("mongoose"),
    Stock = mongoose.model("Stock");

module.exports.historical = {
    handler: function(request, reply) {
        yahooFinance.historical({
            symbol: request.params.stock,
            from: moment().startOf("month").format("YYYY-MM-DD"),
            to: moment().format("YYYY-MM-DD")
        }, function(err, quotes, url, symbol) {
            if (err) {
                console.error(err);
                reply(Hapi.error.badImplementation(err));
                return;
            }

            reply({
                quotes: quotes,
                url: url,
                symbol: symbol
            });
        });
    }
};

module.exports.snapshot = {
    handler: function(request, reply) {
        Stock.find(function(err, stocks) {
            if (err) {
                console.error(err);
                reply(Hapi.error.badImplementation(err));
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
                        reply(Hapi.error.badImplementation(err));
                        return;
                    }

                    reply(data);
                });
            } else {
                reply({});
            }

        });
    }
};
