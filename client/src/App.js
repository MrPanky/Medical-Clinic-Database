import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Doctors from "./pages/Doctors";
import Add_Doctor from "./pages/Add_Doctor";
import Update_Doctor from "./pages/Update_Doctor";
import Login from "./pages/Login";
import Not_Found from "./pages/Not_Found"; 
import Employee_Info from "./pages/Employee_Info";
import Doctor_View from "./pages/Doctor_View";
import Nurse_View from "./pages/Nurse_View";
import Billing_Staff_View from "./pages/Billing_Staff_View";
import Office_Staff_View from "./pages/Office_Staff_View";
import Director_View from "./pages/Director_View";
import Patient_View from "./pages/Patient_View"; 
import Add_Staff from "./pages/Add_Staff"; 
import Update_OfficeStaff from "./pages/Update_OfficeStaff";
import Update_BillingStaff from "./pages/Update_BillingStaff";
import Appointment_Info from "./pages/Appointment_Info";
import Patient_Info from "./pages/Patient_Info";
import Office_Statistics from "./pages/Office_Statistics";
//billing staff routes
import Created_invoice from "./pages/Created_invoice";
import SearchPatient from "./pages/SearchPatient";
import See_Patient_Balance from "./pages/See_Patient_Balance";
import See_Previous_Invoices from "./pages/See_Previous_Invoices";
import Past_Due_Patients from "./pages/Past_Due_Patients";
import Search_Patient_ID from "./pages/Search_Patient_ID";
import Results_Patient_ID from "./pages/Results_Patient_ID";
//end of billing staff routes
import Front_Page from "./pages/Front_Page";




function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Front_Page />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee_info" element={<Employee_Info />} />
          <Route path="/doctor_view" element={<Doctor_View />} />
          <Route path="/nurse_view" element={<Nurse_View />} />
          <Route path="/billing_staff_view" element={<Billing_Staff_View />} />
          <Route path="/office_staff_view" element={<Office_Staff_View />} />
          <Route path="/director_view" element={<Director_View />} />
          <Route path="/director_view/office_statistics" element={<Office_Statistics />} />
          <Route path="/patient_view" element={<Patient_View />} /> 
          <Route path="/appointment_info/:appointmentId" element={<Appointment_Info />} />
          <Route path="/patient_info/:id" element={<Patient_Info />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="*" element={<Not_Found />} />
          <Route path="/add_doctor" element={<Add_Doctor />} />
          <Route path="/update_doctor/:employee_ID" element={<Update_Doctor />} />
          <Route path="/add_staff" element={<Add_Staff />} />
          <Route path="/update_officestaff/:employee_ID" element={<Update_OfficeStaff />} />
          <Route path="/update_billingstaff/:employee_ID" element={<Update_BillingStaff />} />  
          <Route path="/billing_staff_view/SearchPatient" element={<SearchPatient />} />
          <Route path="/billing_staff_view/SearchPatient/See_Patient_Balance" element={<See_Patient_Balance />} />
          <Route path="/billing_staff_view/SearchPatient/See_Previous_Invoices" element={<See_Previous_Invoices />} />
          <Route path="/billing_staff_view/SearchPatient/See_Patient_Balance/Created_invoice" element={<Created_invoice />} />
          <Route path="/billing_staff_view/Past_Due_Patients" element={<Past_Due_Patients />} />
          <Route path="/billing_staff_view/Search_Patient_ID" element={<Search_Patient_ID />} />
          <Route path="/billing_staff_view/Search_Patient_ID/Results_Patient_ID" element={<Results_Patient_ID />} />
        </Routes>
      </BrowserRouter>
    </div>  
  );
}

export default App;
