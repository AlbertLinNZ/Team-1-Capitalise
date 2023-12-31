import { API_URL } from "./config";
import { S3_API_URL } from "./config";

export async function addAward(
  value: string,
  parameterType: string,
  token: string,
  image: string,
  gradient: string[]
) {
  const resp = await fetch(`${API_URL}/api/parameters`, {
    method: "POST",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      value: value,
      parameterType: parameterType,
      image: image,
      gradient: gradient,
    }),
  });
  return resp.json();
}

export async function uploadAwardImage(award: FormData) {
  const resp = await fetch(`${S3_API_URL}/api/s3/award`, {
    method: "POST",
    body: award,
  }).then((data) => {
    return data.text();
  });
  return resp;
}
