var mongoose = require("mongoose");

var {{name}}Schema = new mongoose.Schema({
    
}, {timestamps: true});

{{name}}Schema.methods = {
    toJSON() {
        return {
            id: this._id,

        }
    }
};

module.exports = mongoose.model({{name}}, {{name}}Schema);