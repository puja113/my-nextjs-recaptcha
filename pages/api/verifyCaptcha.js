export default function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const { selected, target, allImages } = req.body;
  
    if (!selected || !target || !allImages) {
      return res.status(400).json({ success: false, message: "Missing parameters" });
    }
  
   
    const correctImages = allImages.filter(img => img.label === target).map(img => img.src);
  
    
    const userSelected = selected.map(img => img.src);
  
    const isCorrect =
      correctImages.length > 0 &&
      correctImages.every(src => userSelected.includes(src)) &&
      userSelected.every(src => correctImages.includes(src));
  
    if (isCorrect) {
      return res.status(200).json({ success: true, message: "Verification successful" });
    } else {
      return res.status(400).json({ success: false, message: "Verification failed" });
    }
  }
  