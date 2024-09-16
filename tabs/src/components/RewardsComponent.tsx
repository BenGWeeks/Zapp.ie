import { FunctionComponent, useCallback, useState, useEffect, useRef } from 'react';
import styles from './RewardsComponent.module.css';
import { ZapRewards } from '../interfaces/DataModel';
import { getRewards } from '../services/lnbitsServiceLocal';

/// <reference path = "../global.d.ts" />

/// <reference types="react-scripts" />

const RewardsComponent: FunctionComponent = () => {
    const [rewards, setRewards] = useState<ZapRewards[]>([]); // Initialize as an empty array
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [visibleDescriptions, setVisibleDescriptions] = useState<{ [key: string]: boolean }>({});
    const [expandedImages, setExpandedImages] = useState<{ [key: string]: boolean }>({});
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRewards = async () => {
            const apiKey = '3ce76a5ab0a34ca5a670f1d8a02c3677'; // API key

            const rewardsData = await getRewards(apiKey);

            // Map API data to ZapRewards format
            const transformedRewards = rewardsData.map((product: any) => ({
                Image: product.image,
                Title: product.product,
                ShortDescription: product.description,
                LongDescription: product.categories, // Can be a different field if available
                Price: product.price,
            }));

            setRewards(transformedRewards);  // Update state with transformed rewards
        };

        fetchRewards();
    }, []);
    const handleMouseDown = (e: React.MouseEvent) => {
        if (carouselRef.current) {
            setIsDragging(true);
            setStartPosition(e.pageX - carouselRef.current.offsetLeft);
            setScrollPosition(carouselRef.current.scrollLeft);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && carouselRef.current) {
            const x = e.pageX - carouselRef.current.offsetLeft;
            const walk = (x - startPosition) * 1; // Scrolling speed factor
            carouselRef.current.scrollLeft = scrollPosition - walk;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const toggleDescription = (key: string) => {
        setVisibleDescriptions(prevState => ({
            ...prevState,
            [key]: !prevState[key],
        }));
        setExpandedImages(prevState => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    // Only render rewards if they exist
    return (
        <div className={styles.mainContainer}>
            <div className={styles.title}>Rewards</div>
            <div
                className={styles.carousel}
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                {rewards.length > 0 ? ( // Check if rewards array has elements
                    rewards.map((reward) => (
                        <div key={reward.Image} className={styles.card}>
                            <img
                                src={reward.Image}
                                alt={reward.Title}
                                className={styles.rewardImage}
                                style={{ height: expandedImages[reward.Image] ? '300px' : '160px' }} // Toggle height
                            />
                            <h3 className={styles.cardTitle}>{reward.Title}</h3>
                            <p className={styles.cardDescription}>{reward.ShortDescription}</p>
                            <p className={styles.productDetails} onClick={() => toggleDescription(reward.Image)}>Product details</p>
                            {visibleDescriptions[reward.Image] && (
                                <p className={styles.longDescription}>{reward.LongDescription}</p>
                            )}
                            <div className={styles.priceContainer}>
                                <p className={styles.price}>{formatPrice(reward.Price)}</p>
                                <p className={styles.sats}>Sats</p>
                            </div>
                            <button className={styles.redeemButton}>Redeem</button>
                        </div>
                    ))
                ) : (
                    <p>No rewards available</p> // Add a fallback message
                )}
            </div>
        </div>
    );
};

export default RewardsComponent;
