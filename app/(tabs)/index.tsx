import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spaceship from '../../components/Spaceship';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

const SHIP_WIDTH = 40;
const SHIP_HEIGHT = 62;
const OBSTACLE_SIZE = 40;
const SHIP_Y = 300;
const MOVE_STEP = 30;
const GAME_LOOP_MS = 30;
const OBSTACLE_SPEED = 6;
const SPAWN_RATE = 25;
const HIGH_SCORE_KEY = 'SPACE_ESCAPE_HIGH_SCORE';

type Obstacle = {
  id: number;
  x: number;
  y: number;
};

export default function HomeScreen() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shipX, setShipX] = useState(
    SCREEN_WIDTH / 2 - SHIP_WIDTH / 2
  );
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const frameCount = useRef(0);
  const obstacleId = useRef(0);
  const shipXRef = useRef(shipX);

  useEffect(() => {
    shipXRef.current = shipX;
  }, [shipX]);

  useEffect(() => {
    const loadHighScore = async () => {
      const saved = await AsyncStorage.getItem(HIGH_SCORE_KEY);

      if (saved) {
        setHighScore(parseInt(saved, 10));
      }
    };

    loadHighScore();
  }, []);

  const saveHighScore = async (finalScore: number) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      await AsyncStorage.setItem(
        HIGH_SCORE_KEY,
        finalScore.toString()
      );
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    const loop = setInterval(() => {
      frameCount.current += 1;

      if (frameCount.current % SPAWN_RATE === 0) {
        const randomX =
          Math.random() *
          (SCREEN_WIDTH - OBSTACLE_SIZE);

        obstacleId.current += 1;

        setObstacles((prev) => [
          ...prev,
          {
            id: obstacleId.current,
            x: randomX,
            y: -OBSTACLE_SIZE,
          },
        ]);
      }

      setObstacles((prev) => {
        let passedAsteroids = 0;

        const moved = prev
          .map((obs) => ({
            ...obs,
            y: obs.y + OBSTACLE_SPEED,
          }))
          .filter((obs) => {
            if (obs.y >= SCREEN_HEIGHT) {
              passedAsteroids += 1;
              return false;
            }

            return true;
          });

        if (passedAsteroids > 0) {
          setScore(
            (prevScore) =>
              prevScore + passedAsteroids
          );
        }

        const currentShipX = shipXRef.current;

        const collision = moved.some((obs) => {
          const horizontalOverlap =
            currentShipX <
              obs.x + OBSTACLE_SIZE &&
            currentShipX + SHIP_WIDTH >
              obs.x;

          const verticalOverlap =
            SHIP_Y <
              obs.y + OBSTACLE_SIZE &&
            SHIP_Y + SHIP_HEIGHT > obs.y;

          return (
            horizontalOverlap &&
            verticalOverlap
          );
        });

        if (collision) {
          setIsPlaying(false);
          setIsGameOver(true);
        }

        return moved;
      });
    }, GAME_LOOP_MS);

    return () => clearInterval(loop);
  }, [isPlaying]);

  useEffect(() => {
    if (isGameOver) {
      saveHighScore(score);
    }
  }, [isGameOver]);

  const handleStartGame = () => {
    setScore(0);
    setObstacles([]);
    frameCount.current = 0;
    obstacleId.current = 0;
    setShipX(
      SCREEN_WIDTH / 2 - SHIP_WIDTH / 2
    );
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const moveLeft = () => {
    setShipX((prev) =>
      Math.max(0, prev - MOVE_STEP)
    );
  };

  const moveRight = () => {
    setShipX((prev) =>
      Math.min(
        SCREEN_WIDTH - SHIP_WIDTH,
        prev + MOVE_STEP
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>
        Space Escape Runner
      </Text>

      <View style={styles.scoreRow}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>
            Current Score
          </Text>
          <Text style={styles.scoreValue}>
            {score}
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>
            High Score
          </Text>
          <Text style={styles.scoreValue}>
            {highScore}
          </Text>
        </View>
      </View>

      {!isPlaying && !isGameOver && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartGame}>
          <Text style={styles.startButtonText}>
            Start Game
          </Text>
        </TouchableOpacity>
      )}

      {isGameOver && (
        <View style={styles.gameOverCard}>
          <Text style={styles.gameOverTitle}>
            Game Over
          </Text>

          <Text style={styles.gameOverScore}>
            Final Score: {score}
          </Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartGame}>
            <Text style={styles.startButtonText}>
              Play Again
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isPlaying && (
        <View style={styles.gameArea}>
          {obstacles.map((obs) => (
            <View
              key={obs.id}
              style={[
                styles.obstacle,
                {
                  left: obs.x,
                  top: obs.y,
                },
              ]}
            />
          ))}

          <View
            style={[
              styles.shipWrapper,
              {
                left: shipX,
                top: SHIP_Y,
              },
            ]}>
            <Spaceship />
          </View>

          <View style={styles.controls}>
            <Pressable
              style={styles.controlButton}
              onPress={moveLeft}>
              <Text style={styles.controlText}>
                ◀ Left
              </Text>
            </Pressable>

            <Pressable
              style={styles.controlButton}
              onPress={moveRight}>
              <Text style={styles.controlText}>
                Right ▶
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1A',
    alignItems: 'center',
    paddingTop: 60,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },

  scoreRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  scoreCard: {
    backgroundColor: '#161B2E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  scoreLabel: {
    color: '#8A8FA3',
  },

  scoreValue: {
    color: '#4FD1C5',
    fontSize: 28,
    fontWeight: '700',
  },

  startButton: {
    backgroundColor: '#4FD1C5',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  startButtonText: {
    color: '#0B0E1A',
    fontWeight: '700',
    fontSize: 18,
  },

  gameOverCard: {
    alignItems: 'center',
  },

  gameOverTitle: {
    color: '#FF6B6B',
    fontSize: 30,
    fontWeight: '800',
  },

  gameOverScore: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 20,
  },

  gameArea: {
    width: SCREEN_WIDTH,
    flex: 1,
    overflow: 'hidden',
  },

  obstacle: {
    position: 'absolute',
    width: OBSTACLE_SIZE,
    height: OBSTACLE_SIZE,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
  },

  shipWrapper: {
  position: 'absolute',
  width: 50,
  height: 70,
  backgroundColor: 'rgba(255,0,0,0.2)',
},

  controls: {
    position: 'absolute',
    bottom: 20,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  controlButton: {
    backgroundColor: '#161B2E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },

  controlText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});