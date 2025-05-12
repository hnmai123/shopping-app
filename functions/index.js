const { onObjectFinalized } = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");

admin.initializeApp();
const db = admin.firestore();
const client = new vision.ImageAnnotatorClient();

exports.labelProductImage = onObjectFinalized(async (event) => {
  const object = event;
  const filePath = `gs://${object.bucket}/${object.name}`;

  // Only handle files uploaded to 'uploads/'
  if (!object.name.startsWith("uploads/")) return;

  const [result] = await client.labelDetection(filePath);
  const labels = result.labelAnnotations.map(label => label.description.toLowerCase());

  console.log(`✅ Labels for ${object.name}:`, labels);

  await db.collection("imageLabels").add({
    labels,
    imagePath: filePath,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
