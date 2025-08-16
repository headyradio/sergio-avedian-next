import { GraphQLClient } from 'graphql-request';

// Your Hygraph Content API endpoint
const HYGRAPH_ENDPOINT = 'https://ap-south-1.cdn.hygraph.com/content/cmebfl0oe02kv07utjwx0hlht/master';

// Public content API token - safe to use in frontend for read-only access
const HYGRAPH_API_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NTUzNjc5NzQsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtZWJmbDBvZTAya3YwN3V0and4MGhsaHQvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiI0NGIzNGFhMS00ZTVhLTRhZjYtOGFhZi00MDhkYzRlNGM1NzIiLCJqdGkiOiJjbWVqZHdxOWYwbmp1MDhtZzE4NGhkNjd6In0.RLqp9ChwCVVZMdKIGkgOKkbwMU1aTnNdJ7uOl2KAGFLq5VyMh6YF7VNg-s3-wlGzwjFNleMGD5YCdZKqM_VNfOUPHvdKNpMeHjb2SeBJoXM6NdOyN6Qy-7KbJGH5tOb-5jH-pv2HGnrXTH--k3F3Zy7F8YZYq1dLk2OQb7TpWQBzNAU-JgO-Q1HzjvM9lnJt5YkH-qW4ykJLOz5JbLzMzPz1YZKk8OL9pHGt9YqE1KO8qM6P8dN1rNvF2Y-4tz5JbJ-2E4FGq9B2S8N7E3M2nKZ9QqJ1O3H8pG5YbM0zL7Jf6E4Q1pN8kZ2hJ-XO6nM9wJ5kV3T-HdPuKbLgOKqXmA';

// Create GraphQL client with the API token
export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_API_TOKEN}`,
  },
});

export default hygraphClient;