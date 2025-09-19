import connectDB from "../../lib/db.mjs";
import Captcha from "../../modles/captcha.mjs";

export default async function handler(req, res) {
  try {
    await connectDB();

    const all = await Captcha.find({});
    if (!all.length) {
      return res.status(200).json({
        target: "",
        targetName: "",
        images: [],
      });
    }

   
    const randomIdx = Math.floor(Math.random() * all.length);
    const targetDoc = all[randomIdx];
    const target = targetDoc.label;
    const targetName = targetDoc.name;

   
    const targetImage =
      targetDoc.images[Math.floor(Math.random() * targetDoc.images.length)];

    const grid = [
      {
        id: `${targetDoc._id}-t`,
        label: target,
        src: `data:image/jpeg;base64,${targetImage}`,
      },
    ];

  
    const distractors = all
      .filter((item) => item.label !== target) 
      .sort(() => 0.5 - Math.random())
      .slice(0, 8)
      .map((img, index) => {
        const randomImage =
          img.images[Math.floor(Math.random() * img.images.length)];

        return {
          id: `${img._id}-${index}`,
          label: img.label,
          src: `data:image/jpeg;base64,${randomImage}`,
        };
      });

   
    const images = [...grid, ...distractors].sort(() => 0.5 - Math.random());

   
    global.captchaCache = images;

    return res.status(200).json({
      target,
      targetName,
      images,
    });
  } catch (err) {
    console.error("Error fetching captcha:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
