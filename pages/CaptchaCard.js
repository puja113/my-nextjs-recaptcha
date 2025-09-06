import { useState, useEffect } from "react";
import { captchaObjects } from "../Data/captchaObject";

export default function CaptchaCard() {
  const [selected, setSelected] = useState([]);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState("");
  const [images, setImages] = useState([]);

  
  const imageDB = {
    "/m/0pg52": ["/images/taxi.jpg", "/images/taxi2.jpg"],
    "/m/01bjv": ["/images/bus.jpg", "/images/bus2.jpg"],
    "/m/02yvhj": ["/images/schoolbus.jpg", "/images/schoolbus2.jpg"],
    "/m/04_sv": ["/images/motorcycle.jpg", "/images/motorcycle2.jpg"],
    "/m/013xlm": ["/images/tractor.jpg", "/images/tractor2.jpg"],
    "/m/01jk_4": ["/images/chimney.jpg", "/images/chimney2.jpg"],
    "/m/014xcs": ["/images/crosswalk.jpg", "/images/crosswalk2.jpg"],
    "/m/015qff": ["/images/trafficlight.jpg", "/images/trafficlight2.jpg"],
    "/m/0199g": ["/images/bike.jpg", "/images/bike2.jpg"],
    "/m/015qbp": ["/images/parkingmeter.jpg", "/images/parkingmeter2.jpg"],
    "/m/0k4j": ["/images/car.jpg", "/images/car2.jpg"],
    "/m/015kr": ["/images/bridge.jpg", "/images/bridge2.jpg"],
    "/m/019jd": ["/images/boat.jpg", "/images/boat2.jpg"],
    "/m/0cdl1": ["/images/palmtree.jpg", "/images/palmtree2.jpg"],
    "/m/09d_r": ["/images/mountains.jpg", "/images/mountain2.jpg"],
    "/m/01pns0": ["/images/Firehydrant.jpg", "/images/firehydrant2.jpg"],
    "/m/01lynh": ["/images/stairs.jpg", "/images/stairs2.jpg"],
     
  };

  useEffect(() => {
    const keys = Object.keys(captchaObjects);

   
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setTarget(randomKey);

    
    const correctImgs = (imageDB[randomKey] || []).slice(0, 2).map(src => ({
      src,
      label: randomKey,
    }));

   
    const otherKeys = keys.filter(k => k !== randomKey);
    let distractors = [];
    while (distractors.length < 7) {
      const randKey = otherKeys[Math.floor(Math.random() * otherKeys.length)];
      const randImgs = imageDB[randKey] || [];
      if (randImgs.length > 0) {
        const randSrc = randImgs[Math.floor(Math.random() * randImgs.length)];
        distractors.push({ src: randSrc, label: randKey });
      }
    }


    const grid = [...correctImgs, ...distractors].sort(() => Math.random() - 0.5);
    setImages(grid);
  }, []);

  const toggleSelect = (img) => {
    if (selected.some(i => i.src === img.src)) {
      setSelected(selected.filter(i => i.src !== img.src));
    } else {
      setSelected([...selected, img]);
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch("/api/verifyCaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected, target, allImages: images }),
      });

      const data = await res.json();
      if (data.success) {
        setVerified(true);
        setError(false);
      } else {
        setError(true);
        setSelected([]);
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  const handleRetry = () => {
    setError(false);
    setSelected([]);
    window.location.reload(); 
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h3>Captcha Verification</h3>

      {!verified ? (
        <>
          <p>
            Select all images with <b>{captchaObjects[target]}</b>:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 100px)",
              gap: 10,
              justifyContent: "center",
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => toggleSelect(img)}
                style={{
                  border: selected.some(i => i.src === img.src)
                    ? "3px solid green"
                    : "1px solid gray",
                  cursor: "pointer",
                  width: 100,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={img.src}
                  alt={captchaObjects[img.label]}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
            ))}
          </div>

          {!error ? (
            <button
              onClick={handleVerify}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Verify
            </button>
          ) : (
            <div style={{ marginTop: 20 }}>
              <p style={{ color: "red" }}>Verification failed! Try again.</p>
              <button
                onClick={handleRetry}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "orange",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: "green", fontWeight: "bold" }}>Verified! ✅</p>
      )}
    </div>
  );
}
