import React, { useEffect } from 'react'
import '../App.css'
import { useState } from 'react'
import '../css/CreateCar.css'

const CreateCar = () => {
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

    const handleChange = (event) => {
        const { name, value } = event.target

        setCar( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }

    const createCar = async (event) => {
        event.preventDefault()

        if (!car.exterior_id || !car.interior_id || !car.wheels_id || !car.roof_id) {
            setError('ERROR: Missing an input! Cannot save this custom car to the database yet. :(')
            return
        }

        setError('')

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        }

        try {
            const response = await fetch('http://localhost:3000/car', options)

            const data = await response.json()
            console.log('Response:', data)

            if (!response.ok) {
                const data = await response.json()
                setError(data.err || 'Error creating car.')
            }

            window.location = '/customcars'
        } catch (err) {
            console.error('Error creating car:', err.message)
        }
    }

    useEffect(() => {
        const fetchExteriors = async () => {
            try {
                const response = await fetch('http://localhost:3000/exterior')

                if (!response.ok) {
                    throw new Error('Failed to fetch exteriors')
                }

                const data = await response.json()
                setExteriors(data)
            } catch (err) {
                console.log("Error in getting exteriors");
            }
        }

        fetchExteriors()
    }, [])

    useEffect(() => {
        const fetchInteriors = async () => {
            try {
                const response = await fetch('http://localhost:3000/interior')

                if (!response.ok) {
                    throw new Error('Failed to fetch interiors')
                }

                const data = await response.json()
                setInteriors(data)
            } catch (err) {
                console.log("Error in getting interiors");
            }
        }

        fetchInteriors()
    }, [])

    useEffect(() => {
        const fetchWheels = async () => {
            try {
                const response = await fetch('http://localhost:3000/wheels')

                if (!response.ok) {
                    throw new Error('Failed to fetch wheels')
                }

                const data = await response.json()
                setWheels(data)
            } catch (err) {
                console.log("Error in getting wheels");
            }
        }

        fetchWheels()
    }, [])

    useEffect(() => {
        const fetchRoofs = async () => {
            try {
                const response = await fetch('http://localhost:3000/roof')

                if (!response.ok) {
                    throw new Error('Failed to fetch roofs')
                }

                const data = await response.json()
                setRoofs(data)
            } catch (err) {
                console.log("Error in getting roofs");
            }
        }

        fetchRoofs()
    }, [])

    return (
        <div className="CreateCar">
            <center><h2>Add a Car</h2></center>

            <div>
                <form>
                    <details className="dropdown">
                        <summary>Exteriors</summary>

                        {exteriors.map((exterior) => (
                            <label key={exterior.id} htmlFor={`exterior-${exterior.id}`}>
                                <input
                                    id={`exterior-${exterior.id}`}
                                    type="radio"
                                    name="exterior_id"
                                    value={exterior.id}
                                    onChange={handleChange}
                                />
                                {exterior.name}

                                <img src={`/assets/${exterior.img}`} alt={exterior.name} />
                            </label>
                        ))}
                    </details>
                    <br/>
                    <br/>

                    <details className="dropdown">
                        <summary>Interiors</summary>

                        {interiors.map((interior) => (
                            <label key={interior.id} htmlFor={`interior-${interior.id}`}>
                                <input
                                    id={`interior-${interior.id}`}
                                    type="radio"
                                    name="interior_id"
                                    value={interior.id}
                                    onChange={handleChange}
                                />
                                {interior.name}

                                <img src={`/assets/${interior.img}`} alt={interior.name} />
                            </label>
                        ))}
                    </details>
                    <br/>
                    <br/>

                    <details className="dropdown">
                        <summary>Wheels</summary>

                        {wheels.map((wheel) => (
                            <label key={wheel.id} htmlFor={`wheel-${wheel.id}`}>
                                <input
                                    id={`wheel-${wheel.id}`}
                                    type="radio"
                                    name="wheels_id"
                                    value={wheel.id}
                                    onChange={handleChange}
                                />
                                {wheel.name}

                                <img src={`/assets/${wheel.img}`} alt={wheel.name} />
                            </label>
                        ))}
                    </details>
                    <br/>
                    <br/>

                    <details className="dropdown">
                        <summary>Roofs</summary>

                        {roofs.map((roof) => (
                            <label key={roof.id} htmlFor={`roof-${roof.id}`}>
                                <input
                                    id={`roof-${roof.id}`}
                                    type="radio"
                                    name="roof_id"
                                    value={roof.id}
                                    onChange={handleChange}
                                />
                                {roof.name}

                                <img src={`/assets/${roof.img}`} alt={roof.name} />
                            </label>
                        ))}
                    </details>
                    <br/>
                    <br/>

                    {/* if there's an impossible combo (sth missing, not all options selected) */}
                    {error && <p className="form-error">{error}</p>}

                    <input
                        type="submit"
                        value="Submit"
                        onClick={createCar}
                    />
                </form>
            </div>
        </div>
    )
}

export default CreateCar