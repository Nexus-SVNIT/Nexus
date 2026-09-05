const { getConfiguredRedirectUrl } = require('../utils/qrRedirectUtils');

const redirectDefaultQr = (req, res) => {
    const destination = getConfiguredRedirectUrl();

    if (!destination) {
        return res.status(503).json({
            message: 'QR redirect destination is not configured or is invalid.',
        });
    }

    // Destination is controlled only via server configuration, not request params.
    return res.redirect(307, destination);
};

module.exports = {
    redirectDefaultQr,
};
