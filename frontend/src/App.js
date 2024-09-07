// import React, {Component} from 'react';
// import './App.css';
// import Modal from './components/Modal'
// import axios from 'axios';


 
// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       modal: false,
//        viewCompleted:false,
//        activeItem: {
//         title: "",
//         description: "",
//         completed: false,
//        },
//        todoList : []
//     };
//   }


// componentDidMount() {
//   this.refreshList(); // Call refreshList to get tasks from the server
// }

// refreshList = () => {
//   axios.get("http://localhost:8000/api/tasks/")
//     .then(res => this.setState({ tasks: res.data }))
//     .catch(err => console.log(err));
// };

//   // Create toggle property
//   toggle = () => {
//     this.setState({modal: !this.state.modal});
//   };

//   // handleSubmit = item => {
//   //   this.toggle();
//   //   // alert('Saved!' + JSON.stringify(item));
//   //   if(item.id){
//   //       axios
//   //       .post(`http://localhost:8000/api/tasks/${item.id}/`, item)
//   //       .then(res => {
//   //         this.refreshList();
//   //       })
//   //     }
//   //     axios
//   //           .get("http://localhost:8000/api/tasks/", item)
//   //           .then(res => {
//   //             this.refreshList();
//   //           })
//   //   };

//   handleSubmit = item => {
//     this.toggle();
//     if (item.id) {
//       axios
//         .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
//         .then(res => {
//           this.refreshList();
//         })
//         .catch(err => console.log(err));
//     } else {
//       axios
//         .post("http://localhost:8000/api/tasks/", item)
//         .then(res => {
//           this.refreshList();
//         })
//         .catch(err => console.log(err));
//     }
//   };

//   handleDelete = item => {

//     axios
//         .delete(`http://localhost:8000/api/tasks/${item.id}/`)
//         .then(res => this.refreshList())

//   }

//   createItem = () => {
//     const item = {title: "", modal: !this.state.modal}
//     this.setState({activeItem: item, modal: !this.state.modal})
//   }

//   editItem = item => {
//     this.setState({activeItem: item, modal: !this.state.modal})
//   }


//   displayCompleted = status => {
//     this.setState({ viewCompleted: status }); // Simplified and corrected
//   }

//   renderTabList = () => {
//     return (
//       <div className='my-5 tab-list'>
//         <span 
//         onClick={() => this.displayCompleted(true)}
//         className={this.state.viewCompleted ? "active" : ""}>Completed</span>

//         <span
//         onClick={() => this.displayCompleted(false)}
//         className={!this.state.viewCompleted ? "active" : ""}
//         >Incompleted</span>
//       </div>
  
//     );
//   };


//   renderItem = () => { 
//     const { viewCompleted } = this.state;
//     const navItems = this.state.todoList.filter(
//       (item) => item.completed === viewCompleted // Using strict equality
//     );
  
//     return navItems.map((item) => {
//       // Added 'return' to return the JSX for each item
//       return (
//         <li
//           key={item.id}
//           className="list-group-item d-flex justify-content-between align-items-center"
//         >
//           <span
//             className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
//             title={item.title}
//           >
//             {item.title}
//           </span>
//           <span>
//             <button className="btn btn-info mr-2">Edit</button>
//             <button className="btn btn-danger mr-2">Delete</button>
//           </span>
//         </li>
//       );
//     });
//   };



//   render (){
//     return(
//       <main className="content p-3 mb-2 bg-info">
//         <h1 className='text-white text-uppercase text-center my-4'>Task Manager</h1>
//         <h1 className='row'></h1>
//         <div className='col-md-6 col-sma-10 mx-auto p-0'>
//           <div className='card p-3'>
//             <div>
//               <button className='btn btn-warning' onClick={this.createItem} >Add Task</button>
//             </div>
//              {this.renderTabList()}
//              <ul className='list-group list-group-flush'>
//               {this.renderItem()}
//              </ul>

//           </div>

//         </div>
//         <footer className='my-5 mb-2 bg-info text-white text-center'>Copyright 2021 &copy; All Rights Reserved</footer>
//         {this.state.modal ? (
//           <Modal activeItem = {this.state.activeItem} toggle = {this.toggle} onSave={this.handleSubmit}> </Modal>
//         ) : null }
//       </main>
//     )
//   }

// }


// export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from './components/Modal';
import axios from 'axios';

const App = () => {
  // State management with useState hooks
  const [modal, setModal] = useState(false);
  const [viewCompleted, setViewCompleted] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [todoList, setTodoList] = useState([]);

  // Fetch the initial list of tasks when the component mounts
  useEffect(() => {
    refreshList();
  }, []);

  // Fetch tasks from the server
  const refreshList = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tasks/");
      setTodoList(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Toggle the modal visibility
  const toggle = () => {
    setModal(!modal);
  };

  // Handle form submission for creating or updating a task
  const handleSubmit = async (item) => {
    toggle();
    try {
      if (item.id) {
        // Update an existing task
        await axios.put(`http://localhost:8000/api/tasks/${item.id}/`, item);
      } else {
        // Create a new task
        await axios.post("http://localhost:8000/api/tasks/", item);
      }
      refreshList();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // Handle deleting a task
  const handleDelete = async (item) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${item.id}/`);
      refreshList();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Create a new task item and open the modal
  const createItem = () => {
    const item = { title: "", description: "", completed: false };
    setActiveItem(item);
    toggle();
  };

  // Edit an existing task item and open the modal
  const editItem = (item) => {
    setActiveItem(item);
    toggle();
  };

  // Display tasks based on their completion status
  const displayCompleted = (status) => {
    setViewCompleted(status);
  };

  // Render the tab list for toggling between completed and incomplete tasks
  const renderTabList = () => (
    <div className='my-5 tab-list'>
      <span onClick={() => displayCompleted(true)} className={viewCompleted ? "active" : ""}>Completed</span>
      <span onClick={() => displayCompleted(false)} className={!viewCompleted ? "active" : ""}>Incompleted</span>
    </div>
  );

  // Render the list of tasks
  const renderItems = () => {
    const filteredItems = todoList.filter(item => item.completed === viewCompleted);
    return filteredItems.map(item => (
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`} title={item.title}>
          {item.title}
        </span>
        <span>
          <button className="btn btn-info mr-2" onClick={() => editItem(item)}>Edit</button>
          <button className="btn btn-danger" onClick={() => handleDelete(item)}>Delete</button>
        </span>
      </li>
    ));
  };

  // Main render
  return (
    <main className="content p-3 mb-2 bg-info">
      <h1 className="text-white text-uppercase text-center my-4">Task Manager</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <button className="btn btn-warning" onClick={createItem}>Add Task</button>
            {renderTabList()}
            <ul className="list-group list-group-flush">
              {renderItems()}
            </ul>
          </div>
        </div>
      </div>
      <footer className="my-5 mb-2 bg-info text-white text-center">Copyright 2021 &copy; All Rights Reserved</footer>
      {modal ? (
        <Modal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} />
      ) : null}
    </main>
  );
};

export default App;
