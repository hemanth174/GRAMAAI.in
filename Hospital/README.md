# GRAMAAI Hospital Management System

A comprehensive hospital management system built with React, featuring appointment scheduling, doctor management, patient tracking, and analytics.

## Features

### 🏥 Core Functionality
- **Appointment Management**: Create, view, edit, and manage patient appointments
- **Doctor Management**: Add, edit, and manage hospital staff and doctors
- **Document Review**: Handle patient documents and medical records
- **Patient Tracking**: Monitor patient status and appointment history

### 📊 Analytics & Insights
- **Dashboard Overview**: Real-time statistics and key metrics
- **Visual Analytics**: Charts and graphs for appointment trends
- **Performance Metrics**: Confirmation rates, workload distribution
- **Monthly Trends**: Track appointment patterns over time

### 💬 Communication
- **Broadcast Messages**: Send notifications to patients and staff
- **Message Templates**: Pre-built templates for common communications
- **Recipient Targeting**: Send messages to specific patient groups

### 👤 User Management
- **Profile Settings**: Manage user account information
- **Role-based Access**: Different permissions for different user types
- **Account Security**: Password management and security settings

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/           # React components
│   ├── appointments/     # Appointment-related components
│   ├── ui/              # Reusable UI components
│   └── ...              # Other page components
├── api/                 # API client and data management
├── utils/               # Utility functions
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## Key Components

### Appointment Management
- **Dashboard**: Overview of all appointments with filtering and search
- **AppointmentCard**: Individual appointment display with status indicators
- **AppointmentDetail**: Detailed view with editing capabilities
- **AppointmentFormDialog**: Modal for creating new appointments

### Doctor Management
- **DoctorManagement**: CRUD operations for hospital staff
- **Doctor Cards**: Visual representation of doctor information
- **Specialty Management**: Organize doctors by medical specialties

### Analytics
- **Insights**: Comprehensive analytics dashboard
- **Charts**: Visual representation of appointment data
- **Metrics**: Key performance indicators

## API Integration

The application uses a mock API client (`base44Client.js`) that simulates backend functionality. In a production environment, replace this with actual API calls to your backend service.

### Mock Data Structure

```javascript
// Appointments
{
  id: string,
  patient_name: string,
  patient_phone: string,
  patient_email: string,
  symptoms: string,
  requested_doctor: string,
  appointment_time: string,
  priority: 'low' | 'medium' | 'high' | 'emergency',
  status: 'pending' | 'confirmed' | 'rejected' | 'documents_requested',
  staff_notes: string,
  document_urls: string[]
}

// Doctors
{
  id: string,
  name: string,
  specialty: string,
  email: string,
  phone: string,
  bio: string
}
```

## Customization

### Styling
- Modify `tailwind.config.js` for custom theme colors
- Update `src/index.css` for global styles
- Component-specific styles are co-located with components

### Adding New Features
1. Create new components in the appropriate directory
2. Add routes in `App.jsx`
3. Update navigation in `Layout.jsx`
4. Add API methods in `base44Client.js`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ for healthcare professionals
