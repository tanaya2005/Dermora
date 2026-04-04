import Advertisement from '../models/Advertisement.js';

// Get active advertisements for display
export const getActiveAds = async (req, res) => {
  try {
    const { userType = 'guest' } = req.query;
    const currentDate = new Date();
    
    const query = {
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      $or: [
        { targetAudience: 'all' },
        { targetAudience: userType }
      ]
    };

    const advertisements = await Advertisement.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(5)
      .select('-createdBy -__v');

    res.json({
      success: true,
      data: advertisements
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisements'
    });
  }
};

// Record advertisement impression
export const recordImpression = async (req, res) => {
  try {
    const { adId } = req.params;
    
    await Advertisement.findByIdAndUpdate(
      adId,
      { $inc: { impressionCount: 1 } }
    );

    res.json({
      success: true,
      message: 'Impression recorded'
    });
  } catch (error) {
    console.error('Error recording impression:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record impression'
    });
  }
};

// Record advertisement click
export const recordClick = async (req, res) => {
  try {
    const { adId } = req.params;
    
    await Advertisement.findByIdAndUpdate(
      adId,
      { $inc: { clickCount: 1 } }
    );

    res.json({
      success: true,
      message: 'Click recorded'
    });
  } catch (error) {
    console.error('Error recording click:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record click'
    });
  }
};

// Create new advertisement (admin only)
export const createAd = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      redirectUrl,
      targetAudience,
      priority,
      endDate
    } = req.body;

    const advertisement = new Advertisement({
      title,
      description,
      imageUrl,
      redirectUrl,
      targetAudience,
      priority,
      endDate,
      createdBy: req.user.id
    });

    await advertisement.save();

    res.status(201).json({
      success: true,
      data: advertisement,
      message: 'Advertisement created successfully'
    });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create advertisement'
    });
  }
};

// Get all advertisements (admin only)
export const getAllAds = async (req, res) => {
  try {
    const advertisements = await Advertisement.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: advertisements
    });
  } catch (error) {
    console.error('Error fetching all advertisements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisements'
    });
  }
};

// Update advertisement (admin only)
export const updateAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const updateData = req.body;

    const advertisement = await Advertisement.findByIdAndUpdate(
      adId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      data: advertisement,
      message: 'Advertisement updated successfully'
    });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update advertisement'
    });
  }
};

// Delete advertisement (admin only)
export const deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;

    const advertisement = await Advertisement.findByIdAndDelete(adId);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: 'Advertisement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete advertisement'
    });
  }
};