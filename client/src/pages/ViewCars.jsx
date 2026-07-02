import React from 'react'
import '../App.css'
import { useState, useEffect } from 'react'
import '../css/ViewCars.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CarDetails from './CarDetails'

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [viewingCar, setViewingCar] = useState(true)
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:3000/car')

                if (!response.ok) {
                    throw new Error('Failed to fetch all cars')
                }

                const data = await response.json()

                // fetch data of each element (ex, in, ro, wh) per car
                const updatedCars = await Promise.all(
                    data.map(async (car) => {
                        const ex_response = await fetch(`http://localhost:3000/exterior/${car.exterior_id}`)
                        const in_response = await fetch(`http://localhost:3000/interior/${car.interior_id}`)
                        const ro_response = await fetch(`http://localhost:3000/roof/${car.roof_id}`)
                        const wh_response = await fetch(`http://localhost:3000/wheels/${car.wheels_id}`)

                        if (!ex_response.ok || !in_response.ok || !ro_response.ok || !wh_response.ok) {
                            throw new Error('Failed to fetch exterior, interior, roof, or wheels data of specific car')
                        }

                        const exterior = await ex_response.json()
                        const interior = await in_response.json()
                        const roof = await ro_response.json()
                        const wheels = await wh_response.json()

                        return {
                            ...car,
                            exterior,
                            interior,
                            roof,
                            wheels
                        }
                    })
                )

                setCars(updatedCars)
                console.log(updatedCars)
            } catch (err) {
                console.log("Error in getting cars");
            }
        }

        fetchCars()
    }, [])

    const editCar = (id) => {

    }

    const deleteCar = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/car/${id}`, {
            method: 'DELETE'
            })

            if (!response.ok) {
            throw new Error('Failed to delete car')
            }

            setCars((prevCars) => prevCars.filter((car) => car.id !== id))
        } catch (err) {
            console.log('Error deleting car:', err.message)
        }
    }

    return (
        <div className="view-cars-page">
            <div className="cars-list">
            {cars.map((car) => {
                const totalPrice = car.exterior.price + car.interior.price + car.wheels.price + car.roof.price

                return (
                    <div className="custom-car-card" key={car.id}>
                        <div className="car-card-header">
                            <span className="car-emoji">🏎️</span>
                            <h2>Car #{car.id}</h2>
                            </div>

                            <div className="car-card-content">
                            <div className="car-options">
                                <p><strong>Exterior:</strong> {car.exterior?.name}</p>
                                <p><strong>Roof:</strong> {car.roof?.name}</p>
                                <p><strong>Wheels:</strong> {car.wheels?.name}</p>
                                <p><strong>Interior:</strong> {car.interior?.name}</p>
                            </div>

                            <div className="car-price-section">
                                <h3>💰 ${totalPrice}</h3>

                                <Link to={`/customcars/${car.id}`}>
                                    <button className="details-button" type="button">
                                        DETAILS
                                    </button>
                                </Link>

                                <Link to={`/edit/${car.id}`}>
                                    <button className="details-button" type="button">EDIT</button>
                                </Link>
                
                                <button className="details-button" type="button" onClick={() => deleteCar(car.id)}>
                                    DELETE
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default ViewCars