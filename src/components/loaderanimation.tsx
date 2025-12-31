import React, { useEffect, useRef } from 'react';

interface LoaderAnimationProps {
    size?: number | string;
    width?: number | string;
    height?: number | string;
    className?: string;
}

const LoaderAnimation: React.FC<LoaderAnimationProps> = ({ 
    size = '100px', // Default size set to small (50px). To change size, pass a different value (e.g., '100px' or 100) or modify this default.
    width, 
    height,
    className 
}) => {
    const flowPathRef = useRef<SVGPathElement>(null);
    const containerStyle = {
        width: width || size,
        height: height || size,
    };

    useEffect(() => {
        const flowPath = flowPathRef.current;
        if (flowPath) {
            const length = flowPath.getTotalLength();
            const dashPercentage = 0.5; // Adjusted for better visibility of the flow
            const dashLength = length * dashPercentage;
            const gapLength = length - dashLength;

            flowPath.style.setProperty('--total-length', length.toString());
            flowPath.style.strokeDasharray = `${dashLength} ${gapLength}`;
        }
    }, []);

    return (
        <div className={`loader-container ${className || ''}`} style={containerStyle}>
            <style>
                {`
                .loader-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .loader-container svg {
                    width: 100%;
                    height: 100%;
                }
                .base-path {
                    fill: transparent;
                    stroke: #334155;
                    stroke-width: 1;
                    opacity: 0.3;
                }
                .flow-path {
                    fill: transparent;
                    stroke: url(#flowGradient);
                    stroke-width: 4;
                    stroke-linecap: round;
                    animation: flow 1.5s linear infinite;
                }
                @keyframes flow {
                    from {
                        stroke-dashoffset: var(--total-length);
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                `}
            </style>
            <svg viewBox="-10 -10 240 170" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#fb923c" stopOpacity="1" />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity="0.5" />
                    </linearGradient>
                </defs>

                <path 
                    className="base-path"
                    d="M53.0179 4.00681C84.3324 -2.58139 83.5179 9.16137 112.912 9.16137C142.305 9.16137 138.597 -2.58139 169.912 4.00681C194.412 9.16133 206.411 45.0068 213.412 73.0068C224.178 116.073 224.588 135.829 206.67 139.255C128.912 154.12 170.467 89.6699 111.76 89.6699C53.0524 89.6699 94.0179 154.12 16.2597 139.255C-1.65854 135.829 -1.2487 116.073 9.51792 73.0068C16.518 45.0068 28.5179 9.16133 53.0179 4.00681Z"
                />
                
                <path 
                    ref={flowPathRef}
                    className="flow-path"
                    d="M53.0179 4.00681C84.3324 -2.58139 83.5179 9.16137 112.912 9.16137C142.305 9.16137 138.597 -2.58139 169.912 4.00681C194.412 9.16133 206.411 45.0068 213.412 73.0068C224.178 116.073 224.588 135.829 206.67 139.255C128.912 154.12 170.467 89.6699 111.76 89.6699C53.0524 89.6699 94.0179 154.12 16.2597 139.255C-1.65854 135.829 -1.2487 116.073 9.51792 73.0068C16.518 45.0068 28.5179 9.16133 53.0179 4.00681Z"
                />
            </svg>
        </div>
    );
};

export default LoaderAnimation;
