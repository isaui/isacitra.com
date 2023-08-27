import express from 'express';
import { User } from '../models/User.js';
const router = express.Router();
import asyncWrapper from '../utils/async-wrapper.js';
import passport from 'passport';

router.post('/register', (async (req,res)=>{
    try {
        const {username, email, password, ...profile } = req.body;
    const user = new User({
        username: username,
        email: email,
        profile: profile,
        role: {
            name:'user'
        }
    }
    )
    const registerUser = await User.register(user, password)
    
    res.send({'message':'berhasil', 'type': 'success'})
    } catch (error) {
        console.log(error)
        res.send({'message': error, 'type': 'error'})
    }
}))
router.post('/login', passport.authenticate('local',{ failureFlash:true}), asyncWrapper( async(req,res)=>{
   
    res.send({'user': req.user})
}))
router.post('/updateProfil', asyncWrapper( async(req,res)=>{
   const {_id, newData} = req.body;
   console.log(newData)
   const existingUser = await User.findOne({
    $or: [
      { username: newData.username }, // Gantilah 'yourUsername' dengan nilai yang ingin Anda cek
      { email: newData.email }, // Gantilah 'yourEmail' dengan nilai yang ingin Anda cek
    ],
  });
  if(existingUser && existingUser._id != _id){
    if(newData.username == existingUser.username){
        return res.status(400).json({ message: 'Username sudah digunakan.' });
    }
    return res.status(400).json({ message: 'Email sudah digunakan.' });
  }

  const {username, email, ...profile} = newData;
  const currentUser = await User.findByIdAndUpdate(_id, {$set:{username:username,email:email,profile:profile}}, {new: true})
  return res.status(200).json({user:currentUser})
  

}))

router.post('/changePassword', passport.authenticate('local',{ failureFlash:true}) ,asyncWrapper(async (req,res)=>{
    try {
        //apa yang harus saya lakukan setelah autentikasi berhasil?
        const {newPassword} = req.body;
        const user = req.user;
        await user.setPassword(newPassword)
        await user.save();
        res.send({'user':req.user})
    } catch (error) {
        res.status(500).json({message:'Something wrong with the server'})
    }
}))



export default router;