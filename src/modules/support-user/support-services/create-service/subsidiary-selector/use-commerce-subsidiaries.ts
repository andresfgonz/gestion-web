import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const commerceSubsidiariesQuery = gql`
  query commerceSubsidiaries($commerceId: String!){
    commerceSubsidiaries(commerceId: $commerceId){
      id
      name
      address
    }
  }
`;

export const useCommerceSubsidiaries = (commerceId: string) => {
  const { data, loading } =
    useQuery<{ commerceSubsidiaries: Subsidiary[] }>(commerceSubsidiariesQuery, {
      variables: { commerceId },
    });

  return { loading, subsidiaries: data.commerceSubsidiaries };
};
