import axios from "axios";
import React, {useState, useEffect} from "react";
import * as yup from "yup";

const formSchema = yup.object().shape({
    name: yup.string().required("name"),
    email: yup.string().email().required("email"),
    password: yup.string().required("password"),  
    checkbox: yup.boolean().oneOf([true], "checkbox"),
  });


export default function Form() {
    const [formState, setFormState] = useState({
      name: "",
      email: "",
      password: "",
      checkbox: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        checkbox: "",
    })

    const [submitDisable, setSubmitDisabled] = useState(true);

    const [post, setPost] = useState([]);
    useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setSubmitDisabled(!valid);
        });
     }, [formState]);


    const validateChange = e => {
        yup
          .reach(formSchema, e.target.name)
          .validate(e.target.value)
          .then(valid => {
            setErrors({
              ...errors,
              [e.target.name]: ""
            });
          })
          .catch(err => {
            setErrors({
              ...errors,
              [e.target.name]: err.errors
            });
          });
      };
      const formSubmit = e => {
        e.preventDefault();
        axios
          .post("https://reqres.in/api/users", formState)
          .then(res => {
            setPost(res.data);
            console.log("success", post);

            setFormState({
              name: "",
              email: "",
              password: "",
              checkbox: "",
            });
          })
          .catch(err => {
            console.log(err.res);
          });
      };

    const inputChange = (event) => {
        event.persist();
        const newFormData = {
            ...formState,
            [event.target.name]:
              event.target.type === "checkbox" ? event.target.checked : event.target.value
          };
            validateChange(event);
            setFormState(newFormData);
    }

    return(
    <div>
        <h2>This is a form</h2>
        <form onSubmit={formSubmit}>
            <label htmlFor="name">
                Name
                <input 
                id="name"
                type="text"
                name="name"
                value={formState.name}
                onChange={inputChange}
                />
                {errors.name.length > 0 ? (<p className="error">{errors.name}</p> ): null}
            </label>
            <br/>
            <label htmlFor="email">
                Email
                <input 
                id="email"
                type="text"
                name="email"
                value={formState.email}
                onChange={inputChange}
                />
                {errors.email.length > 0 ? (<p className="error"> {errors.email}</p>) : null}
            </label>
            <br/>
            <label htmlFor="password">
                Password
                <input 
                id="password"
                type="password"
                name="password"
                value={formState.password}
                onChange={inputChange}
                />
                {errors.name.length > 0 ? (<p className="error">{errors.password}</p> ): null}
            </label>
            <br/>
            <label htmlFor="checkbox">
                Terms of Service
                <input 
                id="checkbox"
                type="checkbox"
                checked={formState.checkbox}
                name="checkbox"
                onChange={inputChange}
                />
                {errors.checked === false ? (<p className="error">{errors.checkbox}</p> ): null}
            </label>
            <br/>
            <pre>{JSON.stringify(post, null, 2)}</pre>

            <button disabled={submitDisable}>Submit</button>
        </form>
    </div> 
    )
}