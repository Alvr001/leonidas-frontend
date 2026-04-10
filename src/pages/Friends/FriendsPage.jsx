import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Icon } from '../../components/Button/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { usePendingRequests } from '../../context/FriendRequestsContext';

import {
  searchUserByAnimalId,
  sendFriendRequest,
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend,
} from '../../services/api';
import {
  Container, Header, HeaderTitle,
  SectionHeader, SectionTitle, SectionChevron, SectionBody,
  SearchInputWrap, SearchInput,
  Item, FriendAvatar, AnonymousIcon, ItemName,
  BtnAdd, TagSent, BtnDelete, BtnAccept, BtnReject, BtnGroup,
  EmptyText,
  ModalOverlay, ModalBox, ModalTitle, ModalSub, ModalBtns,
  BtnConfirmDelete, BtnCancelModal,
} from './FriendsPage.styled';

// Colores cálidos suavizados — menos intensos, más armónicos con Alpheratz
const COLOR_SEARCH  = '#F6BD60'; //
const COLOR_FRIENDS = '#F6BD60'; // único color protagonista
const COLOR_REQ     = '#F6BD60'; // único color protagonista

const AVATAR_COLORS = ['#F4A435', '#D4993A', '#E07B5A', '#B07040', '#E8841A', '#C07D20'];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

function FriendsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem('userId'));
  const { pendingCount, refresh: refreshBadge, markAsSeen, markAcceptedSeen } = usePendingRequests();

useEffect(() => {
  markAsSeen();
  markAcceptedSeen(); // al entrar a Friends, desaparece el punto verde también
}, []);

  const [openSearch,  setOpenSearch]  = useState(false);
  const [openFriends, setOpenFriends] = useState(false);
  const [openReq,     setOpenReq]     = useState(false);

  const [query,        setQuery]        = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching,    setSearching]    = useState(false);
  const searchTimeout = useRef(null);

  const [friends,        setFriends]        = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const [requests,    setRequests]    = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!userId) return;
    loadFriends();
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadFriends = async () => {
    setLoadingFriends(true);
    try {
      const res = await getFriends(userId);
      setFriends(res.data);
    } catch (e) {
      console.error('FriendsPage — error cargando amigos:', e);
    } finally {
      setLoadingFriends(false);
    }
  };

  const loadRequests = async () => {
    setLoadingReqs(true);
    try {
      const res = await getFriendRequests(userId);
      setRequests(res.data);
    } catch (e) {
      console.error('FriendsPage — error cargando solicitudes:', e);
    } finally {
      setLoadingReqs(false);
    }
  };

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    if (!query.trim()) { setSearchResult(null); return; }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchUserByAnimalId(query.trim(), userId);
        setSearchResult(res.data);
      } catch {
        setSearchResult({ found: false });
      } finally {
        setSearching(false);
      }
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  

  const handleAddFriend = async (receiverId) => {
    try {
      await sendFriendRequest(userId, receiverId);
      setSearchResult(prev => ({ ...prev, status: 'pending_sent' }));
    } catch (e) {
      console.error('FriendsPage — error enviando solicitud:', e);
    }
  };

  const handleAccept = async (requestId) => {
  try {
    await acceptFriendRequest(requestId);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    loadFriends();
    refreshBadge(); // 🔥 IMPORTANTE
  } catch (e) {
    console.error('FriendsPage — error aceptando:', e);
  }
};

  const handleReject = async (requestId) => {
  try {
    await rejectFriendRequest(requestId);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    refreshBadge(); // 🔥 IMPORTANTE
  } catch (e) {
    console.error('FriendsPage — error rechazando:', e);
  }
};

  const handleDeleteFriend = async () => {
    if (!confirmDelete) return;
    try {
      await deleteFriend(userId, confirmDelete.friendId);
      setFriends(prev => prev.filter(f => f.id !== confirmDelete.friendId));
    } catch (e) {
      console.error('FriendsPage — error eliminando amigo:', e);
    } finally {
      setConfirmDelete(null);
    }
  };

  const renderSearchResult = () => {
    if (!query.trim()) return null;
    if (searching) return <EmptyText>{t('loading')}</EmptyText>;
    if (!searchResult || !searchResult.found) return <EmptyText>{t('noResults')}</EmptyText>;
    const { user, status } = searchResult;
    return (
      <Item>
        <AnonymousIcon>👤</AnonymousIcon>
        <ItemName>{user.animalId}</ItemName>
        {status === 'none'         && <BtnAdd onClick={() => handleAddFriend(user.id)}>{t('addFriend')}</BtnAdd>}
        {status === 'pending_sent' && <TagSent>{t('requestSent')}</TagSent>}
        {status === 'friends'      && <TagSent>✓ {t('friends')}</TagSent>}
      </Item>
    );
  };

  return (
    <Container>
      <Header>
  <Icon onClick={() => navigate('/settings')}>
    <FiArrowLeft size={22} color="white" />
  </Icon>

  <HeaderTitle>{t('friends')}</HeaderTitle>

  {pendingCount > 0 && (
    <div style={{
      background: '#E63946',
      color: 'white',
      borderRadius: 12,
      padding: '2px 8px',
      fontSize: 12,
      fontWeight: 700,
    }}>
      {pendingCount}
    </div>
  )}
</Header>

      {/* SEARCH */}
      <SectionHeader $bg={COLOR_SEARCH} onClick={() => setOpenSearch(p => !p)}>
        <SectionTitle>{t('searchFriends')}</SectionTitle>
        <SectionChevron $open={openSearch}>›</SectionChevron>
      </SectionHeader>
      {openSearch && (
        <SectionBody>
          <SearchInputWrap>
            <SearchInput
              type="text"
              placeholder={t('searchById')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoCorrect="off"
              autoCapitalize="none"
            />
          </SearchInputWrap>
          {renderSearchResult()}
        </SectionBody>
      )}

      {/* FRIENDS */}
      <SectionHeader $bg={COLOR_FRIENDS} onClick={() => setOpenFriends(p => !p)}>
        <SectionTitle>{t('friends')}{friends.length > 0 && ` (${friends.length})`}</SectionTitle>
        <SectionChevron $open={openFriends}>›</SectionChevron>
      </SectionHeader>
      {openFriends && (
        <SectionBody>
          {loadingFriends && <EmptyText>{t('loading')}</EmptyText>}
          {!loadingFriends && friends.length === 0 && <EmptyText>{t('noFriendsYet')}</EmptyText>}
          {friends.map(friend => (
  <Item key={friend.id}>
    {friend.profilePhoto
      ? <img
          src={friend.profilePhoto}
          alt={friend.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      : <FriendAvatar $color={avatarColor(friend.name || friend.animalId)}>
          {(friend.name || friend.animalId).charAt(0).toUpperCase()}
        </FriendAvatar>
    }

    <div style={{ flex: 1 }}>
      <ItemName>{friend.name || friend.animalId}</ItemName>
      <div style={{ fontSize: 12, color: '#aaa' }}>
        {friend.animalId}
      </div>
    </div>

    <BtnDelete onClick={() =>
      setConfirmDelete({
        friendId: friend.id,
        friendName: friend.name || friend.animalId
      })
    }>
      {t('deleteFriend')}
    </BtnDelete>
  </Item>
))}
        </SectionBody>
      )}

      {/* REQUESTED FRIENDS */}
      <SectionHeader $bg={COLOR_REQ} onClick={() => setOpenReq(p => !p)}>
  <SectionTitle>
    {t('requestedFriends')}
    {requests.length > 0 && ` (${requests.length})`}
  </SectionTitle>

  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    {pendingCount > 0 && (
      <div style={{
        width: 10,
        height: 10,
        background: '#E63946',
        borderRadius: '50%',
      }} />
    )}
    <SectionChevron $open={openReq}>›</SectionChevron>
  </div>
</SectionHeader>
      {openReq && (
        <SectionBody>
          {loadingReqs && <EmptyText>{t('loading')}</EmptyText>}
          {!loadingReqs && requests.length === 0 && <EmptyText>{t('noRequestsYet')}</EmptyText>}
          {requests.map(req => (
            <Item key={req.id}>
              <AnonymousIcon>👤</AnonymousIcon>
              <ItemName>{req.sender?.animalId || req.senderAnimalId}</ItemName>
              <BtnGroup>
                <BtnReject title={t('rejectRequest')} onClick={() => handleReject(req.id)}>✕</BtnReject>
                <BtnAccept title={t('acceptRequest')} onClick={() => handleAccept(req.id)}>✓</BtnAccept>
              </BtnGroup>
            </Item>
          ))}
        </SectionBody>
      )}

      {/* MODAL ELIMINAR */}
      {confirmDelete && (
        <ModalOverlay onClick={() => setConfirmDelete(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>{t('confirmDeleteFriend')}</ModalTitle>
            <ModalSub>{confirmDelete.friendName}{'\n'}{t('confirmDeleteFriendSub')}</ModalSub>
            <ModalBtns>
              <BtnConfirmDelete onClick={handleDeleteFriend}>{t('deleteFriend')}</BtnConfirmDelete>
              <BtnCancelModal onClick={() => setConfirmDelete(null)}>{t('cancel')}</BtnCancelModal>
            </ModalBtns>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default FriendsPage;