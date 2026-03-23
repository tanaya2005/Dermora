import User from '../models/User.js';

/**
 * Save skin assessment data
 * POST /api/assessment
 */
export const saveAssessment = async (req, res, next) => {
  try {
    const { skinType, skinConcerns, budget, preferredCategories } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!skinType || !skinConcerns || !Array.isArray(skinConcerns)) {
      return res.status(400).json({ 
        error: 'Skin type and concerns are required' 
      });
    }

    // Update user's skin profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'skinProfile.skinType': skinType,
          'skinProfile.skinConcerns': skinConcerns,
          'skinProfile.budget': budget || 'under-1000',
          'skinProfile.preferredCategories': preferredCategories || [],
          'skinProfile.assessmentCompleted': true,
          'skinProfile.completedAt': new Date(),
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Assessment saved successfully',
      skinProfile: updatedUser.skinProfile 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's skin assessment data
 * GET /api/assessment
 */
export const getAssessment = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('skinProfile');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ skinProfile: user.skinProfile });
  } catch (error) {
    next(error);
  }
};