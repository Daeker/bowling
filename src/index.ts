/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */

import axios from 'axios';

interface getInteface {
  token: string
  points: number[][]
}

/**
 * Gets points from API, calculates scores and posts back to API
 * Writes success data to console.log
 */
export async function run() {
  const res = await getPoints();
  const score = calcScore(res.points);
  const success = await postPoints(res.token, score);
  console.log(success);
}

/**
 * Promises to get token and points from API
 *
 * @return {Promise<getInteface>} - The promise of token and points
 */
async function getPoints(): Promise<getInteface> {
  return axios
      .get('http://13.74.31.101/api/points')
      .then((response) => {
        return {token: response.data.token, points: response.data.points};
      }).catch((error) => {
        console.log(error);
        return {token: '', points: [[]]};
      });
}

/**
 * Promises to posts scores to API
 *
 * @param {string} token - The API token
 * @param {number[]} scores - The list of calculated scores
 * @return {Promise<boolean>} - The promise of a success state
 */
async function postPoints(token: string, scores: number[]): Promise<boolean> {
  return axios
      .post('http://13.74.31.101/api/points', {
        token: token, points: scores,
      })
      .then((response) => {
        return response.data.success;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
}

/**
 * Returns scores for a game of bowling
 *
 * @param {number[][]} points - The list of points scored in a game of bowling
 * @return {number[]} - The list of scores after each frame in a bowling game
 */
function calcScore(points: number[][]): number[] {
  let i = 0; // tracks the current frame being calculated
  let sum = 0; // tracks the sum of both bowls in the current frame
  let bonusCount = 0; // tracks the number of bonuses yet to be added
  let score = 0; // tracks the total score
  const scores: number[] = []; // holds the score for each frame
  points.forEach((frame) => {
    sum = frame[0] + frame[1];
    if (i == 10) { // case for when bowling an 11th frame to add remaining bonus
      if (bonusCount == 3) {
        scores[i - 2] += frame[0];
        scores[i - 1] += sum + frame[0];
      } else if (bonusCount > 0) {
        scores[i - 1] += sum;
      }
    } else if (frame[0] == 10) { // case for when a strike is bowled
      if (bonusCount == 3) {
        score += 20;
        scores[i - 2] += 10;
        scores[i - 1] += 20;
        bonusCount -= 2;
      } else if (bonusCount > 0) {
        score += 10;
        scores[i - 1] += 10;
        bonusCount--;
      }
      score += 10;
      scores.push(score);
      bonusCount += 2;
      i++;
    } else { // case for when a strike is not bowled
      if (bonusCount == 3) {
        score += sum + frame [0];
        scores[i - 2] += frame[0];
        scores[i - 1] += sum + frame[0];
      } else if (bonusCount == 2) {
        score += sum;
        scores[i - 1] += sum;
      } else if (bonusCount == 1) {
        score += frame[0];
        scores[i - 1] += frame[0];
      }
      score += sum;
      scores.push(score);
      bonusCount = 0;
      if (sum == 10) {
        bonusCount++;
      }
      i++;
    }
  });
  return scores;
};

run();
