import vision from '@google-cloud/vision';

// Creates a client
const client = new vision.ImageAnnotatorClient();

// Function to detect labels from an image
export async function detectAnimalLabels(imagePath: string) {
  try {
    const [result] = await client.labelDetection(imagePath);
    const labels = result.labelAnnotations;
    console.log('Labels detected:');
    labels?.forEach(label => console.log(label.description));
    return labels;
  } catch (error) {
    console.error('Error during label detection:', error);
    throw error;
  }
}
