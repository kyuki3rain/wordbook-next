import React, { useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { NextPage } from 'next';

const ColumnContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center'
});

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center'
});

const Body = styled(ColumnContainer)({
  height: '100vh',
  width: '100vw'
})

const Padding = styled.div({
  padding: 10
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
    <Body className="App">
      <ColumnContainer>
        <Padding>
          <RowContainer>
            <input
              type="text"
              name="word"
              defaultValue={values.word}
              onChange={handleInputChange}
              style={{marginRight: 10}}
            ></input>
            <button onClick={search} style={{paddingLeft: 10, paddingRight: 10}} >検索</button>
          </RowContainer>
        </Padding>
        <div>{result}</div>
      </ColumnContainer>
    </Body>
  );
}

export default Home;
