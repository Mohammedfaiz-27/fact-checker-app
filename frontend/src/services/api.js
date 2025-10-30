// Use environment variable for API base URL, fallback to relative URL for local development
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Log the API base URL for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL || 'Using proxy');
}

export async function checkClaim(claimText) {
  try {
    const url = `${API_BASE_URL}/api/claims/`;

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Making request to:', url);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim_text: claimText }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No error details');
      console.error('API Error Response:', errorText);
      throw new Error(`API error: ${res.status} - ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function checkMultimodalClaim(claimText, file) {
  try {
    const formData = new FormData();

    if (claimText) {
      formData.append('claim_text', claimText);
    }

    if (file) {
      formData.append('file', file);
    }

    const url = `${API_BASE_URL}/api/claims/multimodal`;

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Making multimodal request to:', url);
    }

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No error details');
      console.error('API Error Response:', errorText);
      throw new Error(`API error: ${res.status} - ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
