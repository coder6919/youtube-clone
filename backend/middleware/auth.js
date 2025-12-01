import jwt from 'jsonwebtoken';

// this function checks if the user is logged in
export const protect = async (req, res, next)=>{
    try{
        // 1 get the token from the header (Authorization: "Beaer <token>")
        const token = req.headers.authorization?.split(" ")[1];

        // 2 If no token exists, stop the request
        if(!token){
            return res.status(401).json({message: "Not auhtorized, no token"});

        }

        // 3 Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4 Attach the user ID to the request object so we know WHO is logged in
        // We now access `req.user.id in any protected route
        req.user = decoded;

        // 5 Move to next function (the controller)
        next(); 
    } catch(error){
        res.status(401).json({message: "Token not valid"})
    }
}