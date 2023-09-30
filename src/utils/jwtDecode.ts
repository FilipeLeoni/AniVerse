import jwtDecode from "jwt-decode";

export default function getExpirationFromToken(token: any) {
  try {
    const decodedToken: any = jwtDecode(token);
    if (decodedToken && decodedToken.exp) {
      const expirationTimestamp = decodedToken.exp;
      const expirationDate = expirationTimestamp * 1000;
      return expirationDate;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
  return null;
}
