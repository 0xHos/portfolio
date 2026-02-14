import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const PROJECTS_PER_PAGE = 6;

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const offset = (page - 1) * PROJECTS_PER_PAGE;

    const db = getDb();
    
    const projects = db
      .prepare(
        'SELECT * FROM projects ORDER BY created_at DESC LIMIT ? OFFSET ?'
      )
      .all(PROJECTS_PER_PAGE, offset) as any[];

    const totalResult = db
      .prepare('SELECT COUNT(*) as count FROM projects')
      .get() as { count: number };

    const total = totalResult.count;
    const totalPages = Math.ceil(total / PROJECTS_PER_PAGE);

    // Fetch badges for each project
    const projectsWithBadges = projects.map((project) => {
      const badges = db
        .prepare(
          `SELECT b.* FROM badges b 
           JOIN project_badges pb ON b.id = pb.badge_id 
           WHERE pb.project_id = ?`
        )
        .all(project.id) as any[];
      return { ...project, badges };
    });

    return NextResponse.json({
      data: projectsWithBadges,
      pagination: {
        page,
        totalPages,
        total,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, image_url, project_url, badges } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO projects (name, description, image_url, project_url) VALUES (?, ?, ?, ?)'
    ).run(name, description, image_url || null, project_url || null);

    const projectId = result.lastInsertRowid;

    // Add badges if provided
    if (badges && Array.isArray(badges)) {
      const stmt = db.prepare(
        'INSERT INTO project_badges (project_id, badge_id) VALUES (?, ?)'
      );
      for (const badgeId of badges) {
        stmt.run(projectId, badgeId);
      }
    }

    return NextResponse.json(
      { id: projectId, name, description, image_url, project_url, badges: [] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
