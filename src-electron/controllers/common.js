const axios = require("axios")
exports.checkConnection = (req,res)=>{
  axios.get('https://www.google.com').then(resp=>{
   // console.log(resp)
   res.send({internet:'online'})
}).catch(err=>{
    res.send({internet:'offline'})
})
}





