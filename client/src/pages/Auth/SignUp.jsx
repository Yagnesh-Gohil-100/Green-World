// import React, { useState } from "react";
// import axios from "axios";
// import { FaLeaf, FaUser, FaBuilding } from "react-icons/fa"; // Added icons
// import "./SignUp.css";
// const SignUp = () => {
//     const [activeTab, setActiveTab] = useState("personal");
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//     const validate = () => {
//         let tempErrors = {};
//         if (!formData.name.trim()) {
//             tempErrors.name =
//                 activeTab === "personal"
//                     ? "Full name is required"
//                     : "Employee name is required";
//         }
//         if (!formData.email) {
//             tempErrors.email = "Email is required";
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             tempErrors.email = "Invalid email format";
//         }
//         if (!formData.password) {
//             tempErrors.password = "Password is required";
//         } else if (formData.password.length < 6) {
//             tempErrors.password = "Password must be at least 6 characters";
//         }
//         setErrors(tempErrors);
//         return Object.keys(tempErrors).length === 0;
//     };
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validate()) return;
//         setLoading(true);
//         try {
//             console.log(formData);

//             await axios.post("http://localhost:5000/api/auth/signup", {
//                 ...formData,
//                 userType: activeTab,
//             });
//             alert("Signup successful!");
//             setFormData({ name: "", email: "", password: "" });
//             setErrors({});
//         } catch (err) {
//             console.error(err);
//             alert("Signup failed!");
//         } finally {
//             setLoading(false);
//         }
//     };
//     return (
//         <div className="signup-container">
//             {/* Falling Leaves Animation */}
//             <div className="falling-leaves">
//                 {Array.from({ length: 10 }).map((_, i) => (
//                     <FaLeaf key={i} className="leaf-icon" />
//                 ))}
//             </div>
//             <div className="signup-card">
//                 <h2 className="signup-title">Create Account</h2>
//                 {/* Tabs */}
//                 <div className="tab-container">
//                     <button
//                         type="button"
//                         className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
//                         onClick={() => setActiveTab("personal")}
//                     >
//                         <FaUser className="tab-icon" /> Personal
//                     </button>
//                     <button
//                         type="button"
//                         className={`tab-btn ${activeTab === "business" ? "active" : ""}`}
//                         onClick={() => setActiveTab("business")}
//                     >
//                         <FaBuilding className="tab-icon" /> Business
//                     </button>
//                 </div>
//                 {/* Form */}
//                 <form onSubmit={handleSubmit} noValidate>
//                     <div className="form-group">
//                         <label>
//                             {activeTab === "personal" ? "Full Name" : "Employee Name"}
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             placeholder={
//                                 activeTab === "personal"
//                                     ? "Enter your full name"
//                                     : "Enter employee name"
//                             }
//                             value={formData.name}
//                             onChange={handleChange}
//                         />
//                         {errors.name && <p className="error">{errors.name}</p>}
//                     </div>
//                     <div className="form-group">
//                         <label>Email Address</label>
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Enter your email"
//                             value={formData.email}
//                             onChange={handleChange}
//                         />
//                         {errors.email && <p className="error">{errors.email}</p>}
//                     </div>
//                     <div className="form-group">
//                         <label>Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             placeholder="Enter your password"
//                             value={formData.password}
//                             onChange={handleChange}
//                         />
//                         {errors.password && <p className="error">{errors.password}</p>}
//                     </div>
//                     <button type="submit" className="submit-btn" disabled={loading}>
//                         {loading ? "Creating..." : "Create Account →"}
//                     </button>
//                 </form>
//                 <p className="signin-link">
//                     Already have an account? <a href="/signin">Sign in</a>
//                 </p>
//             </div>
//         </div>
//     );
// };
// export default SignUp;


// -------------------------------------------------------------------------------------

import React, { useState } from "react";


 

import axios from "axios";


 

import { FaUser, FaBuilding } from "react-icons/fa"; // ✅ Icons


 

import "./SignUp.css";


 

const SignUp = () => {


 

  const [activeTab, setActiveTab] = useState("personal");


 

  const [role, setRole] = useState(""); // ✅ NEW for business dropdown


 

  const [formData, setFormData] = useState({


 

    name: "",


 

    organization: "",


 

    email: "",


 

    password: "",


 

  });


 

  const [errors, setErrors] = useState({});


 

  const [loading, setLoading] = useState(false);


 

  const handleChange = (e) => {


 

    setFormData({ ...formData, [e.target.name]: e.target.value });


 

  };


 

  const validate = () => {


 

    let tempErrors = {};


 

    if (activeTab === "personal") {


 

      if (!formData.name.trim()) {


 

        tempErrors.name = "Full name is required";


 

      }


 

    } else if (activeTab === "business") {


 

      if (!role) {


 

        tempErrors.role = "Please select role";


 

      }


 

      if (role === "employee" && !formData.name.trim()) {


 

        tempErrors.name = "Employee name is required";


 

      }


 

      if (role === "employee" && !formData.organization.trim()) {


 

        tempErrors.organization = "Organization name is required";


 

      }


 

      if (role === "admin" && !formData.organization.trim()) {


 

        tempErrors.organization = "Organization name is required";


 

      }


 

    }


 

    if (!formData.email) {


 

      tempErrors.email = "Email is required";


 

    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {


 

      tempErrors.email = "Invalid email format";


 

    }


 

    if (!formData.password) {


 

      tempErrors.password = "Password is required";


 

    } else if (formData.password.length < 6) {


 

      tempErrors.password = "Password must be at least 6 characters";


 

    }


 

    setErrors(tempErrors);


 

    return Object.keys(tempErrors).length === 0;


 

  };


 

  const handleSubmit = async (e) => {


 

    e.preventDefault();


 

    if (!validate()) return;


 

    setLoading(true);


 

    try {


 

      let final_form_data = {};

      let url = "http://localhost:5000/api/auth/"


 

      if (activeTab === "business"){

        final_form_data = {

          ...formData, userType: "business_" + role

        }


 

        url = url + "register/business_" + role;  

      }

      // else personal

      else {

        final_form_data = {

          ...formData, userType: activeTab

        }


 

        url = url + "register/" + activeTab;

      }


 

      // await axios.post("/api/signup", {


 

      //   ...formData,


 

      //   type: activeTab,


 

      //   role, // ✅ send role to backend if business


 

      // });


 

      console.log(url);

      console.log(final_form_data);

     

      await axios.post(url, final_form_data)

        .then(res => {

          console.log("Data sent successfully");

        })

        .catch(error => {

          console.log(error.message);

        });


 

      alert("Signup successful!");


 

      setFormData({ name: "", organization: "", email: "", password: "" });


 

      setRole("");


 

      setErrors({});


 

    } catch (err) {


 

      console.error(err);


 

      alert("Signup failed!");


 

    } finally {


 

      setLoading(false);


 

    }


 

  };


 

  return (


 

    <div className="signup-container">


 

      <div className="signup-card">


 

        <h2 className="signup-title">Create Account</h2>


 

        {/* Tabs */}


 

        <div className="tab-container">


 

          <button


 

            type="button"


 

            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}


 

            onClick={() => {


 

              setActiveTab("personal");


 

              setRole("");


 

            }}


 

          >


 

            <FaUser className="tab-icon" /> Personal


 

          </button>


 

          <button


 

            type="button"


 

            className={`tab-btn ${activeTab === "business" ? "active" : ""}`}


 

            onClick={() => {


 

              setActiveTab("business");


 

              setRole("");


 

            }}


 

          >


 

            <FaBuilding className="tab-icon" /> Business


 

          </button>


 

        </div>


 

        {/* Form */}


 

        <form onSubmit={handleSubmit} noValidate>


 

          {/* Personal Fields */}


 

          {activeTab === "personal" && (


 

            <div className="form-group">


 

              <label>Full Name</label>


 

              <input


 

                type="text"


 

                name="name"


 

                placeholder="Enter your full name"


 

                value={formData.name}


 

                onChange={handleChange}


 

              />


 

              {errors.name && <p className="error">{errors.name}</p>}


 

            </div>


 

          )}


 

          {/* Business Fields */}


 

          {activeTab === "business" && (


 

            <>


 

              {/* Dropdown for role */}


 

              <div className="form-group">


 

                <label>Select Role</label>


 

                <select


 

                  name="role"


 

                  className="dropdown-input"


 

                  value={role}


 

                  onChange={(e) => setRole(e.target.value)}


 

                >


 

                  <option value="">-- Select Role --</option>


 

                  <option value="employee">Business Employee</option>


 

                  <option value="admin">Business Admin</option>


 

                </select>


 

                {errors.role && <p className="error">{errors.role}</p>}


 

              </div>


 

              {/* If employee → employee name + organization */}


 

              {role === "employee" && (


 

                <>


 

                  <div className="form-group">


 

                    <label>Employee Name</label>


 

                    <input


 

                      type="text"


 

                      name="name"


 

                      placeholder="Enter employee name"


 

                      value={formData.name}


 

                      onChange={handleChange}


 

                    />


 

                    {errors.name && <p className="error">{errors.name}</p>}


 

                  </div>


 

                  <div className="form-group">


 

                    <label>Organization Name</label>


 

                    <input


 

                      type="text"


 

                      name="organization"


 

                      placeholder="Enter organization name"


 

                      value={formData.organization}


 

                      onChange={handleChange}


 

                    />


 

                    {errors.organization && (


 

                      <p className="error">{errors.organization}</p>


 

                    )}


 

                  </div>


 

                </>


 

              )}


 

              {/* If admin → only organization */}


 

              {role === "admin" && (


 

                <div className="form-group">


 

                  <label>Organization Name</label>


 

                  <input


 

                    type="text"


 

                    name="organization"


 

                    placeholder="Enter organization name"


 

                    value={formData.organization}


 

                    onChange={handleChange}


 

                  />


 

                  {errors.organization && (


 

                    <p className="error">{errors.organization}</p>


 

                  )}


 

                </div>


 

              )}


 

            </>


 

          )}


 

          {/* Common Fields (Email + Password) */}


 

          <div className="form-group">


 

            <label>Email Address</label>


 

            <input


 

              type="email"


 

              name="email"


 

              placeholder="Enter your email"


 

              value={formData.email}


 

              onChange={handleChange}


 

            />


 

            {errors.email && <p className="error">{errors.email}</p>}


 

          </div>


 

          <div className="form-group">


 

            <label>Password</label>


 

            <input


 

              type="password"


 

              name="password"


 

              placeholder="Enter your password"


 

              value={formData.password}


 

              onChange={handleChange}


 

            />


 

            {errors.password && <p className="error">{errors.password}</p>}


 

          </div>


 

          <button type="submit" className="submit-btn" disabled={loading}>


 

            {loading ? "Creating..." : "Create Account →"}


 

          </button>


 

        </form>


 

        <p className="signin-link">


 

          Already have an account? <a href="/signin">Sign in</a>


 

        </p>


 

      </div>


 

    </div>


 

  );


 

};


 

export default SignUp;