const onsignup = (req, res, next) => {
    // Extract password from request body
    const { password } = req.body;

    const strongPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (!strongPass.test(password)) {
        return res.status(400).json({ 
            field: "password", 
            message: "Need 8+ chars, 1 number, and 1 symbol." 
        });
    }

    
    next();
};

module.exports = onsignup;