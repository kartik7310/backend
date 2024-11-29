
 const getUserProfile = async(req,res)=>{
  try {
    const user = req.user;
    if(!user) return res.status(400).json("user not found");
    return res.status(200).json({user:user})
  } catch (error) {
    return res.status(500).json("internal server error")
  }
}
export{getUserProfile}