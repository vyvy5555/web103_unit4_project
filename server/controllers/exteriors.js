import { pool } from '../config/database.js'

const getExteriors = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT * FROM exteriors
      ORDER BY id ASC
    `)

    res.status(200).json(results.rows)
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

const getExteriorById = async (req, res) => {
  try {
    const id = parseInt(req.params.exteriorId)

    const results = await pool.query(
      `
      SELECT *
      FROM exteriors
      WHERE id = $1
      `,
      [id]
    )

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'Exterior not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

export default {
  getExteriors,
  getExteriorById
}