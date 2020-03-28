const RestResponse = require('../response/RestResponse');

module.exports = function() {
    return (req, res, next) => {
        try {
            
        } catch(err) {
            return RestResponse.error(res, err);
        }
    };
};