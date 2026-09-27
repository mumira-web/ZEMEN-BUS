# Bus Tracking & Ticketing System (BTTS) - Complete Implementation Guide

## PART 1: PROJECT STRUCTURE SETUP

### Step 1: Create Project Folders

```bash
# Open terminal and create main project folder
mkdir BTTS
cd BTTS

# Create backend and frontend folders
mkdir backend
mkdir frontend

# Your folder structure should look like:
# BTTS/
#   ├── backend/          (Django + DRF)
#   ├── frontend/         (React + Tailwind)
#   └── README.md
```

---

## PART 2: BACKEND SETUP (Django + DRF)

### Step 2a: Set Up Python Virtual Environment

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (Python 3.10+)
python -m venv env

# Activate virtual environment
# On Windows:
env\Scripts\activate
# On macOS/Linux:
source env/bin/activate

# You should see (env) in your terminal
```

### Step 2b: Install Django Dependencies

```bash
# Make sure virtual environment is activated (env) prefix visible

# Install required packages
pip install django==4.2
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.2.0
pip install djangorestframework-simplejwt==5.3.2
pip install psycopg2-binary==2.9.7
pip install python-dotenv==1.0.0
pip install pillow==10.0.0

# Create requirements.txt for future reference
pip freeze > requirements.txt
```

### Step 2c: Create Django Project

```bash
# Create Django project
django-admin startproject config .

# Create Django apps
python manage.py startapp users
python manage.py startapp buses
python manage.py startapp bookings
python manage.py startapp drivers
python manage.py startapp tracking
python manage.py startapp notifications
python manage.py startapp feedback

# Your backend structure should now be:
# backend/
#   ├── env/                    (virtual environment)
#   ├── config/                 (main settings)
#   │   ├── settings.py
#   │   ├── urls.py
#   │   └── wsgi.py
#   ├── users/                  (user app)
#   ├── buses/                  (bus app)
#   ├── bookings/               (booking app)
#   ├── drivers/                (driver app)
#   ├── tracking/               (GPS tracking app)
#   ├── notifications/          (notifications app)
#   ├── feedback/               (feedback app)
#   ├── manage.py
#   └── requirements.txt
```

### Step 2d: Configure PostgreSQL Connection

```bash
# Install PostgreSQL locally or use it via Docker
# For Windows/Mac: Download from postgresql.org

# After PostgreSQL is installed, create database
psql -U postgres

# In psql terminal:
CREATE DATABASE btts_db;
CREATE USER btts_user WITH PASSWORD 'btts_password_123';
ALTER ROLE btts_user SET client_encoding TO 'utf8';
ALTER ROLE btts_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE btts_user SET default_transaction_deferrable TO on;
ALTER ROLE btts_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE btts_db TO btts_user;
\q

# Note: Save these credentials - you'll need them in settings.py
```

### Step 2e: Update Django Settings

Edit `backend/config/settings.py`:

```python
import os
from datetime import timedelta
from pathlib import Path

# ... existing code ...

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'btts_db',
        'USER': 'btts_user',
        'PASSWORD': 'btts_password_123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'buses',
    'bookings',
    'drivers',
    'tracking',
    'notifications',
    'feedback',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': 'your-secret-key-change-in-production',
}

AUTH_USER_MODEL = 'users.CustomUser'
```

### Step 2f: Create Django Models

Create `backend/users/models.py`:

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('passenger', 'Passenger'),
        ('driver', 'Driver'),
        ('admin', 'Administrator'),
    )
    
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='passenger')
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_suspended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} - {self.role}"

class Driver(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('on_duty', 'On Duty'),
        ('offline', 'Offline'),
    )
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    license_number = models.CharField(max_length=50, unique=True)
    license_expiry = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offline')
    rating = models.FloatField(default=5.0)
    total_trips = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Driver: {self.user.username}"
```

Create `backend/buses/models.py`:

```python
from django.db import models

class Bus(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('maintenance', 'Maintenance'),
        ('inactive', 'Inactive'),
    )
    
    bus_number = models.CharField(max_length=50, unique=True)
    capacity = models.IntegerField()
    model = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100, default='Express Bus')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    registration_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.bus_number} - {self.model}"

class Route(models.Model):
    start_location = models.CharField(max_length=100)
    end_location = models.CharField(max_length=100)
    distance_km = models.IntegerField()
    estimated_duration_hours = models.IntegerField()
    fare_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.start_location} → {self.end_location}"

class Schedule(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    journey_date = models.DateField()
    available_seats = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.bus.bus_number} - {self.journey_date}"
```

Create `backend/bookings/models.py`:

```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Booking(models.Model):
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    passenger = models.ForeignKey(User, on_delete=models.CASCADE)
    schedule = models.ForeignKey('buses.Schedule', on_delete=models.CASCADE)
    seats = models.CharField(max_length=100)  # e.g., "1,2,3"
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    booking_date = models.DateTimeField(auto_now_add=True)
    qr_code = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return f"Booking #{self.id} - {self.passenger.username}"
```

Create `backend/tracking/models.py`:

```python
from django.db import models

class GPSTracking(models.Model):
    schedule = models.ForeignKey('buses.Schedule', on_delete=models.CASCADE)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField(auto_now_add=True)
    speed_kmh = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"GPS - Schedule {self.schedule.id}"
```

### Step 2g: Create Serializers

Create `backend/users/serializers.py`:

```python
from rest_framework import serializers
from .models import CustomUser, Driver

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number']

class DriverSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Driver
        fields = ['id', 'user', 'license_number', 'status', 'rating', 'total_trips']
```

Create `backend/buses/serializers.py`:

```python
from rest_framework import serializers
from .models import Bus, Route, Schedule

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    bus = BusSerializer(read_only=True)
    route = RouteSerializer(read_only=True)
    
    class Meta:
        model = Schedule
        fields = '__all__'
```

### Step 2h: Create API Views

Create `backend/buses/views.py`:

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Bus, Route, Schedule
from .serializers import BusSerializer, RouteSerializer, ScheduleSerializer

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    
    @action(detail=False, methods=['get'])
    def active_buses(self, request):
        buses = Bus.objects.filter(status='active')
        serializer = self.get_serializer(buses, many=True)
        return Response(serializer.data)

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        start = request.query_params.get('start')
        end = request.query_params.get('end')
        date = request.query_params.get('date')
        
        schedules = Schedule.objects.filter(
            route__start_location=start,
            route__end_location=end,
            journey_date=date
        )
        serializer = self.get_serializer(schedules, many=True)
        return Response(serializer.data)
```

### Step 2i: Set Up URLs

Create `backend/config/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from buses.views import BusViewSet, RouteViewSet, ScheduleViewSet

router = DefaultRouter()
router.register(r'buses', BusViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'schedules', ScheduleViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]
```

### Step 2j: Initialize Database

```bash
# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin
python manage.py createsuperuser
# Enter username: admin
# Enter email: admin@example.com
# Enter password: admin123

# Create sample data (optional)
python manage.py shell
# In shell:
from buses.models import Bus, Route, Schedule
from django.utils import timezone
from datetime import date, time

bus = Bus.objects.create(
    bus_number="BUS-001",
    capacity=50,
    model="Volvo B7R",
    company_name="Express Bus"
)

route = Route.objects.create(
    start_location="Addis Ababa",
    end_location="Dire Dawa",
    distance_km=515,
    estimated_duration_hours=8,
    fare_amount=500.00
)

schedule = Schedule.objects.create(
    bus=bus,
    route=route,
    departure_time=time(8, 0),
    arrival_time=time(16, 0),
    journey_date=date.today(),
    available_seats=50
)

exit()
```

### Step 2k: Run Backend Server

```bash
# Make sure virtual environment is activated
# Run development server
python manage.py runserver

# You should see:
# Starting development server at http://127.0.0.1:8000/
# Visit: http://127.0.0.1:8000/api/
```

---

## PART 3: FRONTEND SETUP (React + Tailwind)

### Step 3a: Create React App

```bash
# Go back to main BTTS folder
cd ../

# Create React app with Vite (faster than create-react-app)
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install

# Install additional packages
npm install -D tailwindcss postcss autoprefixer
npm install axios react-router-dom leaflet
npm install -D tailwindcss postcss autoprefixer
```

### Step 3b: Configure Tailwind CSS

```bash
# Initialize Tailwind
npx tailwindcss init -p

# This creates:
# - tailwind.config.js
# - postcss.config.js
```

Edit `frontend/tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edit `frontend/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 3c: Create Project Structure

```bash
# In frontend directory, create folders
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/context

# Your frontend structure should be:
# frontend/
#   ├── src/
#   │   ├── components/    (React components)
#   │   ├── pages/         (Page components)
#   │   ├── services/      (API calls)
#   │   ├── hooks/         (Custom hooks)
#   │   ├── context/       (Auth context)
#   │   ├── App.jsx
#   │   └── index.css
#   ├── public/
#   ├── package.json
#   └── vite.config.js
```

### Step 3d: Create API Service

Create `frontend/src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API Service functions
export const authService = {
    login: (username, password) =>
        api.post('/token/', { username, password }),
    refreshToken: (refresh) =>
        api.post('/token/refresh/', { refresh }),
    getUser: () =>
        api.get('/users/me/'),
};

export const busService = {
    getActiveBuses: () =>
        api.get('/buses/active_buses/'),
    searchSchedules: (start, end, date) =>
        api.get('/schedules/search/', {
            params: { start, end, date },
        }),
    getScheduleDetail: (id) =>
        api.get(`/schedules/${id}/`),
};

export const bookingService = {
    createBooking: (data) =>
        api.post('/bookings/', data),
    getMyBookings: () =>
        api.get('/bookings/my_bookings/'),
    cancelBooking: (id) =>
        api.delete(`/bookings/${id}/`),
};

export const trackingService = {
    getBusLocation: (scheduleId) =>
        api.get(`/tracking/schedule/${scheduleId}/`),
};

export default api;
```

### Step 3e: Create Auth Context

Create `frontend/src/context/AuthContext.jsx`:

```javascript
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('access_token');
        if (token) {
            authService.getUser()
                .then((res) => setUser(res.data))
                .catch(() => localStorage.removeItem('access_token'));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await authService.login(username, password);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        const userRes = await authService.getUser();
        setUser(userRes.data);
        return userRes.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
```

### Step 3f: Create React Components

Create `frontend/src/components/LoginForm.jsx`:

```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await login(username, password);
            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (user.role === 'driver') {
                navigate('/driver-dashboard');
            } else {
                navigate('/passenger-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">BTTS Login</h1>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="mt-4 text-sm text-gray-600">
                    <p className="font-bold">Demo Credentials:</p>
                    <p>Passenger: passenger / pass123</p>
                    <p>Driver: driver / pass123</p>
                    <p>Admin: admin / admin123</p>
                </div>
            </form>
        </div>
    );
}
```

Create `frontend/src/components/BusSearch.jsx`:

```javascript
import { useState } from 'react';
import { busService } from '../services/api';

export default function BusSearch() {
    const [formData, setFormData] = useState({
        start: '',
        end: '',
        date: '',
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await busService.searchSchedules(
                formData.start,
                formData.end,
                formData.date
            );
            setResults(data.data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-indigo-600">Search Buses</h2>
                
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="From (City)"
                        value={formData.start}
                        onChange={(e) => setFormData({...formData, start: e.target.value})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="To (City)"
                        value={formData.end}
                        onChange={(e) => setFormData({...formData, end: e.target.value})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        required
                    />
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {results.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {results.map((schedule) => (
                        <div key={schedule.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-600">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-bold">{schedule.bus.bus_number}</p>
                                    <p className="text-gray-600">
                                        {schedule.departure_time} → {schedule.arrival_time}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Available Seats: {schedule.available_seats}
                                    </p>
                                </div>
                                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {results.length === 0 && !loading && (
                <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-600">
                    No buses found. Try adjusting your search criteria.
                </div>
            )}
        </div>
    );
}
```

Create `frontend/src/components/TrackingMap.jsx`:

```javascript
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { trackingService } from '../services/api';
import 'leaflet/dist/leaflet.css';

export default function TrackingMap({ scheduleId }) {
    const [map, setMap] = useState(null);
    const [busLocation, setBusLocation] = useState(null);

    useEffect(() => {
        // Initialize map
        const mapInstance = L.map('map').setView([9.0320, 38.7469], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(mapInstance);

        setMap(mapInstance);

        // Fetch bus location
        const fetchLocation = async () => {
            try {
                const response = await trackingService.getBusLocation(scheduleId);
                setBusLocation(response.data);
                
                // Add marker for bus
                L.marker(
                    [response.data.latitude, response.data.longitude],
                    {
                        icon: L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            shadowSize: [41, 41],
                            popupAnchor: [1, -34],
                        }),
                    }
                )
                .bindPopup('Bus Location')
                .addTo(mapInstance);
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        fetchLocation();

        // Refresh location every 5 seconds
        const interval = setInterval(fetchLocation, 5000);

        return () => {
            clearInterval(interval);
            mapInstance.remove();
        };
    }, [scheduleId]);

    return (
        <div>
            <div id="map" style={{ height: '500px' }} className="rounded-lg shadow-lg"></div>
            {busLocation && (
                <div className="mt-4 bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">
                        Speed: {busLocation.speed_kmh} km/h
                    </p>
                    <p className="text-sm text-gray-600">
                        Last Updated: {new Date(busLocation.timestamp).toLocaleTimeString()}
                    </p>
                </div>
            )}
        </div>
    );
}
```

### Step 3g: Create App Router

Create `frontend/src/App.jsx`:

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import BusSearch from './components/BusSearch';
import TrackingMap from './components/TrackingMap';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    
                    <Route
                        path="/passenger-dashboard"
                        element={
                            <ProtectedRoute>
                                <BusSearch />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/track/:scheduleId"
                        element={
                            <ProtectedRoute>
                                <TrackingMap scheduleId={1} />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
```

### Step 3h: Run Frontend

```bash
# Make sure you're in frontend directory
npm run dev

# You should see:
# VITE v4.x.x ready in xxx ms
# ➜ Local: http://localhost:5173/
# ➜ Press q to quit
```

---

## PART 4: RUN COMPLETE SYSTEM

### Running Everything Together

**Terminal 1 - Backend:**
```bash
cd backend
source env/bin/activate  # or env\Scripts\activate on Windows
python manage.py runserver
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Terminal 3 - Database:**
```bash
# Make sure PostgreSQL is running
# Windows: Services > PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

---

## PART 5: DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│  React Component (frontend/src/components/BusSearch.jsx) │
│  └─> User enters: From, To, Date                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Call
                     ↓
┌─────────────────────────────────────────────────────────┐
│  API Service (frontend/src/services/api.js)             │
│  └─> Sends GET request to /api/schedules/search/        │
└────────────────────┬────────────────────────────────────┘
                     │
    HTTP REQUEST (with JWT Token)
                     │
┌────────────────────↓────────────────────────────────────┐
│  Django Backend (localhost:8000)                        │
│                                                          │
│  1. URL Router (config/urls.py)                         │
│     └─> Matches /api/schedules/search/                  │
│                                                          │
│  2. ViewSet (buses/views.py)                            │
│     └─> Calls search() method                           │
│                                                          │
│  3. ORM Query                                           │
│     └─> Schedule.objects.filter(...)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Database Query
                     ↓
┌─────────────────────────────────────────────────────────┐
│  PostgreSQL Database                                    │
│                                                          │
│  SELECT * FROM buses_schedule                           │
│  WHERE route.start_location = 'Addis Ababa'            │
│  AND route.end_location = 'Dire Dawa'                  │
│  AND journey_date = '2024-01-15'                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Query Results
                     ↓
┌────────────────────────────────────────────────────────┐
│  Django Serializer (buses/serializers.py)              │
│  └─> Converts QuerySet to JSON                         │
└────────────────────┬────────────────────────────────────┘
                     │
         HTTP RESPONSE (JSON)
                     │
┌────────────────────↓────────────────────────────────────┐
│  React Component                                        │
│  └─> Receives data & renders bus list                  │
│  └─> User clicks "Book Now"                            │
└─────────────────────────────────────────────────────────┘
```

---

## PART 6: TESTING CHECKLIST

### Test Backend
```bash
# Test API endpoints in terminal
curl -X GET http://localhost:8000/api/buses/active_buses/

# Or use Postman/Thunder Client
# POST http://localhost:8000/api/token/
# Body: {"username": "admin", "password": "admin123"}
```

### Test Frontend
- Navigate to http://localhost:5173/
- Login with: username=admin, password=admin123
- Search for buses
- Verify API calls in browser DevTools (F12)

---

## PART 7: TROUBLESHOOTING

### Backend Issues
```bash
# Port 8000 already in use
python manage.py runserver 8001

# Database connection error
# Check PostgreSQL is running: psql -U postgres

# Migrations not applied
python manage.py makemigrations && python manage.py migrate

# CORS errors
# Make sure CORS_ALLOWED_ORIGINS includes http://localhost:5173
```

### Frontend Issues
```bash
# Port 5173 in use
npm run dev -- --port 5174

# API 404 errors
# Check backend is running on port 8000

# CORS errors in browser console
# Check .env.local has correct API_URL
```

---

## PART 8: DEPLOYMENT NOTES

### For Production (Optional)
```bash
# Backend
python manage.py collectstatic
# Deploy to Heroku, PythonAnywhere, or DigitalOcean

# Frontend
npm run build
# Deploy to Vercel, Netlify, or GitHub Pages
```

---

## NEXT STEPS

1. Follow Parts 1-3 in order
2. Start servers (Part 4)
3. Test login and bus search
4. Add remaining features:
   - Booking creation
   - GPS tracking updates
   - Notifications
   - Feedback system
   - Admin dashboard

Happy coding!
