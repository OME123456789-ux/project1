# Deploying to Render

This guide explains how to deploy the Spring Boot application to Render using Docker.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A PostgreSQL database on Render (or external Postgres)

## Deployment Steps

### 1. Create a PostgreSQL Database on Render

1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL" or "MySQL"
3. Create a new database instance
4. Note down the connection details:
   - Host
   - Port (usually 5432)
   - Database name
   - Username
   - Password

### 2. Create a Web Service on Render

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your repository (GitHub/GitLab/Bitbucket)
3. Configure the service:
   - **Name**: Your service name
   - **Environment**: Docker
   - **Region**: Choose closest to your users
   - **Branch**: main (or your deployment branch)
   - **Root Directory**: `backend/music` (since Dockerfile is in this directory)
   - **Dockerfile Path**: `Dockerfile` (relative to root directory)

### 3. Set Environment Variables

In your Render service settings, add these environment variables:

**Database Configuration (EXACT variables expected by this app):**
- `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<HOST>:<PORT>/<DB_NAME>`
- `SPRING_DATASOURCE_USERNAME`: `<USERNAME>`
- `SPRING_DATASOURCE_PASSWORD`: `<PASSWORD>`

**Optional:**
- `PORT`: Render sets this automatically, but you can override if needed

### 4. Deploy

1. Click "Create Web Service"
2. Render will build your Docker image and deploy it
3. Monitor the build logs for any issues
4. Once deployed, your service will be available at `https://your-service-name.onrender.com`

## Important Notes

- **Build Time**: First build may take 5-10 minutes
- **Cold Starts**: Free tier services spin down after inactivity (15 minutes). First request after spin-down may take 30-60 seconds
- **Database Migrations**: The application uses `spring.jpa.hibernate.ddl-auto=update`, which will automatically create/update tables on startup
- **Static Files**: Static files in `src/main/resources/static/` will be served by Spring Boot

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure Java 21 is supported (it should be with the Dockerfile)
- Verify Maven dependencies are accessible

### Database Connection Issues
- Verify `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` are set correctly

### Application Won't Start
- Check runtime logs in Render dashboard
- Verify PORT environment variable is set (Render sets this automatically)
- Ensure all required environment variables are configured

## Custom Domain

To use a custom domain:
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain and follow DNS configuration instructions

