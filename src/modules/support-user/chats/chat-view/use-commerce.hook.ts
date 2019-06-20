import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const getUserSubsidiaryQuery = gql`
  query getUserSubsidiary($personId: String!){
    subsidiary:subsidiaryByPerson(personId: $personId){
      id
      name
      commerce{
        name
        tinNumber
        logoImage
      }
    }
  }
`;

export const useSubsidiary = (userId: string) => {
  const { data: { subsidiary } } =
    useQuery<{ subsidiary: Subsidiary }>(getUserSubsidiaryQuery, {
      variables: { personId: userId },
    });

  return { subsidiary };
};
