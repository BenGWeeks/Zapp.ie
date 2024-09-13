import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import styles from './ZapChart.module.css';
/// <reference path = "../global.d.ts" />

const ZapChartComponent: FunctionComponent = () => {

    return (
        <div className={styles.zapsChartContainer}>
            {/* Total Zaps Section */}
            <div className={styles.zapStats}>
                <p className={styles.title}>Zap chart</p>

            </div>

        </div>
    );
};


export default ZapChartComponent;