import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TheaterBooking.css';
import './Header.css';
import { supabase } from '../config/supabaseClient'

const TheaterBooking = () => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [faculty, setFaculty] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdminControls, setShowAdminControls] = useState(false);
    const [isMarkingBroken, setIsMarkingBroken] = useState(false);

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
        console.log('Fetching seats...');
        fetchSeats();
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', toggleAdminControls);
        return () => window.removeEventListener('keydown', toggleAdminControls);
    }, []);

    const fetchSeats = async () => {
        try {
            console.log('Starting Supabase query...');
            const { data, error } = await supabase
                .from('seats')
                .select('*')
            
            console.log('Received data:', data);
            if (error) throw error
            setSeats(data)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching seats:', error)
            setError(error.message)
            setLoading(false);
        }
    }

    const handleSeatClick = (seat) => {
        if (seat.is_reserved || seat.is_broken) return;
        
        if (selectedSeats.length > 0) {
            setSelectedSeats([seat]);
        } else {
            setSelectedSeats([seat]);
        }
    };

    const handleMarkBroken = async (seat) => {
        if (!isMarkingBroken) return;
        
        try {
            console.log('Attempting to mark seat as broken:', seat);
            const { data, error } = await supabase
                .from('seats')
                .update({ is_broken: !seat.is_broken })
                .eq('id', seat.id)
                .select();

            if (error) {
                console.error('Supabase error:', error);
                if (error.message.includes('column "is_broken" does not exist')) {
                    alert('Грешка: Колона "is_broken" не постоји у бази. Молимо контактирајте администратора.');
                } else {
                    alert('Грешка при означавању места као покварено: ' + error.message);
                }
                return;
            }

            console.log('Successfully updated seat:', data);
            fetchSeats();
        } catch (error) {
            console.error('Error marking seat as broken:', error);
            alert('Грешка при означавању места као покварено');
        }
    };

    const handleCancelReservation = async (seat) => {
        const studentId = prompt("Унесите ваш број индекса да откажете резервацију:");
        if (!studentId) return;

        try {
            const { error } = await supabase
                .from('seats')
                .update({ 
                    is_reserved: false,
                    customer_name: null,
                    student_id: null,
                    faculty: null 
                })
                .eq('id', seat.id)
                .eq('student_id', studentId);

            if (error) throw error;
            alert('Резервација је успешно отказана!');
            fetchSeats();
        } catch (error) {
            console.error('Error canceling reservation:', error);
            alert('Грешка при отказивању резервације: Број индекса се не подудара са резервацијом');
        }
    };

    const handleReservation = async (e) => {
        e.preventDefault()
        try {
            console.log('Attempting reservation with:', {
                seats: selectedSeats,
                customerName,
                studentId,
                faculty
            });

            const { error } = await supabase
                .from('seats')
                .update({ 
                    is_reserved: true,
                    customer_name: customerName,
                    student_id: studentId,
                    faculty: faculty 
                })
                .in('id', selectedSeats.map(s => s.id));
            
            if (error) throw error;
            
            alert('Резервација је успешно извршена!');
            setSelectedSeats([]);
            setCustomerName('');
            setStudentId('');
            setFaculty('');
            fetchSeats();
        } catch (error) {
            console.error('Error making reservation:', error);
            alert('Грешка при резервацији: ' + error.message);
        }
    }

    const handleClearAll = async () => {
        const adminPassword = prompt("Унесите администраторску лозинку:");
        if (!adminPassword) return;

        // Check for correct admin password
        if (adminPassword !== "admin123") {
            alert("Погрешна администраторска лозинка!");
            return;
        }

        if (window.confirm('Да ли сте сигурни да желите да обришете све резервације? Ова акција се не може поништити.')) {
            try {
                // First, get all seats to preserve their data
                const { data: currentSeats, error: fetchError } = await supabase
                    .from('seats')
                    .select('*');

                if (fetchError) throw fetchError;

                // Update each seat, preserving everything except reservation data
                const updates = currentSeats.map(seat => ({
                    ...seat, // Keep all existing data
                    is_reserved: false,
                    customer_name: null,
                    student_id: null,
                    faculty: null
                }));

                const { error: updateError } = await supabase
                    .from('seats')
                    .upsert(updates);

                if (updateError) throw updateError;
                
                alert('Све резервације су успешно обрисане!');
                fetchSeats();
            } catch (error) {
                console.error('Error clearing reservations:', error);
                alert('Грешка при брисању резервација: ' + error.message);
            }
        }
    };

    const toggleAdminControls = (e) => {
        if (e.ctrlKey && e.altKey && (e.key === 'A' || e.key === 'a')) {
            setShowAdminControls(prev => !prev);
            console.log('Admin controls toggled:', !showAdminControls);
        }
    };

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000
            }}>
                <h2>Loading...</h2>
                <p>Учитавање података...</p>
            </div>
        );
    }

    if (error) return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxWidth: '80%'
        }}>
            <h2 style={{color: 'red'}}>Error</h2>
            <p>{error}</p>
            <button 
                onClick={() => window.location.reload()}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="theater-booking">
            {showAdminControls && (
                <div className="admin-controls">
                    <button 
                        className="clear-all-button" 
                        onClick={handleClearAll}
                    >
                        Обриши све резервације
                    </button>
                    <button 
                        className={`mark-broken-button ${isMarkingBroken ? 'active' : ''}`}
                        onClick={() => setIsMarkingBroken(!isMarkingBroken)}
                    >
                        {isMarkingBroken ? 'Заврши означавање' : 'Означи покварена места'}
                    </button>
                </div>
            )}
            <h1>Резервација</h1>
            <div className="screen">ЕКРАН</div>
            
            <div className="seating-plan">
                {['I', 'II', 'III', 'IV'].map(section => (
                    <div key={section} className="section">
                        <h3>Сектор {section}</h3>
                        <div className="column-numbers">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="column-number">{i + 1}</div>
                            ))}
                        </div>
                        <div className="rows">
                            {[...Array(10)].map((_, rowIndex) => {
                                const rowLetter = String.fromCharCode(65 + rowIndex);
                                return (
                                    <div key={rowLetter} className="row">
                                        <span className="row-label">{rowLetter}</span>
                                        <div className="seats">
                                            {seats
                                                .filter(seat => seat.section === sectionMapping[section] && seat.row === rowLetter)
                                                .sort((a, b) => a.seat_column - b.seat_column)
                                                .map(seat => (
                                                    <div
                                                        key={seat.id}
                                                        className={`seat ${seat.is_reserved ? 'booked' : ''} 
                                                            ${seat.is_broken ? 'broken' : ''}
                                                            ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            if (isMarkingBroken) {
                                                                handleMarkBroken(seat);
                                                            } else if (seat.is_reserved) {
                                                                handleCancelReservation(seat);
                                                            } else {
                                                                handleSeatClick(seat);
                                                            }
                                                        }}
                                                        title={seat.is_broken ? 'Покварено место' : 
                                                               seat.is_reserved ? `Reserved by: ${seat.customer_name}\nClick to cancel` : 
                                                               'Click to select'}
                                                    >
                                                        {seat.seat_column}
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
                <div className="legend-item">
                    <div className="seat broken"></div>
                    <span>Покварено</span>
                </div>
            </div>

            {selectedSeats.length > 0 && (
                <div className="reservation-form">
                    <h3>Завршите вашу резервацију</h3>
                    <p>Изабрана места: {selectedSeats.map(s => 
                        `${s.section}${s.row}${s.seat_column}`).join(', ')}</p>
                    
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