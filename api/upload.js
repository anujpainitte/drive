import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

// Cloudinary configuration
cloudinary.config({ 
    cloud_name: 'ddw6uldso', 
    api_key: '144957938615992', 
    api_secret: '1LHRU1wIfb_DCEdNCDz9NBaxRDY',  // Provided API Secret
});

// Disable body parsing for multipart forms (Vercel's serverless function default)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Main function to handle file upload
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Parse the uploaded file using formidable
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the file', err);
        return res.status(500).json({ error: 'File parsing error' });
      }

      const file = files.file;  // Assuming the file input is named "file"
      const filename = fields.filename;  // Filename entered by the user
      
      if (!file || !filename) {
        return res.status(400).json({ error: 'File or filename is missing' });
      }

      try {
        // Upload the file to Cloudinary with the user-specified filename
        const uploadedResponse = await cloudinary.uploader.upload(file.filepath, {
          public_id: `uploads/${filename}`,  // Use the user-specified filename
        });

        // Return the Cloudinary URL of the uploaded file
        return res.status(200).json({ url: uploadedResponse.secure_url });
      } catch (error) {
        console.error('Cloudinary upload failed:', error);
        return res.status(500).json({ error: 'Upload failed' });
      }
    });
  } else {
    // Handle non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
