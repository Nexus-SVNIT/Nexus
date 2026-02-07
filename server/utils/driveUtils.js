const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { Readable, PassThrough } = require('stream');

// Initialize Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Get Google Drive credentials from environment variables
 */
const getCredentials = () => {
  return {
    type: process.env.GOOGLE_CLOUD_TYPE,
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
    auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN || 'googleapis.com'
  };
};

/**
 * Create and authorize a Google Drive client
 * 
 * @returns {google.drive_v3.Drive} Authorized Drive client
 */
const getDriveClient = () => {
  try {
    const credentials = getCredentials();
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Error creating Drive client:', error);
    throw new Error('Failed to initialize Google Drive client');
  }
};

/**
 * Upload an image to Google Drive from a Multer request
 * 
 * @param {Object} req - Express request object with multer file
 * @param {String} folderId - Optional Google Drive folder ID to store the file in
 * @returns {Promise<Object>} Upload result with success status and fileId
 */
const uploadImageToDrive = async (req, folderId = process.env.GOOGLE_DRIVE_ACHIEVEMENTS_FOLDER, admissionNumber) => {
  try {
    if (!req.file) {
      return { success: false, error: 'No file provided' };
    }

    const drive = getDriveClient();
    
    // Create file metadata
    const fileMetadata = {
      name: `${admissionNumber}-image-${Date.now()}${path.extname(req.file.originalname || '')}` || req.file.originalname,
      parents: folderId ? [folderId] : [] // Add to specific folder if provided
    };

    // // Create media object
    // const media = {
    //   mimeType: req.file.mimetype,
    //   body: fs.createReadStream(req.file.path)
    // };

    const bufferStream = new PassThrough();
    bufferStream.end(req.file.buffer);

    // Upload file to Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: req.file.mimeType,
        body: bufferStream,
      },
      fields: 'id'
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    // // Clean up temporary file
    // fs.unlink(req.file.path, (err) => {
    //   if (err) console.error('Error deleting temp file:', err);
    // });

    return { 
      success: true, 
      fileId: response.data.id,
      fileUrl: `https://drive.google.com/uc?id=${response.data.id}`
    };
  } catch (error) {
    console.error('Google Drive upload error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a file from Google Drive by ID
 * 
 * @param {String} fileId - Google Drive file ID
 * @returns {Promise<Object>} File metadata
 */
const getFileFromDrive = async (fileId) => {
  try {
    const drive = getDriveClient();
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, webViewLink, webContentLink'
    });
    
    return { success: true, file: response.data };
  } catch (error) {
    console.error('Error getting file from Drive:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a file from Google Drive
 * 
 * @param {String} fileId - Google Drive file ID
 * @returns {Promise<Object>} Operation result
 */
const deleteFileFromDrive = async (fileId) => {
  try {
    const drive = getDriveClient();
    await drive.files.delete({ fileId });
    return { success: true };
  } catch (error) {
    console.error('Error deleting file from Drive:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  uploadImageToDrive,
  getFileFromDrive,
  deleteFileFromDrive,
  getDriveClient,
  getCredentials
};
