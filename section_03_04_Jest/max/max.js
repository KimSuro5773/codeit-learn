// max.js
// TDD 실습
/* 3가지 
  1. Red → 실패하는 테스트 작성
  2. Green → 최소한의 코드로 통과되게 작성
  3. Refactor → 리팩토링
*/

function findMax(numbers) {
  if (!numbers || numbers.length === 0) return undefined;

  return Math.max(...numbers);
}

module.exports = { findMax };
