import React from 'react';
import { Link } from 'react-router-dom';


class CombatantSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blueTeam: [],
      redTeam: [],
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
    let selectedCombatants;
    if (team === 'blue') {
      selectedCombatants = Array.from(document.querySelector('[name="availableCombatants"]').selectedOptions, option => option.value);
      this.setState(prevState => ({ blueTeam: [...prevState.blueTeam, ...selectedCombatants] }), () => {
        this.props.onTeamChange(this.state.blueTeam, this.state.redTeam);
      });
    } else if (team === 'red') {
      selectedCombatants = Array.from(document.querySelector('[name="availableCombatants"]').selectedOptions, option => option.value);
      this.setState(prevState => ({ redTeam: [...prevState.redTeam, ...selectedCombatants] }), () => {
        this.props.onTeamChange(this.state.blueTeam, this.state.redTeam);
      });
    }
}



  render() {
    const blueTeam = this.props.blueTeam;
    const redTeam = this.props.redTeam;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Combatants:</label>
          <select
            name="availableCombatants"
            multiple
          >
            {this.state.availableCombatants.map((combatant, index) => (
              <option key={index} value={combatant.name}>
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
                  <div key={index}>{combatant}</div>
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
                  <div key={index}>{combatant}</div>
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