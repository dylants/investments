var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
    symbol: {
        type: String
    }
});

mongoose.model("Stock", StockSchema);

module.exports = StockSchema;
