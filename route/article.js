import express from 'express';
import asyncWrapper from '../utils/async-wrapper.js';
import { User } from '../models/User.js';
import BlogPost from '../models/Post.js';
import Comment from '../models/Comment.js';
import loggedIn from '../utils/authentication-middleware.js';
import passport from 'passport';
import Subscription from '../models/Susbscription.js';

const router = express.Router({mergeParams:true});

router.post('/', asyncWrapper(async (req, res) => {
    try {
      // Proses data yang diterima, misalnya menyimpannya ke database
      
      const {isUpdate, currentId, user, ...postData} = req.body;
      var post;
      if(isUpdate){
        post = await BlogPost.findByIdAndUpdate(currentId);
        Object.assign(post, postData);
      }
      else{
        post = new BlogPost({author:user,...postData})
      }
        
        if(!post.categories.includes('semua')){
          post.categories.unshift(...['semua'])
        }
        await post.save();
        res.send({message:'berhasil menambahkan artikel'})
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }));
  
  router.delete('/:id', asyncWrapper(async (req,res)=> {
    const {id} = req.params;
    const deletedArticle = await BlogPost.findByIdAndDelete(id);
    if(!deletedArticle) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }
    res.send({ message: 'Artikel berhasil dihapus' })
  }))

  router.get('/', asyncWrapper(async (req,res)=> {
    const articles = await BlogPost.find({}).populate('author').populate('comments')
    res.send({articles})
  }))
  router.post('/edit', asyncWrapper(async (req,res)=> {
    const {user} = req.body;
    
    const articles = await BlogPost.find({author:user._id}).populate('author').populate('comments')
    res.send({articles})
  }))

  router.get('/new', asyncWrapper(async(req,res)=>{
    console.log('siapa yang login ayo jawab!! ', req.user)
    console.log('hmm hey buddy you are not login')
    res.send({'status':'success'})
  }) )

  router.post('/update-reaction', asyncWrapper(async (req,res,next)=>{
    const {likes, dislikes, postId, userId} = req.body;
    await BlogPost.findByIdAndUpdate(postId, {likes: likes, dislikes: dislikes})
    console.log(likes, dislikes)
    res.send({'message':'good'})
  }))

  router.post('/subscription', asyncWrapper(async(req,res)=>{
    try {
      const {email} = req.body;
    const exist = await Subscription.findOne({email: email})
    if(exist){
      return res.status(400).json({'message': 'Anda telah melakukan subscription sebelumnya'})
    }
    const newSubscriber = new Subscription({email:email})
    res.status(200).json({'message':'Sukses melakukan subscription'})
    await newSubscriber.save()
    } catch (error) {
      res.status(500).json({error:error, message:'Terdapat kesalahan pada server'})
    }
  }))
  router.get('/subscription', asyncWrapper(async (req, res) => {
    try {
      const subscribers = await Subscription.find({}, 'email'); // Mengambil hanya kolom 'email'
      const emailList = subscribers.map(subscriber => subscriber.email);
      res.status(200).json(emailList);
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan dalam mengambil daftar langganan' });
    }
  }));

  router.get('/search', asyncWrapper(async (req,res)=> {
    const searchTerm = req.query.searchTerm;
    try {
      const searchResults = await BlogPost.find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } }, // Pencarian berdasarkan judul
          { categories: { $regex: searchTerm, $options: 'i' } }, // Pencarian berdasarkan kategori
        ],
      }).populate('author');
      console.log(searchResults)
  
      res.send({searchResults});
    } catch (error) {
      console.error('Error searching posts:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  
  }))

  router.get('/:id', asyncWrapper( async (req,res,next)=>{
      const {id} = req.params;
      var post;
      try {
        post = await BlogPost.findById(id).populate('author').populate('comments');
        post.incrementViews();
      } catch (error) {
        next(error)
        return;
      }
      
      const postCategories = post.categories;
      const filteredCategories = postCategories.filter(category => category !== 'semua');
      const relatedArticles = await BlogPost.find({categories:{$in:filteredCategories}, _id: { $ne: post._id }}).limit(5).populate('author');
      res.send({post, relatedArticles });
  }))




  

  export default router