import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const db = getDb();
    const project = db
      .prepare('SELECT * FROM projects WHERE id = ?')
      .get(id) as any;

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const badges = db
      .prepare(
        `SELECT b.* FROM badges b 
         JOIN project_badges pb ON b.id = pb.badge_id 
         WHERE pb.project_id = ?`
      )
      .all(id) as any[];

    return NextResponse.json({ ...project, badges });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const { name, description, image_url, project_url, badges } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare(
      'UPDATE projects SET name = ?, description = ?, image_url = ?, project_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(name, description, image_url || null, project_url || null, id);

    // Update badges
    if (badges && Array.isArray(badges)) {
      db.prepare('DELETE FROM project_badges WHERE project_id = ?').run(id);
      const stmt = db.prepare(
        'INSERT INTO project_badges (project_id, badge_id) VALUES (?, ?)'
      );
      for (const badgeId of badges) {
        stmt.run(id, badgeId);
      }
    }

    return NextResponse.json({ id, name, description, image_url, project_url, badges });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const db = getDb();
    
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
