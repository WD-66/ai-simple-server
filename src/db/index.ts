import mongoose from 'mongoose';
try {
	// Connect
	await mongoose.connect(process.env.MONGO_URI!, {
		dbName: 'mongoose'
	});
	console.log('\x1b[35mMongoDB connected via Mongoose\x1b[0m');
} catch (error) {
	console.error('MongoDB connection error:', error);
	process.exit(1);
}
