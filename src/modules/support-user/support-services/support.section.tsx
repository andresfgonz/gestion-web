import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Segment,
  Dropdown,
  DropdownProps,
  Form,
  TextAreaProps,
} from 'semantic-ui-react';
import './support.section.scss';

import { useQuery, useMutation, useSubscription } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { SubsidiarySelector } from './create-service/subsidiary-selector';
import { IssuesSelector } from './create-service/issues-selector';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { ServiceCard } from '../../../components/service-card';

const getCommercesQuery = gql`
  query getCommerces {
    commerces{
      id
      name
      tinNumber
      logoImage
    }
  }
`;

const createServiceMutation = gql`
  mutation createService($serviceData: CreateServiceInputType!){
    createService(serviceData: $serviceData){
      id
    }
  }
`;

const servicesQuery = gql`
  query getAllServices {
    services {
      id
      issues {
        id
        name
      }
      subsidiary {
        name
        commerce {
          logoImage
        }
      }
      creationComments
      scheduledTime
      status
      active
      technician {
        id
      }
    }
  }
`;

const serviceSubscription = gql`
  subscription {
    createdService: serviceCreated {
      id
      issues {
        id
        name
      }
      subsidiary {
        name
        commerce {
          logoImage
        }
      }
      creationComments
      scheduledTime
      status
      active
      technician {
        id
      }
    }
  }
`;

const serviceDeletedSubscription = gql`
  subscription {
    deletedService: serviceDeleted {
      id
      issues {
        id
        name
      }
      subsidiary {
        name
        commerce {
          logoImage
        }
      }
      creationComments
      scheduledTime
      status
      active
      technician {
        id
      }
    }
  }
`;

interface FormValues {
  subsidiary: string;
  issues: string[];
  comments: string;
}

export const SupportSection: React.FC = () => {
  const [showCreateServiceModal, setModalState] = useState(false);
  const [selectedCommerce, setSelectedCommerce] = useState<Commerce>(null);
  const createService = useMutation(createServiceMutation);
  const { data: { commerces }, loading } = useQuery<{ commerces: Commerce[] }>(getCommercesQuery);
  const { data: { services }, loading: loadingServices, updateQuery } =
    useQuery<{ services: Service[] }>(servicesQuery);
  const commerceDropdownOptions: any[] = [];
  const sessionUser: SessionUser = JSON.parse(localStorage.getItem('sessionUser'));
  const { user: { roles } } = sessionUser;
  const isSupport = roles.some(({ name }) => name === 'SUPPORT');

  useSubscription<{ createdService: Service }>(serviceSubscription, {
    onSubscriptionData({ subscriptionData: { data: { createdService } } }) {
      updateQuery((prev) => {
        return { ...prev, services: [...prev.services, createdService] };
      });
    },
  });

  useSubscription<{ deletedService: Service }>(serviceDeletedSubscription, {
    onSubscriptionData({ subscriptionData: { data: { deletedService } } }) {
      updateQuery((prev) => {
        const { services } = prev;
        const serviceIndex = services.findIndex(({ id }) => deletedService.id === id);
        services.splice(serviceIndex, 1);

        return {
          ...prev,
          services,
        };
      });
    },
  });

  function selectCommerce(event: any, data: DropdownProps) {
    const selectedCommerce = commerces.find(({ id }) => id === data.value);
    setSelectedCommerce(selectedCommerce);
  }

  async function handleFormSubmit(value: FormValues) {
    const { subsidiary, issues, comments: creationComments } = value;
    await createService({
      variables: {
        serviceData: {
          subsidiary,
          issues,
          creationComments,
        },
      },
    });

    setModalState(false);
    setSelectedCommerce(commerces[0]);
  }

  if (!loading) {
    for (const commerce of commerces) {
      commerceDropdownOptions.push({
        key: commerce.id,
        text: commerce.name,
        value: commerce.id,
        image: { avatar: false, src: commerce.logoImage },
      });
    }
  }

  useEffect(() => {
    if (commerces) setSelectedCommerce(commerces[0]);
  }, [commerces]);

  const initialValues: FormValues = {
    comments: '',
    issues: [],
    subsidiary: '',
  };

  return (
    <div className="services-section">
      <div>
        {!loading && isSupport && (
          <Modal
            open={showCreateServiceModal}
            size="large"
            trigger={<Button onClick={() => setModalState(true)}>Crear servicio</Button>}
            centered={false}
          >
            <Modal.Header>Crear nuevo servicio</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleFormSubmit}
                  validationSchema={Yup.object().shape({
                    subsidiary: Yup.string().required('Seleccione un commercio'),
                    issues: Yup.array().of(Yup.string())
                      .required('Seleccione al menos un tipo de falla'),
                    comments: Yup.string().required('Este campo es requerido'),
                  })}
                >
                  {({ handleSubmit, setFieldValue, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className="create-service-box">
                        <Segment className="commerces field">
                          <label>
                            Cliente:
                            <span className="error-message">
                            {errors.subsidiary && touched.subsidiary ? errors.subsidiary : null}
                          </span>
                          </label>
                          <Dropdown
                            placeholder="Seleccione Comercio"
                            fluid
                            selection
                            value={selectedCommerce ? selectedCommerce.id : null}
                            options={commerceDropdownOptions}
                            onChange={selectCommerce}
                          />
                          {
                            selectedCommerce && (
                              <SubsidiarySelector
                                commerceId={selectedCommerce}
                                onSelect={value => setFieldValue('subsidiary', value)}
                              />
                            )
                          }
                        </Segment>
                        <div className="issue-types">
                          <div className="issue-list field">
                            <label>
                              Tipo de falla:
                              <span className="error-message">
                              {errors.issues && touched.issues ? errors.issues : null}
                            </span>
                            </label>
                            <IssuesSelector onChange={value => setFieldValue('issues', value)} />
                          </div>
                          <div className="comments field">
                            <label>
                              Comentarios:
                              <span className="error-message">
                              {errors.comments && touched.comments ? errors.comments : null}
                            </span>
                            </label>
                            <Form.TextArea
                              onChange={(e, { value }) => setFieldValue('comments', value)} />
                          </div>
                          <div className="button-section">
                            <Button fluid onClick={() => setModalState(false)}>Cancelar</Button>
                            <Button fluid primary>Crear</Button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        )}
      </div>
      <div className="services-list">
        {!loadingServices && services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
