import React, { useState } from 'react';
import {
  Image,
  Card,
  Button,
  Header,
  Icon,
  Modal,
  Dropdown,
  DropdownProps,
  Form,
} from 'semantic-ui-react';
import './service-card.scss';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import { Formik, FormikFormProps } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

const deleteServiceMutation = gql`
  mutation deleteService($serviceId: String!){
    deleteService(serviceId: $serviceId){
      success
      message
    }
  }
`;

const techniciansQuery = gql`
  query technicians {
    technicians {
      id
      fullname
      profileImage
    }
  }
`;

const asignService = gql`
  mutation addServiceTechnician(
    $serviceId: String!,
    $technicianId: String!,
    $scheduledTime: String!
  ) {
    addServiceTechnician(
    serviceId: $serviceId,
    technicianId: $technicianId,
    scheduledTime: $scheduledTime
  ) {
      id
    }
  }
`;

interface ComponentProps {
  service: Service;
}

export const ServiceCard: React.FC<ComponentProps> = ({ service }) => {
  const { subsidiary, issues } = service;
  const { data: { technicians }, loading } =
    useQuery<{ technicians: User[] }>(techniciansQuery);
  const deleteService = useMutation(deleteServiceMutation);
  const asignTechnician = useMutation(asignService);
  const [modalState, setModalState] = useState<boolean>(false);
  const sessionUser: SessionUser = JSON.parse(localStorage.getItem('sessionUser'));
  const isCoordinator = sessionUser.user.roles.some(({ name }) => name === 'COORDINATOR');
  const techniciansDropdownOptions: any[] = [];

  if (!loading) {
    for (const tech of technicians) {
      techniciansDropdownOptions.push({
        key: tech.id,
        text: tech.fullname,
        value: tech.id,
        image: { avatar: true, src: tech.profileImage },
      });
    }
  }

  function openModal() {
    setModalState(true);
  }

  function closeModal() {
    setModalState(false);
  }

  function handleFormSubmit(data: any) {
    asignTechnician({
      variables: {
        serviceId: service.id,
        technicianId: data.technicianId,
        scheduledTime: data.scheduledTime,
      },
      refetchQueries: ['getAllServices'],
    });
  }

  async function handleFinalizeConfirmation() {
    closeModal();
    await deleteService({
      variables: {
        serviceId: service.id,
      },
    });
  }

  return !loading && (
    <div className="service-card">
      <div className="card-container" key={subsidiary.id}>
        <Card className="sub-card">
          <Card.Content>
            <Image floated="right" src={subsidiary.commerce.logoImage} size="mini" />
            <Card.Header>{subsidiary.name}</Card.Header>
            <Card.Description>{subsidiary.address}</Card.Description>
          </Card.Content>
        </Card>
        {issues.map(issue => (
          <div key={issue.id} className="issue-card">
            <div className="issue-description">
              {issue.name}
            </div>
          </div>
        ))}
      </div>
      <div className="status">
        Estado: {service.status}
      </div>
      {isCoordinator && (
        <Formik
          initialValues={{
            technicianId: service.technician ? service.technician.id : null,
            scheduledTime: service.scheduledTime ?
              moment(service.scheduledTime).format('DD-MM-YYYY HH:mm') : null,
          }}
          onSubmit={handleFormSubmit}
          validationSchema={Yup.object().shape({
            technicianId: Yup.string().required(),
            scheduledTime: Yup.string().required(),
          })}
        >
          {({ handleSubmit, setFieldValue, values, isValid }) => (
            <Form onSubmit={handleSubmit}>
              <Dropdown
                placeholder="Asignar técnico"
                fluid
                selection
                options={techniciansDropdownOptions}
                onChange={(e, { value }) => setFieldValue('technicianId', value)}
                value={values.technicianId}
              />
              <DateTimeInput
                name="dateTime"
                placeholder="Fecha de visita"
                iconPosition="left"
                value={values.scheduledTime}
                onChange={(e, { value }) => setFieldValue('scheduledTime', value)}
              />
              <Button fluid primary>Guardar</Button>
            </Form>
          )}
        </Formik>
      )}
      <div className="button-section">
        <Modal
          trigger={<Button onClick={openModal} fluid>Cancelar servicio</Button>}
          open={modalState}
          size="tiny"
        >
          <Modal.Content>
            <Modal.Description>
              <Header>Cancelar Servicio</Header>
              <p>Desea cancelar el servicio?</p>
            </Modal.Description>

          </Modal.Content>
          <Modal.Actions>
            <Button onClick={closeModal}>
              <Icon name="times" /> No
            </Button>
            <Button color="green" onClick={handleFinalizeConfirmation}>
              <Icon name="checkmark" /> Si
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    </div>
  );
};
