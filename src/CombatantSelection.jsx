import React from 'react';
import { Link } from 'react-router-dom';


class CombatantSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blueTeamIds: [],
      redTeamIds: [],
      blueTeamNames: [],
      redTeamNames: [],
      availableCombatants: [],
    };
  }

  componentDidMount() {
    fetch('https://encounterra.com/api/combatant-definition')
      .then(response => response.json())
      .then(data => {
        this.setState({ availableCombatants: data });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

addToTeam = (team) => {
  let selectedOptions = Array.from(document.querySelector('[name="availableCombatants"]').selectedOptions);
  let selectedCombatants = selectedOptions.map(option => ({
    id: option.value,
    name: option.text
  }));

  if (team === 'blue') {
    this.props.onTeamChange([...this.props.blueTeam, ...selectedCombatants], this.props.redTeam);
  } else if (team === 'red') {
    this.props.onTeamChange(this.props.blueTeam, [...this.props.redTeam, ...selectedCombatants]);
  }
}

  render() {
    const blueTeam = this.props.blueTeam;
    const redTeam = this.props.redTeam;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Combatants:</label>
          <select name="availableCombatants" multiple>
          {this.state.availableCombatants.map(combatant => (
            <option key={combatant.id} value={combatant.id}>
              {combatant.name}
            </option>
          ))}
        </select>
          <div className="teams-container">
            <div className="team-column">
              <div>
                <button
                  type="button"
                  onClick={() => this.addToTeam('blue')}
                >
                  Add to Blue Team
                </button>
              </div>
              <div className="team-selection">
                <h2>Selected Blue Team</h2>
                {blueTeam.map((combatant, index) => (
                  <div key={index}>{combatant.name}</div>
                ))}
              </div>
            </div>

            <div className="team-column">
              <div>
                <button
                  type="button"
                  onClick={() => this.addToTeam('red')}
                >
                  Add to Red Team
                </button>
              </div>
              <div className="team-selection">
                <h2>Selected Red Team</h2>
                {redTeam.map((combatant, index) => (
                  <div key={index}>{combatant.name}</div>
                ))}
              </div>
            </div>
          </div>
        </form>
        <Link to="/map_selection">Next</Link>
      </div>
    );
  }
}

export default CombatantSelection;