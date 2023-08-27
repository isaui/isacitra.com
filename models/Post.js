import mongoose  from "mongoose";
const blogPostSchema = new mongoose.Schema({
    thumbnail: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tableOfContents:{
      type: String,
      default: JSON.stringify([])
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: [{
      type: String
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  

  });
  blogPostSchema.methods.incrementViews = async function () {
    this.views += 1;
    await this.save();
  };
  
  blogPostSchema.methods.toggleLike = async function (userId, voteType) {
    // Cek apakah userId sudah ada di dalam daftar likes atau dislikes
    const isLiked = this.likes.includes(userId);
    const isDisliked = this.dislikes.includes(userId);
  
    if (voteType === 'like') {
      if (isLiked) {
        // Jika sudah dilike, hapus userId dari daftar likes
        this.likes = this.likes.filter((id) => id !== userId);
      } else {
        // Jika belum dilike, tambahkan userId ke daftar likes dan hapus dari dislikes
        this.likes.push(userId);
        this.dislikes = this.dislikes.filter((id) => id !== userId);
      }
    } else if (voteType === 'dislike') {
      if (isDisliked) {
        // Jika sudah didislike, hapus userId dari daftar dislikes
        this.dislikes = this.dislikes.filter((id) => id !== userId);
      } else {
        // Jika belum didislike, tambahkan userId ke daftar dislikes dan hapus dari likes
        this.dislikes.push(userId);
        this.likes = this.likes.filter((id) => id !== userId);
      }
    }
  
    await this.save();
  };

  const BlogPost = mongoose.model('BlogPost', blogPostSchema)

  export default BlogPost