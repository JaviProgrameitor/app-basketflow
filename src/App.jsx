
import React from "react";
import { HashRouter as Router, Routes, Route } from 'react-router'
import Login from './pages/Login.jsx'
import RegisterUser from './pages/RegisterUser.jsx'
import Folders from "./pages/Folders.jsx";
import Matches from "./pages/Matches.jsx";
import Teams from "./pages/Teams.jsx";
import GameSetup from "./pages/GameSetup.jsx";
import LiveGameTracker from "./pages/LiveGameTracker.jsx";
import Players from "./pages/Players.jsx";
import FinishMatch from "./pages/FinishMatch.jsx";
import MatchEventsTimeline from "./pages/MatchEventsTimeline.jsx";
import MatchStatsTable from "./pages/MatchStatsTable.jsx";
import LeagueRanking from "./pages/LeagueRanking.jsx";
import Playoffs from "./pages/Playoffs.jsx";
import LeagueScheduleGenerator from "./pages/LeagueScheduleGenerator.jsx";
import LeagueStats from "./pages/LeagueStats.jsx";
import BasketFlowLoader from "./pages/BasketFlowLoader.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Payment from "./pages/Payment.jsx";
import LoadingSync from "./pages/LoadingSync.jsx";
import ProfileUser from "./pages/ProfileUser.jsx";
import SyncChanges from "./pages/SyncChanges.jsx";
import PasswordStart from "./pages/PasswordStart.jsx";
import PasswordNew from "./pages/PasswordNew.jsx";
import PasswordVerifyCode from "./pages/PasswordVerifyCode.jsx";

const App = () => {
  return (
    <div className="h-screen w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<BasketFlowLoader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/pay-license" element={<Payment />} />
          <Route path="/loading" element={<LoadingSync />} />
          <Route path="/sync-changes" element={<SyncChanges />} />
          <Route path="/password/start" element={<PasswordStart />} />
          <Route path="/password/new" element={<PasswordNew />} />
          <Route path="/password/verify" element={<PasswordVerifyCode />} />

          <Route
            path="/profile-user"
            element={
              <ProtectedRoute>
                <ProfileUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/folders"
            element={
              <ProtectedRoute>
                <Folders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches/:folder_id"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/league-ranking/:folder_id"
            element={
              <ProtectedRoute>
                <LeagueRanking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playoffs/:folder_id"
            element={
              <ProtectedRoute>
                <Playoffs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/league-stats/:folder_id"
            element={
              <ProtectedRoute>
                <LeagueStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/:folder_id"
            element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/players/:folder_id/:team_id"
            element={
              <ProtectedRoute>
                <Players />
              </ProtectedRoute>
            }
          />
          <Route
            path="/start-match/:match_id/:folder_id"
            element={
              <ProtectedRoute>
                <GameSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game-tracker/:match_id"
            element={
              <ProtectedRoute>
                <LiveGameTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finish-game/:match_id"
            element={
              <ProtectedRoute>
                <FinishMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match-stats-table/:match_id/:folder_id"
            element={
              <ProtectedRoute>
                <MatchStatsTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match-events-timeline/:match_id/:folder_id"
            element={
              <ProtectedRoute>
                <MatchEventsTimeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/league-schedule-generator/:folder_id"
            element={
              <ProtectedRoute>
                <LeagueScheduleGenerator />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;