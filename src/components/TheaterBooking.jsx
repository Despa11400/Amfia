import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TheaterBooking.css';
import './Header.css';

const API_URL = 'https://amfiabackend.onrender.com';

const TheaterBooking = () => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [faculty, setFaculty] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdminControls, setShowAdminControls] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const faculties = [
        "Архитектонски факултет",
        "Биолошки факултет",
        "Економски факултет",
        "Електротехнички факултет",
        "Факултет безбедности",
        "Факултет организационих наука",
        "Факултет политичких наука",
        "Факултет спорта и физичког васпитања",
        "Факултет за физичку хемију",
        "Факултет за специјалну едукацију и рехабилитацију",
        "Фармацеутски факултет",
        "Филолошки факултет",
        "Филозофски факултет",
        "Физички факултет",
        "Грађевински факултет",
        "Хемијски факултет",
        "Машински факултет",
        "Математички факултет",
        "Медицински факултет",
        "Правни факултет",
        "Православни богословски факултет",
        "Рударско-геолошки факултет",
        "Саобраћајни факултет",
        "Стоматолошки факултет",
        "Шумарски факултет",
        "Технички факултет у Бору",
        "Технолошко-металуршки факултет",
        "Учитељски факултет",
        "Ветеринарски факултет"
    ];

    // Create a mapping for section names
    const sectionMapping = {
        'I': 'A',
        'II': 'B',
        'III': 'C',
        'IV': 'D'
    };

    useEffect(() => {
        const testBackend = async () => {
            setIsLoading(true);
            try {
                console.log('Testing backend connection...');
                console.log('Trying /health...');
                await axios.get('https://amfiabackend.onrender.com/health');
                
                console.log('Trying /api/ping...');
                const pingResponse = await axios.get('https://amfiabackend.onrender.com/api/ping');
                console.log('Ping response:', pingResponse.data);
                
                console.log('Trying /api/seats...');
                const seatsResponse = await axios.get('https://amfiabackend.onrender.com/api/seats');
                console.log('Seats response:', seatsResponse.data);
                
                setSeats(seatsResponse.data);
                setLoading(false);
                setIsLoading(false);
            } catch (err) {
                console.error('Backend test failed:', err);
                console.error('Full error object:', {
                    message: err.message,
                    response: err.response,
                    request: err.request,
                    config: err.config
                });
                setError(`Cannot connect to backend: ${err.message}`);
                setLoading(false);
                setIsLoading(false);
            }
        };

        testBackend();
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', toggleAdminControls);
        return () => window.removeEventListener('keydown', toggleAdminControls);
    }, []);

    const fetchSeats = async () => {
        try {
            const apiUrl = `${API_URL}/api/seats`;
            console.log('Fetching seats from:', apiUrl);
            console.log('Current API_URL:', API_URL);
            
            const response = await axios.get(apiUrl);
            console.log('Response received:', response);
            
            setSeats(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Detailed error:', err);
            console.error('Error response:', err.response);
            setError(
                `Error: ${err.message}. Status: ${err.response?.status}. Data: ${JSON.stringify(err.response?.data)}`
            );
            setLoading(false);
        }
    };

    const handleSeatClick = (seat) => {
        if (seat.booked) return;
        
        if (selectedSeats.length > 0) {
            setSelectedSeats([seat]);
        } else {
            setSelectedSeats([seat]);
        }
    };

    const handleCancelReservation = async (seat) => {
        const studentId = prompt("Унесите ваш број индекса да откажете резервацију:");
        if (!studentId) return;

        try {
            console.log('Attempting to cancel reservation:', {
                seatId: seat.id,
                studentId: studentId,
                currentSeatInfo: seat
            });

            const response = await axios.post(`${API_URL}/api/seats/cancel`, {
                seatId: seat.id,
                studentId: studentId
            });

            if (response.status === 200) {
                alert('Резервација је успешно отказана!');
                fetchSeats();  // Refresh the seats display
            }
        } catch (err) {
            console.error('Cancel reservation error:', err.response?.data || err.message);
            alert('Грешка при отказивању резервације: ' + 
                  (err.response?.data || 'Број индекса се не подудара са резервацијом'));
        }
    };

    const handleReservation = async (e) => {
        e.preventDefault();
        
        const reservation = {
            customerName: customerName,
            studentId: studentId,
            faculty: faculty,
            seats: selectedSeats
        };

        try {
            const response = await axios.post(`${API_URL}/api/seats/reserve`, reservation);
            alert('Резервација је успешно извршена!');
            fetchSeats();
            setSelectedSeats([]);
            setCustomerName('');
            setStudentId('');
            setFaculty('');
        } catch (err) {
            alert('Грешка при резервацији: ' + err.message);
        }
    };

    const handleClearAll = async () => {
        const adminPassword = prompt("Унесите администраторску лозинку:");
        if (!adminPassword) return;

        console.log('Password being sent:', adminPassword);
        console.log('Password length:', adminPassword.length);

        if (window.confirm('Да ли сте сигурни да желите да обришете све резервације? Ова акција се не може поништити.')) {
            try {
                const response = await axios.post(`${API_URL}/api/seats/clear-all`, null, {
                    headers: {
                        'Admin-Password': adminPassword.trim()
                    }
                });
                alert('Све резервације су успешно обрисане!');
                fetchSeats();
            } catch (err) {
                console.error('Clear all error:', err);
                console.error('Response data:', err.response?.data);
                console.error('Password that failed:', adminPassword);
                alert('Грешка при брисању резервација: ' + 
                      (err.response?.data || 'Неисправна администраторска лозинка'));
            }
        }
    };

    const toggleAdminControls = (e) => {
        if (e.ctrlKey && e.altKey && (e.key === 'A' || e.key === 'a')) {
            setShowAdminControls(prev => !prev);
            console.log('Admin controls toggled:', !showAdminControls);
        }
    };

    if (isLoading) {
        return <div className="loading">Учитавање апликације...</div>;
    }

    if (loading) return <div>Loading...</div>;
    if (error) return (
        <div className="error-message" style={{
            padding: '20px',
            margin: '20px',
            backgroundColor: 'white',
            border: '1px solid red',
            borderRadius: '5px'
        }}>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
                Try Again
            </button>
            <pre style={{whiteSpace: 'pre-wrap'}}>
                {JSON.stringify(error, null, 2)}
            </pre>
        </div>
    );

    return (
        <div className="theater-booking">
            <img 
                src="/background.png" 
                alt="Background" 
                className="background-image"
            />
            {showAdminControls && (
                <div className="admin-controls">
                    <button 
                        className="clear-all-button" 
                        onClick={handleClearAll}
                    >
                        Обриши све резервације
                    </button>
                </div>
            )}
            <h1>Резервација</h1>
            <div className="screen">ЕКРАН</div>
            
            <div className="seating-plan">
                {['I', 'II', 'III', 'IV'].map(section => (
                    <div key={section} className="section">
                        <h3>Сектор {section}</h3>
                        <div className="rows">
                            {[...Array(10)].map((_, rowIndex) => {
                                const rowLetter = String.fromCharCode(65 + rowIndex);
                                return (
                                    <div key={rowLetter} className="row">
                                        <span className="row-label">{rowLetter}</span>
                                        <div className="seats">
                                            {seats
                                                .filter(seat => seat.section === sectionMapping[section] && seat.row === rowLetter)
                                                .map(seat => (
                                                    <div
                                                        key={seat.id}
                                                        className={`seat ${seat.booked ? 'booked' : ''} 
                                                            ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''}`}
                                                        onClick={() => seat.booked ? handleCancelReservation(seat) : handleSeatClick(seat)}
                                                        title={seat.booked ? `Reserved by: ${seat.studentName}\nClick to cancel` : 'Click to select'}
                                                    >
                                                        {seat.column}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="seat"></div>
                    <span>Слободно</span>
                </div>
                <div className="legend-item">
                    <div className="seat selected"></div>
                    <span>Изабрано</span>
                </div>
                <div className="legend-item">
                    <div className="seat booked"></div>
                    <span>Резервисано</span>
                </div>
            </div>

            {selectedSeats.length > 0 && (
                <div className="reservation-form">
                    <h3>Завршите вашу резервацију</h3>
                    <p>Изабрана места: {selectedSeats.map(s => 
                        `${s.section}${s.row}${s.column}`).join(', ')}</p>
                    
                    <form onSubmit={handleReservation}>
                        <div className="form-group">
                            <label>Име и презиме:</label>
                            <input 
                                type="text" 
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Унесите ваше име и презиме"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Број индекса:</label>
                            <input 
                                type="text" 
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="Унесите ваш број индекса"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Факултет:</label>
                            <select 
                                value={faculty}
                                onChange={(e) => setFaculty(e.target.value)}
                                required
                            >
                                <option value="">Изаберите факултет</option>
                                {faculties.map((fac, index) => (
                                    <option key={index} value={fac}>{fac}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="submit-button">
                            Резервиши {selectedSeats.length} {selectedSeats.length === 1 ? 'место' : 'места'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TheaterBooking; 