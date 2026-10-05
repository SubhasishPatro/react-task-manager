import axios from "axios";
import { useFormik } from "formik";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { taskStore } from "../Store/TaskStore";
import { addToShare } from "../Slicers/TaskSlicer";
import { API_URL } from "../api";

export function UserDashBoard(){

    let navigate =  useNavigate();
    let dispath = useDispatch();

    const [cookies, setCookies, removeCookies] = useCookies(['username', 'user_id']);

    const [appointments, setAppointments] = useState([{id: null, title: null, description: null, date: null, user_id: null}]);
    
    const [appointment, setAppointment] = useState({id: '', title: '', description: '', date: '', user_id: ''});
    const [searchString, setSearchString] = useState('');

    const formNewTask = useFormik({
        initialValues: {
            title: '',
            description: '',
            date: '',
            user_id: cookies['user_id']
        },
        onSubmit: (appointments)=>{
            axios.post(`${API_URL}/appointments`, appointments)
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
            axios.put(`${API_URL}/appointments/${appointments.id}`, appointments)
            .then(()=>{
                LoadAppointments();
            })
        },
        enableReinitialize: true
    });
    
    // Whenever some changes happened then only this will update, otherwise it only uses the cached data(appointments)
    const LoadAppointments = useCallback(()=>{
        axios.get(`${API_URL}/appointments`)
        .then(response=>{
            setAppointments(response.data);
        });
    },[appointments]);

    //Here cached data will be used qhen required, No need to fetch the task again and again
    const filteredAppointments = useMemo(()=>{
        if(searchString===''){
            return appointments.filter(appointment=> appointment.user_id===cookies['user_id']);
        }
        else{
            return appointments.filter(appointment=> appointment.user_id===cookies['user_id']).filter(item=>item.title.toLowerCase().includes(searchString.toLowerCase()));
        }
    }, [appointments, cookies['user_id']]);

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
            axios.delete(`${API_URL}/appointments/${appointment.id}`)
            .then(()=>{
                LoadAppointments();
            })
        }
    }

    function handleSearchChange(e){
        setSearchString(e.target.value);
    }
    
    function handleShareClick(appointment){
        dispath(addToShare(appointment));
        alert('Appointment Shared Successfully')
    }





    useEffect(()=>{
        LoadAppointments();
    }, [appointments, taskStore]);
    


    return(
        <div className="row p-2">
            <div className="col-2 d-flex flex-column justify-content-between p-3" style={{height:'690px'}}>
                <div>
                    <div className="fs-1 fw-bold text-primary">Task Flow</div>
                        <ul className="list-group">
                            <li className="list-group-item list-group-item-light p-3"><span className="bi bi-columns-gap fw-bold text-primary"> {cookies['username']}'s DashBoard</span></li>
                            <li className="list-group-item p-3 list-group-item-light"><button data-bs-target="#shared" data-bs-toggle="offcanvas" className="btn btn-dark bi bi-share w-100 position-relative"> Shared <span className="badge bg-danger rounded rounded-circle position-absolute">{taskStore.getState().sharedTasksCount}</span></button></li>


                            <div className="offcanvas offcanvas-start" id="shared">
                                <div className="offcanvas-header">
                                    <h4>Shared Appointments</h4>
                                    <button className="btn btn-close" data-bs-dismiss="offcanvas"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>User</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                taskStore.getState().sharedTasks.map(task=>
                                                    <tr key={task.id}>
                                                        <td>{task.title}</td>
                                                        <td>{task.user_id}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>



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
                    <div>
                        <div className="position-relative">
                            <span className="bi position-absolute bi-search" style={{top:'5px', left:'10px'}}></span><input onChange={handleSearchChange} type="text" className="form-control ps-5" placeholder="search appointments"/>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-wrap">
                    {
                        (filteredAppointments.length===0)?
                        <div className="mt-4">No Appointments Found</div>
                        :
                        filteredAppointments.map(appointment=>
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
                                        <button onClick={()=>handleShareClick(appointment)} className="btn btn-dark bi bi-share-fill"></button>
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