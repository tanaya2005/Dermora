# Advertisement System Documentation

## Overview
The advertisement system allows you to create and manage pop-up advertisements that appear on your home page for both signed-in and guest users. This creates an advertising revenue model for your platform.

## Features

### Backend Features
- **Advertisement Model**: Complete data model with targeting, scheduling, and analytics
- **REST API**: Full CRUD operations for advertisement management
- **Analytics Tracking**: Impression and click tracking for performance metrics
- **User Targeting**: Target specific user types (all, signed-in, guests)
- **Priority System**: Control advertisement display order (1-10 priority)
- **Scheduling**: Set start and end dates for campaigns

### Frontend Features
- **Pop-up Display**: Attractive modal pop-ups with smooth animations
- **Smart Timing**: Shows ads after 3 seconds, then every 60 seconds
- **Responsive Design**: Works on all device sizes
- **Admin Dashboard**: Complete management interface for admins
- **Performance Tracking**: View impressions, clicks, and CTR

## API Endpoints

### Public Endpoints
- `GET /api/advertisements/active?userType=guest|signed_in` - Get active ads
- `POST /api/advertisements/:adId/impression` - Record impression
- `POST /api/advertisements/:adId/click` - Record click

### Admin Endpoints (Requires Admin Role)
- `POST /api/advertisements` - Create new advertisement
- `GET /api/advertisements/all` - Get all advertisements
- `PUT /api/advertisements/:adId` - Update advertisement
- `DELETE /api/advertisements/:adId` - Delete advertisement

## Database Schema

```javascript
{
  title: String,           // Advertisement title
  description: String,     // Advertisement description
  imageUrl: String,        // Image URL for the ad
  redirectUrl: String,     // Where to redirect when clicked
  targetAudience: String,  // 'all', 'signed_in', 'guest'
  isActive: Boolean,       // Whether ad is currently active
  priority: Number,        // Display priority (1-10)
  startDate: Date,         // When ad becomes active
  endDate: Date,           // When ad expires
  clickCount: Number,      // Total clicks received
  impressionCount: Number, // Total impressions recorded
  createdBy: ObjectId      // Admin who created the ad
}
```

## Setup Instructions

### 1. Backend Setup
The backend is already configured. To seed sample advertisements:

```bash
cd backend
npm run seed:ads
```

### 2. Frontend Integration
The advertisement system is automatically integrated into the Home page. No additional setup required.

### 3. Admin Access
1. Login as an admin user
2. Navigate to `/admin/advertisements`
3. Create, edit, and manage advertisements

## Usage Guide

### Creating Advertisements
1. Go to Admin Dashboard → Advertisements
2. Click "Create Advertisement"
3. Fill in the form:
   - **Title**: Catchy advertisement title
   - **Description**: Brief description of the offer
   - **Image URL**: Link to advertisement image
   - **Redirect URL**: Where users go when they click
   - **Target Audience**: Who should see this ad
   - **Priority**: Higher numbers show first
   - **End Date**: When the campaign expires
   - **Active**: Whether the ad is currently running

### Advertisement Display Logic
- Ads appear 3 seconds after page load
- Subsequent ads show every 60 seconds
- Only active ads within date range are shown
- Higher priority ads are shown first
- Targeting filters ads by user type

### Analytics
Track advertisement performance with:
- **Impressions**: How many times the ad was shown
- **Clicks**: How many times users clicked the ad
- **CTR**: Click-through rate (clicks/impressions)

## Revenue Model Ideas

### Direct Advertising
- Charge businesses to display their ads
- Pricing based on impressions or clicks
- Premium placement for higher priority

### Affiliate Marketing
- Promote affiliate products
- Earn commission on sales
- Track conversions through redirect URLs

### Internal Promotions
- Promote your own products/services
- Drive traffic to specific pages
- Increase conversion rates

## Customization Options

### Advertisement Timing
Edit `frontend/src/components/AdManager.tsx`:
```javascript
// Change initial delay (currently 3 seconds)
setTimeout(() => {
  setShowPopup(true);
}, 3000);

// Change interval between ads (currently 60 seconds)
setInterval(() => {
  // Show next ad
}, 60000);
```

### Advertisement Styling
Edit `frontend/src/components/AdPopup.tsx` to customize:
- Colors and themes
- Animation effects
- Layout and sizing
- Button styles

### Targeting Options
Extend the targeting system by:
- Adding more audience types
- Implementing geographic targeting
- Adding device-specific targeting
- Creating user behavior-based targeting

## Best Practices

### Advertisement Content
- Use high-quality, relevant images
- Keep titles concise and compelling
- Write clear, action-oriented descriptions
- Ensure redirect URLs are valid and safe

### Campaign Management
- Set realistic end dates
- Monitor performance regularly
- A/B test different creatives
- Rotate advertisements to prevent fatigue

### User Experience
- Don't show too many ads too frequently
- Ensure ads are relevant to your audience
- Provide easy close/skip options
- Monitor user feedback and adjust accordingly

## Troubleshooting

### Ads Not Showing
1. Check if ads are active and within date range
2. Verify user type matches target audience
3. Ensure API endpoints are working
4. Check browser console for errors

### Performance Issues
1. Optimize image sizes and formats
2. Implement image lazy loading
3. Consider caching advertisement data
4. Monitor API response times

### Analytics Not Recording
1. Verify API endpoints are accessible
2. Check network requests in browser dev tools
3. Ensure proper error handling
4. Validate advertisement IDs

## Future Enhancements

### Advanced Features
- Geographic targeting
- Time-based scheduling
- A/B testing framework
- Advanced analytics dashboard
- Integration with ad networks

### Performance Optimizations
- Image optimization and CDN
- Advertisement caching
- Lazy loading
- Progressive loading

### Revenue Features
- Payment integration for advertisers
- Automated billing system
- Performance-based pricing
- Advertiser self-service portal

## Support
For issues or questions about the advertisement system, check:
1. Browser console for JavaScript errors
2. Network tab for API request failures
3. Backend logs for server errors
4. Database for data consistency issues