import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CombatantSelection from './CombatantSelection';
import MapSelection from './MapSelection';
import Simulation from './Simulation';
import StageIndicator from './StageIndicator';
import TopPanel from './TopPanel';
import { Helmet } from 'react-helmet';

const MainPage = () => {
  const [blueTeam, setBlueTeam] = useState([]);
  const [redTeam, setRedTeam] = useState([]);

  const handleTeamChange = (blueTeam, redTeam) => {
    setBlueTeam(blueTeam);
    setRedTeam(redTeam);
  };

  return (
    <>
      <Helmet>
        <title>Simulate - Encounterra</title>
      </Helmet>
      <TopPanel />
      <img src="/logo.png" alt="Encounterra Logo" />
      <StageIndicator />
      <Routes>
        <Route index element={<CombatantSelection onTeamChange={handleTeamChange} blueTeam={blueTeam} redTeam={redTeam} />} />
        <Route path="map_selection" element={<MapSelection />} />
        <Route path="simulation" element={<Simulation blueTeam={blueTeam} redTeam={redTeam} />} />
      </Routes>
    </>
  );
}

export default MainPage;
