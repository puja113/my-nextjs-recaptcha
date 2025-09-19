
import fs from "fs";
import path from "path";
import sharp from "sharp"; 
import Captcha from "../modles/captcha.mjs";
import connectDB from "../lib/db.mjs";

const captchaData = [
  { label: "/m/0pg52", name: "taxis", files: ["taxi.jpg"] },
  { label: "/m/01bjv", name: "bus", files: ["bus.jpg"] },
  { label: "/m/02yvhj", name: "school bus", files: ["schoolbus.jpg"] },
  { label: "/m/04_sv", name: "motorcycles", files: ["motorcycle.jpg"] },
  { label: "/m/013xlm", name: "tractors", files: ["tractor.jpg"] },
  { label: "/m/01jk_4", name: "chimneys", files: ["chimney.jpg"] },
  { label: "/m/014xcs", name: "crosswalks", files: ["crosswalk.jpg"] },
  { label: "/m/015qff", name: "traffic lights", files: ["trafficlight.jpg"] },
  { label: "/m/0199g", name: "bicycles", files: ["bike.jpg"] },
  { label: "/m/015qbp", name: "parking meters", files: ["parkingmeter.jpg"] },
  { label: "/m/0k4j", name: "cars", files: ["car.jpg", "car2.jpg"] },
  { label: "/m/015kr", name: "bridges", files: ["bridge.jpg"] },
  { label: "/m/019jd", name: "boats", files: ["boat.jpg"] },
  { label: "/m/0cdl1", name: "palm trees", files: ["palmtree.jpg"] },
  { label: "/m/09d_r", name: "mountains", files: ["mountains.jpg"] },
  { label: "/m/01pns0", name: "fire hydrant", files: ["firehydrant.jpg"] },
  { label: "/m/01lynh", name: "stairs", files: ["stairs.jpg"] }
];

const seed = async () => {
  await connectDB();

  const imagesPath = path.join(process.cwd(), "public", "images");

  const data = await Promise.all(
    captchaData.map(async (item) => {
      const images = await Promise.all(
        item.files.map(async (file) => {
          const imgPath = path.join(imagesPath, file);

          if (!fs.existsSync(imgPath)) {
            console.warn(`⚠️ File not found: ${imgPath}`);
            return null;
          }

          try {
          
            const buffer = await sharp(imgPath)
              .resize(150, 150, { fit: "cover" }) 
              .jpeg({ quality: 60 })              
              .toBuffer();

            return buffer.toString("base64");
          } catch (err) {
            console.error(`❌ Error processing ${imgPath}:`, err);
            return null;
          }
        })
      );

      return {
        label: item.label,
        name: item.name,
        images: images.filter(Boolean),
      };
    })
  );

  await Captcha.deleteMany({});
  await Captcha.insertMany(data);

  console.log(" Captchas seeded successfully!");
  process.exit();
};

seed();
