import { exec } from 'child_process'
import { promisify } from 'util'
import { NextResponse } from 'next/server'

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Run migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database migrations completed',
      output: stdout,
      warnings: stderr 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.stack
    }, { status: 500 })
  }
}

