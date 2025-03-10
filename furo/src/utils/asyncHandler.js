const asyncHandler =(requestHandler)=>{
 //return kr dege function ko promise ke form me
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res)).catch((err)=> next(err))
    }
       

}
export {asyncHandler}