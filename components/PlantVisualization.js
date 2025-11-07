import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';

export default function PlantVisualization({ plantType, growthStage, color, size }) {
  const scale = size / 200; // Base size is 200

  // Growth stages: 0-10
  const getPlantVisual = () => {
    const stage = Math.min(growthStage, 10);
    
    // Seed stage (0)
    if (stage === 0) {
      return (
        <Circle
          cx={100 * scale}
          cy={180 * scale}
          r={5 * scale}
          fill={color}
        />
      );
    }

    // Sprout stage (1-2)
    if (stage <= 2) {
      const stemHeight = 20 * scale * stage;
      return (
        <G>
          <Path
            d={`M ${100 * scale} ${180 * scale} L ${100 * scale} ${180 * scale - stemHeight}`}
            stroke={color}
            strokeWidth={3 * scale}
            strokeLinecap="round"
          />
          {stage >= 2 && (
            <Ellipse
              cx={100 * scale}
              cy={180 * scale - stemHeight}
              rx={8 * scale}
              ry={5 * scale}
              fill={color}
              opacity={0.7}
            />
          )}
        </G>
      );
    }

    // Growing stages (3-5)
    if (stage <= 5) {
      const stemHeight = 40 * scale + (stage - 3) * 15 * scale;
      const leafSize = 8 * scale + (stage - 3) * 3 * scale;
      return (
        <G>
          {/* Stem */}
          <Path
            d={`M ${100 * scale} ${180 * scale} L ${100 * scale} ${180 * scale - stemHeight}`}
            stroke={color}
            strokeWidth={4 * scale}
            strokeLinecap="round"
          />
          {/* Leaves */}
          <Ellipse
            cx={(100 - 15) * scale}
            cy={(180 - stemHeight + 10) * scale}
            rx={leafSize}
            ry={leafSize * 1.5}
            fill={color}
            opacity={0.8}
            transform={`rotate(-30 ${(100 - 15) * scale} ${(180 - stemHeight + 10) * scale})`}
          />
          <Ellipse
            cx={(100 + 15) * scale}
            cy={(180 - stemHeight + 10) * scale}
            rx={leafSize}
            ry={leafSize * 1.5}
            fill={color}
            opacity={0.8}
            transform={`rotate(30 ${(100 + 15) * scale} ${(180 - stemHeight + 10) * scale})`}
          />
          {stage >= 4 && (
            <Ellipse
              cx={(100 - 12) * scale}
              cy={(180 - stemHeight + 25) * scale}
              rx={leafSize * 0.8}
              ry={leafSize * 1.2}
              fill={color}
              opacity={0.7}
              transform={`rotate(-45 ${(100 - 12) * scale} ${(180 - stemHeight + 25) * scale})`}
            />
          )}
        </G>
      );
    }

    // Flowering stages (6-8)
    if (stage <= 8) {
      const stemHeight = 70 * scale + (stage - 6) * 10 * scale;
      const flowerSize = 15 * scale + (stage - 6) * 5 * scale;
      const petalCount = stage >= 7 ? 6 : 5;
      
      return (
        <G>
          {/* Stem */}
          <Path
            d={`M ${100 * scale} ${180 * scale} L ${100 * scale} ${180 * scale - stemHeight}`}
            stroke={color}
            strokeWidth={5 * scale}
            strokeLinecap="round"
          />
          {/* Leaves */}
          <Ellipse
            cx={(100 - 20) * scale}
            cy={(180 - stemHeight + 20) * scale}
            rx={12 * scale}
            ry={18 * scale}
            fill={color}
            opacity={0.8}
            transform={`rotate(-35 ${(100 - 20) * scale} ${(180 - stemHeight + 20) * scale})`}
          />
          <Ellipse
            cx={(100 + 20) * scale}
            cy={(180 - stemHeight + 20) * scale}
            rx={12 * scale}
            ry={18 * scale}
            fill={color}
            opacity={0.8}
            transform={`rotate(35 ${(100 + 20) * scale} ${(180 - stemHeight + 20) * scale})`}
          />
          {/* Flower */}
          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = (i * 360) / petalCount;
            const radian = (angle * Math.PI) / 180;
            const petalX = 100 * scale + Math.cos(radian) * flowerSize * 0.8;
            const petalY = (180 - stemHeight) * scale + Math.sin(radian) * flowerSize * 0.8;
            return (
              <Ellipse
                key={i}
                cx={petalX}
                cy={petalY}
                rx={flowerSize * 0.6}
                ry={flowerSize * 0.9}
                fill={color}
                opacity={0.9}
                transform={`rotate(${angle} ${petalX} ${petalY})`}
              />
            );
          })}
          {/* Center */}
          <Circle
            cx={100 * scale}
            cy={(180 - stemHeight) * scale}
            r={flowerSize * 0.3}
            fill="#FFD700"
          />
        </G>
      );
    }

    // Fully grown stages (9-10)
    const stemHeight = 100 * scale;
    const flowerSize = 25 * scale;
    const petalCount = 8;
    
    return (
      <G>
        {/* Stem */}
        <Path
          d={`M ${100 * scale} ${180 * scale} L ${100 * scale} ${180 * scale - stemHeight}`}
          stroke={color}
          strokeWidth={6 * scale}
          strokeLinecap="round"
        />
        {/* Multiple Leaves */}
        {[
          { x: -25, y: 30, rotation: -40 },
          { x: 25, y: 30, rotation: 40 },
          { x: -18, y: 50, rotation: -50 },
          { x: 18, y: 50, rotation: 50 },
        ].map((leaf, i) => (
          <Ellipse
            key={i}
            cx={(100 + leaf.x) * scale}
            cy={(180 - stemHeight + leaf.y) * scale}
            rx={15 * scale}
            ry={22 * scale}
            fill={color}
            opacity={0.85}
            transform={`rotate(${leaf.rotation} ${(100 + leaf.x) * scale} ${(180 - stemHeight + leaf.y) * scale})`}
          />
        ))}
        {/* Full Bloom Flower */}
        {Array.from({ length: petalCount }).map((_, i) => {
          const angle = (i * 360) / petalCount;
          const radian = (angle * Math.PI) / 180;
          const petalX = 100 * scale + Math.cos(radian) * flowerSize * 0.9;
          const petalY = (180 - stemHeight) * scale + Math.sin(radian) * flowerSize * 0.9;
          return (
            <Ellipse
              key={i}
              cx={petalX}
              cy={petalY}
              rx={flowerSize * 0.7}
              ry={flowerSize * 1.1}
              fill={color}
              opacity={1}
              transform={`rotate(${angle} ${petalX} ${petalY})`}
            />
          );
        })}
        {/* Center with detail */}
        <Circle
          cx={100 * scale}
          cy={(180 - stemHeight) * scale}
          r={flowerSize * 0.4}
          fill="#FFD700"
        />
        <Circle
          cx={100 * scale}
          cy={(180 - stemHeight) * scale}
          r={flowerSize * 0.2}
          fill="#FFA500"
        />
        {/* Sparkle effect for stage 10 */}
        {stage === 10 && (
          <>
            <Circle cx={85 * scale} cy={(180 - stemHeight - 10) * scale} r={2 * scale} fill="#FFD700" />
            <Circle cx={115 * scale} cy={(180 - stemHeight - 10) * scale} r={2 * scale} fill="#FFD700" />
            <Circle cx={100 * scale} cy={(180 - stemHeight - 15) * scale} r={2.5 * scale} fill="#FFD700" />
          </>
        )}
      </G>
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${200 * scale} ${200 * scale}`}>
        {/* Pot/Base */}
        <Path
          d={`M ${80 * scale} ${180 * scale} L ${80 * scale} ${190 * scale} L ${120 * scale} ${190 * scale} L ${120 * scale} ${180 * scale}`}
          fill="#8B4513"
        />
        <Ellipse
          cx={100 * scale}
          cy={180 * scale}
          rx={20 * scale}
          ry={5 * scale}
          fill="#A0522D"
        />
        
        {/* Plant */}
        {getPlantVisual()}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

