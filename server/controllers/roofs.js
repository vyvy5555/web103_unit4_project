import { pool } from '../config/database.js'

const getRoofs = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT * FROM roofs
      ORDER BY id ASC
    `)

    res.status(200).json(results.rows)
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

const getRoofById = async (req, res) => {
  try {
    const id = parseInt(req.params.roofId)

    const results = await pool.query(
      `
      SELECT *
      FROM roofs
      WHERE id = $1
      `,
      [id]
    )

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'Roof not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

export default {
  getRoofs,
  getRoofById
}