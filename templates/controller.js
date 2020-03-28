const RestResponse = require('../response/RestResponse');
const { auth, validator, hasRole } = require('../middleware/middlewares');
{{ importModel }} //const {  } = require('../model/models');

exports.sample = [
    auth,
    (req, res) => {
        try {

        } catch(err) {
            return RestResponse.error(res, err);
        }
    }
]