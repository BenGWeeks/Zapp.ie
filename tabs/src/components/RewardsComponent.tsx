import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import styles from './RewardsComponent.module.css';
import { getNostrRewards } from '../services/lnbitsServiceLocal';

const stallID = process.env.REACT_APP_LNBITS_STORE_ID as string;

/// <reference path = "../global.d.ts" />
/// <reference types="react-scripts" />

const RewardsComponent: FunctionComponent<{ adminKey: string }> = ({ adminKey }) => {
    const [rewards, setRewards] = useState<NostrZapRewards[]>([]); // Initialize as an empty array
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRewards = async () => {

            const stallId = stallID;

            try {
                const rewardsData = await getNostrRewards(adminKey, stallId);

                if (!rewardsData) {
                    throw new Error('No data returned from API');
                }

                // Map API data to NostrZapRewards format
                const transformedRewards = rewardsData.map((product: any) => ({
                    image: product.images[0],
                    name: product.name,
                    shortDescription: product.config.description,
                    link: product.categories,
                    price: product.price,
                }));

                setRewards(transformedRewards); // Update state with transformed rewards
            } catch (error) {
                console.error('Error fetching rewards:', error);
            }
        };

        fetchRewards();
    }, [adminKey]);

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

    const handleProductDetailsClick = (url: string) => {
        window.open(url, '_blank');
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
                        <div key={reward.image} className={styles.card}>
                            <img
                                src={reward.image}
                                alt={reward.name}
                                className={styles.rewardImage}
                                style={{ height: '160px' }} // Fixed height
                            />
                            <h3 className={styles.cardTitle}>{reward.name}</h3>
                            <p className={styles.cardDescription}>{reward.shortDescription}</p>
                            <p className={styles.productDetails} onClick={() => handleProductDetailsClick(reward.link)}>Product details</p>
                            <div className={styles.priceContainer}>
                                <p className={styles.price}>{formatPrice(reward.price)}</p>
                                <p className={styles.sats}>Sats</p>
                            </div>
                            <button className={styles.buyButton}>Buy</button>
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