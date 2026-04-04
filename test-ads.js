// Simple test script to verify advertisement API
const testAds = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/advertisements/active?userType=guest');
    const data = await response.json();
    
    console.log('Advertisement API Test Results:');
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    console.log('Number of ads:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\nSample Advertisement:');
      console.log('Title:', data.data[0].title);
      console.log('Description:', data.data[0].description);
      console.log('Target Audience:', data.data[0].targetAudience);
      console.log('Priority:', data.data[0].priority);
    }
  } catch (error) {
    console.error('Error testing ads:', error.message);
  }
};

testAds();