import { useLocation } from 'react-router-dom';

function StageIndicator() {
  const location = useLocation();

  const stages = [
    { label: 'Combat Selection', path: '/' },
    { label: 'Map Selection', path: '/map_selection' },
    { label: 'Simulation', path: '/simulation' },
  ];

  return (
    <div className="stage-indicator">
      {stages.map((stage, index) => (
        <React.Fragment key={index}>
          <span
            className={
              location.pathname === stage.path ? 'current-stage' : ''
            }
          >
            {stage.label}
          </span>
          {index < stages.length - 1 && ' -> '}
        </React.Fragment>
      ))}
    </div>
  );
}

export default StageIndicator;
