const validator = require('validator');

const getConfiguredRedirectUrl = () => {
    const url = process.env.QR_REDIRECT_URL?.trim();

    if (!url) {
        return null;
    }

    const isValid = validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
    });

    return isValid ? url : null;
};

module.exports = {
    getConfiguredRedirectUrl,
};
