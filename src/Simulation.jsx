import React from 'react';
import { Link } from 'react-router-dom';

class Simulation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iterations: 10,
      lastJobId: null,
      lastSimulationStatus: null,
      lastBlueVictories: null,
      lastRedVictories: null,
      lastBlueAtLeastOneDied: null,
      lastRedAtLeastOneDied: null,
      lastBlueAtLeastTwoDied: null,
      lastRedAtLeastTwoDied: null,
      lastBlueAtLeastThreeDied: null,
      lastRedAtLeastThreeDied: null,
      logLink: null,
      errorMessage: null,
    };
  }
  
  handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'iterations') {
      this.setState({ iterations: value });
    }
  }


  pollForResult = () => {
    const { lastJobId } = this.state;
    if (!lastJobId) return;

    fetch(`https://encounterra.com/api/get-simulation-result/${lastJobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      credentials: 'include',
    })
    .then(response => {
      if (response.status === 200) { // Simulation finished successfully
        return response.json().then(data => {
          console.log("Data:", data)
          this.setState({ lastJobId: data.null, lastSimulationStatus: 'success', lastBlueVictories: data.BLUE.VICTORIES,
          lastRedVictories: data.RED.VICTORIES, lastBlueAtLeastOneDied: data.BLUE.AT_LEAST_ONE_DIED,
          lastRedAtLeastOneDied: data.RED.AT_LEAST_ONE_DIED, lastBlueAtLeastTwoDied: data.BLUE.AT_LEAST_TWO_DIED,
          lastRedAtLeastTwoDied: data.RED.AT_LEAST_TWO_DIED, lastBlueAtLeastThreeDied: data.BLUE.AT_LEAST_THREE_DIED,
          lastRedAtLeastThreeDied: data.RED.AT_LEAST_THREE_DIED, logLink: data.log_link });
        });
      } else if (response.status === 202) { // Simulation still in progress
        setTimeout(this.pollForResult, 4000); // Poll every 4 seconds.
      } else if (response.status === 500 || response.status === 400) { // Simulation failed
        return response.json().then(data => {
          this.setState({ lastSimulationStatus: 'failed' });
        });
      } else {
        return Promise.reject(new Error(`Unexpected status code: ${response.status}`));
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({ lastSimulationStatus: 'failed' });
    });
  }



  handleSubmit = (e) => {
    e.preventDefault();

    const { iterations } = this.state;

    const data = {
      iterations: parseInt(iterations),
      blue: this.props.blueTeam,
      red: this.props.redTeam,
    };

    fetch('https://encounterra.com/api/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (response.status === 403 || response.status === 401 ) {
        return response.json().then(errorData => {
          console.log('Error Data:', errorData);
          throw new Error(errorData.message);
        });
      }
      return response.json();
    })
    .then(data => {
      this.setState({ lastJobId: data.job_id, lastSimulationStatus: 'in-progress', errorMessage: null }, () => {
        this.pollForResult();
      });
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({
        lastSimulationStatus: 'failed',
        logLink: null,
        errorMessage: error.message
      });
    });
  }

  render() {
    const { iterations, lastSimulationStatus, lastBlueVictories, lastRedVictories, lastBlueAtLeastOneDied,
    lastRedAtLeastOneDied, lastBlueAtLeastTwoDied, lastRedAtLeastTwoDied, lastBlueAtLeastThreeDied, lastRedAtLeastThreeDied} = this.state;
    let simulationDisplay;
    if (lastSimulationStatus == null) {
      simulationDisplay = (
        <div>
          <p>No Simulation Yet</p>
        </div>
      );
    } else if (lastSimulationStatus === 'in-progress') {
      simulationDisplay = (
        <div>
          <div className="spinner"></div>
          <p>This may take up to a couple of minutes</p>
        </div>
      );
    } else if (lastSimulationStatus === 'success') {
      simulationDisplay = (
        <div>
          <h3>Simulation Results</h3>
          <table>
            <thead>
              <tr>
                <th></th> {/* Empty header for the labels column */}
                <th>Blue Team</th>
                <th>Red Team</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Victories:</td>
                <td>{lastBlueVictories}</td>
                <td>{lastRedVictories}</td>
              </tr>
              <tr>
                <td>1+ died:</td>
                <td>{lastBlueAtLeastOneDied}</td>
                <td>{lastRedAtLeastOneDied}</td>
              </tr>
              <tr>
                <td>2+ died:</td>
                <td>{lastBlueAtLeastTwoDied}</td>
                <td>{lastRedAtLeastTwoDied}</td>
              </tr>
              <tr>
                <td>3+ died:</td>
                <td>{lastBlueAtLeastThreeDied}</td>
                <td>{lastRedAtLeastThreeDied}</td>
              </tr>
            </tbody>
          </table>
          {this.state.logLink && <a href={this.state.logLink} download><button>Download Logs</button></a>}
        </div>
      );
    } else if (lastSimulationStatus === 'failed') {
      simulationDisplay = <p>{this.state.errorMessage || 'Simulation failed. Please try again.'}</p>;
    }

    return (
      <div>
        <div className="teams-container">
            <div className="team-column">
              <div className="team-selection">
                <h2>Selected Blue Team</h2>
                {this.props.blueTeam.map((combatant, index) => (
                  <div key={index}>{combatant}</div>
                ))}
              </div>
            </div>
            <div className="team-column">
              <div className="team-selection">
                <h2>Selected Red Team</h2>
                {this.props.redTeam.map((combatant, index) => (
                  <div key={index}>{combatant}</div>
                ))}
              </div>
            </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Iterations:</label>
            <input
              type="number"
              name="iterations"
              value={iterations}
              onChange={this.handleInputChange}
            />
          </div>
          <Link to="/map_selection">Back</Link>
          <button type="submit">Simulate</button>
        </form>
        {simulationDisplay}
      </div>
    );
  }
}

export default Simulation;
