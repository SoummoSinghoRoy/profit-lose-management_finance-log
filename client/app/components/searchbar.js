"use client"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { searchTransactionAction, allTransactionsFetchAction } from "@/lib/action/transaction.action";

export default function SearchBar() {
  const [searchterm, setSearchterm] = useState('');
  const dispatch = useDispatch();

  const searchInputHandler = (event) => {
    setSearchterm(event.target.value);
    if(event.target.value.trim() === "") {
      dispatch(allTransactionsFetchAction());
    }
  }
  
  const submitHandler = (event) => {
    event.preventDefault();
    console.log(searchterm);
    dispatch(searchTransactionAction(searchterm));
  }
  return (
    <form onSubmit={submitHandler} className="d-flex" role="search">
      <input
        className="form-control border-secondary me-2"
        type="search"
        name="search"
        placeholder="Search transaction e.g: income/expense or john"
        aria-label="Search"
        value={searchterm}
        onChange={searchInputHandler}
      />
      <button className="btn btn-outline-secondary" type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </button>
    </form>
  )
}