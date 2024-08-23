import { FunctionComponent } from "react";
import styles from "./FeedList.module.css";
import React from "react";

const FeedList: FunctionComponent = () => {
  return (
    <div className={styles.feedlist}>
      <div className={styles.headercell}>
        <div className={styles.headerContents}>
          <b className={styles.string}>From</b>
          <b className={styles.string}>To</b>
          <b className={styles.string2}>Reason</b>
          <div className={styles.stringWrapper}>
            <b className={styles.string3}>Zap amount</b>
          </div>
          <div className={styles.buttonsStack}>
            <div className={styles.iconbutton}>
              <div className={styles.base}>
                <div className={styles.buttonsStack}>
                  <img
                    className={styles.iconContent}
                    alt=""
                    src="Icon-content.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bodycell}>
        <div className={styles.bodyContents}>
          <div className={styles.mainContentStack}>
            <div className={styles.personDetails}>
              <img className={styles.avatarIcon} alt="" src="avatar.png" />
              <div className={styles.userName}>Ben Weeks</div>
            </div>
            <div className={styles.personDetails}>
              <img className={styles.avatarIcon} alt="" src="avatar.png" />
              <div className={styles.userName}>Ben Weeks</div>
            </div>
            <div className={styles.userName}>
              For being happy to show the same demo second time when the end
              user joined the call
            </div>
          </div>
          <div className={styles.transactionDetails}>
            <b className={styles.b}>241,000</b>
            <img className={styles.icon} alt="" src="Icon.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedList;
