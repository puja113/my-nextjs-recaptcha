import { useState, useEffect } from "react";

export default function CaptchaCard() {
  const [selected, setSelected] = useState([]);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState("");
  const [targetName, setTargetName] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchCaptcha = async () => {
      try {
        const res = await fetch("/api/getCaptcha");
        const data = await res.json();

        setTarget(data.target);
        setTargetName(data.targetName);
        setImages(data.images || []);
      } catch (err) {
        console.error("Error fetching captcha:", err);
      }
    };
    fetchCaptcha();
  }, []);


  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleVerify = async () => {
    const res = await fetch("/api/verifyCaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedIds: selected, 
        target,
      }),
    });
  
    const data = await res.json();
    if (data.success) {
      setVerified(true);
      setError(false);
    } else {
      setError(true);
      setSelected([]);
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
            Select all images with <b>{targetName}</b>:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 100px)",
              gap: 10,
              justifyContent: "center",
            }}
          >
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => toggleSelect(img.id)}
                style={{
                  border: selected.includes(img.id)
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
                  alt={img.label}
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
