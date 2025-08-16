import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req,res,next) =>{

    try{

        const decision = await aj.protect(req, {requested:5});
        console.log(`ARCJET DECISION: ${decision.conclusion}`);

        if(decision.isDenied()) {
            
            if(decision.reason.isRateLimit()) return res.status(429).json({ error: "Too many requests, please try again later." });

            if(decision.reason.isBot()) return res.status(403).json({ error: "Access denied for bots." });
            

            return res.status(403).json({ error: "Access denied." });
        }

        next(); // If the request is allowed, proceed to the next middleware or route handler

    }catch(error){

        console.log(`ARCJET ERROR: ${error}`);
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
}


export default arcjetMiddleware;