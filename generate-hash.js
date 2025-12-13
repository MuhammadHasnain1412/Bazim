const bcrypt = require('bcryptjs');

// Generate hash for admin123 password
const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nYou can use this hash in your database or seed file.');
});
