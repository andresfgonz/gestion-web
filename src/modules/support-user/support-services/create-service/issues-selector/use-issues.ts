import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const issuesQuery = gql`
  query issues {
    issues{
      id
      name
    }
  }
`;

export const useIssues = () => {
  const { data: { issues }, loading } = useQuery<{ issues: Issue[] }>(issuesQuery);
  return { issues, loading };
};
