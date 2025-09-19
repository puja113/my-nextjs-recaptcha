// verify
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { selectedIds, target } = req.body;

  if (!selectedIds || !target) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameters" });
  }

  
  const correctIds = global.captchaCache
    ? global.captchaCache.filter((img) => img.label === target).map((img) => img.id)
    : [];

  const isCorrect =
    correctIds.length > 0 &&
    correctIds.every((id) => selectedIds.includes(id)) &&
    selectedIds.every((id) => correctIds.includes(id));

  if (isCorrect) {
    return res.status(200).json({
      success: true,
      message: "Verification successful",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Verification failed",
    });
  }
}
