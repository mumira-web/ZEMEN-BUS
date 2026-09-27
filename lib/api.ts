const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Get token from localStorage
export function getAuthToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

// Set token in localStorage
export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

// Remove token from localStorage
export function removeAuthToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
}

// API call with authentication header
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getAuthToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API Error')
  }

  return response.json()
}

// ===== AUTH API =====
export async function registerUser(
  email: string,
  password: string,
  name: string,
  phone: string,
  role: 'passenger' | 'driver' | 'admin' = 'passenger'
) {
  return authenticatedFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, phone, role }),
  })
}

export async function loginUser(email: string, password: string) {
  const data = await authenticatedFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  
  if (data.token) {
    setAuthToken(data.token)
  }
  
  return data
}

export async function getCurrentUser() {
  return authenticatedFetch('/auth/me')
}

// ===== BUS API =====
export async function getBuses(filters?: {
  startLocation?: string
  endLocation?: string
  date?: string
}) {
  const params = new URLSearchParams()
  if (filters?.startLocation) params.append('start', filters.startLocation)
  if (filters?.endLocation) params.append('end', filters.endLocation)
  if (filters?.date) params.append('date', filters.date)

  const queryString = params.toString()
  const endpoint = `/buses${queryString ? `?${queryString}` : ''}`
  
  return authenticatedFetch(endpoint)
}

export async function getBusById(busId: string | number) {
  return authenticatedFetch(`/buses/${busId}`)
}

export async function getBusLocation(busId: string | number) {
  return authenticatedFetch(`/buses/${busId}/location`)
}

export async function updateBusLocation(
  busId: string | number,
  latitude: number,
  longitude: number
) {
  return authenticatedFetch(`/buses/${busId}/location`, {
    method: 'PUT',
    body: JSON.stringify({ latitude, longitude }),
  })
}

export async function createBus(
  busNumber: string,
  capacity: number,
  companyName: string
) {
  return authenticatedFetch('/buses', {
    method: 'POST',
    body: JSON.stringify({ bus_number: busNumber, capacity, company_name: companyName }),
  })
}

export async function getBusRoute(busId: string | number) {
  return authenticatedFetch(`/buses/${busId}/route`)
}

// ===== BOOKING API =====
export async function getAvailableSeats(scheduleId: string | number) {
  return authenticatedFetch(`/bookings/schedule/${scheduleId}/seats`)
}

export async function createBooking(
  scheduleId: number,
  busId: number,
  seats: number[],
  passengerInfo: {
    fullName: string
    email: string
    phone: string
  },
  totalPrice: number
) {
  return authenticatedFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify({
      schedule_id: scheduleId,
      bus_id: busId,
      seats: seats.join(','),
      full_name: passengerInfo.fullName,
      email: passengerInfo.email,
      phone: passengerInfo.phone,
      total_price: totalPrice,
    }),
  })
}

export async function getUserBookings() {
  return authenticatedFetch('/bookings')
}

export async function getBookingById(bookingId: string | number) {
  return authenticatedFetch(`/bookings/${bookingId}`)
}

export async function cancelBooking(bookingId: string | number) {
  return authenticatedFetch(`/bookings/${bookingId}`, {
    method: 'DELETE',
  })
}

export async function rescheduleBooking(
  bookingId: string | number,
  newScheduleId: number
) {
  return authenticatedFetch(`/bookings/${bookingId}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify({ schedule_id: newScheduleId }),
  })
}

// ===== DRIVER API =====
export async function getDriverTrips() {
  return authenticatedFetch('/drivers/trips')
}

export async function startTrip(tripId: string | number) {
  return authenticatedFetch(`/drivers/trips/${tripId}/start`, {
    method: 'POST',
  })
}

export async function completeTrip(tripId: string | number) {
  return authenticatedFetch(`/drivers/trips/${tripId}/complete`, {
    method: 'POST',
  })
}

export async function cancelTrip(tripId: string | number) {
  return authenticatedFetch(`/drivers/trips/${tripId}/cancel`, {
    method: 'POST',
  })
}

export async function getTripPassengers(tripId: string | number) {
  return authenticatedFetch(`/drivers/trips/${tripId}/passengers`)
}

export async function getDriverProfile() {
  return authenticatedFetch('/drivers/profile')
}

export async function updateDriverProfile(updates: Record<string, any>) {
  return authenticatedFetch('/drivers/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

// ===== FEEDBACK API =====
export async function submitFeedback(
  busId: number,
  rating: number,
  comment: string
) {
  return authenticatedFetch('/feedback', {
    method: 'POST',
    body: JSON.stringify({ bus_id: busId, rating, comment }),
  })
}

export async function getAllFeedback() {
  return authenticatedFetch('/feedback')
}

export async function updateFeedbackStatus(
  feedbackId: number,
  status: 'pending' | 'resolved'
) {
  return authenticatedFetch(`/feedback/${feedbackId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export async function addFeedbackNote(feedbackId: number, note: string) {
  return authenticatedFetch(`/feedback/${feedbackId}/note`, {
    method: 'POST',
    body: JSON.stringify({ admin_note: note }),
  })
}

// ===== NOTIFICATIONS API =====
export async function getUserNotifications() {
  return authenticatedFetch('/notifications')
}

export async function markNotificationAsRead(notificationId: number) {
  return authenticatedFetch(`/notifications/${notificationId}/read`, {
    method: 'PUT',
  })
}

export async function sendNotification(
  userIds: number[],
  message: string,
  type: string
) {
  return authenticatedFetch('/notifications/send', {
    method: 'POST',
    body: JSON.stringify({ user_ids: userIds, message, type }),
  })
}

export async function broadcastNotification(
  role: 'passenger' | 'driver' | 'all',
  message: string
) {
  return authenticatedFetch('/notifications/broadcast', {
    method: 'POST',
    body: JSON.stringify({ role, message }),
  })
}

// ===== ADMIN API =====
export async function getAllUsers(role?: 'passenger' | 'driver') {
  const endpoint = role ? `/admin/users?role=${role}` : '/admin/users'
  return authenticatedFetch(endpoint)
}

export async function suspendUser(userId: number) {
  return authenticatedFetch(`/admin/users/${userId}/suspend`, {
    method: 'PUT',
  })
}

export async function activateUser(userId: number) {
  return authenticatedFetch(`/admin/users/${userId}/activate`, {
    method: 'PUT',
  })
}

export async function getAdminStats() {
  return authenticatedFetch('/admin/stats')
}
