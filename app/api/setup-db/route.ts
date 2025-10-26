import { NextResponse } from 'next/server'
import prisma from '@/lib/db2'
import fs from 'fs'
import path from 'path'

// This route checks if tables exist and tries to manually create them
export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Check if User table exists by trying to query it
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database is connected and tables exist',
      userCount: userCount,
      tablesExist: true
    })
  } catch (error: any) {
    // If query fails, check if it's because table doesn't exist
    const errorMessage = error.message.toLowerCase()
    
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation') || errorMessage.includes('table')) {
      // Try to manually create tables using raw SQL
      try {
        const migrationPath = path.join(process.cwd(), 'prisma/migrations/20251026063302_sea_food_app/migration.sql')
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
        
        // Execute the migration SQL
        await prisma.$executeRawUnsafe(migrationSQL)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Tables created successfully'
        })
      } catch (createError: any) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to create tables',
          details: createError.message,
          suggestion: 'Please ensure DATABASE_URL is set in Vercel and run migrations during build'
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      suggestion: 'Check database connection and ensure migrations run during build'
    }, { status: 500 })
  }
}

