import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const config = await request.json()
  
  try {
    await writeFile('data/emailConfig.json', JSON.stringify(config, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving email config:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

