export interface Bus {
  id: string
  name: string
  operatorName: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  seatsAvailable: number
  totalSeats: number
  amenities: string[]
  busType: string
  rating: number
}

export interface Seat {
  id: string
  number: string
  type: "regular" | "sleeper"
  status: "available" | "booked" | "selected"
  price: number
}

export interface TrackingBus {
  id: string
  busNumber: string
  busName: string
  route: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  currentLocation: string
  status: "On Time" | "Delayed" | "En Route" | "Completed"
  delay: number
  eta: string
  progress: number
  driverName: string
  driverPhone: string
  coordinates: { lat: number; lng: number }
}

export interface Booking {
  id: string
  busId: string
  busName: string
  operatorName: string
  bookingDate: string
  travelDate: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  seats: string[]
  totalAmount: number
  status: "Upcoming" | "Completed" | "Cancelled"
  passengerName: string
  busNumber: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "alert"
  date: string
  read: boolean
  recipientRole?: "passenger" | "driver" | "all"
}

export interface Feedback {
  id: string
  passengerId: string
  passengerName: string
  bookingId: string
  subject: string
  message: string
  category: "Service" | "Driver" | "Bus Condition" | "Booking" | "Other"
  status: "Pending" | "In Progress" | "Resolved"
  date: string
  adminNotes?: string
}

export interface DriverTrip {
  id: string
  tripDate: string
  route: string
  from: string
  to: string
  busNumber: string
  busName: string
  departureTime: string
  arrivalTime: string
  status: "Scheduled" | "In Progress" | "Completed"
  passengers: number
}

export interface UserAccount {
  id: string
  name: string
  email: string
  phone: string
  role: "passenger" | "driver"
  status: "Active" | "Suspended"
  joinDate: string
  totalBookings?: number
  totalTrips?: number
}

export const mockBookings: Booking[] = [
  {
    id: "BT8X9Y2Z1A",
    busId: "1",
    busName: "Express 101",
    operatorName: "Metro Travels",
    bookingDate: "2025-01-05",
    travelDate: "2025-01-20",
    from: "City A",
    to: "City B",
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    seats: ["12", "13"],
    totalAmount: 90,
    status: "Upcoming",
    passengerName: "John Doe",
    busNumber: "MH12AB1234",
  },
  {
    id: "BT7W6V5U4T",
    busId: "2",
    busName: "Comfort Plus",
    operatorName: "Royal Express",
    bookingDate: "2025-01-10",
    travelDate: "2025-01-25",
    from: "City B",
    to: "City C",
    departureTime: "08:30 AM",
    arrivalTime: "04:00 PM",
    seats: ["8"],
    totalAmount: 55,
    status: "Upcoming",
    passengerName: "John Doe",
    busNumber: "MH14CD5678",
  },
  {
    id: "BT3R2E1D0C",
    busId: "3",
    busName: "Super Deluxe",
    operatorName: "Prime Coaches",
    bookingDate: "2024-12-15",
    travelDate: "2024-12-28",
    from: "City A",
    to: "City D",
    departureTime: "10:00 AM",
    arrivalTime: "05:30 PM",
    seats: ["5", "6"],
    totalAmount: 130,
    status: "Completed",
    passengerName: "John Doe",
    busNumber: "MH16EF9012",
  },
  {
    id: "BT9P8L7K6J",
    busId: "4",
    busName: "Night Rider",
    operatorName: "Moonlight Travels",
    bookingDate: "2024-11-20",
    travelDate: "2024-11-25",
    from: "City C",
    to: "City A",
    departureTime: "11:00 PM",
    arrivalTime: "07:00 AM",
    seats: ["15"],
    totalAmount: 50,
    status: "Cancelled",
    passengerName: "John Doe",
    busNumber: "MH18GH3456",
  },
]

export const trackingBuses: TrackingBus[] = [
  {
    id: "1",
    busNumber: "MH12AB1234",
    busName: "Express 101",
    route: "City A to City B",
    from: "City A",
    to: "City B",
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    currentLocation: "Highway 45, Near Rest Stop",
    status: "On Time",
    delay: 0,
    eta: "02:00 PM",
    progress: 45,
    driverName: "John Smith",
    driverPhone: "+1 234-567-8900",
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  {
    id: "2",
    busNumber: "MH14CD5678",
    busName: "Comfort Plus",
    route: "City B to City C",
    from: "City B",
    to: "City C",
    departureTime: "08:30 AM",
    arrivalTime: "04:00 PM",
    currentLocation: "City B Central Station",
    status: "Delayed",
    delay: 15,
    eta: "04:15 PM",
    progress: 65,
    driverName: "Sarah Johnson",
    driverPhone: "+1 234-567-8901",
    coordinates: { lat: 37.8044, lng: -122.2712 },
  },
  {
    id: "3",
    busNumber: "MH16EF9012",
    busName: "Super Deluxe",
    route: "City A to City D",
    from: "City A",
    to: "City D",
    departureTime: "10:00 AM",
    arrivalTime: "05:30 PM",
    currentLocation: "Approaching City D Terminal",
    status: "En Route",
    delay: 0,
    eta: "05:30 PM",
    progress: 90,
    driverName: "Michael Brown",
    driverPhone: "+1 234-567-8902",
    coordinates: { lat: 37.6879, lng: -122.4702 },
  },
]

export const mockBuses: Bus[] = [
  {
    id: "1",
    name: "Express 101",
    operatorName: "Metro Travels",
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    duration: "8h 0m",
    price: 45,
    seatsAvailable: 12,
    totalSeats: 40,
    amenities: ["AC", "WiFi", "Charging Port", "Water"],
    busType: "AC Seater",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Comfort Plus",
    operatorName: "Royal Express",
    departureTime: "08:30 AM",
    arrivalTime: "04:00 PM",
    duration: "7h 30m",
    price: 55,
    seatsAvailable: 8,
    totalSeats: 36,
    amenities: ["AC", "WiFi", "Charging Port", "Water", "Snacks"],
    busType: "AC Sleeper",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Super Deluxe",
    operatorName: "Prime Coaches",
    departureTime: "10:00 AM",
    arrivalTime: "05:30 PM",
    duration: "7h 30m",
    price: 65,
    seatsAvailable: 15,
    totalSeats: 32,
    amenities: ["AC", "WiFi", "Charging Port", "Water", "Snacks", "Blanket"],
    busType: "Volvo Multi-Axle",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Night Rider",
    operatorName: "Moonlight Travels",
    departureTime: "11:00 PM",
    arrivalTime: "07:00 AM",
    duration: "8h 0m",
    price: 50,
    seatsAvailable: 20,
    totalSeats: 40,
    amenities: ["AC", "Charging Port", "Water", "Blanket"],
    busType: "AC Sleeper",
    rating: 4.3,
  },
]

export function generateSeats(busId: string, totalSeats: number): Seat[] {
  const seats: Seat[] = []
  const bookedSeats = Math.floor(Math.random() * 10) + 5

  for (let i = 1; i <= totalSeats; i++) {
    seats.push({
      id: `${busId}-${i}`,
      number: `${i}`,
      type: i % 5 === 0 ? "sleeper" : "regular",
      status: i <= bookedSeats ? "booked" : "available",
      price: i % 5 === 0 ? 65 : 45,
    })
  }

  return seats
}

export const mockNotifications: Notification[] = [
  {
    id: "N001",
    title: "Trip Reminder",
    message: "Your trip to City B is scheduled for tomorrow at 06:00 AM",
    type: "info",
    date: "2025-01-19",
    read: false,
    recipientRole: "passenger",
  },
  {
    id: "N002",
    title: "New Route Available",
    message: "We've added a new express route from City A to City E",
    type: "success",
    date: "2025-01-18",
    read: true,
    recipientRole: "all",
  },
  {
    id: "N003",
    title: "Maintenance Schedule",
    message: "Bus MH12AB1234 is scheduled for maintenance on Jan 22",
    type: "warning",
    date: "2025-01-17",
    read: false,
    recipientRole: "driver",
  },
  {
    id: "N004",
    title: "Payment Successful",
    message: "Your payment of $90 has been confirmed for booking BT8X9Y2Z1A",
    type: "success",
    date: "2025-01-15",
    read: true,
    recipientRole: "passenger",
  },
]

export const mockFeedback: Feedback[] = [
  {
    id: "FB001",
    passengerId: "P001",
    passengerName: "John Doe",
    bookingId: "BT8X9Y2Z1A",
    subject: "Late departure",
    message: "The bus departed 20 minutes late from City A terminal",
    category: "Service",
    status: "Resolved",
    date: "2025-01-10",
    adminNotes: "Contacted driver, issued warning. Route timing adjusted.",
  },
  {
    id: "FB002",
    passengerId: "P002",
    passengerName: "Jane Smith",
    bookingId: "BT7W6V5U4T",
    subject: "AC not working",
    message: "The air conditioning was not functioning properly during the trip",
    category: "Bus Condition",
    status: "In Progress",
    date: "2025-01-12",
    adminNotes: "Bus scheduled for AC repair on Jan 15",
  },
  {
    id: "FB003",
    passengerId: "P003",
    passengerName: "Mike Johnson",
    bookingId: "BT3R2E1D0C",
    subject: "Excellent service",
    message: "Driver was very professional and the journey was comfortable",
    category: "Driver",
    status: "Resolved",
    date: "2025-01-08",
    adminNotes: "Commendation added to driver's record",
  },
]

export const mockDriverTrips: DriverTrip[] = [
  {
    id: "DT001",
    tripDate: "2025-01-20",
    route: "City A - City B",
    from: "City A",
    to: "City B",
    busNumber: "MH12AB1234",
    busName: "Express 101",
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    status: "Scheduled",
    passengers: 28,
  },
  {
    id: "DT002",
    tripDate: "2025-01-19",
    route: "City B - City A",
    from: "City B",
    to: "City A",
    busNumber: "MH12AB1234",
    busName: "Express 101",
    departureTime: "03:00 PM",
    arrivalTime: "11:00 PM",
    status: "In Progress",
    passengers: 32,
  },
  {
    id: "DT003",
    tripDate: "2025-01-18",
    route: "City A - City B",
    from: "City A",
    to: "City B",
    busNumber: "MH12AB1234",
    busName: "Express 101",
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    status: "Completed",
    passengers: 35,
  },
]

export const mockUserAccounts: UserAccount[] = [
  {
    id: "U001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234-567-8900",
    role: "passenger",
    status: "Active",
    joinDate: "2024-06-15",
    totalBookings: 12,
  },
  {
    id: "U002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234-567-8901",
    role: "passenger",
    status: "Active",
    joinDate: "2024-08-20",
    totalBookings: 8,
  },
  {
    id: "U003",
    name: "John Smith",
    email: "john.smith.driver@example.com",
    phone: "+1 234-567-8902",
    role: "driver",
    status: "Active",
    joinDate: "2023-03-10",
    totalTrips: 145,
  },
  {
    id: "U004",
    name: "Sarah Johnson",
    email: "sarah.johnson.driver@example.com",
    phone: "+1 234-567-8903",
    role: "driver",
    status: "Active",
    joinDate: "2023-07-22",
    totalTrips: 128,
  },
]
