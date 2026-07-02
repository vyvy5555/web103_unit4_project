import React, { useEffect, useState } from 'react'
import '../App.css'
import '../css/CreateCar.css'
import { useNavigate, useParams } from 'react-router-dom'

const EditCar = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [exteriors, setExteriors] = useState([])
  const [interiors, setInteriors] = useState([])
  const [wheels, setWheels] = useState([])
  const [roofs, setRoofs] = useState([])

  const [car, setCar] = useState({
    exterior_id: 0,
    interior_id: 0,
    wheels_id: 0,
    roof_id: 0
  })

  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEditData = async () => {
      try {
        const [
          carResponse,
          exteriorsResponse,
          interiorsResponse,
          wheelsResponse,
          roofsResponse
        ] = await Promise.all([
          fetch(`http://localhost:3000/car/${id}`),
          fetch('http://localhost:3000/exterior'),
          fetch('http://localhost:3000/interior'),
          fetch('http://localhost:3000/wheels'),
          fetch('http://localhost:3000/roof')
        ])

        if (
          !carResponse.ok ||
          !exteriorsResponse.ok ||
          !interiorsResponse.ok ||
          !wheelsResponse.ok ||
          !roofsResponse.ok
        ) {
          throw new Error('Failed to fetch edit data')
        }

        const carData = await carResponse.json()
        const exteriorsData = await exteriorsResponse.json()
        const interiorsData = await interiorsResponse.json()
        const wheelsData = await wheelsResponse.json()
        const roofsData = await roofsResponse.json()

        setCar({
          exterior_id: carData.exterior_id,
          interior_id: carData.interior_id,
          wheels_id: carData.wheels_id,
          roof_id: carData.roof_id
        })

        setExteriors(exteriorsData)
        setInteriors(interiorsData)
        setWheels(wheelsData)
        setRoofs(roofsData)
      } catch (err) {
        console.log('Error loading edit page:', err.message)
      }
    }

    fetchEditData()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target

    setCar((prev) => ({
      ...prev,
      [name]: Number(value)
    }))
  }

  const updateCar = async (event) => {
    event.preventDefault()

    if (!car.exterior_id || !car.interior_id || !car.wheels_id || !car.roof_id) {
      setError('ERROR: Missing an input! Please select every option before saving.')
      return
    }

    setError('')

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(car)
    }

    try {
      const response = await fetch(`http://localhost:3000/car/${id}`, options)
      const data = await response.json()

      console.log('Updated car:', data)

      if (!response.ok) {
        setError(data.err || 'Error updating car.')
        return
      }

      navigate('/customcars')
    } catch (err) {
      console.error('Error updating car:', err.message)
    }
  }

  return (
    <div className="CreateCar">
      <center><h2>Edit Car #{id}</h2></center>

      <div>
        <form onSubmit={updateCar}>
          <details className="dropdown">
            <summary>Exteriors</summary>

            {exteriors.map((exterior) => (
              <label key={exterior.id} htmlFor={`exterior-${exterior.id}`}>
                <input
                  id={`exterior-${exterior.id}`}
                  type="radio"
                  name="exterior_id"
                  value={exterior.id}
                  checked={Number(car.exterior_id) === Number(exterior.id)}
                  onChange={handleChange}
                />
                {exterior.name}

                <img src={`/assets/${exterior.img}`} alt={exterior.name} />
              </label>
            ))}
          </details>

          <br />
          <br />

          <details className="dropdown">
            <summary>Interiors</summary>

            {interiors.map((interior) => (
              <label key={interior.id} htmlFor={`interior-${interior.id}`}>
                <input
                  id={`interior-${interior.id}`}
                  type="radio"
                  name="interior_id"
                  value={interior.id}
                  checked={Number(car.interior_id) === Number(interior.id)}
                  onChange={handleChange}
                />
                {interior.name}

                <img src={`/assets/${interior.img}`} alt={interior.name} />
              </label>
            ))}
          </details>

          <br />
          <br />

          <details className="dropdown">
            <summary>Wheels</summary>

            {wheels.map((wheel) => (
              <label key={wheel.id} htmlFor={`wheel-${wheel.id}`}>
                <input
                  id={`wheel-${wheel.id}`}
                  type="radio"
                  name="wheels_id"
                  value={wheel.id}
                  checked={Number(car.wheels_id) === Number(wheel.id)}
                  onChange={handleChange}
                />
                {wheel.name}

                <img src={`/assets/${wheel.img}`} alt={wheel.name} />
              </label>
            ))}
          </details>

          <br />
          <br />

          <details className="dropdown">
            <summary>Roofs</summary>

            {roofs.map((roof) => (
              <label key={roof.id} htmlFor={`roof-${roof.id}`}>
                <input
                  id={`roof-${roof.id}`}
                  type="radio"
                  name="roof_id"
                  value={roof.id}
                  checked={Number(car.roof_id) === Number(roof.id)}
                  onChange={handleChange}
                />
                {roof.name}

                <img src={`/assets/${roof.img}`} alt={roof.name} />
              </label>
            ))}
          </details>

          <br />
          <br />

          {error && <p className="form-error">{error}</p>}

          <input
            type="submit"
            value="Save Changes"
          />
        </form>
      </div>
    </div>
  )
}

export default EditCar