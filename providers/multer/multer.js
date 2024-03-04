class Multer{
    constructor(){
        this.multer = require("multer");
    }

    createStorage()
    {
        const storage = this.multer.memoryStorage();
        const upload  = this.multer({storage:storage});
        return upload;
    }

}

module.exports = Multer;