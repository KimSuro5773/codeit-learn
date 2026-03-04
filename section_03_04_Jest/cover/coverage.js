// coverage.js
function isPositive(num) {
  if (num > 0) {
    return true;
  } else {
    return false;
  }
}

function calculateGrade(score) {
  if (score >= 90) return "A";
  else if (score >= 80) return "B";
  else if (score >= 70) return "C";
  else return "F";
}

module.exports = { isPositive, calculateGrade };
