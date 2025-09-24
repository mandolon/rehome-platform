import axios from 'axios'

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000'}${process.env.NEXT_PUBLIC_API_PREFIX || '/api'}`,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

/**
 * Initialize CSRF protection by fetching the CSRF cookie
 */
export async function initCsrf(): Promise<void> {
  await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000'}/sanctum/csrf-cookie`, {
    withCredentials: true,
  })
}

export default axiosInstance