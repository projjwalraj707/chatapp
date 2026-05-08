import { NextRequest, NextResponse } from 'next/server';
import client from '../../lib/db/pgsql';
import { extractPayLoad } from '../../lib/session';

export async function GET(request: NextRequest) {
	try {
		// Test database connection
		const dbTest = await client.query('SELECT NOW()');
		console.log('Database test result:', dbTest.rows[0]);

		// Test session extraction
		const payload = await extractPayLoad();
		console.log('Session test result:', payload ? 'Valid session' : 'No session');

		return NextResponse.json({
			status: 'OK',
			database: 'Connected',
			session: payload ? 'Valid' : 'Invalid',
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Health check failed:', error);
		return NextResponse.json({
			status: 'ERROR',
			error: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString()
		}, { status: 500 });
	}
}