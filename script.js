import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('TARGET_PLACEHOLDER');
  // Adjust sleep to simulate think time between requests
  sleep(1);
}