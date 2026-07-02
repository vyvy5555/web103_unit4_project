import { pool } from '../config/database.js'

const getCars = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT * FROM cars
      ORDER BY id ASC
    `)

    res.status(200).json(results.rows)
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

const getCarById = async (req, res) => {
  try {
    const id = parseInt(req.params.carId)

    const results = await pool.query(
      `
      SELECT *
      FROM cars
      WHERE id = $1
      `,
      [id]
    )

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

const createCar = async (req, res) => {
  try {
    const { exterior_id, interior_id, wheels_id, roof_id } = req.body

    const results = await pool.query(
      `
      INSERT INTO cars (exterior_id, interior_id, wheels_id, roof_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [exterior_id, interior_id, wheels_id, roof_id]
    )

    res.status(201).json(results.rows[0])
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

const updateCar = async (req, res) => {
  try {
    const id = parseInt(req.params.carId)
    const { exterior_id, interior_id, wheels_id, roof_id } = req.body

    const results = await pool.query(
      `
      UPDATE cars
      SET exterior_id = COALESCE($1, exterior_id),
          interior_id = COALESCE($2, interior_id),
          wheels_id = COALESCE($3, wheels_id),
          roof_id = COALESCE($4, roof_id)
      WHERE id = $5
      RETURNING *
      `,
      [exterior_id, interior_id, wheels_id, roof_id, id]
    )

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

const deleteCar = async (req, res) => {
  try {
    const id = parseInt(req.params.carId)

    const results = await pool.query(
      `
      DELETE FROM cars
      WHERE id = $1
      RETURNING *
      `,
      [id]
    )

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' })
    }

    res.status(200).json({
      message: 'Car deleted successfully',
      deletedCar: results.rows[0]
    })
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

export default {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
}