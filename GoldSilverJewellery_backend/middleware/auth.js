import jwt from jsonwebtoken;

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const authMiddleware = async(req, res, next) => {
    try{
        const token = req.headers. authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "no token, authorization denied"
            })
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    }catch(err){
        res.status(401).json({
            success:false,
            message: "token is not valid"
        })
    }
}
export default authMiddleware;