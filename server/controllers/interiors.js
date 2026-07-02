import { pool } from '../config/database.js'

const getInteriors = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT * FROM interiors
      ORDER BY id ASC
    `)

    res.status(200).json(results.rows)
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

const getInteriorById = async (req, res) => {
  try {
    const id = parseInt(req.params.interiorId)

    const results = await pool.query(
      `
      SELECT *
      FROM interiors
      WHERE id = $1
      `,
      [id]
    )

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'Interior not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

export default {
  getInteriors,
  getInteriorById
}