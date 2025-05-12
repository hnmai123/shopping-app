const { onObjectFinalized } = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");

admin.initializeApp();
const db = admin.firestore();
const client = new vision.ImageAnnotatorClient();

exports.labelProductImage = onObjectFinalized(async (event) => {
  const object = event.data; // ✅ FIXED: Access the real object data here
  const filePath = `gs://${object.bucket}/${object.name}`;

  console.log("📸 File uploaded:", object.name);

  if (!object.name.startsWith("uploads/")) {
    console.log("❌ Skipped: not in uploads/");
    return;
  }

  try {
    const [result] = await client.labelDetection(filePath);
    const labels = result.labelAnnotations.map(label => label.description.toLowerCase());

    console.log("✅ Labels generated:", labels);

    await db.collection("imageLabels").add({
      labels,
      imagePath: filePath,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("📝 Labels written to Firestore");
  } catch (error) {
    console.error("🔥 Error in labelProductImage:", error);
  }
});
