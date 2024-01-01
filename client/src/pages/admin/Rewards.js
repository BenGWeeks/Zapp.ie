import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from 'react-query';

const Rewards = () => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const amountRef = useRef();
  const { data: rewards = [], refetch: refetchRewards } = useQuery('rewards', () =>
    fetch(`${process.env.REACT_APP_SERVER_URL}/rewards`).then(res => res.json())
  );

  const mutation = useMutation(
    (newReward) => fetch(`${process.env.REACT_APP_SERVER_URL}/rewards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReward),
    }),
    {
      onSuccess: () => {
        refetchRewards();
      },
    }
  );

  const onSaveReward = (title, description, amount) => {
    mutation.mutate({ title, description, amount });
  };

  return (
    <div>
      <h1>Rewards</h1>
      <ul>
        {rewards.map((reward) => (
          <li key={reward.id}>
            {reward.title} - {reward.description} - {reward.amount}
          </li>
        ))}
      </ul>
      <h2>Add a new reward</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveReward(titleRef.current.value, descriptionRef.current.value, amountRef.current.value);
        }}
      >
        <label>
          Title:
          <input type="text" ref={titleRef} />
        </label>
        <label>
          Description:
          <input type="text" ref={descriptionRef} />
        </label>
        <label>
          Amount:
          <input type="number" ref={amountRef} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Rewards;
