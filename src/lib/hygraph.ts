import { GraphQLClient } from 'graphql-request';

// Replace with your actual Hygraph endpoint from your project settings
// Example: 'https://api-us-west-2.hygraph.com/v2/your-project-id/master'
const HYGRAPH_ENDPOINT = 'https://YOUR_REGION.hygraph.com/v2/YOUR_PROJECT_ID/master';

// For frontend applications, you can use a read-only content API token
// The secure token is handled via environment variables in production
export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    // The API key will be added here when you update the endpoint URL above
    // For now, this will work once you configure your endpoint
  },
});

export default hygraphClient;