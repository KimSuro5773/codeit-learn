// logger.js
const fs = require("fs");
const path = require("path");

// 로그 파일 경로 설정
const LOG_DIR = path.join(__dirname, "./logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

function logToFile(level, message) {
  const time = new Date().toISOString();
  const logEntry = `[${time}] [${level}] ${message}\n`;

  try {
    // 로그 디렉토리가 없으면 생성
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }

    // 비동기적으로 파일에 추가
    fs.appendFile(LOG_FILE, logEntry, (err) => {
      if (err) {
        console.error(`로그 파일 작성 중 오류 발생: ${err.message}`);
      }
    });
  } catch (error) {
    console.error(`로깅 시스템 오류: ${error.message}`);
  }
}

module.exports = {
  info: (message) => logToFile("INFO", message),
  warn: (message) => logToFile("WARN", message),
  error: (message) => logToFile("ERROR", message),
  debug: (message) => logToFile("DEBUG", message),
  logToFile, // 내부 함수도 외부에서 사용할 수 있도록 export
};
