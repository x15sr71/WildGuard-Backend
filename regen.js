const { Storage: GCSStorage } = require('@google-cloud/storage');

const storage = new GCSStorage({
  keyFilename: 'wildgaurd-b665d68cd5c7.json', // use absolute path if needed
});

async function generateSignedUrl() {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  const [url] = await storage
    .bucket('wildgaurd-images')
    .file('uploads/8ef01142-7a95-43ae-85fd-35a8055f8ed8-images (1).jpeg')
    .getSignedUrl(options);

  console.log('Generated signed URL:', url);
}

generateSignedUrl();
