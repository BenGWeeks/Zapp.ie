import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Card, CardMedia, CardContent, Typography, Button } from '@material-ui/core';

const Rewards = () => {
  const rewards = [
    { title: 'Reward 1', description: 'This is reward 1', amount: 100, image: 'url_to_image_1' },
    { title: 'Reward 2', description: 'This is reward 2', amount: 200, image: 'url_to_image_2' },
    // Add more rewards as needed
  ];

  return (
    <Carousel>
      {rewards.map((reward, index) => (
        <div key={index}>
          <Card>
            <CardMedia
              image={reward.image}
              title={reward.title}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {reward.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reward.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amount: {reward.amount}
              </Typography>
              <Button variant="contained" color="primary">
                Redeem
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
    </Carousel>
  );
};

export default Rewards;
