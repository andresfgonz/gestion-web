import React, { ChangeEvent, useState, useEffect } from 'react';
import { useIssues } from './use-issues';
import './issues-selector.scss';
import { FieldProps } from 'formik';

interface ComponentProps {
  onChange: (selectedIssues: string[]) => void;
}

export const IssuesSelector: React.FC<ComponentProps> = ({ onChange }) => {
  const { issues, loading } = useIssues();
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  function handleIssueClick(event: ChangeEvent<HTMLInputElement>, issueId: string) {
    if (event.target.checked) {
      setSelectedIssues([...selectedIssues, issueId]);
    } else {
      setSelectedIssues([...selectedIssues.filter(issue => issue !== issueId)]);
    }
  }

  useEffect(() => {
    onChange(selectedIssues);
  }, [selectedIssues]);

  return (
    <div className="selector-container">
      {!loading && issues.map(issue => (
        <div key={issue.id} className="issue-card">
          <input type="checkbox" onChange={event => handleIssueClick(event, issue.id)} />
          <div className="issue-description">
            {issue.name}
          </div>
        </div>
      ))}
    </div>
  );
};
