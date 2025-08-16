import { GraphQLClient } from 'graphql-request';

// TODO: Replace with your actual Hygraph endpoint
// Example: 'https://api-us-west-2.hygraph.com/v2/your-project-id/master'
const HYGRAPH_ENDPOINT = 'https://YOUR_REGION.hygraph.com/v2/YOUR_PROJECT_ID/master';

// TODO: Replace with your actual Hygraph auth token
// Get this from: Project Settings → API Access → Permanent Auth Tokens
const HYGRAPH_TOKEN = 'YOUR_HYGRAPH_TOKEN';

export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

export default hygraphClient;