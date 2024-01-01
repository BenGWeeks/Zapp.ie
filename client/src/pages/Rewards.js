import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { DocumentCard, DocumentCardImage, DocumentCardTitle, DocumentCardDetails, PrimaryButton } from '@fluentui/react';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/rewards`)
      .then(response => response.json())
      .then(data => setRewards(data));
  }, []);

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
