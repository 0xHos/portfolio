import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const PROJECTS_PER_PAGE = 6;

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const offset = (page - 1) * PROJECTS_PER_PAGE;

    const db = getDb();
    
    const projectsResult = await db.execute({
      sql: 'SELECT * FROM projects ORDER BY created_at DESC LIMIT ? OFFSET ?',
      args: [PROJECTS_PER_PAGE, offset],
    });
    
    const projects = projectsResult.rows as any[];

    const totalResult = await db.execute('SELECT COUNT(*) as count FROM projects');
    const total = (totalResult.rows[0] as any)?.count || 0;
    const totalPages = Math.ceil(total / PROJECTS_PER_PAGE);

    // Fetch badges for each project
    const projectsWithBadges = await Promise.all(
      projects.map(async (project) => {
        const badgesResult = await db.execute({
          sql: `SELECT b.* FROM badges b 
                JOIN project_badges pb ON b.id = pb.badge_id 
                WHERE pb.project_id = ?`,
          args: [project.id],
        });
        const badges = badgesResult.rows as any[];
        return { ...project, badges };
      })
    );

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
    const result = await db.execute({
      sql: 'INSERT INTO projects (name, description, image_url, project_url) VALUES (?, ?, ?, ?)',
      args: [name, description, image_url || null, project_url || null],
    });

    const projectId = result.lastInsertRowid;

    // Add badges if provided
    if (badges && Array.isArray(badges)) {
      for (const badgeId of badges) {
        await db.execute({
          sql: 'INSERT INTO project_badges (project_id, badge_id) VALUES (?, ?)',
          args: [projectId, badgeId],
        });
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
