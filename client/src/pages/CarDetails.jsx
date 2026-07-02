import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../css/CarDetails.css'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [activeFeature, setActiveFeature] = useState(null)

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const [
          carRes,
          exteriorsRes,
          interiorsRes,
          wheelsRes,
          roofsRes
        ] = await Promise.all([
          fetch(`http://localhost:3000/car/${id}`),
          fetch('http://localhost:3000/exterior'),
          fetch('http://localhost:3000/interior'),
          fetch('http://localhost:3000/wheels'),
          fetch('http://localhost:3000/roof')
        ])

        const carData = await carRes.json()
        const exteriors = await exteriorsRes.json()
        const interiors = await interiorsRes.json()
        const wheels = await wheelsRes.json()
        const roofs = await roofsRes.json()

        const findById = (items, itemId) => {
          return items.find((item) => item.id === Number(itemId))
        }

        const formattedCar = {
          id: carData.id,
          exterior: findById(exteriors, carData.exterior_id),
          interior: findById(interiors, carData.interior_id),
          wheels: findById(wheels, carData.wheels_id),
          roof: findById(roofs, carData.roof_id)
        }

        setCar(formattedCar)
        setActiveFeature({
          label: 'Exterior',
          ...formattedCar.exterior
        })
      } catch (err) {
        console.log('Error fetching car details:', err.message)
      }
    }

    fetchCarDetails()
  }, [id])

  const deleteCar = async () => {
    const response = await fetch(`http://localhost:3000/car/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      navigate('/customcars')
    } else {
      console.log('Error deleting car')
    }
  }

  if (!car) {
    return <h2 className="loading-text">Loading...</h2>
  }

  const totalPrice = car.exterior.price +
                    car.interior.price +
                    car.wheels.price +
                    car.roof.price

  return (
    <div className="car-details-page">
      <div className="details-card">
        <div className="details-header">
          <span className="car-emoji">🏎️</span>
          <h1>Car #{car.id}</h1>
        </div>

        <div className="details-main">
          <div className="details-left">
            <h2>💰 ${totalPrice}</h2>

            <div className="details-buttons">
              <Link to={`/edit/${car.id}`}>
                <button type="button">EDIT</button>
              </Link>

              <button type="button" onClick={deleteCar}>
                DELETE
              </button>
            </div>
          </div>

          <div className="feature-info-box">
            {activeFeature && (
              <>
                <h3>
                  {activeFeature.label}: {activeFeature.name}
                </h3>
                <p>💵 ${activeFeature.price}</p>
              </>
            )}
          </div>

          <div className="details-images">
            <img
              src={`/assets/${car.exterior.img}`}
              alt={car.exterior.name}
              onMouseEnter={() =>
                setActiveFeature({
                  label: 'Exterior',
                  ...car.exterior
                })
              }
            />

            <img
              src={`/assets/${car.roof.img}`}
              alt={car.roof.name}
              onMouseEnter={() =>
                setActiveFeature({
                  label: 'Roof',
                  ...car.roof
                })
              }
            />

            <img
              src={`/assets/${car.wheels.img}`}
              alt={car.wheels.name}
              onMouseEnter={() =>
                setActiveFeature({
                  label: 'Wheels',
                  ...car.wheels
                })
              }
            />

            <img
              src={`/assets/${car.interior.img}`}
              alt={car.interior.name}
              onMouseEnter={() =>
                setActiveFeature({
                  label: 'Interior',
                  ...car.interior
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails