import React from 'react';
import { Link } from 'react-router-dom';

class MapSelection extends React.Component {
    state = {
      mapType: 'standard' // default value
    };
  
    handleMapChange = (event) => {
      this.setState({ mapType: event.target.value });
    }
  
    render() {
      return (
        <div>
          <label>
            Choose a map:
            <select value={this.state.mapType} onChange={this.handleMapChange}>
              <option value="blank">Blank</option>
              <option value="standard">Standard</option>
              <option value="hallway">Hallway</option>
            </select>
          </label>
          <div className="link-container">
            <Link to="/" className="back-link">Back</Link>
            <Link to="/simulation" className="next-link">Next</Link>
          </div>
        </div>
      );
    }
  }

  export default MapSelection;
  