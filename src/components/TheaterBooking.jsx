import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TheaterBooking.css';
import './Header.css';

const TheaterBooking = () => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [faculty, setFaculty] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdminControls, setShowAdminControls] = useState(false);

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
        fetchSeats();
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', toggleAdminControls);
        return () => window.removeEventListener('keydown', toggleAdminControls);
    }, []);

    const fetchSeats = async () => {
        try {
            console.log('Fetching seats from backend...');
            const response = await axios.get('/api/seats', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', response);
            setSeats(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                request: err.request
            });
            setError(err.message);
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

        const cleanStudentId = studentId.trim();

        try {
            const response = await axios.post(
                '/api/seats/cancel', 
                {
                    seatId: seat.id,
                    studentId: cleanStudentId
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            alert('Резервација је успешно отказана!');
            fetchSeats();
        } catch (err) {
            if (err.response?.status === 403) {
                alert('Неауторизовано: Број индекса се не подудара са резервацијом');
            } else {
                alert('Грешка при отказивању резервације: ' + (err.response?.data || err.message));
            }
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
            const response = await axios.post('/api/seats/reserve', reservation);
            console.log('Reservation response:', response);
            alert('Резервација је успешно извршена!');
            fetchSeats();
            setSelectedSeats([]);
            setCustomerName('');
            setStudentId('');
            setFaculty('');
        } catch (err) {
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                data: err.response?.data
            });
            if (err.response?.status === 400) {
                alert(err.response.data);
            } else {
                alert('Грешка при резервацији: ' + (err.response?.data || err.message));
            }
        }
    };

    const handleClearAll = async () => {
        const adminPassword = prompt("Унесите администраторску лозинку:");
        if (!adminPassword) return;

        if (window.confirm('Да ли сте сигурни да желите да обришете све резервације? Ова акција се не може поништити.')) {
            try {
                await axios.post('/api/seats/clear-all', null, {
                    headers: {
                        'Admin-Password': adminPassword
                    }
                });
                alert('Све резервације су успешно обрисане!');
                fetchSeats();
            } catch (err) {
                if (err.response?.status === 403) {
                    alert('Неауторизовано: Погрешна администраторска лозинка');
                } else {
                    alert('Грешка при брисању резервација: ' + (err.response?.data || err.message));
                }
            }
        }
    };

    const toggleAdminControls = (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'A') {  // Ctrl + Alt + A
            setShowAdminControls(prev => !prev);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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