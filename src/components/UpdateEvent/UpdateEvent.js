import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

function UpdateEvent() {
    const { id } = useParams();  // Captura el ID del evento desde la URL
    const [eventData, setEventData] = useState({});
    const navigate = useNavigate();
    // Campos del evento
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    // Campos del usuario
    const [currentUserData, setCurrentUserData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/events/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
                setEventData(response.data);
            } catch (error) {
                setError('Error fetching event');
                console.error(error.response.data);
                navigate('/showAllEvents');
            }
        };

        const fetchUserProfile = async () => {
            const token = localStorage.getItem('access');
    
            if (!token) {
                setError('No token found');
                return;
            }
    
            try {
                const response = await axios.get('http://localhost:8000/api/user/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCurrentUserData(response.data);
            } catch (error) {
                setError('Error fetching user profile');
                console.error(error);
            }
        };
    
        fetchEvent();
        fetchUserProfile();
    }, [id, navigate]);

    useEffect(() => {
        if (eventData.usuario && currentUserData) {
            if (currentUserData.id !== eventData.usuario.id) {
                navigate('/showAllEvents');
            } else {
                console.log('User is authorized');
                console.log(currentUserData.id);
                console.log(eventData.usuario.id);
            }
        }
    }, [eventData, currentUserData, navigate]);

    useEffect(() => {
        if (eventData.nombre && eventData.descripcion) {
            setNombre(eventData.nombre || '');
            setDescripcion(eventData.descripcion || '');
        }
    }, [eventData]);

    // Este handle submit ahora debe editar
    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('access');
        if (!token) {
            setError('No token found');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/events/${id}/`, {
                nombre,
                descripcion,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setSuccess('Event updated successfully');
            setNombre('');
            setDescripcion('');
            navigate('/showAllEvents');
        } catch (error) {
            setError('Error updating event');
        }
    };

  return (
    <div>   
            <h1>Update Event</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Actualizar Evento</button>
                {error && <div>{error}</div>}
                {success && <div>{success}</div>}
            </form>
        </div>
  )
}

export default UpdateEvent