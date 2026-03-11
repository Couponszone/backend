const { supabase } = require('../../config/db');
const cloudinary = require('../../config/cloudinary');

// Helper: upload image to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'companies') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    });
    stream.end(fileBuffer);
  });
};

// CREATE COMPANY
exports.createCompany = async (req, res) => {
  try {
    let logo_url = '';
    if (req.file) {
      logo_url = await uploadToCloudinary(req.file.buffer);
    }

    const companyData = { ...req.body, logo_url };
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET ALL COMPANIES
exports.getCompanies = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = { ...req.body }; // All text fields

    // If a new logo is uploaded, upload to Cloudinary and replace logo_url
    if (req.file) {
      const logo_url = await uploadToCloudinary(req.file.buffer);
      updateData.logo_url = logo_url;
    }

    // Supabase expects null instead of empty string if field is not updated
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '') updateData[key] = null;
    });

    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, data: data[0] });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// DELETE COMPANY
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, data: data[0], message: 'Company deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};