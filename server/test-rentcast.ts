// Test script to verify Rentcast API connectivity
const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;

async function testRentcastAPI() {
  if (!RENTCAST_API_KEY) {
    console.error('RENTCAST_API_KEY not found');
    return;
  }

  console.log('Testing Rentcast API with key:', RENTCAST_API_KEY.substring(0, 20) + '...');

  try {
    // Test with a simple property lookup
    const response = await fetch('https://api.rentcast.io/v1/properties?address=1600 Amphitheatre Parkway&city=Mountain View&state=CA', {
      method: 'GET',
      headers: {
        'X-Api-Key': RENTCAST_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✓ Rentcast API connection successful');
    } else {
      console.log('✗ Rentcast API returned error:', data);
    }
  } catch (error) {
    console.error('✗ Rentcast API test failed:', error);
  }
}

testRentcastAPI();