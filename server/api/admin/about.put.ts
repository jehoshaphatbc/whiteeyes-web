import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    memoryStore.about = { ...memoryStore.about, ...body }
    return memoryStore.about
  }

  const [updatedAbout] = await sql`
    UPDATE abouts SET
      biography = ${body.biography},
      formed_year = ${body.formed_year},
      origin = ${body.origin},
      genre = ${body.genre},
      style_description = ${body.style_description},
      section_photo_url = ${body.section_photo_url}
    WHERE id = 1
    RETURNING *
  `

  if (body.milestones && Array.isArray(body.milestones)) {
    await sql`DELETE FROM milestones WHERE about_id = 1`
    for (let i = 0; i < body.milestones.length; i++) {
      const m = body.milestones[i]
      await sql`INSERT INTO milestones (about_id, year, text, sort_order) VALUES (1, ${m.year}, ${m.text}, ${i})`
    }
  }

  const milestones = await sql`SELECT * FROM milestones WHERE about_id = 1 ORDER BY sort_order ASC`
  return { ...updatedAbout, milestones }
})
