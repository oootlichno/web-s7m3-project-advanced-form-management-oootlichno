import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

const users = () => ({
  username: '',
  favLanguage: '', 
  favFood: '', 
  agreement: false,
});

const usersErrors = () => ({
  username: '',
  favLanguage: '', 
  favFood: '',
  agreement: '',
});

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
};

const formSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: yup
    .string()
    .oneOf(['javascript', 'rust'], e.favLanguageOptions)
    .required(e.favLanguageRequired),
  favFood: yup
    .string()
    .oneOf(["pizza", "spaghetti", "broccoli"], e.favFoodOptions)
    .required(e.favFoodRequired),
  agreement: yup
    .boolean()
    .oneOf([true], e.agreementOptions)
    .required(e.agreementRequired),
});

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

export default function App() {
  const [user, setUser] = useState(users()); 
  const [errors, setErrors] = useState(usersErrors()); 
  const [serverSuccess, setserverSuccess] = useState(); 
  const [serverFailure, setserverFailure] = useState();
  const [formEnabled, setformEnabled] = useState(false)

  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

 useEffect(() => {
    formSchema.isValid(user).then(setformEnabled)
  }, [user]); 

  const onChange = evt => {
    let { name, value, checked, type } = evt.target
    value = type === "checkbox" ? checked : value
    setUser({...user, [name]: value})
    
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({
          ...errors,
          [name]: ''
        });
      })
      .catch(err => {
        setErrors({
          ...errors,
          [name]: err.errors[0]
        });
      }); 
  }; 
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
  


  const onSubmit = evt => {
  evt.preventDefault();
  axios.post('https://webapis.bloomtechdev.com/registration', user)
      .then(res => {
        setUser(users())
        setserverSuccess(res.data.message)
        console.log(res);
        setserverFailure()
      })
      .catch(err => {
        setserverFailure(err.response.data.message)
        setserverSuccess()
       
  });
}

    //formSubmit();
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.


  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {serverSuccess && <h4 className="success">{serverSuccess}</h4>}
        {serverFailure && <h4 className="error">{serverFailure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            id="username" 
            name="username" 
            type="text"
            placeholder="Type Username" 
            onChange={onChange}
            value={user.username}
          />
           {errors.username && <div className="validation">{errors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input 
                type="radio" 
                name="favLanguage" 
                value="javascript"
                onChange={onChange}
                checked={user.favLanguage === "javascript"}
              />
              JavaScript
            </label>

            <label>
              <input
                type="radio"
                name="favLanguage"
                value="rust" 
                onChange={onChange}
                checked={user.favLanguage === "rust"}
              />
              Rust
            </label>
          </fieldset>
          {errors.favLanguage && <div className="validation">{errors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select 
            id="favFood" 
            name="favFood"
            onChange={onChange}
            value={user.favFood}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errors.favFood && <div className="validation">{errors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input 
              id="agreement" 
              type="checkbox" 
              name="agreement"
              onChange={onChange}
              checked={user.agreement}
            />
            Agree to our terms
          </label>
          {errors.agreement && <div className="validation">{errors.agreement}</div>}
        </div>

        <div>
          <input disabled={!formEnabled} type="submit" />
        </div>
      </form>
    </div>
  );
}
