# Learning Pathways Application for English Educators

A comprehensive 6-month Teacher Training Program Application that enables seamless planning, tracking, and delivery of educational content with CEFR integration, assessment capabilities, and database persistence.

## 🚀 Features

### Core Functionality
- **Multi-Role User Management**: Admin, Trainer, Participant, and Client roles
- **Interactive Pathway Builder**: Drag-and-drop timeline with visual learning journey
- **Workshop Planning**: Detailed hourly agenda breakdown with resource management
- **Progress Tracking**: Real-time participant monitoring and analytics
- **CEFR Integration**: Complete Common European Framework implementation
- **Pre-Program Assessment**: Proficiency evaluation with adaptive pathways

### Advanced Features
- **Certificate Generation**: Automated certificate creation with verification codes
- **Personalized Reports**: Detailed impact measurement and gap analysis
- **Feedback System**: Multi-touchpoint feedback collection and analytics
- **Database Integration**: Full Supabase integration for data persistence
- **Editable Branding**: Customizable portal name and colors

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context + Custom Hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learning-pathways-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `.env` file with your credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run database migrations**
   - In your Supabase dashboard, go to SQL Editor
   - Run the migration file: `supabase/migrations/create_initial_schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄 Database Schema

The application uses the following main tables:
- `users` - User management with role-based access
- `pathways` - Learning pathway definitions
- `learning_events` - Individual learning activities
- `participants` - Enrollment and progress tracking
- `assessments` - CEFR assessment results
- `certificates` - Generated certificates
- `feedback_responses` - Feedback collection

## 🎯 Usage

### For Administrators
1. **Create Learning Pathways**: Design 6-month training programs
2. **Manage Users**: Add trainers and participants
3. **Monitor Progress**: Track completion rates and engagement
4. **Generate Reports**: Export detailed analytics

### For Trainers
1. **Plan Workshops**: Create detailed hourly agendas
2. **Manage Resources**: Upload materials and handouts
3. **Track Participants**: Monitor individual progress
4. **Collect Feedback**: Gather session evaluations

### For Participants
1. **Take Assessments**: Complete CEFR proficiency evaluation
2. **Follow Pathways**: Progress through learning activities
3. **Submit Work**: Complete assignments and assessments
4. **Receive Certificates**: Download completion certificates

## 🔧 Configuration

### Branding Customization
- Click the edit icon next to the portal name in the header
- Modify colors through the BrandingContext
- Upload custom logos (feature ready for implementation)

### CEFR Levels
The application supports all 6 CEFR levels:
- **A1-A2**: Beginner (Basic User)
- **B1-B2**: Intermediate (Independent User)
- **C1-C2**: Advanced (Proficient User)

## 🚀 Deployment

### Supabase Hosting
1. Build the application: `npm run build`
2. Deploy to your preferred hosting platform
3. Set environment variables in your hosting platform
4. Ensure Supabase RLS policies are properly configured

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Features Overview

### Learning Event Types
- **Workshops/CBTs**: Full-day detailed schedules
- **eLearning Modules**: Self-paced online content
- **Assessments**: Quizzes, tests, and evaluations
- **Assignments**: Upload-based and reflective tasks
- **Group Activities**: Collaborative learning
- **Checkpoints**: Progress evaluations

### Reporting Capabilities
- **Attendance Tracking**: Workshop and online event participation
- **Completion Analytics**: Module and pathway completion rates
- **Engagement Metrics**: User activity and interaction data
- **CEFR Progress**: Language proficiency advancement
- **Impact Measurement**: Teaching effectiveness improvements

## 🔒 Security

- **Row Level Security**: Supabase RLS policies for data protection
- **Role-Based Access**: Granular permissions by user role
- **Data Validation**: Input sanitization and validation
- **Secure Authentication**: Supabase Auth integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the database schema
- Examine the component structure
- Test with sample data

## 🔄 Updates

The application is designed for continuous improvement with:
- Modular component architecture
- Extensible database schema
- Configurable assessment system
- Scalable reporting framework