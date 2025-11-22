import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader)
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET||"derdvfbgedvb34we3423ewveqg4vbvrrtgf");
        console.log("d",decoded)
        req.id = decoded.userId; 
        // attach user id to request
        console.log("object",req.id);
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default isAuthenticated;
