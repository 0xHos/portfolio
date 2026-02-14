import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const db = getDb();
    const projectResult = await db.execute({
      sql: 'SELECT * FROM projects WHERE id = ?',
      args: [id],
    });

    const project = projectResult.rows[0] as any;

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const badgesResult = await db.execute({
      sql: `SELECT b.* FROM badges b 
            JOIN project_badges pb ON b.id = pb.badge_id 
            WHERE pb.project_id = ?`,
      args: [id],
    });

    const badges = badgesResult.rows as any[];

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
    await db.execute({
      sql: 'UPDATE projects SET name = ?, description = ?, image_url = ?, project_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [name, description, image_url || null, project_url || null, id],
    });

    // Update badges
    if (badges && Array.isArray(badges)) {
      await db.execute({
        sql: 'DELETE FROM project_badges WHERE project_id = ?',
        args: [id],
      });
      
      for (const badgeId of badges) {
        await db.execute({
          sql: 'INSERT INTO project_badges (project_id, badge_id) VALUES (?, ?)',
          args: [id, badgeId],
        });
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
    
    await db.execute({
      sql: 'DELETE FROM projects WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
