/// <reference path="../types/global.d.ts" />

import React, { useEffect, useState } from 'react';
import ActivityCalendar, { Activity } from 'react-activity-calendar';
import { getWalletZapsSince } from '../services/lnbitsServiceLocal';
import styles from './ZapActivityChartComponent.module.css';

interface ZapContributionsChartProps {
  lnKey: string;
  timestamp: number; // Timestamp in seconds since the epoch
}

function generateDateRange(fromDate: string, toDate: string): string[] {
  const dates = [];
  const currentDate = new Date(fromDate);
  const endDate = new Date(toDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

const transformZapsToActivities = (
  zaps: Zap[],
  fromDate: string,
  toDate: string,
): Activity[] => {
  const dateAmounts: { [date: string]: number } = {};

  zaps.forEach(zap => {
    if (zap.time && !isNaN(zap.time)) {
      const date = new Date(zap.time * 1000).toISOString().split('T')[0];
      const amount = Math.abs(zap.amount);
      dateAmounts[date] = (dateAmounts[date] || 0) + amount;
    }
  });

  // Generate the full date range
  const dateRange = generateDateRange(fromDate, toDate);

  // Create activities for all dates
  const activities: Activity[] = dateRange.map(date => {
    const totalAmount = dateAmounts[date] || 0;

    let level = 0;
    if (totalAmount >= 1000 && totalAmount < 2000) {
      level = 1;
    } else if (totalAmount >= 2000 && totalAmount < 3000) {
      level = 2;
    } else if (totalAmount >= 3000 && totalAmount < 4000) {
      level = 3;
    } else if (totalAmount >= 4000) {
      level = 4;
    }

    return { date, count: totalAmount, level };
  });

  return activities;
};

const ZapContributionsChart: React.FC<ZapContributionsChartProps> = ({
  lnKey,
  timestamp,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fromDate = new Date(timestamp * 1000).toISOString().split('T')[0];
  const toDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const zapsData: Zap[] = await getWalletZapsSince(lnKey, timestamp); // This currently only gets zaps for the specified wallet.
        const activitiesData = transformZapsToActivities(
          zapsData,
          fromDate,
          toDate,
        );

        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching zaps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [lnKey, timestamp]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (activities.length === 0) {
    return <div>No activity data available.</div>;
  }

  return (
    <div className={styles.zapactivitychartbox}>
      <h2 className={styles.zapactivitycharttitle}>Your Zap activity</h2>
      <ActivityCalendar
        data={activities}
        blockSize={12}
        blockMargin={5}
        fontSize={14}
        theme={{
          dark: ['#1F1F1F', '#492D16', '#BF6C21', '#E56C31', '#F2A900'],
        }}
        colorScheme="dark"
        labels={{
          totalCount: '{{count}} Sats zapped',
        }}
      />
    </div>
  );
};

export default ZapContributionsChart;
