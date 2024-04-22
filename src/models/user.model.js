const mongoose = require("mongoose");
const joi = require('joi');
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			enum: ["ADMIN", "USER", "AGENT"],
			default: "USER"
		},
		is_active: {
			type: Boolean,
			default: true,
		}
	},
	{ timestamps: true },
	{ versionKey: false }
);

module.exports = mongoose.model("User", userSchema);