class Error{
    constructor(res)
    {
        this.RESPONSE = res;
    }

    internalError(){
        return this.RESPONSE.status(500).json({is_sucess:false,message:"Internal server error!"})
    }
}

module.exports = Error;