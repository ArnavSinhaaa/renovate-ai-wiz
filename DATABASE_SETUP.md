# Database Setup Guide for Fixfy

This guide will help you set up the database for the Fixfy application to save user-uploaded images and analysis data.

## 🗄️ Database Overview

The Fixfy application uses **Supabase** as the database backend to store:
- User sessions and data
- Uploaded images with metadata
- AI analysis results
- Renovation suggestions
- User activity tracking

## 🚀 Quick Setup

### 1. Database Schema Setup

1. **Access Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in to your account
   - Open your project dashboard

2. **Run the Database Schema**
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the contents of `database-schema.sql`
   - Paste and run the SQL script
   - This will create all necessary tables, indexes, and security policies

### 2. Environment Configuration

Your Supabase configuration is already set up in:
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`

**Current Configuration:**
- **URL**: `https://tbsgqvrfoljyjciflosl.supabase.co`
- **Anon Key**: Already configured
- **Database**: PostgreSQL with Row Level Security (RLS)

### 3. Storage Setup (Optional)

For better image storage, you can set up Supabase Storage:

1. **Enable Storage**
   - Go to **Storage** in your Supabase dashboard
   - Create a new bucket called `user-images`
   - Set it to **Public** for easy access

2. **Update Image Storage** (Optional)
   - Modify `src/services/database.ts` to use Supabase Storage
   - Upload images to storage instead of using object URLs

## 📊 Database Schema

### Tables Created

1. **`users`** - User session management
   - `id` (UUID, Primary Key)
   - `session_id` (Text, Unique)
   - `created_at`, `updated_at` (Timestamps)

2. **`user_images`** - Uploaded images
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key)
   - `image_url` (Text)
   - `image_name`, `image_size`, `image_type` (Metadata)
   - `uploaded_at` (Timestamp)
   - `processed` (Boolean)

3. **`analysis_results`** - AI analysis data
   - `id` (UUID, Primary Key)
   - `user_id`, `image_id` (UUID, Foreign Keys)
   - `detected_objects` (JSONB)
   - `analysis_confidence` (Decimal)
   - `room_type`, `budget_range` (Text)
   - `analysis_completed_at` (Timestamp)

4. **`renovation_suggestions`** - AI suggestions
   - `id` (UUID, Primary Key)
   - `analysis_id` (UUID, Foreign Key)
   - `suggestion_text`, `suggestion_type` (Text)
   - `estimated_cost` (Decimal)
   - `priority_score` (Integer)
   - `is_selected` (Boolean)
   - `created_at` (Timestamp)

5. **`user_sessions`** - Session tracking
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key)
   - `session_data` (JSONB)
   - `last_activity` (Timestamp)
   - `created_at` (Timestamp)

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Session-based authentication** for anonymous users
- **Data isolation** - users can only access their own data
- **Automatic cleanup** - related data is deleted when images are removed

## 🔧 Features Implemented

### ✅ What's Working

1. **Image Upload & Storage**
   - Images are saved to database with metadata
   - Object URLs are generated for immediate display
   - File validation and error handling

2. **AI Analysis Persistence**
   - Analysis results are saved to database
   - Detected objects stored as JSON
   - Confidence scores and room type tracking

3. **User Session Management**
   - Anonymous user sessions with unique IDs
   - Session persistence across browser refreshes
   - Automatic user creation on first upload

4. **Image History**
   - View all uploaded images
   - See analysis status and results
   - Click to reload previous analyses
   - Delete images and related data

5. **Data Relationships**
   - Proper foreign key relationships
   - Cascading deletes for data cleanup
   - Efficient queries with indexes

### 🎯 Usage Examples

```typescript
// Save an image
const savedImage = await saveImage({
  imageUrl: 'blob:...',
  imageName: 'room-photo.jpg',
  imageSize: 1024000,
  imageType: 'image/jpeg'
});

// Save analysis results
const analysis = await saveAnalysis({
  imageId: savedImage.id,
  detectedObjects: [...],
  analysisConfidence: 0.85,
  roomType: 'Living Room'
});

// Get user's images
const images = await getUserImages();
```

## 🔍 Database Queries

### Common Queries

```sql
-- Get user's images with analysis
SELECT ui.*, ar.detected_objects, ar.analysis_confidence
FROM user_images ui
LEFT JOIN analysis_results ar ON ui.id = ar.image_id
WHERE ui.user_id = 'user-uuid'
ORDER BY ui.uploaded_at DESC;

-- Get analysis statistics
SELECT 
  COUNT(*) as total_images,
  COUNT(ar.id) as analyzed_images,
  AVG(ar.analysis_confidence) as avg_confidence
FROM user_images ui
LEFT JOIN analysis_results ar ON ui.id = ar.image_id
WHERE ui.user_id = 'user-uuid';

-- Get recent activity
SELECT ui.image_name, ui.uploaded_at, ar.analysis_completed_at
FROM user_images ui
LEFT JOIN analysis_results ar ON ui.id = ar.image_id
WHERE ui.user_id = 'user-uuid'
ORDER BY ui.uploaded_at DESC
LIMIT 10;
```

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to save image"**
   - Check if user session is initialized
   - Verify database connection
   - Check browser console for errors

2. **"Analysis not saved"**
   - Ensure image was saved first
   - Check if currentImageId is set
   - Verify analysis data format

3. **"Permission denied"**
   - Check RLS policies are enabled
   - Verify session ID is valid
   - Ensure user exists in database

### Debug Steps

1. **Check Database Connection**
   ```typescript
   const { data, error } = await supabase.from('users').select('count');
   console.log('DB Connection:', { data, error });
   ```

2. **Verify User Session**
   ```typescript
   const { user } = useUserSession();
   console.log('Current User:', user);
   ```

3. **Check Browser Storage**
   ```javascript
   console.log('Session ID:', localStorage.getItem('fixfy_session_id'));
   ```

## 📈 Performance Optimization

### Indexes Created

- `idx_user_images_user_id` - Fast user image queries
- `idx_user_images_uploaded_at` - Chronological sorting
- `idx_analysis_results_user_id` - User analysis queries
- `idx_analysis_results_image_id` - Image-analysis joins
- `idx_renovation_suggestions_analysis_id` - Suggestion queries
- `idx_user_sessions_user_id` - Session lookups

### Query Optimization

- Use `LIMIT` for large result sets
- Filter by `user_id` first for better performance
- Use `SELECT` specific columns instead of `*`
- Consider pagination for image history

## 🔒 Security Considerations

### Data Protection

- **No personal data** - Only session IDs and anonymous data
- **RLS policies** - Users can only access their own data
- **Input validation** - File type and size checks
- **Error handling** - No sensitive data in error messages

### Privacy

- Images are stored as object URLs (client-side)
- No image data is sent to external services
- Session data is stored locally in browser
- Users can delete their data at any time

## 🚀 Next Steps

### Potential Enhancements

1. **Supabase Storage Integration**
   - Upload images to Supabase Storage
   - Generate permanent URLs
   - Better image management

2. **User Authentication**
   - Add email/password login
   - Social authentication (Google, GitHub)
   - User profiles and preferences

3. **Advanced Analytics**
   - Track popular room types
   - Analysis success rates
   - User engagement metrics

4. **Data Export**
   - Export analysis results
   - Download image collections
   - Share analysis reports

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify database connection in Supabase dashboard
3. Test with a fresh browser session
4. Check the database logs in Supabase

The database is now fully configured and ready to store user images and analysis data! 🎉


