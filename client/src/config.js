let baseUrl = '';

if (process.env.NODE_ENV === 'development') {
  // Set the base URL to localhost during development
  baseUrl = 'http://localhost:3001';
} else {
  // Set the base URL to the actual production URL
  baseUrl = 'https://campfire-1f3fc409de5e.herokuapp.com/';
}

export default baseUrl;