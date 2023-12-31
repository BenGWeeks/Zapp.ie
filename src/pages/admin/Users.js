import React, { useState } from 'react';
import { DetailsList, Dialog, DialogType, TextField, PrimaryButton, DefaultButton } from '@fluentui/react';

const Users = () => {
  const [users, setUsers] = useState([
    // Example users
    { id: 1, name: 'User1', nPub: 'nPub1' },
    { id: 2, name: 'User2', nPub: 'nPub2' },
  ]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'nPub', name: 'nPub', fieldName: 'nPub', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  const onAddUser = () => {
    setSelectedUser(null);
    setDialogVisible(true);
  };

  const onEditUser = (user) => {
    setSelectedUser(user);
    setDialogVisible(true);
  };

  const onDeleteUser = (user) => {
    setUsers(users.filter(u => u.id !== user.id));
  };

  const onSaveUser = (name, nPub) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, name, nPub } : user));
    } else {
      // Add new user
      const id = Math.max(...users.map(user => user.id)) + 1;
      setUsers([...users, { id, name, nPub }]);
    }
    setDialogVisible(false);
  };

  return (
    <div>
      <h1>Admin Users</h1>
      <DetailsList
        items={users}
        columns={columns}
        setKey="id"
        onItemInvoked={onEditUser}
      />
      <PrimaryButton onClick={onAddUser}>Add User</PrimaryButton>
      {selectedUser && <DefaultButton onClick={() => onDeleteUser(selectedUser)}>Delete User</DefaultButton>}
      <Dialog
        hidden={!dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: selectedUser ? 'Edit User' : 'Add User',
        }}
      >
        <TextField label="Name" defaultValue={selectedUser ? selectedUser.name : ''} />
        <TextField label="nPub" defaultValue={selectedUser ? selectedUser.nPub : ''} />
        <PrimaryButton onClick={() => onSaveUser(name, nPub)}>Save</PrimaryButton>
      </Dialog>
    </div>
  );
};

export default Users;
