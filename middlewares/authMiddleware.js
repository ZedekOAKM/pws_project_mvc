exports.protect = (req, res, next) => {
    
    if (!req.session.user) {
        return res.status(401).send('Pro přístup k této stránce se musíte nejdříve přihlásit.');
    }
    next();
};

exports.restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).send('Nemáte dostatečná oprávnění k zobrazení této stránky.');
        }
        next();
    };
};