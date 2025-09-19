import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Captcha from "../modles/captcha.mjs";
import connectDB from "../lib/db.mjs";


const captchaData = [
  { label: "/m/0pg52", name: "taxis", files: ["taxi.jpg", "taxi2.jpg"] },
  { label: "/m/01bjv", name: "bus", files: ["bus.jpg", "bus2.jpg"] },
  { label: "/m/02yvhj", name: "school bus", files: ["schoolbus.jpg", "schoolbus2.jpg"] },
  { label: "/m/04_sv", name: "motorcycles", files: ["motorcycle.jpg", "motorcycle2.jpg"] },
  { label: "/m/013xlm", name: "tractors", files: ["tractor.jpg", "tractor2.jpg"] },
  { label: "/m/01jk_4", name: "chimneys", files: ["chimney.jpg", "chimney2.jpg"] },
  { label: "/m/014xcs", name: "crosswalks", files: ["crosswalk.jpg", "crosswalk2.jpg"] },
  { label: "/m/015qff", name: "traffic lights", files: ["trafficlight.jpg", "trafficlight2.jpg"] },
  { label: "/m/0199g", name: "bicycles", files: ["bike.jpg", "bike2.jpg"] },
  { label: "/m/015qbp", name: "parking meters", files: ["parkingmeter.jpg", "parkingmeter2.jpg"] },
  { label: "/m/0k4j", name: "cars", files: ["car.jpg", "car2.jpg"] },
  { label: "/m/015kr", name: "bridges", files: ["bridge.jpg", "bridge2.jpg"] },
  { label: "/m/019jd", name: "boats", files: ["boat.jpg", "boat2.jpg"] },
  { label: "/m/0cdl1", name: "palm trees", files: ["palmtree.jpg", "palmtree2.jpg"] },
  { label: "/m/09d_r", name: "mountains", files: ["mountains.jpg", "mountain2.jpg"] },
  { label: "/m/01pns0", name: "fire hydrant", files: ["firehydrant.jpg", "firehydrant2.jpg"] },
  { label: "/m/01lynh", name: "stairs", files: ["stairs.jpg", "stairs2.jpg"] }
];

const seed = async () => {
  await connectDB();

  const imagesPath = path.join(process.cwd(), "public", "images");

  const data = captchaData.map((item) => {
    const images = item.files.map((file) => {
      const imgPath = path.join(imagesPath, file);
      if (fs.existsSync(imgPath)) {
       
        return fs.readFileSync(imgPath).toString("base64");

      } else {
        console.warn(`⚠️ File not found: ${imgPath}`);
        return null;
      }
    }).filter(Boolean);

    return {
      label: item.label,
      name: item.name,
      images,  
    };
  });


  await Captcha.deleteMany({});
  await Captcha.insertMany(data);

  console.log(" Captchas seeded successfully!");
  process.exit();
};

seed();
