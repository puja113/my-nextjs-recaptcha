import mongoose from "mongoose";

const CaptchaSchema = new mongoose.Schema({
  label: { type: String, required: true },       
  name: { type: String, required: true },       
  images: [{ type: String, required: true }],    
});

export default mongoose.models.Captcha || mongoose.model("Captcha", CaptchaSchema);
