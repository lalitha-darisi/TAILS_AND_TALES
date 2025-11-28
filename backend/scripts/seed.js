// backend/scripts/seed.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Pet = require('../src/models/Pet');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  // create admin if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@petapp.local';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'AdminPass123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin created:', adminEmail);
  } else {
    console.log('Admin exists:', adminEmail);
  }

  // sample owner
  let owner = await User.findOne({ email: 'owner@example.com' });
  if (!owner) {
    owner = new User({ name: 'Owner One', email: 'owner@example.com', password: 'ownerpass', role: 'owner' });
    await owner.save();
  }

  // create sample pets
  const pets = [
    { name: 'Rex', species: 'Dog', breed: 'Labrador', age: 3, owner: owner._id, description: 'Friendly lab', photos: [] },
    { name: 'Milo', species: 'Cat', breed: 'Siamese', age: 2, owner: null, description: 'Calm cat (admin-owned)', photos: [] }
  ];
  for (const p of pets) {
    const exists = await Pet.findOne({ name: p.name });
    if (!exists) {
      await Pet.create(p);
      console.log('Created pet:', p.name);
    } else console.log('Pet exists:', p.name);
  }

  console.log('Done seeding');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
