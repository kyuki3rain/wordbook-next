import React, { useState } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import styled from '@emotion/styled';
import { NextPage } from 'next';

const ColumnContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const Home: NextPage = () => {
  const [values, setValues] = useState({
    word: ""
  });
  const handleInputChange = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValues({ ...values, [name]: value });
  }
  const [result, setResult] = useState("");
  const search = () => {
    axios.get(`https://polar-dawn-70145.herokuapp.com/to_english?word=${values.word}`).then((res) => {
      setResult(res.data.data);
    });
  }

  return (
    <div className="App">
      <ColumnContainer>
        <RowContainer>
          <input type="text" name="word" defaultValue={values.word} onChange={handleInputChange}></input>
          <button onClick={search}></button>
        </RowContainer>
        <div>{result}</div>
      </ColumnContainer>
    </div>
  );
}

export default Home;
