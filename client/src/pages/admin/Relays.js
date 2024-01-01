import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from 'react-query';

const Relays = () => {
  const nameRef = useRef();
  const addressRef = useRef();
  const { data: relays = [], refetch: refetchRelays } = useQuery('relays', () =>
    fetch(`${process.env.REACT_APP_SERVER_URL}/relays`).then(res => res.json())
  );

  const mutation = useMutation(
    (newRelay) => fetch(`${process.env.REACT_APP_SERVER_URL}/relays`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRelay),
    }),
    {
      onSuccess: () => {
        refetchRelays();
      },
    }
  );

  const onSaveRelay = (name, address) => {
    mutation.mutate({ name, address });
  };

  return (
    <div>
      <h1>Relays</h1>
      <ul>
        {relays.map((relay) => (
          <li key={relay.id}>
            {relay.name} - {relay.address}
          </li>
        ))}
      </ul>
      <h2>Add a new relay</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveRelay(nameRef.current.value, addressRef.current.value);
        }}
      >
        <label>
          Name:
          <input type="text" ref={nameRef} />
        </label>
        <label>
          Address:
          <input type="text" ref={addressRef} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Relays;
