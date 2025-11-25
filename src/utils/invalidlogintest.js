import http from "k6/http";
import { sleep } from "k6";
// Whn you run this test, the load test will simulate multiple users trying to log in with valid/invalid credentials to test the server's handling of such scenarios
export let options = {
  stages: [
    { duration: "10s", target: 50 },    // ramp-up to 50 users
    { duration: "20s", target: 200 },   // ramp-up to 200 users
    { duration: "30s", target: 500 },   // ramp-up to 500 users
    { duration: "10s", target: 0 },     // ramp-down
  ],
};

export default function () {
  const email = `test1@test1.com`;  
  const payload = JSON.stringify({
    emailId: email,
    password: "Test1@123"
  });

  const params = {
    headers: { "Content-Type": "application/json" },
    timeout: "60s"
  };

  http.post("http://localhost:3000/login", payload, params);

  sleep(0.1); // Avoid too aggressive flooding
}
