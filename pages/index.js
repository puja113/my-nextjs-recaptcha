import CaptchaCard from "./CaptchaCard";

export default function Home() {
  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CaptchaCard />
    </div>
  );
}
