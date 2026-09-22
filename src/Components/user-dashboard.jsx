import axios from "axios";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function UserDashBoard(){

    let navigate =  useNavigate();

    const [cookies, setCookies, removeCookies] = useCookies(['username', 'user_id']);

    const [appointments, setAppointments] = useState([{id: null, title: null, description: null, date: null, user_id: null}]);
    
    const [appointment, setAppointment] = useState({id: '', title: '', description: '', date: '', user_id: ''});

    const formNewTask = useFormik({
        initialValues: {
            title: '',
            description: '',
            date: '',
            user_id: cookies['user_id']
        },
        onSubmit: (appointments)=>{
            axios.post(`http://localhost:3000/appointments`, appointments)
            .then(()=>{
                LoadAppointments();
            })
        },
        enableReinitialize: true
    });

    const formEditTask = useFormik({
        initialValues: {
            id: appointment.id,
            title: appointment.title,
            description: appointment.description,
            date: appointment.date,
            user_id: appointment.user_id
        },
        onSubmit: (appointments)=>{
            axios.put(`http://localhost:3000/appointments/${appointments.id}`, appointments)
            .then(()=>{
                LoadAppointments();
            })
        },
        enableReinitialize: true
    });
    
    function LoadAppointments(){
        axios.get(`http://localhost:3000/appointments`)
        .then(response=>{
            let user_appointments = response.data.filter(item=>item.user_id===cookies['user_id']);
            setAppointments(user_appointments);
        });
    };

    function handleSignout(){
        removeCookies('user_id');
        removeCookies('username');
        navigate('/login');
    }

    function handleEditClick(appointment){
        setAppointment(appointment)
    }

    function handleDeleteClick(appointment){
        let flag = confirm(`Are you sure want to Delete\n${appointment.title.toUpperCase()}`)
        if(flag==true){
            axios.delete(`http://localhost:3000/appointments/${appointment.id}`)
            .then(()=>{
                LoadAppointments();
            })
        }
    }

    useEffect(()=>{
        LoadAppointments();
    }, [appointments]);
    


    return(
        <div className="row p-2">
            <div className="col-2 d-flex flex-column justify-content-between p-3" style={{height:'690px'}}>
                <div>
                    <div className="fs-1 fw-bold text-primary">Task Flow</div>
                        <ul className="list-group">
                            <li className="list-group-item list-group-item-light p-3"><span className="bi bi-columns-gap fw-bold text-primary"> {cookies['username']}'s DashBoard</span></li>
                            <li className="list-group-item list-group-item-light p-3 my-3"><button className="btn btn-primary w-100" data-bs-target='#newTask' data-bs-toggle='modal'><span className="bi bi-plus-lg"></span>New Appointment</button></li>
                            <li className="list-group-item list-group-item-light p-3 my-3"><span className="bi bi-check-circle"> Tasks</span></li>
                            <li className="list-group-item list-group-item-light p-3"><span className="bi bi-calendar-date"> Calender</span></li>
                        </ul>
                    </div>
                <div>
                    <button onClick={handleSignout} className="btn btn-primary w-100">Signout</button>
                </div>
            </div>
            <div className="col-10">
                <div className="bg-light p-5 mt-3">
                    Filter, Search
                </div>
                <div className="d-flex flex-wrap">
                    {
                        appointments.map(appointment=>
                            <div key={appointment.id} className="card m-2 p-2" style={{width:'500px'}}>
                                <div className="card-header d-flex justify-content-between">
                                    <span className="text-uppercase fw-bold">{appointment.title}</span>
                                    <span><span className="bi bi-calendar-date"></span> {moment(appointment.date).format('DD dddd, MMM, YYYY')}</span>
                                </div>
                                <div className="card-body">
                                    <div>{appointment.description}</div>
                                </div>
                                    <div className="card-footer">
                                        <button data-bs-target='#editTask' data-bs-toggle='modal' onClick={()=>handleEditClick(appointment)} className="btn btn-warning bi bi-pen-fill"></button>
                                        <button onClick={()=>handleDeleteClick(appointment)} className="btn btn-danger bi bi-trash-fill mx-2"></button>
                                    </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="modal fade" id="newTask">
                <form onSubmit={formNewTask.handleSubmit}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>New Appointment</h3>
                            </div>
                            <div className="modal-body">
                                <dl>
                                    <dt>Title</dt>
                                    <dd><input type="text" className="form-control" name="title" onChange={formNewTask.handleChange}/></dd>
                                    <dt>Description</dt>
                                    <dd><textarea rows='4' cols='40' className="form-control" name="description" onChange={formNewTask.handleChange}></textarea></dd>
                                    <dt>Date</dt>
                                    <dd><input type="date" className="form-control" name="date" onChange={formNewTask.handleChange}/></dd>
                                </dl>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" data-bs-dismiss='modal' className="btn btn-primary">Add</button>
                                <button type="button" data-bs-dismiss='modal' className="btn btn-warning">Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="modal fade" id="editTask">
                <form onSubmit={formEditTask.handleSubmit}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Edit Appointment</h3>
                            </div>
                            <div className="modal-body">
                                <dl>
                                    <input type="hidden" name="id" value={formEditTask.values.id}/>
                                    <dt>Title</dt>
                                    <dd><input type="text" className="form-control" value={formEditTask.values.title} name="title" onChange={formEditTask.handleChange}/></dd>
                                    <dt>Description</dt>
                                    <dd><textarea rows='4' cols='40' className="form-control" value={formEditTask.values.description} name="description" onChange={formEditTask.handleChange}></textarea></dd>
                                    <dt>Date</dt>
                                    <dd><input type="date" className="form-control" value={formEditTask.values.date} name="date" onChange={formEditTask.handleChange}/></dd>
                                </dl>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" data-bs-dismiss='modal' className="btn btn-primary">Edit</button>
                                <button type="button" data-bs-dismiss='modal' className="btn btn-warning">Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}