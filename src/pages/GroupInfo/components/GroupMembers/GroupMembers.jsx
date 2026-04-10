import React, { useState } from 'react';
import { FiUserPlus, FiChevronDown, FiSearch, FiX, FiCheck, FiChevronRight } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import Avatar from '../../../../components/Avatar/Avatar';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { getUsers, joinGroup, removeMember, makeAdmin,getFriends } from '../../../../services/api';

import {
  MembersContainer, MembersHeader, MembersTitle,
  AddMemberButton, AddMemberIcon, AddMemberText,
  MemberItem, MemberInfo, MemberName, AdminBadge,
  ShowMoreButton, SearchWrapper, SearchInput
} from './GroupMembers.styled';
import {
  Overlay, ModalSheet, ModalTitle, CancelButton
} from '../GroupActions/ConfirmModal.styled';
import styled from 'styled-components';

const UserList = styled.div`
  max-height: 320px;
  overflow-y: auto;
  margin: 8px 0;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 4px;
  border-radius: 10px;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.45 : 1};
  transition: background 0.15s;
  &:hover {
    background: ${({ $disabled }) => $disabled ? 'none' : '#FFF8E7'};
  }
`;

const UserRowName = styled.p`
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #1A1A1A;
`;

const CheckIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #F4A435;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #F4A435, #E8841A);
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.15s;
  &:disabled { opacity: 0.4; cursor: default; }
`;

const AddSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
  border-radius: 10px;
  margin-bottom: 8px;
`;

// Flecha del miembro
const MemberArrow = styled.div`
  color: #BBBBBB;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0deg)'};
  cursor: pointer;
`;

// Panel de opciones que se despliega
const MemberOptions = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px ${({ theme }) => theme?.spacing?.xl || '20px'} 12px 76px;
  background: ${({ theme }) => theme.colors.primaryLight || '#FFF8E7'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight || '#F0E0C0'};
`;

const OptionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  background: ${({ $danger }) => $danger ? '#E63946' : '#F4A435'};
  color: white;
  &:hover { opacity: 0.85; }
`;

const PREVIEW_COUNT = 4;

function GroupMembers({ members, adminId, currentUserId, isFormer, groupId, onMemberAdded, canAddMembers }){
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMemberId, setOpenMemberId] = useState(null); // cuál tiene opciones abiertas
  const { t } = useLanguage();

  const isAdmin = adminId === currentUserId;

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  const visibleMembers = showAll
    ? filteredMembers
    : filteredMembers.slice(0, PREVIEW_COUNT);
  const remaining = filteredMembers.length - PREVIEW_COUNT;


// Reemplazar openAddModal:
const openAddModal = async () => {
  setUserSearch('');
  setSelected([]);
  try {
    const res = await getFriends(currentUserId);
    setAllUsers(res.data);
  } catch (err) { console.error(err); }
  setShowAddModal(true);
};

  const memberIds = new Set(members.map(m => m.id));
  const availableUsers = allUsers.filter(u =>
    !memberIds.has(u.id) &&
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const toggleSelect = (uid) => {
    setSelected(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleAdd = async () => {
  if (selected.length === 0) return;
  setLoading(true);
  try {
    await Promise.all(selected.map(uid => joinGroup(groupId, uid)));

    // 🔥 NUEVO: notificar a toda la app
    window.dispatchEvent(new Event('groups-changed'));

    setShowAddModal(false);
    onMemberAdded?.();
  } catch (err) { console.error(err); }
  finally { setLoading(false); }
  };

  const handleRemove = async (memberId) => {
    try {
      await removeMember(groupId, memberId);
      setOpenMemberId(null);
      onMemberAdded?.(); // recarga la lista
    } catch (err) { console.error(err); }
  };

  const handleMakeAdmin = async (memberId) => {
    try {
      await makeAdmin(groupId, memberId);
      setOpenMemberId(null);
      onMemberAdded?.();
    } catch (err) { console.error(err); }
  };

  const toggleMemberOptions = (memberId) => {
    setOpenMemberId(prev => prev === memberId ? null : memberId);
  };

  return (
    <>
      <MembersContainer>
        <MembersHeader>
          <MembersTitle>{members.length} {t('members')}</MembersTitle>
        </MembersHeader>

        <SearchWrapper>
          <FiSearch size={16} color="#888" />
          <SearchInput
            placeholder={t('searchMember')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchWrapper>

        {!isFormer && canAddMembers &&(
          <AddMemberButton onClick={openAddModal}>
            <AddMemberIcon>
              <FiUserPlus size={20} color="white" />
            </AddMemberIcon>
            <AddMemberText>{t('addMember')}</AddMemberText>
          </AddMemberButton>
        )}

        {visibleMembers.map(member => {
          const isMe = member.id === parseInt(currentUserId);
          const isMemberAdmin = member.id === adminId;
          const isOpen = openMemberId === member.id;
          // Solo el admin puede ver opciones, y no sobre sí mismo ni sobre el admin actual
          const canManage = isAdmin && !isMe && !isMemberAdmin;

          return (
            <React.Fragment key={member.id}>
              <MemberItem>
                <Avatar 
                    name={member.name} 
                    id={member.id} 
                    size="md"
                    src={member.profilePhoto || null} // ← agregar
                  />
                <MemberInfo>
                  <MemberName>{isMe ? t('you') : member.name}</MemberName>
                </MemberInfo>
                {isMemberAdmin && <AdminBadge>{t('admin')}</AdminBadge>}
                {/* Flecha solo visible para el admin sobre otros miembros */}
                {canManage && (
                  <MemberArrow $open={isOpen} onClick={() => toggleMemberOptions(member.id)}>
                    <IoIosArrowDown size={20} />
                  </MemberArrow>
                )}
              </MemberItem>

              {/* Panel de opciones desplegable */}
              {canManage && isOpen && (
                <MemberOptions>
                  <OptionButton onClick={() => handleMakeAdmin(member.id)}>
                    {t('makeAdmin')}
                  </OptionButton>
                  <OptionButton $danger onClick={() => handleRemove(member.id)}>
                    {t('removeMember')}
                  </OptionButton>
                </MemberOptions>
              )}
            </React.Fragment>
          );
        })}

        {!showAll && remaining > 0 && (
          <ShowMoreButton onClick={() => setShowAll(true)}>
            <FiChevronDown size={20} />
            {remaining} {t('more')}
          </ShowMoreButton>
        )}
      </MembersContainer>

      {/* Modal agregar miembro */}
      {showAddModal && (
        <Overlay onClick={() => setShowAddModal(false)}>
          <ModalSheet onClick={e => e.stopPropagation()}>
            <ModalTitle>{t('addMember')}</ModalTitle>
            <AddSearchWrapper>
              <FiSearch size={16} color="#888" />
              <SearchInput
                placeholder={t('searchMember')}
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                autoFocus
              />
              {userSearch && (
                <FiX size={16} color="#888" style={{ cursor: 'pointer' }}
                  onClick={() => setUserSearch('')} />
              )}
            </AddSearchWrapper>
            <UserList>
              {availableUsers.length === 0 && (
                <p style={{ color: '#aaa', fontSize: 14, padding: '8px 0' }}>
                  {t('noResults')}
                </p>
              )}
              {availableUsers.map(user => {
                const isSelected = selected.includes(user.id);
                return (
                  <UserRow key={user.id} onClick={() => toggleSelect(user.id)}>
                    <Avatar 
                      name={user.name} 
                      id={user.id} 
                      size="md"
                      src={user.profilePhoto || null} // ← agregar
                    />
                    <UserRowName>{user.name}</UserRowName>
                    {isSelected && (
                      <CheckIcon><FiCheck size={14} color="white" /></CheckIcon>
                    )}
                  </UserRow>
                );
              })}
            </UserList>
            <AddButton onClick={handleAdd} disabled={selected.length === 0 || loading}>
              {loading
                ? t('loading')
                : `${t('addMember')}${selected.length > 0 ? ` (${selected.length})` : ''}`}
            </AddButton>
            <CancelButton onClick={() => setShowAddModal(false)}>
              {t('cancel')}
            </CancelButton>
          </ModalSheet>
        </Overlay>
      )}
    </>
  );
}

export default GroupMembers;