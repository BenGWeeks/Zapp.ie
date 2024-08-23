import { FunctionComponent, useCallback } from "react";
import styles from "./FeedComponent.module.css";
import FeedList from "./FeedList";
import React from "react";

const FeedComponent: FunctionComponent = () => {
  const onTabContainerClick = useCallback(() => {
    // Add your code here
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = today.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className={styles.feedcomponent}>
      <div className={styles.tabs}>
        <div className={styles.tab}>
          <div className={styles.base}>
            <div className={styles.stringBadgeIconStack}>
              <b className={styles.stringTabTitle}>Leaderboard</b>
            </div>
            <div className={styles.borderPaddingStack}>
              <div className={styles.borderBottom} />
            </div>
          </div>
        </div>
        <div className={styles.tab1} onClick={onTabContainerClick}>
          <div className={styles.base1}>
            <div className={styles.stringBadgeIconStack}>
              <div className={styles.stringTabTitle}>Feed</div>
            </div>
          </div>
        </div>
        <div className={styles.tab1} onClick={onTabContainerClick}>
          <div className={styles.base1}>
            <div className={styles.stringBadgeIconStack}>
              <div className={styles.stringTabTitle}>Zaps</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.infoStrip}>
        <b className={styles.jan12020}>Jan 1, 2020 - Jan 30, 2020</b>
        <div className={styles.dateRange}>Date range:</div>
        <div className={styles.div}>|</div>
        <b className={styles.all}>All</b>
        <div className={styles.groups}>
          <span>Groups:</span>
        </div>
        <div className={styles.div1}>|</div>
        <b className={styles.all1}>All</b>
        <div className={styles.location}>Location:</div>
        <div className={styles.div2}>|</div>
        <div className={styles.amPt}>{formattedTime} (Local Time)</div>
        <div className={styles.dateContainer}>
          <b>{formattedDate}</b>
        </div>
      </div>
      <div className={styles.pivotPointsdoubleFull60}>
        <div className={styles.daysCopy}>60 days</div>
        <b className={styles.daysCopy3}>30 days</b>
        <div className={styles.daysCopy1}>7 days</div>
      </div>
      <FeedList />
    </div>
  );
};

export default FeedComponent;
