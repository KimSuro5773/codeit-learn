// fetchMock.js

async function fetchUserData(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "HTTP 에러");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

module.exports = { fetchUserData };
