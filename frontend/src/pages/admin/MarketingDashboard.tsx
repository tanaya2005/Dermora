import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  marketingOverview, 
  googleAdsData, 
  metaAdsData, 
  emailMarketingData, 
  referralProgramData, 
  contentSeoData, 
  socialMediaData 
} from '../../data/marketingData';

const MarketingDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Marketing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl border border-primary/15 bg-white/80 dark:bg-slate-900/80 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Admin Dashboard
          </Link>
          <h1 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-2">
            Marketing Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Complete marketing performance analytics and campaign insights
          </p>
        </motion.div>

        {/* Marketing Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">₹{(marketingOverview.totalMarketingSpend / 1000).toFixed(0)}K</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Marketing Spend</div>
            <div className="text-xs text-slate-500 mt-1">Monthly</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">₹{(marketingOverview.revenueAttributed / 1000).toFixed(0)}K</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Revenue Attributed</div>
            <div className="text-xs text-success mt-1">+15% growth</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-primary dark:text-secondary mb-2">{marketingOverview.overallRoas}x</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Overall ROAS</div>
            <div className="text-xs text-success mt-1">Above target</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{marketingOverview.newUsersFromMarketing.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">New Users</div>
            <div className="text-xs text-slate-500 mt-1">From Marketing</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-primary dark:text-secondary mb-2">{marketingOverview.emailSubscribers.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Email Subscribers</div>
            <div className="text-xs text-success mt-1">+8% this month</div>
          </div>
        </motion.div>

        {/* Strategy 1 - Google Ads */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">Strategy 1 - Google Ads Performance</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Google Ads Metrics */}
            <div className="lg:col-span-2 glass-card p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">₹{googleAdsData.spend.toLocaleString()}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Spend</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary dark:text-secondary">{googleAdsData.clicks.toLocaleString()}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{googleAdsData.ctr}%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">CTR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{googleAdsData.roas}x</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">ROAS</div>
                </div>
              </div>
              
              <h4 className="font-semibold mb-4">Daily Performance (Last 7 Days)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={googleAdsData.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#E94560" strokeWidth={2} name="Clicks" />
                  <Line type="monotone" dataKey="conversions" stroke="#16A085" strokeWidth={2} name="Conversions" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Keywords */}
            <div className="glass-card p-6">
              <h4 className="font-semibold mb-4 text-primary dark:text-secondary">Top Performing Keywords</h4>
              <div className="space-y-4">
                {googleAdsData.topKeywords.map((keyword, index) => (
                  <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="font-medium text-sm mb-1">{keyword.keyword}</div>
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{keyword.clicks} clicks</span>
                      <span>{keyword.conversions} conv</span>
                    </div>
                    <div className="text-xs text-accent">CPA: ₹{keyword.cpa}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strategy 2 - Meta/Instagram Ads */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">Strategy 2 - Meta/Instagram Ads</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-2">₹{metaAdsData.spend.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Spend</div>
              <div className="text-xs text-success mt-1">ROAS: {metaAdsData.roas}x</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-primary dark:text-secondary mb-2">{metaAdsData.reach.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Reach</div>
              <div className="text-xs text-slate-500 mt-1">Unique users</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">{metaAdsData.engagement.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Engagement</div>
              <div className="text-xs text-slate-500 mt-1">CTR: {metaAdsData.ctr}%</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-2">₹{metaAdsData.revenue.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Revenue</div>
              <div className="text-xs text-success mt-1">Attributed</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="glass-card p-6">
              <h4 className="font-semibold mb-4 text-primary dark:text-secondary">Top Performing Creative</h4>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center text-white font-bold">
                  📹
                </div>
                <div>
                  <div className="font-medium">{metaAdsData.topCreative.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{metaAdsData.topCreative.views.toLocaleString()} views</div>
                  <div className="text-sm text-success">{metaAdsData.topCreative.engagement.toLocaleString()} engagements</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-semibold mb-4 text-primary dark:text-secondary">Retargeting Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Cart Abandoners Retargeted</span>
                  <span className="font-semibold">{metaAdsData.retargeting.cartAbandoners.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Conversion Rate</span>
                  <span className="font-semibold text-success">{metaAdsData.retargeting.conversionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strategy 3 - Email Marketing */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">Strategy 3 - Email Marketing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-primary dark:text-secondary mb-2">{emailMarketingData.totalEmailsSent.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Emails Sent</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">{emailMarketingData.openRate}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Open Rate</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-2">{emailMarketingData.ctr}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Click-Through Rate</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">{emailMarketingData.unsubscribeRate}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Unsubscribe Rate</div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-semibold mb-4 text-primary dark:text-secondary">Campaign Performance</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2">Campaign</th>
                    <th className="text-right py-2">Sent</th>
                    <th className="text-right py-2">Opened</th>
                    <th className="text-right py-2">Clicked</th>
                    <th className="text-right py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {emailMarketingData.campaigns.map((campaign, index) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 font-medium">{campaign.name}</td>
                      <td className="py-3 text-right">{campaign.sent.toLocaleString()}</td>
                      <td className="py-3 text-right">{campaign.opened.toLocaleString()}</td>
                      <td className="py-3 text-right">{campaign.clicked.toLocaleString()}</td>
                      <td className="py-3 text-right font-semibold text-success">₹{campaign.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Strategy 4 - Referral Program */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">Strategy 4 - Referral Program</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-primary dark:text-secondary mb-2">{referralProgramData.totalReferrals.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Referrals</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">{referralProgramData.successfulReferrals}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Successful Referrals</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-2">₹{referralProgramData.revenueFromReferred.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Revenue Generated</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-primary dark:text-secondary mb-2">{referralProgramData.conversionRate}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Conversion Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h4 className="font-semibold mb-4 text-primary dark:text-secondary">Top Referrers Leaderboard</h4>
              <div className="space-y-3">
                {referralProgramData.topReferrers.map((referrer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{referrer.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{referrer.referrals} referrals</div>
                      <div className="text-xs text-success">{referrer.coinsEarned} coins</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-semibold mb-4 text-primary dark:text-secondary">Referral Flow</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">1</div>
                  <span>User shares link</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm">2</div>
                  <span>Friend signs up</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white text-sm">3</div>
                  <span>Friend purchases</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">4</div>
                  <span>Both get ₹100</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strategy 5 - Content/SEO & Social Media */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Content/SEO */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Content/SEO Performance</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary dark:text-secondary">{contentSeoData.organicTraffic.toLocaleString()}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Organic Traffic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{contentSeoData.avgSessionDuration}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Avg Session</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{contentSeoData.bounceRate}%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Bounce Rate</div>
              </div>
            </div>

            <h4 className="font-semibold mb-3">Top Blog Posts</h4>
            <div className="space-y-3">
              {contentSeoData.topBlogPosts.map((post, index) => (
                <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="font-medium text-sm">{post.title}</div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{post.traffic.toLocaleString()} visits</span>
                    <span className="text-success">₹{post.estimatedRevenue.toLocaleString()} revenue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Social Media Performance</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <div className="text-2xl font-bold text-accent">{socialMediaData.instagram.followers.toLocaleString()}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Instagram Followers</div>
                <div className="text-xs text-success">{socialMediaData.instagram.engagement}% engagement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📺</div>
                <div className="text-2xl font-bold text-accent">{socialMediaData.youtube.subscribers.toLocaleString()}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">YouTube Subscribers</div>
                <div className="text-xs text-success">{socialMediaData.youtube.monthlyViews.toLocaleString()} monthly views</div>
              </div>
            </div>

            <h4 className="font-semibold mb-3">Follower Growth (Last 6 Months)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={socialMediaData.followerGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="instagram" stroke="#E94560" strokeWidth={2} name="Instagram" />
                <Line type="monotone" dataKey="youtube" stroke="#1A1A2E" strokeWidth={2} name="YouTube" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MarketingDashboard;
