import React from 'react';
import NavBar from "../Componants/NavBar"
import { supabase } from '../supaBaseClient.jsx';
import DatePicker from 'react-datepicker'; // Make sure you have this installed
import 'react-datepicker/dist/react-datepicker.css';

export default function Post(){
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const addEvent = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data: eventData, error: eventError } = await supabase
            .from('Event')
            .insert({
                date_start: startDate,
                date_end: endDate,
                title: title,
                description: description
            });

        if(eventError){
            console.error("Error adding event: ", eventError);
            alert('Failed to add event');
        } else {
            console.log("Event added: ", eventData);
            alert('Event added!');
            setTitle('');
            setDescription('');
            setStartDate(null);
            setEndDate(null);
        }

        setLoading(false);
    };

    return(
        <div>
            <NavBar/>
            <div className="event-add">
                <form onSubmit={addEvent}>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Event Title"
                        required
                    />
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Event Description"
                        required
                    />
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText='Select Start Date'
                        dateFormat="yyyy-MM-dd"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText='Select End Date'
                        dateFormat="yyyy-MM-dd"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Event'}
                    </button>
                </form>
            </div>
        </div>
    )
}
