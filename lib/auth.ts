export interface AuthResponse {
  status: boolean
  message: string
  data: {
    token: string
  }
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginData {
  email: string
  password: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Registration failed')
  }

  return response.json()
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  const responseData = await response.json()
  console.log('Login response data:', responseData)

  if (!responseData.status) {
    throw new Error(responseData.message || 'Email atau password salah')
  }

  return responseData
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
