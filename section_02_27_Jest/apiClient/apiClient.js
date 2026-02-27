// apiClient.js
const axios = require("axios");

// API 호출 + 데이터 포맷 + 콜백으로 데이터 전달
const fetchData = async (url, callback) => {
  try {
    // 1. API 호출
    const response = await axios.get(url);
    const rawData = response.data;
    // 2. 데이터 포맷 - 프론트엔드에서 사용하기 좋은 형태로 변환
    const formattedData = {
      userId: rawData.id,
      formattedName: rawData.name.toUpperCase(),
      address: `${rawData.address.street} ${rawData.address.suite} ${rawData.address.city}`,
    };
    // 3. 추가적인 작업이 필요한 경우 callback 함수 실행
    if (callback && typeof callback === "function") {
      // 콜백 함수가 제공되면 호출
      callback(formattedData);
    }
    return formattedData;
  } catch (error) {
    console.error(`API 호출 중 오류 발생: ${error.message}`);
    throw error; // 에러를 다시 던져서 호출자에게 알림
  }
};

// fetchData("https://jsonplaceholder.typicode.com/users/1", (data) => {
//   console.log("콜백 함수에서 받은 데이터:", data);
// });

module.exports = { fetchData };
