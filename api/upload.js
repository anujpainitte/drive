// Import Cloudinary SDK
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your provided credentials
cloudinary.config({
  cloud_name: 'ddw6uldso',
  api_key: '144957938615992',
  api_secret: '1LHRU1wIfb_DCEdNCDz9NBaxRDY',
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { data, filename } = req.body;

    // Debugging: Check if the file data and filename were passed correctly
    if (!data || !filename) {
      console.error('No data or filename received');
      return res.status(400).json({ error: 'File data or filename missing' });
    }

    try {
      // Upload the file to Cloudinary using the user-defined filename
      const uploadedResponse = await cloudinary.uploader.upload(data, {
        public_id: `uploads/${filename}`, // Set the file name in Cloudinary
      });

      console.log('Upload successful:', uploadedResponse); // Debugging: Log Cloudinary response

      // Return the URL of the uploaded file
      res.status(200).json({ url: uploadedResponse.secure_url });
    } catch (error) {
      // More detailed error logging
      console.error('Upload failed:', error);
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  } else {
    console.error('Invalid request method:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
