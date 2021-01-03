import React, { useRef } from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import './style.css'

const GET_ALL_TODOS = gql`
{
  todos {
    id
    description
  }
}
`;

const ADD_TODO = gql`
  mutation addTodo($description: String!){
    addTodo(description: $description){
      id
    }
  }
`

export default function Home() {
  const { loading, error, data } = useQuery(GET_ALL_TODOS);
  const [addTodo] = useMutation(ADD_TODO);
  
  let descField;

  const addTask = () =>{
    addTodo({
      variables: {
        description: descField.value
      },
      refetchQueries: () => [{ query: GET_ALL_TODOS }]
    })
    descField.value = "";
    alert("your task has been submitted");
  }
console.log(data)
  if (loading)
    return <h3>Loading..</h3>

  if (error)

    return <h3>Error</h3>

  return (
    <div className="background">
       <h2 className="heading1">ADD TODO</h2>
      <form className='form1' >
        <input className="input1" type="text"
          placeholder="Enter Todo"
          ref= {node => {descField = node}}
          required={true} />
        <button className='addbutton' onClick={addTask}>+</button>
      </form> 
      
      <h2><span className='heading2'>My</span> <span className='heading3'>TODOS</span></h2>
      {/* {data && data.todos && (
        <div>{JSON.stringify(data.todos)}</div>
      )} */}
      <table >
        
        <tbody>
          {data?.todos.map(todo=>{
            return <tr key={todo.id}>
                
                <td>{todo.description}</td>

            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
}