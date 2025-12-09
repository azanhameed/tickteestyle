/**
 * Admin Statistics API route
 * Handles GET (fetch admin statistics)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/supabase/admin-stats';
import { requireAdmin } from '@/lib/auth/admin-check';

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    // Fetch admin stats
    const { stats, error } = await getAdminStats();

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      );
    }

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




