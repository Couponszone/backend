const { supabase } = require('../../config/db'); 
const cloudinary = require('../../config/cloudinary');

exports.createCategory = async (req, res) => {
  try {
    let image_url = '';

    if (req.file) {
      const uploadPromise = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'categories' },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
          stream.end(req.file.buffer);
        });

      image_url = await uploadPromise();
    }

    const { name, slug, meta_title, meta_description } = req.body;

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, meta_title, meta_description, image_url }])
      .select();console.log('Insert result:', data, error);

    if (error) throw error;

    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    console.log('Supabase fetch:', data, error); // <--- Debug here

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch current category to preserve image if no new file
    const { data: existingData, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    let image_url = existingData.image_url; // preserve old image

    if (req.file) {
      const uploadPromise = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'categories' },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
          stream.end(req.file.buffer);
        });

      image_url = await uploadPromise();
    }

    const { name, slug, meta_title, meta_description } = req.body;

    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug, meta_title, meta_description, image_url })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};