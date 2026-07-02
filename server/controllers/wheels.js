import { pool } from '../config/database.js'

const getWheels = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT * FROM wheels
      ORDER BY id ASC
    `)

    res.status(200).json(results.rows)
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

const getWheelsById = async (req, res) => {
  try {
    const id = parseInt(req.params.wheelsId)

    const results = await pool.query(
      `
      SELECT *
      FROM wheels
      WHERE id = $1
      `,
      [id]
    )

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'Wheels not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

export default {
  getWheels,
  getWheelsById
}