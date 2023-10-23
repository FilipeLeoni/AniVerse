export async function renewAccessToken(refreshToken: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Refresh ${refreshToken}`,
        },
      }
    );
    const data = await response.json();

    if (response.status === 200 || 201) {
      return data;
    } else {
      console.error("Token renewal failed:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error renewing token:", error);
    return null;
  }
}
