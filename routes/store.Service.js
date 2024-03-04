const bodyParser = require("body-parser");
const express = require("express");
const generateAdmin = require("../methods/generateAdmin");
const jwt = require("jsonwebtoken");
const Store = require("../providers/services/store.Service");
const router = express.Router();
router.use(bodyParser.json());

router.post('/',async(req,res)=>{
    try{
        console.log(req.body)
        const store = new Store(req,res);
        return await store.saveStoreInDb();
    }
    catch(err)
    {
        return res.status(500).json({is_success:true,message:"Internal server error !!!"});
    }
})


router.get('/',async (req,res)=>{
    try{
        const store = new Store(req,res);
        return await store.getStoreFromDb();
    }
    catch(err)
    {
        return res.status(500).json({is_success:true,message:"Internal server error !!!"});
    }
})


router.delete('/',async (req,res)=>{
    try{
        const store = new Store(req,res);
        return await store.deleteStoreInDb();

    }
    catch(err)
    {
        return res.status(500).json({is_success:true,message:"Internal server error !!!"});
    }
})


module.exports = router;