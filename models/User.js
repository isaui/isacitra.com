import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';


// Skema Profil Pengguna
const profileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  bio: String,
  avatar: String,
  // Informasi tambahan lainnya tentang profil
});

// Skema Peran Pengguna
const roleSchema = new mongoose.Schema({
  name: String,
  // Hak akses, izin, atau atribut lain yang berhubungan dengan peran
});

// Skema Pengguna
const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
  },
  profile: profileSchema,
  role: roleSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.plugin(passportLocalMongoose);

const Profile = mongoose.model('Profile', profileSchema);
const Role = mongoose.model('Role', roleSchema);
const User = mongoose.model('User', userSchema);


export {
  Profile,
  Role,
  User,
};