const { supabase } = require('../../config/db');
exports.createCoupon = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (!payload.id) delete payload.id;
    if (!payload.company_id) delete payload.company_id;
    if (!payload.category_id) delete payload.category_id;

    const { data, error } = await supabase
      .from('coupons')
      .insert([payload])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    console.error("INSERT ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// GET COUPONS/DEALS/OFFERS
exports.getCoupons = async (req, res) => {
  try {
    let query = supabase.from('coupons').select('*');
    if (req.query.type) query = query.eq('type', req.query.type);
    if (req.query.status) query = query.eq('status', req.query.status);

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE COUPON/DEAL/OFFER
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    const { data, error } = await supabase
      .from('coupons')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: data[0] });
  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE COUPON/DEAL/OFFER
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: data[0], message: 'Item deleted successfully' });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.clickCoupon = async (req, res) => {
  try {
    const { userId, couponId, couponName } = req.body;
    if (!userId || !couponId) return res.status(400).json({ error: "Missing data" });

    const { data, error } = await supabase
      .from("coupon_clicks")
      .insert([{ user_id: userId, coupon_id: couponId, coupon_name: couponName }])
      .select();

    if (error) throw error;

    res.json({ success: true, message: "Coupon click recorded", data: data[0] });
  } catch (err) {
    console.error("Click coupon error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all clicks
exports.getTotalClicks = async (req, res) => {
  try {
    const { data, error } = await supabase.from("coupon_clicks").select("*");
    if (error) throw error;
    res.json({ success: true, totalClicks: data.length, clicks: data });
  } catch (err) {
    console.error("Get total clicks error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get clicks for a specific user
exports.getUserClicks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from("coupon_clicks")
      .select("*")
      .eq("user_id", userId)
      .order("clicked_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, clicks: data });
  } catch (err) {
    console.error("Get user clicks error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};