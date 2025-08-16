import { GraphQLClient } from 'graphql-request';

// Your Hygraph Content API endpoint
const HYGRAPH_ENDPOINT = 'https://ap-south-1.cdn.hygraph.com/content/cmebfl0oe02kv07utjwx0hlht/master';

// For frontend applications, create client without auth headers initially
// You can add a public content API token here if needed
export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    // Add your public content API token here if you have one
    // Authorization: `Bearer YOUR_PUBLIC_CONTENT_API_TOKEN`,
  },
});

export default hygraphClient;