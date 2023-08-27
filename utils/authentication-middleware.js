const loggedIn = (req,res,next) => {
    console.log('user? ', req.user)
    console.log(req.session.id)
    if(! req.isAuthenticated()){
        return res.status(401).send({code:"401", message:"pengguna tidak memiliki akses"})
    }else{
        next()
    }
    
}

export default loggedIn