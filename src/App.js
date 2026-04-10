import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Client } from '@stomp/stompjs';
import { API_URL, WS_URL } from './config'; // ✅ BIEN
import SplashPage from './pages/Splash/SplashPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import GroupsPage from './pages/Groups/GroupsPage';
import ChatPage from './pages/Chat/ChatPage';
import GroupInfoPage from './pages/GroupInfo/GroupInfoPage';
import GroupPermissionsPage from './pages/GroupPermissions/GroupPermissionsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import LanguagePage from './pages/Settings/LanguagePage';
import ThemePage from './pages/Settings/ThemePage';
import { LanguageProvider } from './i18n/LanguageContext';
import { lightTheme } from './styles/themes/lightTheme';
import GlobalStyle from './styles/GlobalStyle';
import ProfilePage from './pages/Profile/ProfilePage';
import FriendsPage from './pages/Friends/FriendsPage';
import { useFCM } from './hooks/useFCM';
import GroupMediaPage from './pages/GroupInfo/components/GroupMedia/GroupMediaPage';
import AlarmReceivedModal from './components/AlarmReceivedModal/AlarmReceivedModal';
import { FriendRequestsProvider } from './context/FriendRequestsContext';
import { getGroupsByUser } from './services/api';

function App() {
  const [userId, setUserId] = useState(() => {
  const stored = localStorage.getItem('userId');
  return stored ? parseInt(stored) : null;
  });
  useFCM(userId);

  const [activeAlarm, setActiveAlarm] = useState(null);
  const stompClientRef = useRef(null);
  const groupsRef = useRef([]);

  const handleCloseAlarm = useCallback(() => setActiveAlarm(null), []);

  useEffect(() => {
    if (!userId) return;
    const loadAndConnect = async () => {
      try {
        const res = await getGroupsByUser(userId);
        groupsRef.current = res.data;
        connectAlarmWebSocket(res.data);
      } catch (e) {
        console.error('App.js — error cargando grupos para WS alarmas:', e);
      }
    };
    loadAndConnect();
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const handleGroupsChanged = async () => {
      try {
        const res = await getGroupsByUser(userId);
        groupsRef.current = res.data;
        connectAlarmWebSocket(res.data);
      } catch (e) {}
    };
    window.addEventListener('groups-changed', handleGroupsChanged);
    return () => window.removeEventListener('groups-changed', handleGroupsChanged);
  }, [userId]);
  useEffect(() => {
  const handleSession = () => {
    const stored = localStorage.getItem('userId');
    setUserId(stored ? parseInt(stored) : null);
  };

  window.addEventListener('session-changed', handleSession);
  window.addEventListener('storage', handleSession);

  return () => {
    window.removeEventListener('session-changed', handleSession);
    window.removeEventListener('storage', handleSession);
  };
  }, []);

  const connectAlarmWebSocket = (groupList) => {
    if (stompClientRef.current) stompClientRef.current.deactivate();
    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        groupList.forEach(group => {
          client.subscribe(`/topic/alert/${group.id}`, (msg) => {
            try {
              const newAlert = JSON.parse(msg.body);
              if (newAlert.level === 'RED' && newAlert.reporter?.id !== userId) {
                setActiveAlarm({ alert: newAlert, groupName: group.name });
              }
            } catch (e) {
              console.error('App.js — error parseando alerta:', e);
            }
          });
        });
      },
      onStompError: (frame) => console.error('App.js — STOMP error:', frame),
    });
    client.activate();
    stompClientRef.current = client;
  };

  return (
    <LanguageProvider>
    <FriendRequestsProvider userId={userId}>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={userId ? <Navigate to="/groups" /> : <SplashPage />} />
            <Route path="/login" element={userId ? <Navigate to="/groups" /> : <LoginPage />} />
            <Route path="/register" element={userId ? <Navigate to="/groups" /> : <RegisterPage />} />

            {/* Rutas protegidas */}
            <Route path="/groups" element={userId ? <GroupsPage /> : <Navigate to="/" />} />
            <Route path="/chat/:groupId" element={userId ? <ChatPage /> : <Navigate to="/" />} />
            <Route path="/group-info/:groupId" element={userId ? <GroupInfoPage /> : <Navigate to="/" />} />
            <Route path="/group-permissions/:groupId" element={userId ? <GroupPermissionsPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={userId ? <SettingsPage /> : <Navigate to="/" />} />
            <Route path="/settings/profile" element={userId ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/settings/language" element={userId ? <LanguagePage /> : <Navigate to="/" />} />
            <Route path="/settings/theme" element={userId ? <ThemePage /> : <Navigate to="/" />} />
            <Route path="/groups/:groupId/media" element={userId ? <GroupMediaPage /> : <Navigate to="/" />} />
            <Route path="/friends" element={userId ? <FriendsPage /> : <Navigate to="/" />} />
          </Routes>

          {activeAlarm && (
            <AlarmReceivedModal
              alert={activeAlarm.alert}
              groupName={activeAlarm.groupName}
              onClose={handleCloseAlarm}
            />
          )}
        </Router>
  </ThemeProvider>
  </FriendRequestsProvider>
  </LanguageProvider>
  );
}

export default App;