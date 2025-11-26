const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't include password in queries by default
  },
  nrp: {
    type: String,
    sparse: true, // Allows multiple null values but unique non-null
    match: [/^\d{10}$/, 'NRP must be 10 digits'],
  },
  primaryRole: {
    type: String,
    enum: ['mahasiswa', 'dosen', 'tendik', 'admin'],
    required: true,
  },
  secondaryRoles: [{
    type: String,
  }],
  phoneNumber: {
    type: String,
    match: [/^(\+62|62|0)[0-9]{9,12}$/, 'Please provide a valid phone number'],
  },
  avatar: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Validate NRP is required for mahasiswa
userSchema.pre('validate', function(next) {
  if (this.primaryRole === 'mahasiswa' && !this.nrp) {
    this.invalidate('nrp', 'NRP is required for mahasiswa');
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
