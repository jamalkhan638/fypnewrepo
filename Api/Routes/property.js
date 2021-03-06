const express = require("express");
const router = express.Router();
const Property = require("../controllers/property");
const multer = require('multer');
const { ensureAuthenticated, forwardAuthenticated } = require('../../config/auth');
const propertyData = require('../Model/properties');
mongoose = require('mongoose')
contactModel = mongoose.model('NewUserModel')
// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });
  //**********************/
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  //**********************/
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });
  

//To Add Property
router.post("/addProperty",ensureAuthenticated,upload.array('photo', 20),Property.addProperty);
router.get('/search',Property.searchProperty);
//for search property
router.get('/showProperty/:id',async (req,res)=>{
    let alpha;
    alpha=req.params.id
    let beta = await propertyData.findOne({userId:alpha})
    res.render('showProperty',{
        data:beta
    })
})

//INDEX - show all campgrounds
router.get("/newsearch", function(req, res){
  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      propertyData.find({address: regex}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         } else {
            if(allCampgrounds.length < 1) {
                noMatch = "No campgrounds match that query, please try again.";
            }
           res.render('searchdeatails',{
            campgrounds:allCampgrounds
           })
         }
      });
  } else {
      // Get all campgrounds from DB
      propertyData.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         } else {
          res.render('searchdeatails',{
            campgrounds:allCampgrounds
           })
         }
      });
  }
});
//Escaping / makes the function suitable for escaping characters to be used in a JS regex literal for later eval.
function escapeRegex(text) {
  text.replace("/[-[\]{}()*+?.,\\^$|#\s]/g", "\\$&")
  return text;
  
};

router.get('/list',ensureAuthenticated,async (req,res)=>{
  let user= req.user
  let data = await propertyData.find({isActive:'pending'})
  let chek= await contactModel.find({status: 'unread'})
  
  beta = chek.length
    res.render('approve', {
      data:data,
      user,
      unread:beta})
  })

  


  router.put('/status/:id',(req,res)=>{
    var id = req.params.id;
    propertyData.findOne({_id:id},function(err,foundObject){
      if(err){
        res.status(500).send();
      }else {
        if(!foundObject){
          res.status(404).send();
        }
        else{
          // console.log(foundObject)
          foundObject.isActive="done"
        }
        foundObject.save().then(res=>console.log(res))
      }
      res.redirect('/property/list')
    })

  })

  router.get('/detailpage/:id',async (req,res)=>{
    let data = await propertyData.findOne({_id: req.params.id})
    let property = await propertyData.find().limit(4)
    res.render('details',{
      data,
      property
    })
  })

  router.get('/cont/:id',async (req,res)=>{
    let contact = await contactModel.findOne({_id: req.params.id})
    console.log(contact)
    return  res.json({
      authsuccess: true,
      contact: contact
  });
  })

  router.get('/contact/:id',async (req,res)=>{
    let contact = await contactModel.findOne({_id: req.params.id})
    console.log(contact)
    return  res.json({
      authsuccess: true,
      contact: contact
  });
  })
  router.get('/agent/:id', async(req,res)=>{
    let data =await propertyData.find({userId:req.params.id})
    res.render('agentproperty',{
      data
    })
  })
module.exports = router;
