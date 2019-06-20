import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { useCommerceSubsidiaries } from './use-commerce-subsidiaries';
import './subsidiary-selector.scss';

interface ComponentProps {
  commerceId: Commerce;
  onSelect: (subsidiary: string) => void;
}

export const SubsidiarySelector: React.FC<ComponentProps> =
  ({ commerceId, onSelect }) => {
    const { subsidiaries, loading } = useCommerceSubsidiaries(commerceId.id);

    return (
      <div className="subsidiary-selector">
        {!loading && subsidiaries.map(subsidiary => (
          <div className="card-container" key={subsidiary.id}>
            <div className="input-container">
              <input
                type="radio"
                id="subsidiary"
                name="subsidiary"
                onChange={() => onSelect(subsidiary.id)}
              />
            </div>
            <Card>
              <Card.Content>
                <Image floated="right" src={commerceId.logoImage} size="mini" />
                <Card.Header>{subsidiary.name}</Card.Header>
                <Card.Description>{subsidiary.address}</Card.Description>
              </Card.Content>
            </Card>
          </div>
        ))}
      </div>
    );
  };
