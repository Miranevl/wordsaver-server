import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            const userIdFromToken = decoded._id;
            const requestedUserId = req.params.userId;

            if (userIdFromToken !== requestedUserId) {
                return res.status(403).json({
                    message: 'Нет доступа к данному пользователю!',
                });
            }
            req.userId = userIdFromToken;
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа!',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа!',
        });
    }
}