
const urlModel = require('../Model/urlModel')
const shortid = require('shortid')
const validUrl= require('valid-url')

// const isValid = function (value) {
//     if (typeof value === 'undefined' || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false
//     return true;
// }
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const shortUrl = async function(req , res){
    try {
        let url = req.body
        let longUrl = url.longUrl
        if (!isValidRequestBody(url)) {
            return res.status(400).send({status:false , msg:" please enter the details"})
        }
        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({status:false,msg:"please provide valid url"})
        }
        const baseUrl ="http://localhost:3000";
        const urlCode= shortid.generate();
        const shortUrl= baseUrl+'/'+urlCode;

        let longurl=await urlModel.findOne({shortUrl,urlCode})
        if (longurl) {
            return res.status(200).send({status:false , msg:"url is already generated"})
        }
        else{
         url = new urlModel({
             longUrl,
             shortUrl,urlCode
         })
         let shortenUrl = await urlModel.create(url)
         return res.status(201).send({status:true,msg:"Url successfuly created", data:shortenUrl})
    }

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({status:false, error:err.message})   
    }

}


const getUrl = async function(req, res){
  try {
    const urlCode = req.params.urlCode
    let getUrl = await urlModel.findOne({urlCode:urlCode})
    if (!getUrl) {
        return res.status(404).send({status:false,msg:"url not found"})
    }
    let url = getUrl.shortUrl
    res.redirect(url)

  } catch (  err) {
      return res.status(500).send({error:err.message})
  }

}

module.exports = {shortUrl,getUrl}

// /^(ftp|http|https):\/\/[^ "]+$/.test(url);