const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const userDetailSchema = new mongoose.Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			trim: true,
		},
		mobileNumber: {
			type: String,
			required: false,
			trim: true,
			default: null
		},
		birthYear: {
			type: Number,
			required: false,
			trim: true,
			default: null
		},
		interstedIn: {
			type: Array,
			default: [],
		}
	},
	{ timestamps: true },
	{ versionKey: false }
);

userDetailSchema.virtual('user', {
	ref: 'User', //The Model to use
	localField: 'userId', //Find in Model, where localField 
	foreignField: '_id', // is equal to foreignField
 });
 
 // Set Object and Json property to true. Default is set to false
 userDetailSchema.set('toObject', { virtuals: true });
 userDetailSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UserDetail', userDetailSchema);