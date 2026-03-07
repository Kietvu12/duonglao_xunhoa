import crypto from 'crypto';

// Generate a random JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('🔑 Generated JWT Secret:');
console.log('='.repeat(60));
console.log(jwtSecret);
console.log('='.repeat(60));
console.log('\n📝 Copy this value to your .env file as JWT_SECRET');
console.log('Example:');
console.log(`JWT_SECRET=${jwtSecret}`);

