import React, { useState } from 'react';
import FeedComponent from './components/FeedComponent';
import ZapActivityChartComponent from './components/ZapActivityChartComponent';
import TotalZapsComponent from './components/TotalZapsComponent';


const centeredImageStyle: IRawStyle = {
  display: 'block',
  maxWidth: '100%',
  Height: '42px', // Maintain aspect ratio
  top: "100px",
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  margin: 'auto',
  paddingBottom: '80px',
};

export function Home() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      // Redirect authenticated users to /leaderboard
      navigate('/feed');
    }
  }, [accounts, navigate]);

  return (

    <div style={{ background: '#1F1F1F' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: 20,
          //background: '#1F1F1F',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 918,
          display: 'inline-flex',
        }}
      >
        <div
          style={{
            /*height: 246.19,*/
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 6,
            display: 'flex',
          }}
        >
          <TotalZapsComponent />
          <ZapActivityChartComponent lnKey={inKey} timestamp={timestamp} />
        </div>
      </div>
      <div
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          paddingTop: 0,
        }}
      >
        <FeedComponent />
      </div>
    </div>
  );
}

export default Home;