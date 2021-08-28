import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { NextPage } from 'next';
import db, { Word } from '../public/db';

const ColumnContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
});

const Body = styled(ColumnContainer)({
  height: '100vh',
  width: '100vw',
  backgroundColor: '#FFEDDA'
})

const Button = styled.div({
  borderRadius: 10,
  backgroundColor: '#564c46',
  fontSize: 20, color: 'white',
  paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3,
  ':active': {
    backgroundColor: 'black'
  }
})

const Box = styled.div({
  width: '80vw',
  marginTop: 30
})

const MainView = styled.div({
  width: '100vw',
  height: '90vh'
})

const WordBox = styled.div({
  width: '80vw',
})

const PageText = styled.div({
  fontSize: 20
})

const LIST_COUNT = 10;
const GET_COUNT = 3;

const Home: NextPage = () => {
  const [values, setValues] = useState({
    word: "",
    list: [] as Word[],
    pageIndex: 1
  });
  const handleInputChange = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValues({ ...values, [name]: value });
  }

  const [result, setResult] = useState<Array<string>>([]);

  const search = () => {
    db.wordbook?.where('word').equals(values.word).toArray().then((db_result) => {
      if (db_result.length >= GET_COUNT) {
        setResult(db_result.map((item) => item.meaning))
        return;
      }

      const isOnLine = typeof window !== 'undefined' ? navigator.onLine : false;
      if (isOnLine) {
        axios.get(`https://polar-dawn-70145.herokuapp.com/to_english?word=${values.word}`).then((res) => {
          const items = res.data.data.split(/\t/g);
          console.log(items);
          setResult(items);
          if (items[0] == "no content"){return;}

          const add_items = items.slice(0, GET_COUNT).map((item: string) => {
            return {
              word: values.word, meaning: item, createdAt: Date.now()
            }
          })
          db.wordbook?.bulkAdd(add_items).then((index) => {
            console.log("add word for index: " + index);
          })
        });
      }
    })
  }

  useEffect(() => {
    const indexArray = Array(LIST_COUNT).fill(0).map((v, i) => i + (values.pageIndex - 1) * LIST_COUNT + 1);
    
    db.wordbook?.bulkGet(indexArray).then((list_with_undefined) => {
      let new_list = list_with_undefined.filter((item): item is Word => !!item);
      setValues({...values, list: new_list })
    })
  }, [values.pageIndex, result]);

  return (
    <Body className="App">
      <ColumnContainer>
          <RowContainer style={{width: '100vw', height: '10vh', backgroundColor: '#FFB830'}}>
            <input
              type="text"
              name="word"
              defaultValue={values.word}
              onChange={handleInputChange}
              style={{marginRight: 10, fontSize: 24, width: '70vw', maxWidth: 400}}
            ></input>
            <Button
              onClick={search}>
              検索
            </Button>
          </RowContainer>
          <MainView>
            <ColumnContainer style={{height: '100%', justifyContent: 'space-between'}}>
              <Box>
                {result.map((item, index) => {
                  return <React.Fragment key={index}>{item}<br/></React.Fragment>;
                })}
              </Box>
              <ColumnContainer>
                {values.list.map((item, index) => {
                  return (
                    <WordBox key={index}>
                      <RowContainer style={{justifyContent: 'space-between', border: 'black 1px solid', marginBottom: -1 }}>
                        <div>{item.word}</div>
                        <div style={{flex: 1, marginLeft: 15, borderLeft: 'black 1px solid'}}>{item.meaning}</div>
                      </RowContainer>
                    </WordBox>
                  );
                })}
                <RowContainer style={{justifyContent: 'space-around', width: '100%', margin: 10}}>
                  <PageText onClick={() => {
                    if (values.pageIndex == 1) return;
                    setValues({...values, pageIndex: values.pageIndex - 1});
                  }}>{values.pageIndex == 1 ? "" :"<"}</PageText>
                  <PageText>{values.pageIndex}</PageText>
                  <PageText onClick={() => {
                    if(values.list.length != LIST_COUNT) return;
                    setValues({...values, pageIndex: values.pageIndex + 1});
                  }}>{values.list.length != LIST_COUNT ? "" :">"}</PageText>
                </RowContainer>
              </ColumnContainer>
            </ColumnContainer>
          </MainView>
      </ColumnContainer>
    </Body>
  );
}

export default Home;
