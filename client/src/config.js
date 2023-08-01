let baseUrl = '';

if (process.env.NODE_ENV === 'production') {
  // Set the base URL to localhost during development
  baseUrl = 'https://campfire-1f3fc409de5e.herokuapp.com/';
} else {
  // Set the base URL to the actual production URL
  baseUrl = 'http://localhost:3001';
}

export default baseUrl;